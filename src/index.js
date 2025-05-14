// Main JavaScript file (没有使用ES模块导入以避免CORS问题)

// 性能监控升级版
const performance = {
  startTime: Date.now(),
  domLoaded: 0,
  fullyLoaded: 0,
  firstPaint: 0, // 首次绘制时间
  firstContentfulPaint: 0, // 首次内容绘制时间
  interactiveTime: 0, // 可交互时间
  metrics: {},  // 保存各项指标

  // 记录指标
  mark(name) {
    this.metrics[name] = Date.now() - this.startTime;
    return this.metrics[name];
  },
  
  // 输出性能日志
  logTimes() {
    console.log(`DOM加载时间: ${this.domLoaded}ms`);
    console.log(`首次绘制时间: ${this.firstPaint}ms`);
    console.log(`首次内容绘制时间: ${this.firstContentfulPaint}ms`);
    console.log(`可交互时间: ${this.interactiveTime}ms`);
    console.log(`页面完全加载时间: ${this.fullyLoaded}ms`);
    
    // 将性能数据保存到localStorage以便后续分析
    try {
      const perfData = localStorage.getItem('perfData') ? 
        JSON.parse(localStorage.getItem('perfData')) : [];
      
      // 限制数据量
      if (perfData.length > 10) {
        perfData.shift();
      }
      
      perfData.push({
        timestamp: new Date().toISOString(),
        metrics: this.metrics
      });
      
      localStorage.setItem('perfData', JSON.stringify(perfData));
    } catch (e) {
      console.error('无法保存性能数据', e);
    }
  }
};

