import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5aPXd4DjzXI-zU4_CbOur2q8BtJ1tr1Y",
    authDomain: "fir-sd-22d1a.firebaseapp.com",
    databaseURL: "https://fir-sd-22d1a-default-rtdb.firebaseio.com",
    projectId: "fir-sd-22d1a",
    storageBucket: "fir-sd-22d1a.appspot.com",
    messagingSenderId: "526172429927",
    appId: "1:526172429927:web:51ae427f7acfa1d925bec2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);


function fetchUserApplicationsByEmail(email) {
    const applicationsRef = ref(db, 'StudentApplicant');
    get(applicationsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const applications = snapshot.val();
            const userApplications = Object.values(applications).filter(application => application.email === email);
            if (userApplications.length > 0) {
                displayApplications(userApplications);
            } else {
                console.log("User has no applications.");
                clearApplicationsList();
            }
        } else {
            console.log("No applications found.");
            clearApplicationsList();
        }
    }).catch((error) => {
        console.error("Error fetching user applications:", error);
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserApplicationsByEmail(user.email);
    } else {
        console.log("User is signed out.");
        clearApplicationsList();
    }
});
function displayApplications(applications) {
    const applicationsList = document.getElementById('applications-list');
    applicationsList.innerHTML = ''; 
    Object.values(applications).forEach(application => {
        const listItem = document.createElement('li');
        const title = document.createElement('strong'); 
        title.textContent = application.bursary;
        listItem.appendChild(title);
        const motivation = document.createElement('p');
        motivation.textContent = `Motivation: ${application.motivation}`;
        listItem.appendChild(motivation);
        const status = document.createElement('p');
        status.textContent = `Status: ${application.status || 'Pending'}`; // Set status to 'Pending' if undefined
        listItem.appendChild(status);
        applicationsList.appendChild(listItem);
    });
}

