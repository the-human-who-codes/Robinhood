import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getDatabase, ref, push, set, get,update,remove } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js';

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

        const snapshot = await push(fundingOpportunitiesRef, newFundingOpportunity);
        console.log('New funding opportunity created:', snapshot.key);
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
    const { id, title, description, deadline, motivation } = fundingOpportunity;
    const detailedContainer = document.getElementById('detailedFundingOpportunity');
    detailedContainer.innerHTML = '';

    const form = document.createElement('form');
    form.id = 'updateFundingOpportunityForm';

    const titleInput = createInputField('title', 'Title:', 'text', title);
    const descriptionInput = createInputField('description', 'Description:', 'textarea', description);
    const deadlineInput = createInputField('deadline', 'Deadline:', 'date', deadline);
    const motivationInput = createInputField('motivation', 'Motivation:', 'text', motivation);
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
    form.appendChild(updateButton);
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
        const fundingRef = ref(db, `funding-opportunities/${id}`);
        await set(fundingRef, updatedData);
        console.log('Funding opportunity updated successfully');
    } catch (error) {
        console.error('Error updating funding opportunity:', error);
    }
}

async function deleteFundingOpportunity(id) {
    try {
        const fundingRef = ref(db, `funding-opportunities/${id}`);
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
    await displayAllFundingOpportunities();
});
