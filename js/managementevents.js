const editButtons = document.querySelectorAll(".editBtn");
const deleteButtons = document.querySelectorAll(".deleteBtn");
const eventinput= document.getElementById("eventinput");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");
const hallSelect = document.getElementById("hallSelect");
const facultySelect= document.getElementById("facultySelect");
const statusSelect = document.getElementById("statusSelect");
const editBox = document.getElementById("editBox");
const applyBtn = document.getElementById("applyBtn");
const closeBtn = document.getElementById("closeBtn");
const deleteBtnInside = document.getElementById("deleteBtn");

let currentEvent = null;

// open edit box
editButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    currentEvent = e.target.closest(".event");
    editBox.style.display = "block";

    eventinput.value = currentEvent.querySelector(".event-name").textContent.trim();
    dateInput.value = currentEvent.querySelector(".event-date").textContent.trim();
    timeSelect.value = currentEvent.querySelector(".event-time").textContent.trim();
    hallSelect.value = currentEvent.querySelector(".event-hall").textContent.trim();
    facultySelect.value = currentEvent.querySelector(".event-faculty").textContent.trim();
    statusSelect.value= currentEvent.querySelector(".status").textContent.trim();
   
  });
});

// apply changes
applyBtn.addEventListener("click", () => {
  if (!currentEvent) return;
  const newEvent= eventinput.value
  const newHall = hallSelect.value;
  const newDate = dateInput.value;
  const newTime = timeSelect.value;
  const newFaculty = facultySelect.value;
  const newStatus = statusSelect.value;

  if (newStatus) currentEvent.querySelector(".status").textContent = newStatus;
  if (newFaculty) currentEvent.querySelector(".event-faculty").textContent = newFaculty;
  if (newEvent) currentEvent.querySelector(".event-name").textContent = newEvent;
  if (newHall) currentEvent.querySelector(".event-hall").textContent = newHall;
  if (newDate) currentEvent.querySelector(".event-date").textContent = newDate;
  if (newTime) currentEvent.querySelector(".event-time").textContent = newTime;

  editBox.style.display = "none";
});

// close box
closeBtn.addEventListener("click", () => {
  editBox.style.display = "none";
});

// delete from inside edit box
deleteBtnInside.addEventListener("click", () => {
  if (currentEvent && confirm("Are you sure you want to delete this event?")) {
    currentEvent.remove();
    editBox.style.display = "none";
  }
});

// delete button directly from list
deleteButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    const eventToDelete = e.target.closest(".event");
    if (confirm("Are you sure you want to delete this event?")) {
      eventToDelete.remove();
    }
  });
});

function myFunction() {
  var input, filter, tr, td, i, txtValue;
  input = document.getElementById('query');
  filter = input.value.toUpperCase();
  tbody = document.getElementById("myTbody");
  tr = tbody.getElementsByTagName('tr');

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
  }
}

document.querySelector('.btn-secondary').addEventListener('click', function(e) {
  e.preventDefault();
  
  const newRow = document.createElement('tr');
  newRow.className = 'event';
  newRow.innerHTML = `
      <td class="event-name">New Event</td>
      <td class="event-date">11/20/2025</td>
      <td class="event-time">02:00 PM</td>
      <td class="event-hall">Main Hall</td>
      <td class="event-faculty">Business Administration</td>
      <td>0/50</td>
      <td><button class="alert alert-info status" style="background-color: aquamarine;">Upcoming</button></td>
      <td>
          <button class="editBtn" style="border: 0px; background-color: white;">
              <i class="fa-regular fa-pen-to-square"></i>
          </button> 
          <button class="deleteBtn" style="border: 0px; background-color: white;">
              <i class="fa-solid fa-trash"></i>
          </button>
      </td>
  `;
  document.getElementById('myTbody').appendChild(newRow);
  
  const newEditBtn = newRow.querySelector('.editBtn');
  const newDeleteBtn = newRow.querySelector('.deleteBtn');
  
  newEditBtn.addEventListener('click', function(e) {
      currentEvent = e.target.closest(".event");
      editBox.style.display = "block";
      
      eventinput.value = currentEvent.querySelector(".event-name").textContent.trim();
      dateInput.value = currentEvent.querySelector(".event-date").textContent.trim();
      timeSelect.value = currentEvent.querySelector(".event-time").textContent.trim();
      hallSelect.value = currentEvent.querySelector(".event-hall").textContent.trim();
      facultySelect.value = currentEvent.querySelector(".event-faculty").textContent.trim();
      statusSelect.value = currentEvent.querySelector(".status").textContent.trim();
  });
  
  newDeleteBtn.addEventListener('click', function(e) {
      if (confirm("Are you sure you want to delete this event?")) {
          e.target.closest(".event").remove();
      }
  });
});
