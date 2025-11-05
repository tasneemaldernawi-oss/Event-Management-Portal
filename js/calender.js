// Your events data
const events = [
    { date: '2025-10-21', title: 'AI Hackathon 2025', time: '10:00 AM', location: 'Gaming Hall', faculty: 'Artificial Intelligence', registrations: '45/50', status: 'upcoming' },
    { date: '2025-10-25', title: 'Engineering Career Fair', time: '09:00 AM', location: 'Main Hall', faculty: 'Engineering', registrations: '100/150', status: 'upcoming' },
    { date: '2025-10-26', title: 'Research Symposium', time: '02:00 PM', location: 'Room 13', faculty: 'Research & Development', registrations: '80/100', status: 'upcoming' },
    { date: '2025-10-28', title: 'Business Leadership Workshop', time: '01:00 PM', location: 'Room 26', faculty: 'Business Administration', registrations: '40/40', status: 'upcoming' },
    { date: '2025-10-15', title: 'Startup Pitch Competition', time: '03:00 PM', location: 'Room 3', faculty: 'Entrepreneurship Center', registrations: '25/30', status: 'completed' },
    { date: '2025-11-15', title: 'Environmental Sustainability Summit', time: '10:00 AM', location: 'Room 26', faculty: 'Environmental Sciences', registrations: '60/75', status: 'pending' }
];

let currentDate = new Date();
let currentMonth = 9; // October
let currentYear = 2025;
let selectedDay = null;

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function generateCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonthYear');
    
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarDays.appendChild(emptyDay);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today');
        }

        const dateString = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const dayEvents = events.filter(event => event.date === dateString);
        if (dayEvents.length > 0) {
            dayElement.classList.add('event-day');
            const eventsList = document.createElement('div');
            eventsList.className = 'events-list';
            const eventCount = document.createElement('div');
            eventCount.className = 'event-item';
            eventCount.textContent = `${dayEvents.length} event${dayEvents.length>1?'s':''}`;
            eventsList.appendChild(eventCount);
            dayElement.appendChild(eventsList);
        }

        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.day.selected').forEach(day => day.classList.remove('selected'));
            dayElement.classList.add('selected');
            showEventsForDate(dateString, day, month, year);
            selectedDay = { day, month, year, dateString };
        });

        calendarDays.appendChild(dayElement);
    }

    if (selectedDay && selectedDay.month === month && selectedDay.year === year) {
        const days = calendarDays.querySelectorAll('.day:not(.empty)');
        if (selectedDay.day <= days.length) {
            days[selectedDay.day-1].classList.add('selected');
            showEventsForDate(selectedDay.dateString, selectedDay.day, month, year);
        }
    }
}

function showEventsForDate(dateString, day, month, year) {
    const selectedDateElement = document.getElementById('selectedDate');
    const eventsContainer = document.getElementById('eventsContainer');

    const date = new Date(year, month, day);
    const formattedDate = date.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    selectedDateElement.textContent = formattedDate;

    const dayEvents = events.filter(event => event.date === dateString);
    eventsContainer.innerHTML = dayEvents.length ? '' : '<div class="no-events">No events scheduled for this date</div>';

    dayEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-details">
                <div class="event-detail"><i class="fas fa-clock"></i><span>${event.time}</span></div>
                <div class="event-detail"><i class="fas fa-map-marker-alt"></i><span>${event.location}</span></div>
                <div class="event-detail"><i class="fas fa-building"></i><span>${event.faculty}</span></div>
                <div class="event-detail"><i class="fas fa-users"></i><span>${event.registrations} registered</span></div>
            </div>
            <div class="event-status status-${event.status}">${event.status.charAt(0).toUpperCase()+event.status.slice(1)}</div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

function goToPreviousMonth() {
    currentMonth--;
    if(currentMonth<0){ currentMonth=11; currentYear--; }
    generateCalendar(currentMonth, currentYear);
}

function goToNextMonth() {
    currentMonth++;
    if(currentMonth>11){ currentMonth=0; currentYear++; }
    generateCalendar(currentMonth, currentYear);
}

document.getElementById('prevMonth').addEventListener('click', goToPreviousMonth);
document.getElementById('nextMonth').addEventListener('click', goToNextMonth);

document.addEventListener('keydown', e => {
    if(e.key==='ArrowLeft') goToPreviousMonth();
    if(e.key==='ArrowRight') goToNextMonth();
});

generateCalendar(currentMonth, currentYear);
