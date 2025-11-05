class MainFooter extends HTMLElement {
  async connectedCallback() {
    try {
      // Load HTML template from external file (relative to JS file location)
      const scriptUrl = new URL(import.meta.url);
      const scriptDir = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptDir}/guest_user_footer.html`;
      const response = await fetch(templatePath);

      if (!response.ok) throw new Error('Failed to load footer template');

      let htmlTemplate = await response.text();

      // Get current year for copyright
      const currentYear = new Date().getFullYear();

      // Replace {{YEAR}} placeholder
      htmlTemplate = htmlTemplate.replace('{{YEAR}}', currentYear);

      // Inject the HTML into the custom element
      this.innerHTML = htmlTemplate;

      // Wait a short moment for DOM to settle
      setTimeout(() => {
        const footer = this.querySelector('footer');
        if (footer) {
          // Dynamic and full-width styling
          Object.assign(footer.style, {
            position: 'relative',
            width: '100vw',
            left: '50%',
            marginLeft: '-50vw',
            background: '#212529',
            color: '#f8f9fa',
            boxSizing: 'border-box',
            zIndex: '150',
            clear: 'both',
            display: 'block',
            overflowX: 'hidden'
          });

          // Ensure wrapper <main-footer> also behaves properly
          Object.assign(this.style, {
            position: 'relative',
            width: '100%',
            display: 'block',
            zIndex: '150',
            marginTop: 'auto'
          });

          // Make the page flex to push footer down when content is short
          const body = document.body;
          body.style.display = 'flex';
          body.style.flexDirection = 'column';
          body.style.minHeight = '100vh';

          const main = document.querySelector('main');
          if (main && !main.style.flexGrow) {
            main.style.flexGrow = '1';
          }
        }
      }, 150);
    } catch (error) {
      console.error('Error loading footer template:', error);
      this.innerHTML = `
        <footer class="bg-dark text-light p-4 text-center">
          <p class="text-white-50 mb-0">Footer failed to load. Please refresh the page.</p>
        </footer>
      `;
    }
  }
}

customElements.define('main-footer', MainFooter);
