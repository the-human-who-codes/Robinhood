import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, onValue, remove ,get,update} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

// Firebase configuration
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
        const fundingRef = ref(db, `fund_manager-applications/${id}`);
        const snapshot = await get(fundingRef);
        if (snapshot.exists()) {
            const fundingData = snapshot.val();
            if (!fundingData.status) {
                await update(ref(db, `fund_manager-applications/${id}`), { status: 'rejected' });
            } else {
                console.log('Funding opportunity already has a status:', id);
            }
            console.log('Funding opportunity rejected:', id);
        } else {
            console.error('Funding opportunity not found:', id);
        }
    } catch (error) {
        console.error('Error rejecting funding opportunity:', error);
    }
}
// Function to approve a funding opportunity
async function approveFundingOpportunity(id) {
    try {
        const fundingRef = ref(db, `fund_manager-applications/${id}`);
        const snapshot = await get(fundingRef);
        if (snapshot.exists()) {
            const fundingData = snapshot.val();
            if (!fundingData.status) {
                await update(ref(db, `fund_manager-applications/${id}`), { status: 'accepted' });
            } else {
                console.log('Funding opportunity already has a status:', id);
            }
            console.log('Funding opportunity approved:', id);
        } else {
            console.error('Funding opportunity not found:', id);
        }
    } catch (error) {
        console.error('Error approving funding opportunity:', error);
    }
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