import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdFoWKRZQuKnjv20ry0tfdF-N70Pe5JiQ",
    authDomain: "letsgo-946e6.firebaseapp.com",
    databaseURL: "https://letsgo-946e6-default-rtdb.firebaseio.com",
    projectId: "letsgo-946e6",
    storageBucket: "letsgo-946e6.appspot.com",
    messagingSenderId: "41559700737",
    appId: "1:41559700737:web:ea3c57df878a3826281700",
    measurementId: "G-6W1NY2T4DW"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const fundingOpportunitiesRef = ref(db, 'funding-opportunities');

async function createFundingOpportunity(title, description, deadline, motivation) {
    try {
        const newFundingOpportunity = {
            title,
            description,
            deadline,
            motivation,
        };

        const newFundingRef = push(fundingOpportunitiesRef);
        await set(newFundingRef, newFundingOpportunity);
        console.log('New funding opportunity created:', newFundingRef.key);
    } catch (error) {
        console.error('Error creating funding opportunity:', error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const motivation = document.getElementById('motivation').value;
    await createFundingOpportunity(title, description, deadline, motivation);
}

document.getElementById('fundingOpportunityForm').addEventListener('submit', handleSubmit);

function Create() {
    window.location.href = 'fundingmenager.html';
}
