import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";

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

export async function createFundingOpportunity(title, description, deadline, motivation, uid) {
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

export async function handleSubmit(event, form) {
    event.preventDefault();
    const title = form.querySelector('#title').value;
    const description = form.querySelector('#description').value;
    const deadline = form.querySelector('#deadline').value;
    const motivation = form.querySelector('#motivation').value;
    
    // Get UID from session storage
    let user = JSON.parse(sessionStorage.getItem("user"));
    const uid = user.uid;

    await createFundingOpportunity(title, description, deadline, motivation, uid);
}

// Export the function for testing
export function redirect() {
    window.location.href = 'fundingmenager.html';
}

// Redirect function
function Create() {
    window.location.href = 'fundingmenager.html';
}
