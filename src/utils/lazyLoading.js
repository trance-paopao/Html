/**
 * Lazy Loading Utility
 * Handles lazy loading of images for better performance
 */

/**
 * Initialize lazy loading for images
 * @param {string} selector - CSS selector for lazy load images
 */
function initLazyLoading(selector = 'img.lazy-load') {
  // Load all images that are in viewport on initial load
  loadVisibleImages(selector);
  
  // Setup intersection observer for lazy loading if supported
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            // Load the image
            loadImage(img, src);
            
            // Stop observing the image
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      // Load images a bit before they come into view
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all lazy load images
    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    window.addEventListener('scroll', throttle(() => {
      loadVisibleImages(selector);
    }, 200));
    
    window.addEventListener('resize', throttle(() => {
      loadVisibleImages(selector);
    }, 200));
    
    window.addEventListener('orientationchange', throttle(() => {
      loadVisibleImages(selector);
    }, 200));
  }
}

/**
 * Load an image with fade-in effect
 * @param {HTMLImageElement} img - The image element
 * @param {string} src - The source URL
 */
function loadImage(img, src) {
  // Create a new image element to preload
  const newImg = new Image();
  
  // When the image is loaded
  newImg.onload = function() {
    // Set the source on the actual image
    img.src = src;
    
    // Add a class for fade-in effect
    img.classList.add('fade-in');
    
    // Remove the lazy-load class
    img.classList.remove('lazy-load');
    
    // Remove the data-src attribute
    img.removeAttribute('data-src');
  };
  
  // Set the source to begin loading
  newImg.src = src;
}

/**
 * Load all images currently visible in the viewport
 * @param {string} selector - CSS selector for lazy load images
 */
function loadVisibleImages(selector = 'img.lazy-load') {
  const lazyImages = document.querySelectorAll(selector);
  
  lazyImages.forEach(img => {
    if (isInViewport(img)) {
      const src = img.getAttribute('data-src');
      
      if (src) {
        loadImage(img, src);
      }
    }
  });
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 50 &&
    rect.bottom >= -50 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) + 50 &&
    rect.right >= -50
  );
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - The function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
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

export {
  initLazyLoading,
  loadVisibleImages,
  isInViewport,
  loadImage,
  throttle
}; 