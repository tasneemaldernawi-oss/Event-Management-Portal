// Shared JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    
    // CALENDAR FUNCTIONALITY
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (calendarGrid) {
        let currentDate = new Date();
        
        // Sample events data
        const events = [
            { date: new Date(2024, 10, 15), name: "AI Hackathon", type: "my-event" },
            { date: new Date(2024, 10, 20), name: "Career Fair", type: "event" },
            { date: new Date(2024, 10, 25), name: "Science Symposium", type: "event" },
            { date: new Date(2024, 11, 5), name: "Art Exhibition", type: "event" }
        ];
        
        function renderCalendar() {
            calendarGrid.innerHTML = '';
            
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Update header
            currentMonthYear.textContent = currentDate.toLocaleString('default', { 
                month: 'long', 
                year: 'numeric' 
            });
            
            // Get first day and number of days
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();
            
            // Add empty cells for previous month
            for (let i = 0; i < startingDay; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyCell);
            }
            
            // Add days of current month
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = day;
                
                const cellDate = new Date(year, month, day);
                
                // Check if today
                if (cellDate.toDateString() === today.toDateString()) {
                    dayCell.classList.add('today');
                }
                
                // Check for events
                const dayEvents = events.filter(event => 
                    event.date.getDate() === day && 
                    event.date.getMonth() === month && 
                    event.date.getFullYear() === year
                );
                
                dayEvents.forEach(event => {
                    dayCell.classList.add(event.type);
                    dayCell.title = event.name;
                });
                
                calendarGrid.appendChild(dayCell);
            }
            
            // Update upcoming events
            const upcomingList = document.getElementById('upcoming-events-list');
            if (upcomingList) {
                const upcomingEvents = events
                    .filter(event => event.date >= today)
                    .sort((a, b) => a.date - b.date)
                    .slice(0, 5);
                
                upcomingList.innerHTML = upcomingEvents.map(event => `
                    <div class="upcoming-event-item">
                        <strong>${event.name}</strong>
                        <br>
                        <small>${event.date.toLocaleDateString()}</small>
                    </div>
                `).join('');
            }
        }
        
        // Navigation
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        }
        
        renderCalendar();
    }
    
    // ENHANCED CREATE EVENT FORM
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        // Real-time preview
        const formInputs = eventForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', updatePreview);
        });
        
        function updatePreview() {
            document.getElementById('preview-name').textContent = 
                document.getElementById('event-name').value || 'Not set';
            
            const date = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            document.getElementById('preview-datetime').textContent = 
                (date && time) ? `${date} at ${time}` : 'Not set';
            
            const room = document.getElementById('room-number').value;
            const building = document.getElementById('building').value;
            document.getElementById('preview-location').textContent = 
                (room || building) ? `Room ${room}${building ? `, ${building}` : ''}` : 'Not set';
            
            const faculty = document.getElementById('event-faculty').value;
            document.getElementById('preview-faculty').textContent = 
                faculty ? faculty.charAt(0).toUpperCase() + faculty.slice(1) : 'Not set';
        }
        
        // Form submission
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventName = document.getElementById('event-name').value;
            const eventDate = document.getElementById('event-date').value;
            const eventTime = document.getElementById('event-time').value;
            
            if (!eventName || !eventDate || !eventTime) {
                alert('Please fill in all required fields (*)');
                return;
            }
            
            // Show success message
            document.getElementById('success-event-name').textContent = eventName;
            document.getElementById('success-message').style.display = 'block';
            
            // Scroll to success message
            document.getElementById('success-message').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Optional: Reset form after success
            // eventForm.reset();
        });
        
        updatePreview(); // Initial preview
    }
    
    // ... (keep existing profile and events code from previous examples)
});