import React, { useState, useEffect, useRef } from 'react';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesRef = useRef(null);
  const autoplayRef = useRef(null);
  const touchStartXRef = useRef(0);
  
  // Banner items
  const items = [
    { image: '../assets/images/banner1.svg', link: '#', alt: '活动banner1' },
    { image: '../assets/images/banner2.svg', link: '#', alt: '活动banner2' },
    { image: '../assets/images/banner3.svg', link: '#', alt: '活动banner3' }
  ];
  
  // 设置自动轮播
  useEffect(() => {
    startAutoplay();
    
    return () => {
      stopAutoplay();
    };
  }, []);
  
  // 切换到指定幻灯片
  const goToSlide = (index) => {
    // 确保索引在有效范围内
    let newIndex = index;
    if (newIndex < 0) {
      newIndex = items.length - 1;
    } else if (newIndex >= items.length) {
      newIndex = 0;
    }
    
    setCurrentSlide(newIndex);
    
    // 重新启动自动播放
    stopAutoplay();
    startAutoplay();
  };
  
  // 开始自动播放
  const startAutoplay = () => {
    autoplayRef.current = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 3000);
  };
  
  // 停止自动播放
  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };
  
  // 处理触摸事件
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    stopAutoplay();
  };
  
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;
    
    // 左右滑动检测
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // 右滑 - 上一张
        goToSlide(currentSlide - 1);
      } else {
        // 左滑 - 下一张
        goToSlide(currentSlide + 1);
      }
    }
    
    startAutoplay();
  };
  
  return (
    <div 
      className="carousel container mt-1" 
      style={{ height: '3rem' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="carousel-slides flex" 
        style={{ 
          width: `${items.length * 100}%`, 
          transform: `translateX(-${currentSlide * (100 / items.length)}%)`,
          transition: 'transform 0.3s ease'
        }}
        ref={slidesRef}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="carousel-slide flex-1"
            style={{ width: `${100 / items.length}%` }}
          >
            <a href={item.link}>
              <img 
                src={item.image} 
                alt={item.alt} 
                loading="lazy" 
                style={{ width: '100%', height: '3rem', objectFit: 'cover' }}
              />
            </a>
          </div>
        ))}
      </div>
      
      {/* 指示器 */}
      <div className="flex justify-center py-1" style={{ position: 'absolute', bottom: '0.1rem', left: 0, right: 0 }}>
        {items.map((_, index) => (
          <div
            key={index}
            className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Banner; 