import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, deleteUser, reauthenticateWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');
  const backButton = document.getElementById('backButton');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      confirmDeleteBtn.addEventListener('click', () => {
        reauthenticateAndDeleteUser(user);
      });
    } else {
      console.log("User is signed out.");
      window.location.href = "../../index.html"; // Redirect if not logged in
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    window.location.href = "dash_board.html"; // Redirect to the dashboard or appropriate page
  });

  backButton.addEventListener('click', () => {
    window.history.back(); // Redirect to the previous page
  });
});

function reauthenticateAndDeleteUser(user) {
  reauthenticateWithPopup(user, provider).then(() => {
    deleteUserProfile(user);
  }).catch((error) => {
    console.error("Error reauthenticating:", error.message);
    alert("Error reauthenticating. Please try again.");
  });
}

function deleteUserProfile(user) {
  const userId = user.uid;
  const userRef = ref(db, 'Applicants/' + userId);

  // Remove user data from the database
  remove(userRef)
    .then(() => {
      // Delete user authentication profile
      deleteUser(user)
        .then(() => {
          console.log("User account deleted successfully.");
          alert("Your account has been deleted.");
          window.location.href = "../../index.html"; // Redirect to the homepage or appropriate page
        })
        .catch((error) => {
          console.error("Error deleting user authentication profile:", error.message);
          alert("There was an error deleting your account. Please try again.");
        });
    })
    .catch((error) => {
      console.error("Error removing user data from database:", error.message);
      alert("There was an error deleting your account. Please try again.");
    });
}
