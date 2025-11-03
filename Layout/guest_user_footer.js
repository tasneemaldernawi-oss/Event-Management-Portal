/* -------------------- Main Footer Component -------------------- */
class MainFooter extends HTMLElement {
  async connectedCallback() {
    try {
      // Load HTML template from external file (relative to JS file location)
      const scriptUrl = new URL(import.meta.url);
      const scriptDir = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptDir}/guest_user_footer.html`;
      const response = await fetch(templatePath);
      let htmlTemplate = await response.text();

      // Get current year for copyright
      const currentYear = new Date().getFullYear();

      // Replace the year placeholder with current year
      htmlTemplate = htmlTemplate.replace('{{YEAR}}', currentYear);

      // Inject the HTML into the custom element
      this.innerHTML = htmlTemplate;

      // Wait a moment for DOM to settle, then make footer dynamic and full-width
      setTimeout(() => {
        const footer = this.querySelector('footer');
        
        if (footer) {
          // Make footer dynamic - it will naturally flow after content
          // Span full viewport width using viewport width technique
          footer.style.position = 'relative';
          footer.style.width = '100vw';
          footer.style.left = '50%';
          footer.style.right = '50%';
          footer.style.marginLeft = '-50vw';
          footer.style.marginRight = '-50vw';
          footer.style.overflowX = 'hidden';
          footer.style.boxSizing = 'border-box';
          
          // Ensure footer appears above sidebar (sidebar z-index is 100)
          footer.style.zIndex = '150';
          footer.style.background = '#212529';
          
          // Footer is dynamic - it will take the space it needs based on content
          footer.style.clear = 'both';
          footer.style.display = 'block';
          
          // Ensure the custom element wrapper also has proper positioning
          this.style.position = 'relative';
          this.style.width = '100%';
          this.style.zIndex = '150';
          this.style.display = 'block';
          this.style.marginTop = 'auto'; // Push footer to bottom on short pages
          
          // Make body flexbox to ensure footer stays at bottom on short pages
          // This makes footer dynamic - it adjusts based on content length
          const body = document.body;
          if (!body.style.display || body.style.display === '') {
            body.style.display = 'flex';
            body.style.flexDirection = 'column';
            body.style.minHeight = '100vh';
            
            // Make main content grow to fill available space (pushes footer down)
            const mainContent = document.querySelector('main');
            if (mainContent) {
              // Only add flex-grow if not already set
              if (!mainContent.style.flexGrow) {
                mainContent.style.flexGrow = '1';
              }
            }
          }
        }
      }, 150);
    } catch (error) {
      // If loading fails, show error message
      console.error('Error loading footer template:', error);
      this.innerHTML = `
        <footer class="bg-dark text-light p-4 text-center">
          <p class="text-white-50 mb-0">Footer failed to load. Please refresh the page.</p>
        </footer>
      `;
    }
  }
}

// Register the custom element
customElements.define("main-footer", MainFooter);

