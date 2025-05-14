/**
 * Carousel Component
 * A reusable carousel/slider component
 */

class Carousel {
  /**
   * Create a new Carousel
   * @param {Object} options - Carousel options
   * @param {boolean} [options.autoplay=true] - Whether to autoplay the carousel
   * @param {number} [options.interval=3000] - Autoplay interval in milliseconds
   * @param {Array} [options.items=[]] - Array of slide items (each with image and link)
   * @param {string} [options.containerClass=''] - Additional class for the container
   * @param {boolean} [options.showIndicators=true] - Whether to show indicators
   * @param {boolean} [options.showArrows=true] - Whether to show navigation arrows
   */
  constructor(options) {
    this.options = Object.assign({
      autoplay: true,
      interval: 3000,
      items: [],
      containerClass: '',
      showIndicators: true,
      showArrows: true,
      height: '3rem',
      onSlideChange: null
    }, options);
    
    this.currentIndex = 0;
    this.interval = null;
    this.container = null;
    this.slidesContainer = null;
    this.indicatorContainer = null;
  }
  
  /**
   * Render the carousel
   * @returns {HTMLElement} - The carousel element
   */
  render() {
    // Create carousel container
    this.container = document.createElement('div');
    this.container.className = `carousel ${this.options.containerClass}`;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
    this.container.style.borderRadius = '0.1rem';
    this.container.style.height = this.options.height;
    
    // Create slides container
    this.slidesContainer = document.createElement('div');
    this.slidesContainer.className = 'carousel-slides flex';
    this.slidesContainer.style.width = `${this.options.items.length * 100}%`;
    this.slidesContainer.style.transition = 'transform 0.3s ease';
    
    // Create slides
    this._createSlides();
    
    // Create indicators if enabled
    if (this.options.showIndicators) {
      this._createIndicators();
    }
    
    // Create navigation arrows if enabled
    if (this.options.showArrows) {
      this._createArrows();
    }
    
    // Add touch events for swipe
    this._addTouchEvents();
    
    // Append elements to container
    this.container.appendChild(this.slidesContainer);
    
    // Start autoplay if enabled
    if (this.options.autoplay) {
      this.startAutoplay();
      
      // Pause autoplay on hover
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    return this.container;
  }
  
  /**
   * Create slides for the carousel
   * @private
   */
  _createSlides() {
    this.options.items.forEach((item, index) => {
      // Create slide
      const slide = document.createElement('div');
      slide.className = 'carousel-slide flex-1';
      slide.style.width = `${100 / this.options.items.length}%`;
      
      const link = document.createElement('a');
      link.href = item.link || '#';
      link.style.display = 'block';
      link.style.width = '100%';
      link.style.height = '100%';
      
      const img = document.createElement('img');
      img.className = 'lazy-load';
      img.setAttribute('data-src', item.image);
      img.alt = item.alt || `Slide ${index + 1}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      
      // Placeholder until image loads
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23cccccc"/%3E%3C/svg%3E';
      
      link.appendChild(img);
      slide.appendChild(link);
      this.slidesContainer.appendChild(slide);
    });
  }
  
  /**
   * Create indicators for the carousel
   * @private
   */
  _createIndicators() {
    // Create indicator container
    this.indicatorContainer = document.createElement('div');
    this.indicatorContainer.className = 'carousel-indicators flex justify-center';
    this.indicatorContainer.style.position = 'absolute';
    this.indicatorContainer.style.bottom = '0.2rem';
    this.indicatorContainer.style.left = '0';
    this.indicatorContainer.style.right = '0';
    this.indicatorContainer.style.zIndex = '1';
    
    // Create indicator dots
    this.options.items.forEach((_, index) => {
      const indicator = document.createElement('span');
      indicator.className = 'carousel-indicator';
      indicator.style.width = '0.16rem';
      indicator.style.height = '0.16rem';
      indicator.style.borderRadius = '50%';
      indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      indicator.style.margin = '0 0.05rem';
      indicator.style.transition = 'background-color 0.3s';
      indicator.style.cursor = 'pointer';
      
      if (index === 0) {
        indicator.style.backgroundColor = 'white';
      }
      
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      this.indicatorContainer.appendChild(indicator);
    });
    
    this.container.appendChild(this.indicatorContainer);
  }
  
  /**
   * Create navigation arrows for the carousel
   * @private
   */
  _createArrows() {
    // Create arrow styles
    const arrowStyle = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0.6rem',
      height: '0.6rem',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: '1',
      color: 'white',
      fontSize: '0.3rem',
      fontWeight: 'bold',
      userSelect: 'none'
    };
    
    // Create previous arrow
    const prevArrow = document.createElement('div');
    prevArrow.className = 'carousel-arrow carousel-arrow-prev';
    Object.assign(prevArrow.style, arrowStyle);
    prevArrow.style.left = '0.2rem';
    prevArrow.innerHTML = '&lt;';
    prevArrow.addEventListener('click', () => this.prevSlide());
    
    // Create next arrow
    const nextArrow = document.createElement('div');
    nextArrow.className = 'carousel-arrow carousel-arrow-next';
    Object.assign(nextArrow.style, arrowStyle);
    nextArrow.style.right = '0.2rem';
    nextArrow.innerHTML = '&gt;';
    nextArrow.addEventListener('click', () => this.nextSlide());
    
    // Append arrows to container
    this.container.appendChild(prevArrow);
    this.container.appendChild(nextArrow);
  }
  
  /**
   * Add touch events for swipe functionality
   * @private
   */
  _addTouchEvents() {
    let startX = 0;
    let isDragging = false;
    
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      if (Math.abs(diff) > 30) {
        // Prevent default scrolling when swiping
        e.preventDefault();
      }
    });
    
    this.container.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      // Minimum swipe distance
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left, go to next slide
          this.nextSlide();
        } else {
          // Swipe right, go to previous slide
          this.prevSlide();
        }
      }
      
      isDragging = false;
      this.startAutoplay();
    });
  }
  
  /**
   * Go to a specific slide
   * @param {number} index - Slide index
   */
  goToSlide(index) {
    // Update current index
    this.currentIndex = index;
    
    // Handle index boundaries
    if (this.currentIndex < 0) {
      this.currentIndex = this.options.items.length - 1;
    } else if (this.currentIndex >= this.options.items.length) {
      this.currentIndex = 0;
    }
    
    // Move slides container
    this.slidesContainer.style.transform = `translateX(-${this.currentIndex * (100 / this.options.items.length)}%)`;
    
    // Update indicators if they exist
    if (this.indicatorContainer) {
      const indicators = this.indicatorContainer.querySelectorAll('.carousel-indicator');
      indicators.forEach((indicator, i) => {
        if (i === this.currentIndex) {
          indicator.style.backgroundColor = 'white';
        } else {
          indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        }
      });
    }
    
    // Call onSlideChange callback if provided
    if (typeof this.options.onSlideChange === 'function') {
      this.options.onSlideChange(this.currentIndex);
    }
  }
  
  /**
   * Go to the next slide
   */
  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }
  
  /**
   * Go to the previous slide
   */
  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }
  
  /**
   * Start autoplay
   */
  startAutoplay() {
    if (this.options.autoplay) {
      this.stopAutoplay();
      this.interval = setInterval(() => {
        this.nextSlide();
      }, this.options.interval);
    }
  }
  
  /**
   * Stop autoplay
   */
  stopAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  /**
   * Destroy the carousel
   */
  destroy() {
    this.stopAutoplay();
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

export default Carousel; 