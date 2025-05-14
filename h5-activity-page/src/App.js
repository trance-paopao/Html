import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ActivityCards from './components/ActivityCards';
import Footer from './components/Footer';
import WelcomeModal from './components/WelcomeModal';
import { initLocalStorage, initLazyLoading } from './utils/helpers';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // 检查是否首次访问
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // 首次访问
      localStorage.setItem('hasVisited', 'true');
      localStorage.setItem('visitCount', '1');
      localStorage.setItem('lastVisit', new Date().toISOString());
      
      // 显示新用户欢迎弹窗
      setTimeout(() => {
        setShowWelcome(true);
      }, 1000);
    } else {
      // 老用户
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      localStorage.setItem('visitCount', (visitCount + 1).toString());
      localStorage.setItem('lastVisit', new Date().toISOString());
    }

    // 初始化懒加载
    initLazyLoading();
  }, []);
  
  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  return (
    <div className="app">
      <Header />
      <Banner />
      <ActivityCards />
      <Footer />
      
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}
    </div>
  );
};

export default App; 