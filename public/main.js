// 背景装饰元素动画
const ornaments = document.querySelector(".bg-ornaments");
function createOrnaments() {
  if (!ornaments) return;
  const w = window.innerWidth || 1024;
  // 优化元素数量：移动端更少，桌面端适量
  const count = w < 480 ? 2 : w < 768 ? 3 : w < 1024 ? 5 : 6;
  ornaments.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    // 优化尺寸：移动端更小
    const size = w < 768 ? Math.round(80 + Math.random() * 100) : Math.round(120 + Math.random() * 160);
    // 优化动画时长：移动端更慢
    const durX = w < 768 ? Math.round(20 + Math.random() * 15) : Math.round(14 + Math.random() * 12);
    const durY = w < 768 ? Math.round(25 + Math.random() * 18) : Math.round(16 + Math.random() * 14);
    const delayX = Math.round(Math.random() * 8);
    const delayY = Math.round(Math.random() * 8);
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.left = x + "%";
    bubble.style.top = y + "%";
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";
    bubble.style.setProperty("--durX", durX + "s");
    bubble.style.setProperty("--delayX", delayX + "s");
    const blob = document.createElement("div");
    blob.className = "blob";
    blob.style.setProperty("--durY", durY + "s");
    blob.style.setProperty("--delayY", delayY + "s");
    bubble.appendChild(blob);
    ornaments.appendChild(bubble);
  }
}

createOrnaments();
window.addEventListener("resize", () => {
  clearTimeout(window.__ornTimer);
  window.__ornTimer = setTimeout(createOrnaments, 200);
});

// 音乐控制逻辑
const audio = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

if (audio && musicToggle) {
  let userInteracted = false;
  
  // 页面加载后立即尝试播放
  function initAudioPlayback() {
    // 尝试直接播放
    audio.play().then(() => {
      console.log('音乐自动播放成功');
      musicToggle.classList.add('playing');
    }).catch(err => {
      console.log('自动播放受限，等待用户交互:', err);
      // 保持按钮状态为未播放
    });
  }
  
  // 用户交互后立即播放（优化版）
  function handleUserInteraction() {
    if (userInteracted) return;
    userInteracted = true;
    
    audio.play().then(() => {
      musicToggle.classList.add('playing');
    }).catch(err => {
      console.log('用户交互后播放失败:', err);
    });
  }
  
  // 页面加载完成后初始化
  window.addEventListener('DOMContentLoaded', initAudioPlayback);
  
  // 优化事件监听器：使用节流和防抖
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      if (!inThrottle) {
        func.apply(this, arguments);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // 添加优化的用户交互事件
  const throttledInteraction = throttle(handleUserInteraction, 1000);
  document.addEventListener('click', throttledInteraction, { once: true });
  document.addEventListener('keydown', throttledInteraction, { once: true });
  document.addEventListener('touchstart', throttledInteraction, { once: true });
  
  // 音乐控制按钮点击事件
  musicToggle.addEventListener('click', () => {
    if (audio.paused) {
      // 播放音乐
      audio.play().then(() => {
        musicToggle.classList.add('playing');
      }).catch(err => {
        console.log('播放失败:', err);
      });
    } else {
      // 暂停音乐
      audio.pause();
      musicToggle.classList.remove('playing');
    }
  });
}