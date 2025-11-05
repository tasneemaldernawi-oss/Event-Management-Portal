// Save button click
document.querySelector('.btn-save').addEventListener('click', () => {
    alert('Profile changes saved successfully!');
});

// Cancel button click
document.querySelector('.btn-cancel').addEventListener('click', () => {
    if (confirm('Cancel changes?')) {
        location.reload();
    }
});
