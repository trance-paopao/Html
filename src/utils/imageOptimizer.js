// Image optimizer utility

/**
 * Convert an image to WebP format
 * This is a simulation since we can't actually convert images in the browser
 * In a real project, you would do this on the server or build process
 */
function convertToWebP(imgElement) {
  const originalSrc = imgElement.getAttribute('data-src') || imgElement.src;
  
  // Check if image is already WebP
  if (originalSrc.endsWith('.webp')) {
    return originalSrc;
  }
  
  // In a real project, you would use a server endpoint or build tool to convert
  // Here we just simulate by changing the extension
  const webpSrc = originalSrc.replace(/\.(jpe?g|png|gif)$/i, '.webp');
  
  return webpSrc;
}

/**
 * Apply WebP if browser supports it
 * @param {HTMLImageElement} imgElement - The image element
 */
function applyWebPIfSupported(imgElement) {
  // Check if browser supports WebP
  if (supportsWebP()) {
    const webpSrc = convertToWebP(imgElement);
    
    if (imgElement.hasAttribute('data-src')) {
      imgElement.setAttribute('data-src', webpSrc);
    } else {
      imgElement.src = webpSrc;
    }
  }
}

/**
 * Check if browser supports WebP
 * @returns {boolean} - Whether WebP is supported
 */
function supportsWebP() {
  // Feature detection for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // If the browser supports canvas, check toDataURL WebP support
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  // No canvas support means no WebP support
  return false;
}

/**
 * Apply WebP optimization to all images with the specified selector
 * @param {string} selector - CSS selector for images
 */
function optimizeImages(selector = 'img') {
  // Get all images
  const images = document.querySelectorAll(selector);
  
  // Apply WebP optimization if supported
  images.forEach(img => {
    applyWebPIfSupported(img);
  });
}

// Export functions
export { 
  convertToWebP,
  applyWebPIfSupported,
  supportsWebP,
  optimizeImages
}; 