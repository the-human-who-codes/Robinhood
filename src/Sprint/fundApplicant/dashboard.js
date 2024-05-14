
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyD5aPXd4DjzXI-zU4_CbOur2q8BtJ1tr1Y",
    authDomain: "fir-sd-22d1a.firebaseapp.com",
    databaseURL: "https://fir-sd-22d1a-default-rtdb.firebaseio.com",
    projectId: "fir-sd-22d1a",
    storageBucket: "fir-sd-22d1a.appspot.com",
    messagingSenderId: "526172429927",
    appId: "1:526172429927:web:51ae427f7acfa1d925bec2",
};

const app = initializeApp(firebaseConfig);

import {
    getDatabase,
    ref,
    child,
    get,
    set,
    update,
    remove,
    onValue,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
const db = getDatabase();
const dbref = ref(db);

let user = JSON.parse(sessionStorage.getItem("user"));


//get all bursary
function RetrieveAllBursaries() {
    get(child(dbref, "funding-advertisements"))
        .then((snapshot) => {
            console.log("opportunities fetched");
            snapshot.forEach((childSnapshot) => {
                var bursary = childSnapshot.val();
                bursary["id"] = childSnapshot.key;
                console.log(bursary);
                //display the bursaries to the user
                addOpportunity(bursary);
            });
        })
        .catch((error) => {
            alert("A network issue is causing some errors with the operation");
            console.log(error);
        });
}

// Function to create and append funding opportunity
function addOpportunity(bursary) {
    const article = document.createElement("article");
    article.classList.add("opportunity");

    const img = document.createElement("img");
    img.src = bursary.logoUrl;
    img.alt = "Company Logo";
    img.addEventListener('error', function () {
        this.src = './company.png';
    });
    article.appendChild(img);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("opportunity-details");

    const h3 = document.createElement("h3");
    h3.textContent = bursary['bursary-title'];
    detailsDiv.appendChild(h3);

    const descriptionP = document.createElement("p");
    descriptionP.textContent = bursary.description;
    detailsDiv.appendChild(descriptionP);

    const amountP = document.createElement("p");
    amountP.textContent = "Amount: " + bursary.amount;
    detailsDiv.appendChild(amountP);
    //view more button
    const viewMoreBtn = document.createElement("button");
    viewMoreBtn.classList.add("view-more-btn");
    viewMoreBtn.textContent = "View More";
    detailsDiv.appendChild(viewMoreBtn);
    viewMoreBtn.addEventListener("click", function () {
        
        //add extra info about the bursary

        const criteria = document.createElement("p");
        criteria.textContent ='criteria: '+bursary.criteria;
        detailsDiv.appendChild(criteria);

        const contact = document.createElement("p");
        contact.textContent = 'contact: '+bursary.contact;
        detailsDiv.appendChild(contact);

        const deadline = document.createElement("p");
        deadline.textContent = 'Deadline: '+bursary.deadline;
        detailsDiv.appendChild(deadline);


        const opportunity = this.closest(".opportunity");
        const details = opportunity.querySelector(".opportunity-details");
        details.style.display = "block";
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply";
        applyBtn.classList.add("apply-btn");
        applyBtn.addEventListener("click", function () {
            window.location.href = 'Application.html';
        });
        this.parentNode.appendChild(applyBtn);
        this.style.display = "none";
    });

    article.appendChild(detailsDiv);

    document.getElementById("container").appendChild(article);
}


document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const completeProfileBtn = document.getElementById("completeProfileBtn");
    const dashViewArticles = document.querySelectorAll("#dashview article");
    const name = user.displayName;

    try {
        document.getElementById('username').textContent = name.split(' ')[0];
        document.getElementById('welcome').textContent = 'Welcome '+ name.split(' ')[0]+'!';

    }
    catch (error) {
        alert('please login!');
    }
    RetrieveAllBursaries();

    const isFirstLogin = sessionStorage.getItem('firstLogin');
    
    console.log('isFirstLogin',isFirstLogin);
    if (isFirstLogin=='true') {
        overlay.style.display = "flex";
    }
    else {
        overlay.style.display = "none";
    }

    function handleSubmit(event) {

        // Prevent the default form submission behavior
        event.preventDefault();
        const fundingForm = document.getElementById('uploadForm')
        const formData = new FormData(fundingForm);

        let uid = user.uid;

        const applicantData = {};

        applicantData.name = user.displayName;
        applicantData.email = user.email;

        // Add the "Type of Applicant" field to the data
        applicantData.type = document.getElementById('applicantType').value;;

        formData.forEach((value, key) => {
            applicantData[key] = value;
        });

        // Post the new applicant to the database
        set(ref(db, 'Applicants/' + uid), applicantData)
            .then(() => {
                // Hide the overlay/modal
                overlay.style.display = "none";
                sessionStorage.setItem('firstLogin',false);
            })
            .catch((error) => {
                console.error('Error submitting application:', error);
            });


    }


    // Get a reference to the form
    const uploadForm = document.getElementById('uploadForm');

    // Add a submit event listener to the form
    uploadForm.addEventListener('submit', handleSubmit);



    // Event listener for view more button
    const viewMoreBtns = document.querySelectorAll(".view-more-btn");
    viewMoreBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            console.log("in")
            const opportunity = this.closest(".opportunity");
            const details = opportunity.querySelector(".opportunity-details");
            details.style.display = "block";
            const applyBtn = document.createElement("button");
            applyBtn.textContent = "Apply";
            applyBtn.classList.add("apply-btn");
            applyBtn.addEventListener("click", function () {
                window.location.href = 'Application.html';
            });
            this.parentNode.appendChild(applyBtn);
            this.style.display = "none";
        });
    });

    // Toggle active class for tabs
    dashViewArticles.forEach(article => {
        article.addEventListener("click", function () {
            dashViewArticles.forEach(a => a.classList.remove("active"));
            this.classList.add("active");
        });
    });

    const notifications = document.querySelector('.notifications');

    notifications.addEventListener('click', function () {
        this.classList.toggle('active');
        const notificationList = this.querySelector('.notification-list');
        notificationList.style.display = notificationList.style.display === 'block' ? 'none' : 'block';
    });

    // Close notification list when clicking outside
    document.addEventListener('click', function (event) {
        if (!notifications.contains(event.target)) {
            notifications.classList.remove('active');
            const notificationList = notifications.querySelector('.notification-list');
            notificationList.style.display = 'none';
        }
    });
});


