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

// Make userData globally accessible for header component
window.userData = userData;

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
    if (window.location.pathname.includes('createevent.html') || window.location.pathname.includes('create-event.html')) {
        setupCreateEventPage();
    }
    if (window.location.pathname.includes('calendar.html')) {
        setupCalendarPage();
    }
    if (window.location.pathname.includes('allevents.html')) {
        setupAllEventsPage();
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
            
            // Update global reference
            window.userData = userData;
            
            // Update display
            document.getElementById('display-name').textContent = userData.name;
            document.getElementById('display-email').textContent = userData.email;
            document.getElementById('display-faculty').textContent = userData.faculty;
            
            // Update header
            updateUserHeader();
            
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

// Event Storage Functions - Using localStorage
function saveEventToStorage(event) {
    try {
        // Get existing events from localStorage
        const existingEvents = getEventsFromStorage();
        
        // Add new event
        existingEvents.push(event);
        
        // Save back to localStorage
        localStorage.setItem('userEvents', JSON.stringify(existingEvents));
        
        console.log('Event saved to localStorage:', event);
        return true;
    } catch (error) {
        console.error('Error saving event to localStorage:', error);
        return false;
    }
}

function getEventsFromStorage() {
    try {
        const eventsJson = localStorage.getItem('userEvents');
        if (eventsJson) {
            return JSON.parse(eventsJson);
        }
        return [];
    } catch (error) {
        console.error('Error reading events from localStorage:', error);
        return [];
    }
}

// Format time from 24h to 12h format - Global function
window.formatTimeTo12Hour = function(time24h) {
    if (!time24h) return '';
    
    const [hours, minutes] = time24h.split(':');
    const hour12 = parseInt(hours, 10);
    const ampm = hour12 >= 12 ? 'PM' : 'AM';
    const hour12Formatted = hour12 % 12 || 12;
    
    return `${hour12Formatted}:${minutes} ${ampm}`;
};

// Make formatDateInput globally available
window.formatDateInput = formatDateInput;

// Create Event Page
function setupCreateEventPage() {
    const eventForm = document.querySelector('.create-event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventName = document.getElementById('event-name').value.trim();
            const eventDescription = document.getElementById('event-description').value.trim();
            const roomNumber = document.getElementById('room-number').value.trim();
            const eventFaculty = document.getElementById('event-faculty').value;
            const eventDate = document.getElementById('event-date').value.trim();
            const eventTime = document.getElementById('event-time').value;
            
            // Validation
            if (!eventName || !eventDate || !roomNumber || !eventFaculty || !eventTime) {
                alert('Please fill all required fields (marked with *)');
                return;
            }
            
            // Validate date format (YYYY-MM-DD)
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(eventDate)) {
                alert('Please enter date in format YYYY-MM-DD (e.g., 2024-12-25)');
                return;
            }
            
            // Check if date is in the future
            const selectedDate = new Date(eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                if (!confirm('This date is in the past. Do you still want to create this event?')) {
                    return;
                }
            }
            
            // Format time to 12-hour format
            const formattedTime = formatTimeTo12Hour(eventTime);
            
            // Create event object
            const newEvent = {
                date: eventDate,
                title: eventName,
                time: formattedTime,
                location: `Room ${roomNumber}`,
                faculty: eventFaculty.charAt(0).toUpperCase() + eventFaculty.slice(1),
                registrations: '0/100',
                status: 'upcoming',
                description: eventDescription || '',
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            if (saveEventToStorage(newEvent)) {
                // Update user stats
                userData.eventsCreated++;
                
                // Show success message
                alert(`Event "${eventName}" created successfully!\nDate: ${eventDate}\nTime: ${formattedTime}\n\nThe event will appear in your calendar.`);
                
                // Reset form
                eventForm.reset();
                
                // Optionally redirect to calendar
                if (confirm('Would you like to view your calendar now?')) {
                    window.location.href = 'calendar.html';
                }
            } else {
                alert('Error saving event. Please try again.');
            }
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

// All Events Page
function setupAllEventsPage() {
    // Hardcoded events from dashboard.html
    const dashboardEvents = [
        {
            title: 'AI Hackathon 2025',
            date: '2025-10-21',
            time: '10:00 AM',
            location: 'Gaming Hall',
            faculty: 'Artificial Intelligence',
            registrations: '45/50',
            status: 'upcoming',
            description: 'Join us for an exciting 48-hour AI hackathon where students collaborate to build innovative AI solutions.'
        },
        {
            title: 'Engineering Career Fair',
            date: '2025-10-25',
            time: '09:00 AM',
            location: 'Main Hall',
            faculty: 'Engineering',
            registrations: '100/150',
            status: 'upcoming',
            description: 'Meet top employers and explore career opportunities in engineering fields.'
        },
        {
            title: 'Research Symposium',
            date: '2025-10-26',
            time: '02:00 PM',
            location: 'Room 13',
            faculty: 'Research & Development',
            registrations: '80/100',
            status: 'upcoming',
            description: 'Showcase of undergraduate and graduate research projects across all faculties.'
        },
        {
            title: 'Business Leadership Workshop',
            date: '2025-10-28',
            time: '01:00 PM',
            location: 'Room 26',
            faculty: 'Business Administration',
            registrations: '40/40',
            status: 'upcoming',
            description: 'Learn essential leadership skills from industry experts and successful entrepreneurs.'
        }
    ];

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Determine if event is past or upcoming
    function getEventStatus(dateString) {
        const eventDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today ? 'upcoming' : 'past';
    }

    // Render events
    function renderEvents(events) {
        const container = document.getElementById('eventsContainer');
        const noEvents = document.getElementById('noEvents');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (events.length === 0) {
            if (noEvents) noEvents.classList.remove('d-none');
            return;
        }
        
        if (noEvents) noEvents.classList.add('d-none');
        
        events.forEach(event => {
            const status = event.status || getEventStatus(event.date);
            const statusClass = status === 'upcoming' ? 'success' : 'secondary';
            const statusText = status === 'upcoming' ? 'Upcoming' : 'Past';
            
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${event.title}</h5>
                            <span class="badge bg-${statusClass}">${statusText}</span>
                        </div>
                        ${event.description ? `<p class="card-text text-muted small">${event.description}</p>` : ''}
                        <div class="mt-3">
                            <p class="mb-1"><i class="bi bi-calendar3 me-2"></i><span class="event-date">${formatDate(event.date)}</span></p>
                            <p class="mb-1"><i class="bi bi-clock me-2"></i><span class="event-time">${event.time}</span></p>
                            <p class="mb-1"><i class="bi bi-geo-alt me-2"></i><span class="event-location">${event.location}</span></p>
                            <p class="mb-1"><i class="bi bi-building me-2"></i><span class="event-faculty">${event.faculty}</span></p>
                            <p class="mb-0"><i class="bi bi-people me-2"></i><span class="event-registrations">${event.registrations || '0/100'} registered</span></p>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Filter and search events
    function filterEvents() {
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');
        
        if (!searchInput || !filterSelect) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = filterSelect.value;
        const storedEvents = getEventsFromStorage();
        const allEvents = [...dashboardEvents, ...storedEvents];
        
        let filtered = allEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.faculty.toLowerCase().includes(searchTerm) ||
                                event.location.toLowerCase().includes(searchTerm);
            const status = event.status || getEventStatus(event.date);
            const matchesFilter = filterType === 'all' || status === filterType;
            return matchesSearch && matchesFilter;
        });
        
        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderEvents(filtered);
    }

    // Initialize
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (searchInput && filterSelect) {
        filterEvents();
        searchInput.addEventListener('input', filterEvents);
        filterSelect.addEventListener('change', filterEvents);
    }
}

// Update user header
function updateUserHeader() {
    const header = document.querySelector('user-header');
    if (header && header.updateFromUserData) {
        header.updateFromUserData();
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
    
    // Update header on page load
    setTimeout(updateUserHeader, 500);
}