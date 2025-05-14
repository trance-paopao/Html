// 工具函数文件

// 初始化本地存储
export const initLocalStorage = () => {
  // 检查是否首次访问
  const hasVisited = localStorage.getItem('hasVisited');
  
  if (!hasVisited) {
    // 首次访问
    localStorage.setItem('hasVisited', 'true');
    localStorage.setItem('visitCount', '1');
    localStorage.setItem('lastVisit', new Date().toISOString());
    return true;
  } else {
    // 老用户
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', (visitCount + 1).toString());
    localStorage.setItem('lastVisit', new Date().toISOString());
    return false;
  }
};

// 初始化懒加载
export const initLazyLoading = () => {
  // 检测 IntersectionObserver API 是否可用
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.removeAttribute('data-src');
          imageObserver.unobserve(lazyImage);
        }
      });
    });
    
    lazyImages.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // 降级处理 - 非常简单的懒加载实现
    const lazyLoad = () => {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      lazyImages.forEach(img => {
        if (isInViewport(img)) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    };
    
    // 绑定滚动和调整大小事件
    document.addEventListener('scroll', throttle(lazyLoad, 200));
    window.addEventListener('resize', throttle(lazyLoad, 200));
    window.addEventListener('orientationchange', throttle(lazyLoad, 200));
    
    // 初始检查
    lazyLoad();
  }
};

// 检查元素是否在视口中
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// 节流函数
export const throttle = (func, delay) => {
  let timeout = null;
  return function(...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func.call(this, ...args);
        timeout = null;
      }, delay);
    }
  };
};

// 显示提示框
export const showToast = (message, duration = 2000) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    document.body.removeChild(toast);
  }, duration);
}; 