// Chart
const ctx = document.getElementById('eventsPerMonth').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[{
            label:'Events',
            data:[12,15,18,14,10,8,6,8,19,24,21,15],
            backgroundColor:'#ffd700',
            borderRadius:10
        }]
    },
    options:{
        responsive:true,
        plugins:{legend:{display:false}}
    }
});

// Modal functionality
let currentEvent = null;

// Open edit modal
document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', e => {
        currentEvent = e.target.closest('.event-card');
        document.getElementById('editModal').style.display = 'flex';
    });
});

// Apply button
document.getElementById('applyBtn').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// Close modal
document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// Delete event
document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', e => {
        if(confirm('Delete this event?')) e.target.closest('.event-card').remove();
    });
});
