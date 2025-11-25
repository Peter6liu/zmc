# 静态网站部署指南

## 部署选项

### 1. GitHub Pages（推荐）

GitHub Pages 是免费的静态网站托管服务，适合个人项目。

#### 自动部署（使用GitHub Actions）

1. 确保代码已推送到GitHub仓库
2. 在GitHub仓库设置中启用GitHub Pages：
   - 进入仓库的 "Settings" 页面
   - 在左侧菜单选择 "Pages"
   - 在 "Source" 部分选择 "GitHub Actions"

3. 每次推送到 `main` 分支时，GitHub Actions会自动部署

#### 手动部署

```bash
# 安装依赖
npm install

# 构建静态网站
npm run build

# 部署到GitHub Pages
npm run deploy
```

### 2. Netlify

Netlify 提供免费的静态网站托管，支持自动部署。

1. 注册 Netlify 账户
2. 连接你的GitHub仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`dist`
5. 每次推送到GitHub时自动部署

### 3. Vercel

Vercel 也是优秀的静态网站托管平台。

1. 注册 Vercel 账户
2. 导入你的GitHub仓库
3. 框架预设选择 "Other"
4. 构建命令：`npm run build`
5. 输出目录：`dist`

## 本地预览

在部署前，可以在本地预览构建后的网站：

```bash
# 构建网站
npm run build

# 本地预览
npm run preview
```

访问 http://localhost:3000 查看效果。

## 项目结构说明

- `public/` - 源文件目录
- `dist/` - 构建输出目录（部署时使用）
- `server/` - 本地开发服务器（可选）
- `.github/workflows/` - GitHub Actions 部署配置

## 注意事项

1. **媒体文件大小**：GitHub Pages 有存储限制，确保媒体文件大小合理
2. **自定义域名**：可以在GitHub Pages设置中添加自定义域名
3. **HTTPS**：GitHub Pages 自动提供HTTPS支持
4. **缓存**：部署后可能需要清除浏览器缓存才能看到最新版本

## 故障排除

### 部署失败
- 检查GitHub Actions日志
- 确保所有依赖正确安装
- 验证构建脚本正常运行

### 页面显示问题
- 检查控制台错误信息
- 验证资源路径是否正确
- 确保所有文件已正确复制到dist目录

## 联系方式

如有部署问题，请检查GitHub Actions日志或联系项目维护者。