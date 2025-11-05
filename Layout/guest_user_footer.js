/* Footer Component - Creates reusable footer for all pages */

class MainFooter extends HTMLElement {
  async connectedCallback() {
    try {
      // Load HTML template from same folder
      const scriptUrl = new URL(import.meta.url);
      const scriptFolder = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptFolder}/guest_user_footer.html`;
      const response = await fetch(templatePath);
      
      if (!response.ok) throw new Error(`Failed to load footer: ${response.status}`);
      
      // Replace {{YEAR}} with current year
      let htmlContent = await response.text();
      htmlContent = htmlContent.replace('{{YEAR}}', new Date().getFullYear());
      
      this.innerHTML = htmlContent;
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.position = 'relative';
      
      // Style footer after a short delay
      setTimeout(() => this.styleFooter(), 150);
      
    } catch (error) {
      console.error('Error loading footer:', error);
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.position = 'relative';
      this.innerHTML = `<footer class="bg-dark text-light p-4 text-center"><p class="text-white-50 mb-0">Footer failed to load: ${error.message}</p></footer>`;
    }
  }
  
  // Make footer full-width and position it correctly
  styleFooter() {
    const footer = this.querySelector('footer');
    if (!footer) return;
    
    // Full-width styling
    Object.assign(footer.style, {
      position: 'relative',
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      zIndex: '150',
      background: '#212529',
      clear: 'both',
      display: 'block'
    });
    
    // Style wrapper
    Object.assign(this.style, {
      position: 'relative',
      width: '100%',
      zIndex: '150',
      display: 'block',
      marginTop: 'auto'
    });
    
    this.setupPageLayout();
  }
  
  // Set up page layout so footer stays at bottom
  setupPageLayout() {
    const body = document.body;
    if (body.style.display && body.style.display !== '') return;
    
    // Make body flexbox to push footer to bottom
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.minHeight = '100vh';
    
    // Find or create main content area
    let mainContent = document.querySelector('main') || document.querySelector('section');
    
    if (!mainContent) {
      // Create wrapper for all content before footer
      const footer = this;
      const allContent = Array.from(document.body.children).filter(
        el => el !== footer && el.tagName !== 'SCRIPT'
      );
      
      if (allContent.length > 0) {
        const wrapper = document.createElement('div');
        wrapper.style.flexGrow = '1';
        allContent.forEach(el => wrapper.appendChild(el));
        document.body.insertBefore(wrapper, footer);
        mainContent = wrapper;
      }
    }
    
    // Make main content grow (pushes footer down)
    if (mainContent && !mainContent.style.flexGrow) {
      mainContent.style.flexGrow = '1';
    }
  }
}

// Register with both names: <main-footer> and <guest-footer>
if (!customElements.get("main-footer")) {
  customElements.define("main-footer", MainFooter);
}
if (!customElements.get("guest-footer")) {
  customElements.define("guest-footer", class extends MainFooter {});
}
