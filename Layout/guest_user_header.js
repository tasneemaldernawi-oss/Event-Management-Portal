/* Guest Header Component - Creates reusable header for guest pages */

class GuestHeader extends HTMLElement {
  async connectedCallback() {
    try {
      // Get active page name (e.g., "home", "events")
      const activePage = (this.getAttribute("active") || "").toLowerCase();
      
      // Load HTML template from same folder
      const scriptUrl = new URL(import.meta.url);
      const scriptFolder = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const templatePath = `${scriptFolder}/guest_user_header.html`;
      const htmlContent = await (await fetch(templatePath)).text();
      
      this.innerHTML = htmlContent;
      this.fixAllLinks(); // Fix links to work from any folder
      
      // Highlight active page link
      if (activePage) {
        const activeLink = this.querySelector(`[data-key="${activePage}"]`);
        if (activeLink) {
          activeLink.setAttribute("aria-current", "page");
          activeLink.classList.add("active");
        }
      }
    } catch (error) {
      console.error('Error loading guest header:', error);
      this.innerHTML = `<header class="bg-light p-3 text-center"><p class="mb-0 text-danger">Header failed to load. Please refresh.</p></header>`;
    }
  }
  
  // Fix all links to work from any folder (add ../ if needed)
  fixAllLinks() {
    const pathParts = window.location.pathname.split('/').filter(part => part && !part.endsWith('.html'));
    const folderDepth = pathParts.length;
    const pathPrefix = folderDepth > 0 ? '../'.repeat(folderDepth) : './';
    
    this.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#') &&
          !href.startsWith('../') && !href.startsWith('./') && folderDepth > 0) {
        link.setAttribute('href', pathPrefix + href);
      }
    });
  }
}

customElements.define("guest-header", GuestHeader);


/* User Header Component - For logged-in users */

class UserHeader extends HTMLElement {
  async connectedCallback() {
    try {
      // Try to get user name from attribute first
      let userName = (this.getAttribute("user") || "").trim();
      let userEmail = (this.getAttribute("email") || "").trim();
      
      // Get user name from window.userData if available
      if (!userName && window.userData && window.userData.name) {
        userName = window.userData.name;
      }
      
      const displayName = userName || userEmail || "User";
      const firstLetter = userName ? userName.trim().charAt(0).toUpperCase() : "U";
      
      // Load and customize template
      const scriptUrl = new URL(import.meta.url);
      const scriptFolder = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      let htmlContent = await (await fetch(`${scriptFolder}/user_header.html`)).text();
      htmlContent = htmlContent.replace('{{INITIAL}}', firstLetter).replace('{{DISPLAY_ID}}', displayName);
      
      this.innerHTML = htmlContent;
      this.fixAllLinks();
      
      // Update from userData after page loads
      setTimeout(() => this.updateFromUserData(), 500);
    } catch (error) {
      console.error('Error loading user header:', error);
      this.innerHTML = `<header class="bg-light p-3 text-center"><p class="mb-0 text-danger">User header failed to load.</p></header>`;
    }
  }
  
  updateFromUserData() {
    if (window.userData && window.userData.name) {
      const name = window.userData.name;
      const firstLetter = name.trim().charAt(0).toUpperCase();
      const initialSpan = this.querySelector('.badge.bg-primary');
      const nameSpan = this.querySelector('span[aria-label="Signed in as"]');
      if (initialSpan) initialSpan.textContent = firstLetter;
      if (nameSpan) nameSpan.textContent = name;
    }
  }
  
  fixAllLinks() {
    const pathParts = window.location.pathname.split('/').filter(part => part && !part.endsWith('.html'));
    const folderDepth = pathParts.length;
    const pathPrefix = folderDepth > 0 ? '../'.repeat(folderDepth) : './';
    
    this.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#') &&
          !href.startsWith('../') && !href.startsWith('./') && folderDepth > 0) {
        link.setAttribute('href', pathPrefix + href);
      }
    });
  }
}

customElements.define("user-header", UserHeader);


/* User Sidebar Component - For logged-in users */

class UserSidebar extends HTMLElement {
  async connectedCallback() {
    try {
      const activePage = (this.getAttribute("active") || "").toLowerCase();
      
      // Load template
      const scriptUrl = new URL(import.meta.url);
      const scriptFolder = scriptUrl.href.substring(0, scriptUrl.href.lastIndexOf('/'));
      const htmlContent = await (await fetch(`${scriptFolder}/user_sidebar.html`)).text();
      
      this.innerHTML = htmlContent;
      this.fixAllLinks();
      
      // Mark active link
      if (activePage) {
        const activeLink = this.querySelector(`[data-key="${activePage}"]`);
        if (activeLink) {
          activeLink.setAttribute("aria-current", "page");
          activeLink.classList.add("active", "fw-bold");
        }
      }
      
      this.setupMobileMenu();
    } catch (error) {
      console.error('Error loading sidebar:', error);
      this.innerHTML = `<aside class="bg-light p-3"><p class="mb-0 text-danger">Sidebar failed to load.</p></aside>`;
    }
  }
  
  fixAllLinks() {
    // Sidebar links are usually in same folder, so no changes needed
    this.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Just validate it's not an absolute URL
      if (href && href.startsWith('http') || href.startsWith('/')) {
        // Absolute URL - leave as is
      }
    });
  }
  
  setupMobileMenu() {
    setTimeout(() => {
      const sidebar = document.getElementById('user-sidebar');
      const toggleBtn = document.getElementById('sidebarToggle');
      if (!sidebar || !toggleBtn) return;
      
      // Create overlay for mobile menu
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
      
      // Close sidebar when overlay clicked
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
      
      // Close sidebar when link clicked (mobile only)
      if (window.innerWidth < 992) {
        sidebar.querySelectorAll('a').forEach(link => {
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