// 预加载资源
const preloadResources = () => {
  // 预加载关键图片资源
  const criticalImages = [
    'src/assets/images/banner1.svg',
    'src/assets/images/activity1.svg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// 创建并显示骨架屏
const showSkeleton = () => {
  const root = document.getElementById('root');
  
  // 清空容器
  root.innerHTML = '';
  
  // 创建骨架屏
  const skeletonHeader = document.createElement('div');
  skeletonHeader.className = 'flex justify-between items-center';
  skeletonHeader.style.height = '0.8rem';
  skeletonHeader.style.padding = '0.2rem 0.3rem';
  skeletonHeader.style.backgroundColor = 'white';
  
  const logoSkeleton = document.createElement('div');
  logoSkeleton.className = 'skeleton';
  logoSkeleton.style.width = '2rem';
  logoSkeleton.style.height = '0.4rem';
  
  const navSkeleton = document.createElement('div');
  navSkeleton.className = 'flex';
  
  const navItem1 = document.createElement('div');
  navItem1.className = 'skeleton';
  navItem1.style.width = '0.8rem';
  navItem1.style.height = '0.3rem';
  navItem1.style.marginRight = '0.2rem';
  
  const navItem2 = document.createElement('div');
  navItem2.className = 'skeleton';
  navItem2.style.width = '0.8rem';
  navItem2.style.height = '0.3rem';
  
  navSkeleton.appendChild(navItem1);
  navSkeleton.appendChild(navItem2);
  
  skeletonHeader.appendChild(logoSkeleton);
  skeletonHeader.appendChild(navSkeleton);
  
  // 轮播图骨架屏
  const bannerSkeleton = document.createElement('div');
  bannerSkeleton.className = 'container mt-1 skeleton';
  bannerSkeleton.style.height = '3rem';
  
  // 活动卡片骨架屏
  const cardsSkeleton = document.createElement('div');
  cardsSkeleton.className = 'container mt-2';
  
  const titleSkeleton = document.createElement('div');
  titleSkeleton.className = 'skeleton';
  titleSkeleton.style.width = '2.5rem';
  titleSkeleton.style.height = '0.4rem';
  titleSkeleton.style.marginBottom = '0.2rem';
  
  cardsSkeleton.appendChild(titleSkeleton);
  
  // 创建3个卡片骨架
  for (let i = 0; i < 3; i++) {
    const cardSkeleton = document.createElement('div');
    cardSkeleton.className = 'card flex';
    
    const imgSkeleton = document.createElement('div');
    imgSkeleton.className = 'skeleton flex-1';
    imgSkeleton.style.height = '1.5rem';
    
    const contentSkeleton = document.createElement('div');
    contentSkeleton.className = 'flex-1 px-1';
    
    const cardTitleSkeleton = document.createElement('div');
    cardTitleSkeleton.className = 'skeleton';
    cardTitleSkeleton.style.width = '80%';
    cardTitleSkeleton.style.height = '0.3rem';
    
    const cardDescSkeleton = document.createElement('div');
    cardDescSkeleton.className = 'skeleton mt-1';
    cardDescSkeleton.style.width = '100%';
    cardDescSkeleton.style.height = '0.2rem';
    
    const cardBtnSkeleton = document.createElement('div');
    cardBtnSkeleton.className = 'skeleton mt-2';
    cardBtnSkeleton.style.width = '2rem';
    cardBtnSkeleton.style.height = '0.5rem';
    
    contentSkeleton.appendChild(cardTitleSkeleton);
    contentSkeleton.appendChild(cardDescSkeleton);
    contentSkeleton.appendChild(cardBtnSkeleton);
    
    cardSkeleton.appendChild(imgSkeleton);
    cardSkeleton.appendChild(contentSkeleton);
    
    cardsSkeleton.appendChild(cardSkeleton);
  }
  
  // 添加到页面
  root.appendChild(skeletonHeader);
  root.appendChild(bannerSkeleton);
  root.appendChild(cardsSkeleton);
  
  performance.mark('skeletonRendered');
};

// DOM content loaded event
document.addEventListener('DOMContentLoaded', () => {
  performance.domLoaded = Date.now() - performance.startTime;
  preloadResources();
  showSkeleton(); // 先显示骨架屏
  
  // 延迟一小段时间再加载真实内容，确保骨架屏能被看到
  setTimeout(() => {
    initApp();
  }, 300);
});

// Initialize application
function initApp() {
  // 记录首次内容绘制时间
  if (window.performance && window.performance.getEntriesByType) {
    const paintEntries = window.performance.getEntriesByType('paint');
    if (paintEntries.length) {
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          performance.firstPaint = entry.startTime;
        } else if (entry.name === 'first-contentful-paint') {
          performance.firstContentfulPaint = entry.startTime;
        }
      });
    }
  }
  
  console.log('准备创建组件...');
  
  // Create components
  const header = createHeader();
  const banner = createBanner();
  const activityCards = createActivityCards();
  const footer = createFooter();
  
  // Append components to root element
  const root = document.getElementById('root');
  if (!root) {
    console.error('找不到root元素，无法渲染页面');
    return;
  }
  
  console.log('清空骨架屏...');
  root.innerHTML = ''; // 清空骨架屏
  
  console.log('添加header和banner...');
  root.appendChild(header);
  root.appendChild(banner);
  
  // 使用Fragment减少DOM重绘
  console.log('添加活动卡片...');
  const fragment = document.createDocumentFragment();
  fragment.appendChild(activityCards);
  fragment.appendChild(footer);
  root.appendChild(fragment);
  
  // 检查活动卡片是否渲染
  console.log('检查是否成功渲染活动卡片...');
  setTimeout(() => {
    const cards = document.querySelectorAll('.card');
    console.log(`找到${cards.length}个活动卡片`);
    if (cards.length === 0) {
      console.error('未能渲染活动卡片，尝试重新添加');
      // 尝试直接重新添加活动卡片
      root.appendChild(createActivityCards());
    }
  }, 100);
  
  // 初始化本地存储
  initLocalStorage();
  
  // Initialize lazy loading
  initLazyLoading();
  
  // 添加页面滚动监听，实现更好的动画效果
  initScrollAnimations();
  
  // 记录可交互时间
  performance.interactiveTime = Date.now() - performance.startTime;
  performance.mark('interactive');
  
  // 记录页面完全加载时间
  window.addEventListener('load', () => {
    performance.fullyLoaded = Date.now() - performance.startTime;
    performance.mark('fullyLoaded');
    performance.logTimes();
  });
}

// 初始化本地存储
function initLocalStorage() {
  // 检查是否首次访问
  const hasVisited = localStorage.getItem('hasVisited');
  
  if (!hasVisited) {
    // 首次访问
    localStorage.setItem('hasVisited', 'true');
    localStorage.setItem('visitCount', '1');
    localStorage.setItem('lastVisit', new Date().toISOString());
    
    // 显示新用户欢迎弹窗
    setTimeout(() => {
      showWelcomeModal();
    }, 1000);
  } else {
    // 老用户
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', (visitCount + 1).toString());
    localStorage.setItem('lastVisit', new Date().toISOString());
  }
}

