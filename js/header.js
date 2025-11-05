// header.js - JavaScript functionality for the header
document.addEventListener('DOMContentLoaded', function() {
    // Set active nav link based on current page
    function setActiveNav() {
        const currentPage = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPage.includes(linkHref)) {
                link.classList.add('active');
            }
        });
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '../auth/login.html';
            }
        });
    }

    // Mobile menu toggle enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarContent = document.getElementById('navbarContent');
    
    if (navbarToggler && navbarContent) {
        navbarToggler.addEventListener('click', function() {
            const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
            navbarToggler.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Profile dropdown close on click outside
    document.addEventListener('click', function(e) {
        const profileDropdown = document.querySelector('.admin-profile');
        const dropdownMenu = document.querySelector('.admin-profile + .dropdown-menu');
        
        if (profileDropdown && dropdownMenu && 
            !profileDropdown.contains(e.target) && 
            !dropdownMenu.contains(e.target)) {
            // Close dropdown if Bootstrap is handling it
            const bsDropdown = bootstrap.Dropdown.getInstance(profileDropdown);
            if (bsDropdown) {
                bsDropdown.hide();
            }
        }
    });

    // Notification badge click handler
    const notificationBell = document.querySelector('.nav-link[data-bs-toggle="dropdown"]');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Mark notifications as read (optional)
            const notificationBadge = document.querySelector('.notification-badge');
            if (notificationBadge) {
                // You can add logic here to mark notifications as read
                console.log('Notifications viewed');
            }
        });
    }

    // Keyboard navigation for header
    document.addEventListener('keydown', function(e) {
        // ESC key closes dropdowns
        if (e.key === 'Escape') {
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                const dropdownInstance = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                if (dropdownInstance) {
                    dropdownInstance.hide();
                }
            });
        }
        
        // Tab key navigation enhancement
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('dropdown-item')) {
                const dropdown = focusedElement.closest('.dropdown-menu');
                if (dropdown && !dropdown.contains(e.relatedTarget)) {
                    const dropdownToggle = dropdown.previousElementSibling;
                    if (dropdownToggle) {
                        const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (dropdownInstance) {
                            dropdownInstance.hide();
                        }
                    }
                }
            }
        }
    });

    // Initialize header functionality
    setActiveNav();

    // Add loading state to header (optional)
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.addEventListener('click', function(e) {
            // Add loading indicator if needed
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 500);
        });
    }

    // Responsive header adjustments
    function handleResize() {
        const navLinks = document.querySelectorAll('.nav-link');
        const isMobile = window.innerWidth < 768;
        
        navLinks.forEach(link => {
            if (isMobile) {
                link.style.padding = '0.5rem 1rem !important';
            } else {
                link.style.padding = '0.6rem 1.2rem !important';
            }
        });
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial call
    handleResize();

    // Smooth scrolling for anchor links (if any in header)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header shadow on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Add/remove shadow based on scroll position
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Profile image error handling
    const profileImage = document.querySelector('.admin-profile img');
    if (profileImage) {
        profileImage.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9IiNkNjllMmUiLz4KPHBhdGggZD0iTTIxIDExQzE3LjEzIDExIDE0IDE0LjEzIDE0IDE4QzE0IDIxLjg3IDE3LjEzIDI1IDIxIDI1QzI0Ljg3IDI1IDI4IDIxLjg3IDI4IDE4QzI4IDE0LjEzIDI0Ljg3IDExIDIxIDExWk0yMSAyM0MxOS4zNCAyMyAxOCAyMS42NiAxOCAyMEMxOCAxOC4zNCAxOS4zNCAxNyAyMSAxN0MyMi42NiAxNyAyNCAxOC4zNCAyNCAyMEMyNCAyMS42NiAyMi42NiAyMyAyMSAyM1oiIGZpbGw9IiMxYTIwMmMiLz4KPC9zdmc+';
            this.alt = 'Default Profile';
        });
    }

    console.log('Header JavaScript loaded successfully');
});

// Export functions for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setActiveNav };
}