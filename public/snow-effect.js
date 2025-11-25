/**
 * 雪花飘落效果
 * 为网站添加冬季氛围的雪花动画
 * 升级版：更真实的雪花形状和效果
 */

class SnowEffect {
    constructor() {
        this.snowflakes = [];
        this.maxSnowflakes = 80;
        this.animationId = null;
        this.snowflakeTypes = ['crystal', 'star', 'simple'];
        this.init();
    }

    init() {
        this.createCanvas();
        this.startSnowing();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'snow-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.background = 'transparent';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createSnowflake() {
        const type = this.snowflakeTypes[Math.floor(Math.random() * this.snowflakeTypes.length)];
        const size = Math.random() * 4 + 3;
        
        return {
            x: Math.random() * this.canvas.width,
            y: -20,
            size: size,
            radius: size,
            speed: Math.random() * 2 + 0.8,
            wind: Math.random() * 0.8 - 0.4,
            opacity: Math.random() * 0.7 + 0.3,
            color: `rgba(255, 255, 255, ${Math.random() * 0.9 + 0.1})`,
            type: type,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            swayAmount: Math.random() * 2 + 1,
            swaySpeed: Math.random() * 0.02 + 0.01,
            time: 0
        };
    }

    updateSnowflakes() {
        // 添加新雪花
        if (this.snowflakes.length < this.maxSnowflakes && Math.random() < 0.4) {
            this.snowflakes.push(this.createSnowflake());
        }

        // 更新现有雪花
        for (let i = this.snowflakes.length - 1; i >= 0; i--) {
            const snowflake = this.snowflakes[i];
            
            snowflake.time += 1;
            snowflake.y += snowflake.speed;
            snowflake.x += snowflake.wind + Math.sin(snowflake.time * snowflake.swaySpeed) * snowflake.swayAmount * 0.1;
            snowflake.rotation += snowflake.rotationSpeed;
            
            // 移除超出屏幕的雪花
            if (snowflake.y > this.canvas.height + 20 || 
                snowflake.x < -30 || 
                snowflake.x > this.canvas.width + 30) {
                this.snowflakes.splice(i, 1);
            }
        }
    }

    drawSnowflake(snowflake) {
        this.ctx.save();
        this.ctx.translate(snowflake.x, snowflake.y);
        this.ctx.rotate(snowflake.rotation);
        this.ctx.globalAlpha = snowflake.opacity;
        this.ctx.fillStyle = snowflake.color;
        this.ctx.strokeStyle = snowflake.color;
        this.ctx.lineWidth = 1;

        switch (snowflake.type) {
            case 'crystal':
                this.drawCrystalSnowflake(snowflake);
                break;
            case 'star':
                this.drawStarSnowflake(snowflake);
                break;
            case 'simple':
                this.drawSimpleSnowflake(snowflake);
                break;
        }

        this.ctx.restore();
    }

    drawCrystalSnowflake(snowflake) {
        const size = snowflake.size;
        
        // 绘制六角雪花晶体
        for (let i = 0; i < 6; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI) / 3);
            
            // 主线
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -size);
            this.ctx.stroke();
            
            // 分支
            this.ctx.beginPath();
            this.ctx.moveTo(0, -size * 0.7);
            this.ctx.lineTo(-size * 0.2, -size * 0.5);
            this.ctx.moveTo(0, -size * 0.7);
            this.ctx.lineTo(size * 0.2, -size * 0.5);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        // 中心圆
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawStarSnowflake(snowflake) {
        const size = snowflake.size;
        const points = 8;
        
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const radius = i % 2 === 0 ? size : size * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // 添加内部装饰
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    drawSimpleSnowflake(snowflake) {
        const size = snowflake.size;
        
        // 简单的十字形雪花
        this.ctx.beginPath();
        this.ctx.moveTo(-size, 0);
        this.ctx.lineTo(size, 0);
        this.ctx.moveTo(0, -size);
        this.ctx.lineTo(0, size);
        this.ctx.stroke();
        
        // 对角线
        this.ctx.beginPath();
        this.ctx.moveTo(-size * 0.7, -size * 0.7);
        this.ctx.lineTo(size * 0.7, size * 0.7);
        this.ctx.moveTo(-size * 0.7, size * 0.7);
        this.ctx.lineTo(size * 0.7, -size * 0.7);
        this.ctx.stroke();
        
        // 装饰点
        this.ctx.beginPath();
        this.ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSnowflakes() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(snowflake => {
            this.drawSnowflake(snowflake);
            
            // 添加光晕效果
            this.ctx.save();
            this.ctx.globalAlpha = snowflake.opacity * 0.2;
            this.ctx.fillStyle = snowflake.color;
            this.ctx.beginPath();
            this.ctx.arc(snowflake.x, snowflake.y, snowflake.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        this.updateSnowflakes();
        this.drawSnowflakes();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startSnowing() {
        if (!this.animationId) {
            this.animate();
        }
    }

    stopSnowing() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stopSnowing();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}

// 简化的初始化函数
function initSnowEffect() {
    console.log('❄️ 开始初始化雪花效果');
    window.snowEffect = new SnowEffect();
    console.log('❄️ 升级版雪花飘落效果已启动');
}

// 等待DOM准备好后初始化
function safeInitSnowEffect() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSnowEffect);
    } else {
        // DOM已经准备好，立即初始化
        initSnowEffect();
    }
}

// 延迟500ms后执行安全初始化
setTimeout(safeInitSnowEffect, 500);

// 提供全局控制函数
window.toggleSnowEffect = function() {
    if (window.snowEffect) {
        if (window.snowEffect.animationId) {
            window.snowEffect.stopSnowing();
            console.log('❄️ 雪花效果已暂停');
        } else {
            window.snowEffect.startSnowing();
            console.log('❄️ 雪花效果已启动');
        }
    } else {
        console.log('❌ 雪花效果未初始化');
    }
};