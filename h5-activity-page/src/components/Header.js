import React from 'react';

const Header = () => {
  return (
    <header className="header flex justify-between items-center">
      <div className="text-xl text-bold">活动专区</div>
      <nav className="flex">
        <a href="#" className="px-1">首页</a>
        <a href="#" className="px-1">我的</a>
      </nav>
    </header>
  );
};

export default Header; 