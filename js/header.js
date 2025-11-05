document.addEventListener("DOMContentLoaded", function(){
  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop() || 'managmentevent.html';
  document.querySelectorAll(".nav-link").forEach(link => {
    if(link.getAttribute('href') === currentPage) link.classList.add("active");
  });

  // Logout confirmation
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', function(e){
    e.preventDefault();
    if(confirm('Are you sure you want to logout?')) alert('Logging out...');
  });
});