// 显示新用户欢迎弹窗
function showWelcomeModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay fade-in';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  
  const modal = document.createElement('div');
  modal.className = 'modal slide-up';
  modal.style.width = '80%';
  modal.style.maxWidth = '6rem';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '0.2rem';
  modal.style.overflow = 'hidden';
  
  modal.innerHTML = `
    <div style="padding: 0.3rem; text-align: center;">
      <h3 class="text-large text-bold" style="margin-bottom: 0.2rem;">欢迎来到活动专区</h3>
      <p class="text-medium" style="margin-bottom: 0.3rem;">新用户专享优惠，立即注册领取100元优惠券</p>
      <button class="btn btn-primary" id="welcomeCloseBtn" style="width: 80%; margin: 0 auto;">我知道了</button>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  document.getElementById('welcomeCloseBtn').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

// 初始化滚动动画
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card');
  
  // 使用IntersectionObserver API检测元素进入视口
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 添加滑入动画类，但不隐藏卡片
          entry.target.classList.add('slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
      // 不要设置opacity为0，这会导致卡片内容不可见
      observer.observe(card);
    });
    
    // 记录性能指标
    performance.mark('scrollAnimInitialized');
  }
}

// Create header component
function createHeader() {
  const header = document.createElement('header');
  header.className = 'flex justify-between items-center';
  
  const logo = document.createElement('div');
  logo.className = 'text-xl text-bold';
  logo.textContent = '活动专区';
  
  const nav = document.createElement('nav');
  nav.className = 'flex';
  
  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.className = 'px-1';
  homeLink.textContent = '首页';
  
  const myLink = document.createElement('a');
  myLink.href = '#';
  myLink.className = 'px-1';
  myLink.textContent = '我的';
  
  nav.appendChild(homeLink);
  nav.appendChild(myLink);
  
  header.appendChild(logo);
  header.appendChild(nav);
  
  return header;
}

// 优化后的轮播图组件
function createBanner() {
  // Create carousel container
  const container = document.createElement('div');
  container.className = 'carousel container mt-1';
  container.style.height = '3rem';
  container.style.position = 'relative';
  container.style.overflow = 'hidden'; // 确保内容不溢出
  
  // 创建掩盖层容器以解决上一页颜色显示问题
  const wrapperContainer = document.createElement('div');
  wrapperContainer.style.position = 'absolute';
  wrapperContainer.style.top = '0';
  wrapperContainer.style.left = '0';
  wrapperContainer.style.width = '100%';
  wrapperContainer.style.height = '100%';
  wrapperContainer.style.overflow = 'hidden';
  
  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';
  slidesContainer.style.position = 'absolute';
  slidesContainer.style.top = '0';
  slidesContainer.style.left = '0';
  slidesContainer.style.width = '100%';
  slidesContainer.style.height = '100%';
  slidesContainer.style.display = 'flex';
  slidesContainer.style.transition = 'transform 0.3s ease';
  
  // Banner items
  const items = [
    { image: 'src/assets/images/banner1.svg', link: '#', alt: '活动banner1' },
    { image: 'src/assets/images/banner2.svg', link: '#', alt: '活动banner2' },
    { image: 'src/assets/images/banner3.svg', link: '#', alt: '活动banner3' }
  ];
  
  // 创建一个额外的轮播容器，宽度是项目数量的100%
  const totalWidth = items.length * 100;
  slidesContainer.style.width = `${totalWidth}%`;
  
  // 优化图片加载 - 先创建所有幻灯片，但只加载第一张图片
  items.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.flex = `0 0 ${100 / items.length}%`;
    slide.style.overflow = 'hidden'; // 确保子元素不溢出
    slide.style.position = 'relative';
    
    const link = document.createElement('a');
    link.href = item.link;
    link.style.display = 'block';
    link.style.width = '100%';
    link.style.height = '100%';
    
    const img = document.createElement('img');
    img.className = index === 0 ? '' : 'lazy-load';
    img.alt = item.alt;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.display = 'block'; // 防止图片底部空隙
    
    // 仅加载第一张图片，其他图片使用延迟加载
    if (index === 0) {
      img.src = item.image;
    } else {
      img.setAttribute('data-src', item.image);
      // 使用纯色占位，而不是SVG
      img.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect width="1" height="1" fill="%23cccccc"/%3E%3C/svg%3E`;
    }
    
    link.appendChild(img);
    slide.appendChild(link);
    slidesContainer.appendChild(slide);
  });
  
  // 将轮播图幻灯片容器添加到掩盖层容器
  wrapperContainer.appendChild(slidesContainer);
  container.appendChild(wrapperContainer);
  
  // Create indicators
  const indicatorContainer = document.createElement('div');
  indicatorContainer.className = 'carousel-indicators flex justify-center';
  indicatorContainer.style.position = 'absolute';
  indicatorContainer.style.bottom = '0.2rem';
  indicatorContainer.style.left = '0';
  indicatorContainer.style.right = '0';
  indicatorContainer.style.zIndex = '2'; // 确保指示器显示在图片上方
  
  let currentIndex = 0;
  
  items.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.className = 'carousel-indicator';
    indicator.style.backgroundColor = index === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)';
    
    indicator.addEventListener('click', () => {
      goToSlide(index);
    });
    
    indicatorContainer.appendChild(indicator);
  });
  
  // Append indicator container
  container.appendChild(indicatorContainer);
  
  // 优化轮播自动播放 - 页面不在视口时暂停
  let interval;
  const startAutoplay = () => {
    stopAutoplay();
    interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 3000);
  };
  
  const stopAutoplay = () => {
    if (interval) {
      clearInterval(interval);
    }
  };
  
  // 添加页面可见性监听
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
  
  // 初始启动轮播
  startAutoplay();
  
  // 添加触摸事件
  let startX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoplay();
  });
  
  container.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    
    startAutoplay();
  });
  
  // Go to slide function
  function goToSlide(index) {
    // 预加载下一张图片
    if (index >= 0 && index < items.length) {
      const nextImg = slidesContainer.children[index].querySelector('img');
      if (nextImg.hasAttribute('data-src')) {
        nextImg.src = nextImg.getAttribute('data-src');
        nextImg.removeAttribute('data-src');
        nextImg.classList.remove('lazy-load');
      }
    }
    
    // Update current index
    currentIndex = index;
    
    // Handle index boundaries
    if (currentIndex < 0) {
      currentIndex = items.length - 1;
    } else if (currentIndex >= items.length) {
      currentIndex = 0;
    }
    
    // Move slides container
    slidesContainer.style.transform = `translateX(-${currentIndex * (100 / items.length)}%)`;
    
    // Update indicators
    const indicators = indicatorContainer.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, i) => {
      indicator.style.backgroundColor = i === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)';
    });
  }
  
  return container;
}

