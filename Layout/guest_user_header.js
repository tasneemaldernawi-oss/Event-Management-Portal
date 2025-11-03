/* -------------------- Guest Header Component -------------------- */
class GuestHeader extends HTMLElement {
  async connectedCallback() {
    try {
      // Get active page from attribute
      const active = (this.getAttribute("active") || "").toLowerCase(); // home | events | contact | login | signup

      // Load HTML template from external file (relative to JS file location)
      const scriptUrl = new URL(import.meta.url);
      const scriptDir = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptDir}/guest_user_header.html`;
      const response = await fetch(templatePath);
      let htmlTemplate = await response.text();

      // Inject the HTML into the custom element
      this.innerHTML = htmlTemplate;

      // Fix all links to work from any directory
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(part => part && !part.endsWith('.html'));
      const depth = pathParts.length;
      const rootPath = depth > 0 ? '../'.repeat(depth) : './';

      const links = this.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
          if (href.startsWith('../') || href.startsWith('./')) {
            return;
          }
          if (depth > 0) {
            link.setAttribute('href', rootPath + href);
          }
        }
      });

      // Mark active link after HTML is loaded
      if (active) {
        const a = this.querySelector(`[data-key="${active}"]`);
        if (a) {
          a.setAttribute("aria-current", "page");
          a.classList.add("active");
        }
      }
    } catch (error) {
      console.error('Error loading guest header template:', error);
      this.innerHTML = `
        <header class="bg-light p-3 text-center">
          <p class="mb-0 text-danger">Header failed to load. Please refresh the page.</p>
        </header>
      `;
    }
  }
}
customElements.define("guest-header", GuestHeader);


/* -------------------- User Navbar (Top) Component -------------------- */
class UserHeader extends HTMLElement {
  async connectedCallback() {
    try {
      // Get user data from attributes
      const user = (this.getAttribute("user") || "").trim();
      const email = (this.getAttribute("email") || "").trim();

      // Determine display name (prefer user name, fallback to email)
      const displayId = user || email || "User";

      // Calculate initial for avatar (from user name or email before @)
      const getInitial = () => {
        if (user) return user.trim().charAt(0).toUpperCase();
        if (email) {
          const local = email.split("@")[0] || email;
          return local.trim().charAt(0).toUpperCase();
        }
        return "U";
      };

      const initial = getInitial();

      // Load HTML template from external file (relative to JS file location)
      const scriptUrl = new URL(import.meta.url);
      const scriptDir = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptDir}/user_header.html`;
      const response = await fetch(templatePath);
      let htmlTemplate = await response.text();

      // Replace placeholders with actual values
      htmlTemplate = htmlTemplate.replace('{{INITIAL}}', initial);
      htmlTemplate = htmlTemplate.replace('{{DISPLAY_ID}}', displayId);

      // Inject the HTML into the custom element
      this.innerHTML = htmlTemplate;

      // Fix all links in the header to work from any directory
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(part => part && !part.endsWith('.html'));
      const depth = pathParts.length;
      const rootPath = depth > 0 ? '../'.repeat(depth) : './';

      // Update all links in the header
      const links = this.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        // Only fix relative links (not absolute URLs or anchors)
        if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
          // If link already starts with ../ or ./, don't modify it
          if (href.startsWith('../') || href.startsWith('./')) {
            return; // Skip this link
          }
          // If we're in a subdirectory, prepend ../ to reach root
          if (depth > 0) {
            link.setAttribute('href', rootPath + href);
          }
          // If depth is 0, we're at root, href is already correct (no change needed)
        }
      });
    } catch (error) {
      // If loading fails, show error message
      console.error('Error loading user header template:', error);
      this.innerHTML = `
        <header class="bg-light p-3 text-center">
          <p class="mb-0 text-danger">User header failed to load. Please refresh the page.</p>
        </header>
      `;
    }
  }
}
customElements.define("user-header", UserHeader);

/* -------------------- User Sidebar Component -------------------- */
class UserSidebar extends HTMLElement {
  async connectedCallback() {
    try {
      // Get active page from attribute
      const active = (this.getAttribute("active") || "").toLowerCase(); // profile | past | create | calendar | logout

      // Load HTML template from external file (relative to JS file location)
      const scriptUrl = new URL(import.meta.url);
      const scriptDir = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptDir}/user_sidebar.html`;
      const response = await fetch(templatePath);
      let htmlTemplate = await response.text();

      // Inject the HTML into the custom element
      this.innerHTML = htmlTemplate;

      // Fix all sidebar links to work from any directory
      // Since all Student pages are in the same directory, links should work as-is
      // But we'll ensure relative paths work correctly
      const currentPath = window.location.pathname;
      const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/')) || '';
      
      // Update all links in the sidebar - for same-directory links, use filename as-is
      const links = this.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        // Only fix relative links (not absolute URLs or anchors)
        if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
          // If link already starts with ../ or ./, don't modify it
          if (href.startsWith('../') || href.startsWith('./')) {
            return; // Skip this link
          }
          // For same-directory links (like Student pages), keep them as-is
          // The filename-only links will work within the same directory
        }
      });

      // Mark active link after HTML is loaded
      if (active) {
        const a = this.querySelector(`[data-key="${active}"]`);
        if (a) {
          a.setAttribute("aria-current", "page");
          a.classList.add("active", "fw-bold");
        }
      }
      
      // Setup mobile sidebar toggle functionality
      this.setupMobileToggle();
    } catch (error) {
      // If loading fails, show error message
      console.error('Error loading user sidebar template:', error);
      this.innerHTML = `
        <aside class="bg-light p-3">
          <p class="mb-0 text-danger">Sidebar failed to load. Please refresh the page.</p>
        </aside>
      `;
    }
  }
  
  setupMobileToggle() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const sidebar = document.getElementById('user-sidebar');
      const toggleBtn = document.getElementById('sidebarToggle');
      
      if (!sidebar || !toggleBtn) return;
      
      // Create overlay element if it doesn't exist
      let overlay = document.querySelector('.sidebar-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
      }
      
      // Toggle sidebar on button click
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      });
      
      // Close sidebar when overlay is clicked
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
      
      // Close sidebar when a link is clicked (mobile only)
      if (window.innerWidth < 992) {
        const links = sidebar.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', () => {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
          });
        });
      }
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
          sidebar.classList.remove('show');
          overlay.classList.remove('show');
        }
      });
    }, 100);
  }
}
customElements.define("user-sidebar", UserSidebar);

