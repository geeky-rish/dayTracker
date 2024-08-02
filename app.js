import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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
const database = getDatabase(app);

const totalDays = 2385;
const trackerDiv = document.getElementById('tracker');
const infoDiv = document.getElementById('info');
const progressBar = document.getElementById('progress-bar');

function formatDate(date) {
    let day = ('0' + date.getDate()).slice(-2);
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
}

function updateInfo() {
    const checkedBoxes = document.querySelectorAll('.day.checked').length;
    const remainingBoxes = totalDays - checkedBoxes;
    infoDiv.innerHTML = `Total Boxes: ${totalDays}<br>
                          Checked: ${checkedBoxes}<br>
                          Left: ${remainingBoxes}`;
    // Update the progress bar
    const progress = (checkedBoxes / totalDays) * 100;
    progressBar.value = progress;
}

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
            updateInfo(); // Ensure progress bar is updated after loading state
        }
    })
    .catch((error) => {
        console.error('Error loading state from Firebase:', error);
    });
}

const today = new Date();

for (let i = 0; i < totalDays; i++) {
    const dayDiv = document.createElement('div');
    const dateDiv = document.createElement('div');
    
    dayDiv.className = 'day unchecked';
    dayDiv.innerHTML = '✗';
    
    dateDiv.className = 'date';
    dateDiv.innerHTML = formatDate(today);
    
    dayDiv.onclick = () => {
        dayDiv.classList.toggle('checked');
        dayDiv.classList.toggle('unchecked');
        dayDiv.innerHTML = dayDiv.classList.contains('checked') ? '✓' : '✗';
        updateInfo();
        saveState(); // Save state whenever a box is clicked
    };
    
    dayDiv.appendChild(dateDiv);
    trackerDiv.appendChild(dayDiv);
    
    today.setDate(today.getDate() + 1); // Move to the next day
}

loadState(); // Load state from Firebase on page load
updateInfo(); // Initial call to set up info display
