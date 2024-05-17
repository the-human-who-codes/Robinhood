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

onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchUserProfile(user.uid);
    } else {
        console.log("User is signed out.");
    }
});

function fetchUserProfile(userId) {
    const userRef = ref(db, 'Applicants/' + userId);
    get(child(userRef, '/')).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById('profile-name').innerText = data.name || '';
            document.getElementById('profile-email').innerText = data.email || '';
            document.getElementById('profile-address').innerText = data.address || '';
            document.getElementById('profile-contacts').innerText = data["Cellphone Number"] || '';
            document.getElementById('profile-type').innerText = data.type || '';
            document.getElementById('uni').innerText = data.University || '';

            // Pre-fill the edit form
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-email').value = data.email || '';
            document.getElementById('edit-address').value = data.address || '';
            document.getElementById('edit-contacts').value = data["Cellphone Number"] || '';
            document.getElementById('edit-type').value = data.type || '';
            document.getElementById('edit-uni').value = data.University || '';

            // Show profile view
            document.getElementById('profile-view').style.display = 'block';
        } else {
            console.log("No user data found.");
        }
    }).catch((error) => {
        console.error("Error getting user profile:", error);
    });
}

document.getElementById('edit-profile-btn').addEventListener('click', () => {
    document.getElementById('profile-view').style.display = 'none';
    document.getElementById('edit-profile-btn').style.display = 'none';
    document.getElementById('profile-edit').style.display = 'block';
});

document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('profile-view').style.display = 'block';
    document.getElementById('edit-profile-btn').style.display = 'block';
    document.getElementById('profile-edit').style.display = 'none';
});

document.getElementById('edit-profile-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const updatedData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            address: document.getElementById('edit-address').value,
            "Cellphone Number": document.getElementById('edit-contacts').value,
            type: document.getElementById('edit-type').value,
            University: document.getElementById('edit-uni').value,
        };

        const userRef = ref(db, 'Applicants/' + userId);
        update(userRef, updatedData).then(() => {
            console.log("Profile updated successfully.");
            fetchUserProfile(userId);
            document.getElementById('profile-view').style.display = 'block';
            document.getElementById('edit-profile-btn').style.display = 'block';
            document.getElementById('profile-edit').style.display = 'none';
        }).catch((error) => {
            console.error("Error updating profile:", error);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-btn');
    
    // Add event listener for back button
    backBtn.addEventListener('click', () => {
        window.history.back();
    });
});
