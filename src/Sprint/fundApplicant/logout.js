import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Initialize Firebase app
const firebaseConfig = {
    apiKey: "AIzaSyD5aPXd4DjzXI-zU4_CbOur2q8BtJ1tr1Y",
    authDomain: "fir-sd-22d1a.firebaseapp.com",
    databaseURL: "https://fir-sd-22d1a-default-rtdb.firebaseio.com",
    projectId: "fir-sd-22d1a",
    storageBucket: "fir-sd-22d1a.appspot.com",
    messagingSenderId: "526172429927",
    appId: "1:526172429927:web:51ae427f7acfa1d925bec2"
  }

const app = initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    const backButton = document.getElementById('backButton');

    const auth = getAuth(app); // Get the Auth instance from the initialized app

    logoutButton.addEventListener('click', () => {
        // Sign out the user
        signOut(auth).then(() => {
            console.log('User signed out successfully.');
            // Redirect to the login page after logout
            window.location.href = "../../index.html";
        }).catch((error) => {
            console.error('Error signing out:', error.message);
            alert('Error signing out. Please try again.');
        });
    });

    backButton.addEventListener('click', () => {
        // Go back to the previous page
        window.history.back();
    });
});
