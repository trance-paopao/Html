/**
 * Modal Component
 * A reusable modal dialog component
 */

class Modal {
  /**
   * Create a new Modal
   * @param {Object} options - Modal options
   * @param {string} [options.title=''] - Modal title
   * @param {string} [options.content=''] - Modal content (HTML allowed)
   * @param {Function} [options.onOpen=null] - Callback when modal opens
   * @param {Function} [options.onClose=null] - Callback when modal closes
   * @param {string} [options.width='80%'] - Modal width
   * @param {string} [options.maxWidth='6rem'] - Modal max width
   * @param {boolean} [options.closable=true] - Whether the modal can be closed by the user
   * @param {boolean} [options.closeOnOverlayClick=true] - Whether clicking the overlay closes the modal
   */
  constructor(options) {
    this.options = Object.assign({
      title: '',
      content: '',
      onOpen: null,
      onClose: null,
      width: '80%',
      maxWidth: '6rem',
      closable: true,
      closeOnOverlayClick: true
    }, options);
    
    this.modal = null;
    this.overlay = null;
    this.isOpen = false;
  }
  
  /**
   * Render the modal
   * @returns {HTMLElement} - The modal element
   */
  render() {
    // Create modal overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay fade-in';
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.overlay.style.zIndex = '999';
    this.overlay.style.display = 'flex';
    this.overlay.style.justifyContent = 'center';
    this.overlay.style.alignItems = 'center';
    
    // Add overlay click handler if enabled
    if (this.options.closeOnOverlayClick && this.options.closable) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
    
    // Create modal container
    this.modal = document.createElement('div');
    this.modal.className = 'modal fade-in';
    this.modal.style.width = this.options.width;
    this.modal.style.maxWidth = this.options.maxWidth;
    this.modal.style.backgroundColor = 'white';
    this.modal.style.borderRadius = '0.2rem';
    this.modal.style.overflow = 'hidden';
    this.modal.style.maxHeight = '80vh';
    this.modal.style.display = 'flex';
    this.modal.style.flexDirection = 'column';
    
    // Prevent propagation to avoid overlay click
    this.modal.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    // Create modal header if title is provided
    if (this.options.title) {
      const header = document.createElement('div');
      header.className = 'modal-header flex justify-between items-center';
      header.style.padding = '0.2rem 0.3rem';
      header.style.borderBottom = '1px solid #eee';
      
      // Create title
      const title = document.createElement('h3');
      title.className = 'modal-title text-medium text-bold';
      title.textContent = this.options.title;
      
      header.appendChild(title);
      
      // Create close button if closable
      if (this.options.closable) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.style.fontSize = '0.4rem';
        closeBtn.style.lineHeight = '0.4rem';
        closeBtn.style.color = '#999';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'none';
        closeBtn.style.cursor = 'pointer';
        
        closeBtn.addEventListener('click', () => this.close());
        
        header.appendChild(closeBtn);
      }
      
      this.modal.appendChild(header);
    }
    
    // Create modal body
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.style.padding = '0.3rem';
    body.style.overflowY = 'auto';
    body.style.flexGrow = '1';
    
    // Set content
    if (typeof this.options.content === 'string') {
      body.innerHTML = this.options.content;
    } else if (this.options.content instanceof HTMLElement) {
      body.appendChild(this.options.content);
    }
    
    this.modal.appendChild(body);
    
    // Create footer if provided
    if (this.options.footer) {
      const footer = document.createElement('div');
      footer.className = 'modal-footer flex justify-end';
      footer.style.padding = '0.2rem 0.3rem';
      footer.style.borderTop = '1px solid #eee';
      
      if (typeof this.options.footer === 'string') {
        footer.innerHTML = this.options.footer;
      } else if (this.options.footer instanceof HTMLElement) {
        footer.appendChild(this.options.footer);
      } else if (Array.isArray(this.options.footer)) {
        // If footer is an array of buttons
        this.options.footer.forEach(btn => {
          footer.appendChild(btn);
        });
      }
      
      this.modal.appendChild(footer);
    }
    
    // Append modal to overlay
    this.overlay.appendChild(this.modal);
    
    return this.overlay;
  }
  
  /**
   * Open the modal
   */
  open() {
    if (this.isOpen) return;
    
    // Create modal if it doesn't exist
    if (!this.modal) {
      this.render();
    }
    
    // Append to body
    document.body.appendChild(this.overlay);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Set open state
    this.isOpen = true;
    
    // Call onOpen callback if provided
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen(this);
    }
    
    // Add escape key listener if closable
    if (this.options.closable) {
      this._addEscapeKeyListener();
    }
  }
  
  /**
   * Close the modal
   */
  close() {
    if (!this.isOpen) return;
    
    if (this.overlay && this.overlay.parentNode) {
      // Remove from DOM
      document.body.removeChild(this.overlay);
      
      // Restore body scrolling
      document.body.style.overflow = '';
      
      // Set closed state
      this.isOpen = false;
      
      // Remove escape key listener
      this._removeEscapeKeyListener();
      
      // Call onClose callback if provided
      if (typeof this.options.onClose === 'function') {
        this.options.onClose(this);
      }
    }
  }
  
  /**
   * Set modal content
   * @param {string|HTMLElement} content - New content for the modal
   */
  setContent(content) {
    const body = this.modal.querySelector('.modal-body');
    
    if (body) {
      // Clear current content
      body.innerHTML = '';
      
      // Set new content
      if (typeof content === 'string') {
        body.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        body.appendChild(content);
      }
    }
  }
  
  /**
   * Set modal title
   * @param {string} title - New title for the modal
   */
  setTitle(title) {
    const titleElement = this.modal.querySelector('.modal-title');
    
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
  
  /**
   * Add escape key listener
   * @private
   */
  _addEscapeKeyListener() {
    this._handleEscapeKey = (e) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.close();
      }
    };
    
    document.addEventListener('keydown', this._handleEscapeKey);
  }
  
  /**
   * Remove escape key listener
   * @private
   */
  _removeEscapeKeyListener() {
    if (this._handleEscapeKey) {
      document.removeEventListener('keydown', this._handleEscapeKey);
      this._handleEscapeKey = null;
    }
  }
}

export default Modal; 