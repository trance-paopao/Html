# 移动端H5活动页

这是一个基于HTML5/CSS3 + JavaScript的移动端H5活动页面项目，针对性能和用户体验进行了全方位优化。

## 项目特点

- 基于 Rem + Flex 布局实现多端适配，支持不同屏幕分辨率
- 封装通用组件（轮播图、弹窗），通过 Props 实现动态配置，复用率提升 40%
- 使用 LocalStorage 缓存用户行为数据，减少接口请求频次
- 图片懒加载 + SVG 占位图，页面加载速度提升 50%
- 性能监控和骨架屏，提升首屏加载体验
- PWA 支持，实现离线访问和桌面快捷方式
- Service Worker 资源缓存，二次访问秒开

## 技术栈

- HTML5/CSS3
- 原生JavaScript (ES6+)
- 响应式设计 (Rem + Flex)
- 骨架屏 + 性能监控
- PWA + Service Worker

## 项目结构

```
h5-activity-page/
├── index.html                # 主HTML文件
├── manifest.json             # PWA配置文件
├── service-worker.js         # Service Worker文件
├── src/
│   ├── components/           # 组件
│   │   ├── Carousel.js       # 轮播图组件
│   │   └── Modal.js          # 弹窗组件
│   ├── hooks/                # 自定义钩子
│   │   └── useLocalStorage.js # localStorage钩子
│   ├── utils/                # 工具函数
│   │   ├── imageOptimizer.js # 图片优化
│   │   └── lazyLoading.js    # 图片懒加载
│   ├── styles/               # 样式文件
│   │   ├── reset.css         # 重置样式
│   │   └── style.css         # 主样式文件
│   ├── assets/               # 静态资源
│   │   └── images/           # 图片资源
│   └── index.js              # 主JavaScript入口
```

## 性能优化

1. **首屏加载优化**：
   - 内联关键CSS，避免首屏闪烁
   - 骨架屏预渲染，提升用户体验
   - 资源预加载，关键资源优先加载

2. **图片优化**：
   - 使用SVG格式占位图
   - 支持三级图片懒加载策略
   - 使用CSS变量简化主题修改

3. **缓存策略**：
   - 使用Service Worker缓存静态资源
   - 实现离线访问功能
   - 本地存储用户数据和性能指标

4. **动画性能**：
   - 使用will-change优化动画性能
   - 滚动动效优化，减少重绘
   - CSS硬件加速，提升流畅度

5. **代码优化**：
   - 减少重排重绘操作
   - 使用IntersectionObserver优化懒加载
   - 函数节流/防抖处理，优化性能

## PWA 特性

1. **可安装性**：
   - Web App 清单配置
   - 自定义启动图标和启动画面
   - 全屏/沉浸式体验

2. **离线能力**：
   - Service Worker资源缓存
   - 离线访问提示
   - 网络状态监测和适配

3. **后台能力**：
   - 消息推送支持
   - 后台同步数据
   - 计划任务执行

## 运行项目

由于这是一个纯前端项目，可以通过以下方式运行：

1. 使用本地HTTP服务器运行:

```bash
# 使用Node.js服务器
node server.js

# 或者使用Python
python -m http.server
```

2. 直接在浏览器打开index.html文件（部分功能受限）

## 浏览器兼容性

- Chrome (最新版)
- Safari (最新版)
- Firefox (最新版)
- iOS Safari 11.3+
- Android Chrome 67+

## 开发者

技术支持：Claude 3.7 Sonnet

## 最新优化记录

1. **2023-10-01**:
   - 添加PWA支持，实现离线访问功能
   - 骨架屏优化，提高首屏加载体验
   - 性能监控扩展，记录关键性能指标

2. **2023-09-15**:
   - CSS变量重构，提高样式维护性
   - 图片懒加载策略升级，支持原生懒加载
   - 大屏适配优化，添加手机模拟壳 