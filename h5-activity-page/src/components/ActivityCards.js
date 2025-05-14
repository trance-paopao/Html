import React, { useState, useEffect, useRef } from 'react';
import { showToast } from '../utils/helpers';

const ActivityCards = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: '夏日特惠活动',
      image: '../assets/images/activity1.svg',
      description: '夏季商品全场8折，满200减50',
      startDate: '2023-07-01',
      endDate: '2023-08-31',
      status: 'active'
    },
    {
      id: 2,
      title: '新品首发体验',
      image: '../assets/images/activity2.svg',
      description: '新用户下单立减30元，无门槛',
      startDate: '2023-06-15',
      endDate: '2023-09-15',
      status: 'active'
    },
    {
      id: 3,
      title: '会员专享优惠',
      image: '../assets/images/activity3.svg',
      description: '会员用户专享95折优惠，可与其他优惠叠加',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'active'
    },
    {
      id: 4,
      title: '限时秒杀活动',
      image: '../assets/images/activity4.svg',
      description: '每日10点、14点、20点准时开抢，限量100份',
      startDate: '2023-07-10',
      endDate: '2023-07-25',
      status: 'coming'
    }
  ]);
  
  const cardsRef = useRef([]);
  
  useEffect(() => {
    // 初始化滚动动画
    initScrollAnimations();
  }, []);
  
  // 初始化滚动动画
  const initScrollAnimations = () => {
    if (cardsRef.current.length === 0) return;
    
    // 使用IntersectionObserver API检测元素进入视口
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('slide-up');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });
      
      cardsRef.current.forEach(card => {
        if (card) {
          card.style.opacity = '0';
          observer.observe(card);
        }
      });
    }
  };
  
  // 打开活动详情
  const openActivityDetail = (activity) => {
    if (activity.status === 'coming') {
      showToast('活动即将开始，敬请期待');
      return;
    }
    
    // 这里可以导航到详情页或显示弹窗
    showToast(`您点击了"${activity.title}"活动`);
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  return (
    <div className="container mt-2 mb-3">
      <h2 className="text-large mb-2">热门活动</h2>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="card" 
            ref={el => cardsRef.current[index] = el}
            onClick={() => openActivityDetail(activity)}
          >
            <div className="flex">
              <div className="flex-1">
                <h3 className="text-medium text-bold">{activity.title}</h3>
                <p className="text-small text-secondary mt-1">{activity.description}</p>
                <p className="text-small mt-1">
                  {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                </p>
                <button className="btn btn-primary mt-1">
                  {activity.status === 'active' ? '立即参与' : '即将开始'}
                </button>
              </div>
              <div style={{ width: '1.5rem', marginLeft: '0.2rem' }}>
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  style={{ width: '100%', height: '1.5rem', objectFit: 'cover', borderRadius: '0.1rem' }}
                  loading="lazy"
                />
                {activity.status === 'coming' && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      background: 'rgba(0,0,0,0.5)', 
                      color: 'white',
                      padding: '0.05rem 0.1rem', 
                      fontSize: '0.2rem',
                      borderRadius: '0.05rem',
                      transform: 'translate(0.1rem, -1.5rem)'
                    }}
                  >
                    即将开始
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCards; 