// 优化活动卡片组件
function createActivityCards() {
  const container = document.createElement('div');
  container.className = 'container mt-2';
  
  const title = document.createElement('h2');
  title.className = 'text-large text-bold mb-2';
  title.textContent = '热门活动';
  
  const cardContainer = document.createElement('div');
  cardContainer.className = 'flex-col';
  
  // Activity data
  const activities = [
    { id: 1, title: '限时抢购', desc: '每日10点开抢，折扣高达5折', image: 'src/assets/images/activity1.svg' },
    { id: 2, title: '新人专享', desc: '新用户注册即送100元优惠券', image: 'src/assets/images/activity2.svg' },
    { id: 3, title: '会员日', desc: '每月28日，会员专享特惠', image: 'src/assets/images/activity3.svg' }
  ];
  
  // 使用文档片段减少DOM操作次数
  const fragment = document.createDocumentFragment();
  
  // Create cards for each activity
  activities.forEach(activity => {
    const card = document.createElement('div');
    card.className = 'card flex';
    card.setAttribute('data-id', activity.id);
    card.style.opacity = '1'; // 确保卡片可见
    
    // Create lazy-loaded image
    const imgContainer = document.createElement('div');
    imgContainer.style.width = '30%'; // 控制图片容器宽度
    imgContainer.style.marginRight = '0.2rem';
    
    const img = document.createElement('img');
    img.alt = activity.title;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '0.1rem';
    
    // 直接加载图片，不使用懒加载
    img.src = activity.image;
    
    imgContainer.appendChild(img);
    
    // Create text content
    const content = document.createElement('div');
    content.className = 'flex-1';
    content.style.display = 'flex';
    content.style.flexDirection = 'column';
    content.style.justifyContent = 'space-between';
    
    const cardTitle = document.createElement('h3');
    cardTitle.className = 'text-medium text-bold';
    cardTitle.textContent = activity.title;
    
    const cardDesc = document.createElement('p');
    cardDesc.className = 'text-small text-secondary mt-1';
    cardDesc.textContent = activity.desc;
    
    const cardButton = document.createElement('button');
    cardButton.className = 'btn btn-primary mt-2';
    cardButton.textContent = '立即参与';
    cardButton.addEventListener('click', function() {
      openActivityDetail(activity);
    });
    
    content.appendChild(cardTitle);
    content.appendChild(cardDesc);
    content.appendChild(cardButton);
    
    card.appendChild(imgContainer);
    card.appendChild(content);
    
    fragment.appendChild(card);
  });
  
  cardContainer.appendChild(fragment);
  container.appendChild(title);
  container.appendChild(cardContainer);
  
  return container;
}

