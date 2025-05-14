import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/reset.css';
import './styles/style.css';

// 性能监控
const performance = {
  startTime: Date.now(),
  domLoaded: 0,
  fullyLoaded: 0,
  logTimes() {
    console.log(`DOM加载时间: ${this.domLoaded}ms`);
    console.log(`页面完全加载时间: ${this.fullyLoaded}ms`);
  }
};

// DOM content loaded event
document.addEventListener('DOMContentLoaded', () => {
  performance.domLoaded = Date.now() - performance.startTime;
});

// 初始化应用
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// 记录页面完全加载时间
window.addEventListener('load', () => {
  performance.fullyLoaded = Date.now() - performance.startTime;
  performance.logTimes();
}); 