// checkStatus.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, push, set, get, update, remove } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

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

async function displayAllFundingOpportunities() {
    try {
        const snapshot = await get(fundingOpportunitiesRef);
        if (snapshot.exists()) {
            const fundingOpportunities = snapshot.val();
            const fundingOpportunitiesList = document.getElementById('fundingOpportunitiesList');
            fundingOpportunitiesList.innerHTML = ''; 
            for (const [id, opportunity] of Object.entries(fundingOpportunities || {})) {
                displayFundingOpportunity({ id, ...opportunity });
            }
        } else {
            console.log('No funding opportunities found.');
        }
    } catch (error) {
        console.error('Error fetching funding opportunities:', error);
    }
}

async function displaySubmittedFundingOpportunities() {
    try {
        let user = JSON.parse(sessionStorage.getItem("user"));
        const uid = user.uid;

        const snapshot = await get(fundingOpportunitiesRef);
        if (snapshot.exists()) {
            const fundingOpportunities = snapshot.val();
            const fundingOpportunitiesList = document.getElementById('fundingOpportunitiesList');
            fundingOpportunitiesList.innerHTML = ''; 
            for (const [id, opportunity] of Object.entries(fundingOpportunities || {})) {
                if (opportunity.status && (opportunity.status === 'rejected' || opportunity.status === 'accepted') && opportunity.uid === uid) {
                    displayFundingOpportunity({ id, ...opportunity });
                }
            }
        } else {
            console.log('No funding opportunities found.');
        }
    } catch (error) {
        console.error('Error fetching funding opportunities:', error);
    }
}

async function displayInProgressFundingOpportunities() {
    try {
        let user = JSON.parse(sessionStorage.getItem("user"));
        const uid = user.uid;
        const snapshot = await get(fundingOpportunitiesRef);
        if (snapshot.exists()) {
            const fundingOpportunities = snapshot.val();
            const fundingOpportunitiesList = document.getElementById('fundingOpportunitiesList');
            fundingOpportunitiesList.innerHTML = ''; 
            for (const [id, opportunity] of Object.entries(fundingOpportunities || {})) {
                if (!opportunity.status && opportunity.uid ===uid) {
                    displayFundingOpportunity({ id, ...opportunity });
                }
            }
        } else {
            console.log('No funding opportunities found.');
        }
    } catch (error) {
        console.error('Error fetching funding opportunities:', error);
    }
}



async function displayFundingOpportunity(fundingOpportunity) {
    const fundingList = document.getElementById('fundingOpportunitiesList');
    const existingItem = fundingList.querySelector(`[data-id="${fundingOpportunity.id}"]`);
    if (existingItem) {
        existingItem.textContent = fundingOpportunity.title;
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = fundingOpportunity.title;
        listItem.setAttribute('data-id', fundingOpportunity.id);
        listItem.classList.add('funding-opportunity-item');
        listItem.addEventListener('click', async () => {
            await displayDetailedFundingOpportunity(fundingOpportunity);
        });
        fundingList.appendChild(listItem);
    }
}

async function displayDetailedFundingOpportunity(fundingOpportunity) {
    const { id, title, description, deadline, motivation, status } = fundingOpportunity;
    const detailedContainer = document.getElementById('detailedFundingOpportunity');
    detailedContainer.innerHTML = '';

    const form = document.createElement('form');
    form.id = 'updateFundingOpportunityForm';

    const titleInput = createInputField('title', 'Title:', 'text', title);
    const descriptionInput = createInputField('description', 'Description:', 'textarea', description);
    const deadlineInput = createInputField('deadline', 'Deadline:', 'date', deadline);
    const motivationInput = createInputField('motivation', 'Motivation:', 'text', motivation);

    // Display status
    const statusInput = createInputField('status', 'Status:', 'text', status || 'Pending');

    const updateButton = document.createElement('button');
    updateButton.type = 'submit';
    updateButton.textContent = 'Update Funding Opportunity';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete Funding Opportunity';
    deleteButton.addEventListener('click', async () => {
        await deleteFundingOpportunity(id);
    });

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    form.appendChild(deadlineInput);
    form.appendChild(motivationInput);
    form.appendChild(statusInput);
    
    // Check status to determine buttons to display
    if (status === 'Pending') {
        form.appendChild(updateButton);
    }
    
    if (status === 'In Progress' || !status) {
        form.appendChild(updateButton);
    }

    form.appendChild(deleteButton);

    detailedContainer.appendChild(form);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedTitle = document.getElementById('title').value;
        const updatedDescription = document.getElementById('description').value;
        const updatedDeadline = document.getElementById('deadline').value;
        const updatedMotivation = document.getElementById('motivation').value;
        await updateFundingOpportunity(id, {
            title: updatedTitle,
            description: updatedDescription,
            deadline: updatedDeadline,
            motivation: updatedMotivation
        });
        const fundingList = document.getElementById('fundingOpportunitiesList');
        const listItem = fundingList.querySelector(`[data-id="${id}"]`);
        if (listItem) {
            listItem.textContent = updatedTitle;
        }
    });
}


async function updateFundingOpportunity(id, updatedData) {
    try {
        const fundingRef = ref(db, `fund_manager-applications/${id}`);
        await update(fundingRef, updatedData); // Use update method instead of set
        console.log('Funding opportunity updated successfully');
    } catch (error) {
        console.error('Error updating funding opportunity:', error);
    }
}


async function deleteFundingOpportunity(id) {
    try {
        const fundingRef = ref(db, `fund_manager-applications/${id}`);
        await set(fundingRef, null); // Set to null to delete the entry
        console.log('Funding opportunity deleted');
    } catch (error) {
        console.error('Error deleting funding opportunity:', error);
    }
}

function createInputField(id, label, type, value) {
    const div = document.createElement('div');
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    input.id = id;
    input.name = id;
    if (type !== 'textarea') {
        input.type = type;
    }
    input.value = value || '';
    input.required = true;

    const inputLabel = document.createElement('label');
    inputLabel.textContent = label;
    inputLabel.htmlFor = id;

    div.appendChild(inputLabel);
    div.appendChild(input);

    return div;
}
document.getElementById('check-status-button').addEventListener('click', async () => {
    const selectedStatus = document.getElementById('application-status').value;

    if (selectedStatus === 'submitted') {
        await displaySubmittedFundingOpportunities();
    } else if (selectedStatus === 'in-progress') {
        await displayInProgressFundingOpportunities();
    } else {
        await displayAllFundingOpportunities();
    }
});
