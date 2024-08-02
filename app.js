// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOrZcOMrGGlftqC4on1cu4ihHxpSU400g",
  authDomain: "day-tracker-59979.firebaseapp.com",
  databaseURL: "https://day-tracker-59979-default-rtdb.firebaseio.com",
  projectId: "day-tracker-59979",
  storageBucket: "day-tracker-59979.appspot.com",
  messagingSenderId: "673935867438",
  appId: "1:673935867438:web:7154c6b0563594a758e9bf",
  measurementId: "G-WJNSFS8TG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const trackerDiv = document.getElementById('tracker');
const infoDiv = document.getElementById('info');

// Create boxes based on the range
function createBoxes(startDate, endDate) {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    trackerDiv.innerHTML = ''; // Clear previous boxes

    while (currentDate <= end) {
        const dayDiv = document.createElement('div');
        const dateDiv = document.createElement('div');

        dayDiv.className = 'day unchecked';
        dayDiv.innerHTML = '✗';

        dateDiv.className = 'date';
        dateDiv.innerHTML = formatDate(currentDate);

        dayDiv.onclick = () => {
            dayDiv.classList.toggle('checked');
            dayDiv.classList.toggle('unchecked');
            dayDiv.innerHTML = dayDiv.classList.contains('checked') ? '✓' : '✗';
            updateInfo();
            saveState(); // Save state whenever a box is clicked
        };

        dayDiv.appendChild(dateDiv);
        trackerDiv.appendChild(dayDiv);

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }
}

// Format date for display
function formatDate(date) {
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
}

// Update information display
function updateInfo() {
    const checkedBoxes = document.querySelectorAll('.day.checked').length;
    const totalBoxes = document.querySelectorAll('.day').length;
    const remainingBoxes = totalBoxes - checkedBoxes;
    infoDiv.innerHTML = `Total Boxes: ${totalBoxes}<br>
                          Checked: ${checkedBoxes}<br>
                          Left: ${remainingBoxes}`;
}

// Save state to Firebase
function saveState() {
    const state = Array.from(document.querySelectorAll('.day')).map(dayDiv => dayDiv.classList.contains('checked'));
    set(ref(database, 'trackerState'), state)
    .then(() => {
        console.log('State saved successfully');
    })
    .catch((error) => {
        console.error('Error saving state:', error);
    });
}

// Load state from Firebase
function loadState() {
    const stateRef = ref(database, 'trackerState');
    get(stateRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            const savedState = snapshot.val();
            const dayDivs = document.querySelectorAll('.day');
            savedState.forEach((checked, index) => {
                if (dayDivs[index]) {
                    dayDivs[index].classList.toggle('checked', checked);
                    dayDivs[index].classList.toggle('unchecked', !checked);
                    dayDivs[index].innerHTML = checked ? '✓' : '✗';
                }
            });
            updateInfo(); // Update info display after loading state
        }
    })
    .catch((error) => {
        console.error('Error loading state from Firebase:', error);
    });
}

// Start and end dates for demonstration (update these as needed)
const startDate = '2024-08-02';
const endDate = '2031-02-11';

// Initialize boxes and load state
createBoxes(startDate, endDate);
loadState(); // Load state from Firebase on page load
updateInfo(); // Initial call to set up info display
