import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5aPXd4DjzXI-zU4_CbOur2q8BtJ1tr1Y",
    authDomain: "fir-sd-22d1a.firebaseapp.com",
    databaseURL: "https://fir-sd-22d1a-default-rtdb.firebaseio.com",
    projectId: "fir-sd-22d1a",
    storageBucket: "fir-sd-22d1a.appspot.com",
    messagingSenderId: "526172429927",
    appId: "1:526172429927:web:51ae427f7acfa1d925bec2"
  };



// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const fundingOpportunitiesRef = ref(db, 'fund_manager-applications');

async function createFundingOpportunity(title, description, deadline, motivation, uid) {
    try {
        const newFundingOpportunity = {
            title,
            description,
            deadline,
            motivation,
            uid // Add UID to the funding opportunity
        };

        const newFundingRef = push(fundingOpportunitiesRef);
        await set(newFundingRef, newFundingOpportunity);
        console.log('New funding opportunity created:', newFundingRef.key);
    } catch (error) {
        console.error('Error creating funding opportunity:', error);
    }
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const motivation = document.getElementById('motivation').value;
    
    // Get UID from session storage
    let user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    await createFundingOpportunity(title, description, deadline, motivation, uid);
}

// Add event listener to form submission
document.getElementById('fundingOpportunityForm').addEventListener('submit', handleSubmit);

// Redirect function
function Create() {
    window.location.href = 'fundingmenager.html';
}
