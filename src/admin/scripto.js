import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

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

// Function to create and append a new DOM element
function createElement(tag, attributes, innerHTML) {
    const element = document.createElement(tag);
    if (attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}

// Function to toggle visibility of details and buttons
function toggleDetails(details) {
    if (details.style.display === 'none') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

// Function to display funding opportunities
function displayFundingOpportunities(fundingOpportunities) {
    const fundingList = document.getElementById('fundingOpportunitiesList');
    fundingList.innerHTML = '';

    fundingOpportunities.forEach((opportunity) => {
        const listItem = createElement('li');

        const title = createElement('h3', { 'data-id': opportunity.id }, opportunity.title);
        title.addEventListener('click', () => {
            const details = listItem.querySelector('.details');
            toggleDetails(details);
        });

        const details = createElement('div', { class: 'details', style: 'display: none;' });
        details.appendChild(createElement('p', null, '<strong>Description:</strong> ' + opportunity.description));
        details.appendChild(createElement('p', null, '<strong>Motivation:</strong> ' + opportunity.motivation));
        details.appendChild(createElement('p', null, '<strong>Deadline:</strong> ' + opportunity.deadline));

        const approveButton = createElement('button', null, 'Approve');
        approveButton.addEventListener('click', () => {
            approveFundingOpportunity(opportunity.id);
        });

        const rejectButton = createElement('button', null, 'Reject');
        rejectButton.addEventListener('click', () => {
            rejectFundingOpportunity(opportunity.id);
        });

        details.appendChild(approveButton);
        details.appendChild(rejectButton);

        listItem.appendChild(title);
        listItem.appendChild(details);
        fundingList.appendChild(listItem);
    });
}


// Function to reject a funding opportunity
async function rejectFundingOpportunity(id) {
    try {
        await remove(ref(fundingOpportunitiesRef, id));
        console.log('Funding opportunity rejected:', id);
    } catch (error) {
        console.error('Error rejecting funding opportunity:', error);
    }
}

// Function to approve a funding opportunity
async function approveFundingOpportunity(id) {
    // Implement approval logic here
    console.log('Funding opportunity approved:', id);
}

// Listen for changes in the funding opportunities list
onValue(fundingOpportunitiesRef, (snapshot) => {
    const fundingOpportunities = [];
    snapshot.forEach((childSnapshot) => {
        fundingOpportunities.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
        });
    });
    displayFundingOpportunities(fundingOpportunities);
}, {
    onlyOnce: true
});
