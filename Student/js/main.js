// University Event Portal - Complete JavaScript
console.log('University Event Portal JS loaded');

// Simple user data
let userData = {
    name: "Student User",
    email: "student@university.edu",
    faculty: "Engineering",
    eventsAttended: 8,
    eventsCreated: 3
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Setup specific pages
    if (window.location.pathname.includes('profile.html')) {
        setupProfilePage();
    }
    if (window.location.pathname.includes('events.html')) {
        setupEventsPage();
    }
    if (window.location.pathname.includes('create-event.html')) {
        setupCreateEventPage();
    }
    if (window.location.pathname.includes('calendar.html')) {
        setupCalendarPage();
    }
    
    // Setup navigation
    setupNavigation();
});

// Manual date formatting for text input
function formatDateInput(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Auto-format as YYYY-MM-DD
    if (value.length > 4) {
        value = value.substring(0,4) + '-' + value.substring(4,6) + '-' + value.substring(6,8);
    } else if (value.length > 2) {
        value = value.substring(0,4) + '-' + value.substring(4,6);
    }
    
    input.value = value;
}

// Simple Profile Page
function setupProfilePage() {
    console.log('Setting up simple profile');
    
    // Display user info
    document.getElementById('display-name').textContent = userData.name;
    document.getElementById('display-email').textContent = userData.email;
    document.getElementById('display-faculty').textContent = userData.faculty;
    
    // Display stats
    document.getElementById('events-attended').textContent = userData.eventsAttended;
    document.getElementById('events-created').textContent = userData.eventsCreated;
    
    // Edit button functionality
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const newName = prompt('Enter your name:', userData.name);
            const newEmail = prompt('Enter your email:', userData.email);
            const newFaculty = prompt('Enter your faculty:', userData.faculty);
            
            if (newName) userData.name = newName;
            if (newEmail) userData.email = newEmail;
            if (newFaculty) userData.faculty = newFaculty;
            
            // Update display
            document.getElementById('display-name').textContent = userData.name;
            document.getElementById('display-email').textContent = userData.email;
            document.getElementById('display-faculty').textContent = userData.faculty;
            
            alert('Profile updated!');
        });
    }
}

// Events Page
function setupEventsPage() {
    const pastEventsContainer = document.getElementById('past-events-container');
    if (pastEventsContainer) {
        const pastEvents = [
            { name: "AI Hackathon", date: "Oct 15, 2024", faculty: "Engineering" },
            { name: "Career Fair", date: "Sep 20, 2024", faculty: "Business" }
        ];
        
        pastEventsContainer.innerHTML = pastEvents.map(event => `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p>Faculty: ${event.faculty}</p>
                <button class="btn-secondary">View Details</button>
            </div>
        `).join('');
    }
}

// Create Event Page
function setupCreateEventPage() {
    const eventForm = document.querySelector('.create-event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventName = document.getElementById('event-name').value;
            const eventDate = document.getElementById('event-date').value;
            
            if (!eventName || !eventDate) {
                alert('Please fill event name and date');
                return;
            }
            
            alert(`Event "${eventName}" created successfully!\nDate: ${eventDate}\n\nWaiting for admin approval.`);
            
            // Update user stats
            userData.eventsCreated++;
            
            // Reset form
            eventForm.reset();
        });
    }
}

// Calendar Page
function setupCalendarPage() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonth = document.getElementById('current-month');
    
    if (calendarGrid && currentMonth) {
        const today = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        currentMonth.textContent = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
        
        // Simple calendar - just show current month days
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Mark today
            if (day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
}

// Navigation
function setupNavigation() {
    // Logout confirmation
    const logoutLinks = document.querySelectorAll('a[href="logout.html"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
                window.location.href = 'index.html';
            }
        });
    });
}