// Create footer component
function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'text-center py-2 text-small text-secondary mt-3';
  footer.textContent = '© 2025 H5活动页演示';
  
  return footer;
}

// 优化活动详情弹窗
function openActivityDetail(activity) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay fade-in';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'modal slide-up';
  modal.style.width = '80%';
  modal.style.maxWidth = '6rem';
  modal.style.backgroundColor = 'white';
  modal.style.borderRadius = '0.2rem';
  modal.style.overflow = 'hidden';
  
  // Create modal header
  const header = document.createElement('div');
  header.className = 'modal-header flex justify-between items-center';
  header.style.padding = '0.2rem 0.3rem';
  header.style.borderBottom = '1px solid #eee';
  
  // Create title
  const title = document.createElement('h3');
  title.className = 'modal-title text-medium text-bold';
  title.textContent = activity.title;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.style.fontSize = '0.4rem';
  closeBtn.style.lineHeight = '0.4rem';
  closeBtn.style.color = '#999';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'none';
  closeBtn.style.cursor = 'pointer';
  
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
  });
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create modal body
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.padding = '0.3rem';
  
  body.innerHTML = `
    <div class="flex-col items-center">
      <img src="${activity.image}" alt="${activity.title}" style="width: 100%; max-height: 3rem">
      <p class="text-medium mt-2">${activity.desc}</p>
      <div class="mt-2 text-center">
        <button class="btn btn-primary" id="joinActivityBtn">确认参与</button>
      </div>
    </div>
  `;
  
  // Append elements
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  
  // Prevent body scrolling
  document.body.style.overflow = 'hidden';
  
  // Append to body
  document.body.appendChild(overlay);
  
  // Add event listener for join button
  document.getElementById('joinActivityBtn').addEventListener('click', function() {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
    showToast('参与成功！');
    
    // 记录用户行为
    try {
      const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
      actions.push({
        action: 'join_activity',
        activityId: activity.id,
        timestamp: new Date().toISOString()
      });
      
      // 只保留最近的20条记录
      if (actions.length > 20) {
        actions.shift();
      }
      
      localStorage.setItem('userActions', JSON.stringify(actions));
    } catch (e) {
      console.error('Error saving user action:', e);
    }
  });
}

// Show toast message - 优化的Toast显示
function showToast(message, duration = 2000) {
  // 移除现有的toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 使用CSS动画自动移除toast
  setTimeout(() => {
    if (toast.parentNode) {
      document.body.removeChild(toast);
    }
  }, duration);
}

// 优化后的图片懒加载
function initLazyLoading() {
  // 尝试使用更现代的API
  if ('loading' in HTMLImageElement.prototype) {
    // 浏览器原生支持懒加载
    document.querySelectorAll('img.lazy-load').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('fade-in');
        img.removeAttribute('data-src');
      }
    });
    performance.mark('nativeLazyLoadInitialized');
  } 
  // 使用 Intersection Observer API
  else if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            // 创建新图像预加载
            const newImage = new Image();
            newImage.onload = function() {
              img.src = src;
              img.classList.add('fade-in');
              img.removeAttribute('data-src');
              performance.mark(`lazyLoaded_${src}`);
            };
            newImage.src = src;
            
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // 提前50px开始加载
      threshold: 0.1
    });
    
    document.querySelectorAll('img.lazy-load').forEach(img => {
      imageObserver.observe(img);
    });
    performance.mark('intersectionObserverInitialized');
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    loadVisibleImages();
    window.addEventListener('scroll', throttle(loadVisibleImages, 200));
    window.addEventListener('resize', throttle(loadVisibleImages, 200));
    performance.mark('fallbackLazyLoadInitialized');
  }
}

// Load all images currently visible in the viewport
function loadVisibleImages() {
  const lazyImages = document.querySelectorAll('img.lazy-load');
  
  lazyImages.forEach(img => {
    if (isInViewport(img)) {
      const src = img.getAttribute('data-src');
      
      if (src) {
        img.src = src;
        img.classList.add('fade-in');
        img.removeAttribute('data-src');
        img.classList.remove('lazy-load');
      }
    }
  });
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
    rect.bottom >= -100 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) + 100 &&
    rect.right >= -100
  );
}

// Throttle function to limit function calls
function throttle(func, delay) {
  let lastCall = 0;
  
  return function(...args) {
    const now = new Date().getTime();
    
    if (now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    }
  };
} 