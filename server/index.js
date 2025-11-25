import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 添加安全中间件
import helmet from "helmet";

// 速率限制实现
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const RATE_LIMIT_MAX = 60; // 每分钟最多60个请求

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 使用helmet增强安全性，但允许视频和音频文件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      mediaSrc: ["'self'", "data:", "blob:"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  }
}));

// 配置Express解析JSON，设置合理的大小限制
app.use(express.json({ limit: "4kb" }));

// 添加速率限制中间件
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }
  
  // 清理过期的请求记录
  const requests = rateLimit.get(ip).filter(time => now - time < RATE_LIMIT_WINDOW);
  rateLimit.set(ip, requests);
  
  // 检查是否超过速率限制
  if (requests.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "请求过于频繁，请稍后再试" });
  }
  
  // 记录当前请求
  requests.push(now);
  next();
});

// 添加CORS配置（如果需要）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 设置静态文件缓存控制
app.use(express.static(path.join(__dirname, "..", "public"), {
  maxAge: 86400000, // 24小时
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // HTML文件不缓存
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (filePath.endsWith('.mp4')) {
      // 视频文件设置正确的MIME类型和缓存策略
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400000');
    }
  }
}));

// 添加错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  console.error('错误堆栈:', err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 404处理
app.use((req, res) => {
  console.warn('404 - 页面未找到:', req.url);
  res.status(404).sendFile(path.join(__dirname, "..", "public", "404.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器启动在端口 ${port}`);
  console.log(`运行环境: ${process.env.NODE_ENV || 'development'}`);
  
  // 确保数据目录存在
  const p = path.join(__dirname, "data");
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log(`创建数据目录: ${p}`);
  }
});