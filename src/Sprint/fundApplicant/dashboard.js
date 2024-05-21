import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, child, get, set, push, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

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
const storage = getStorage(app);
const dbref = ref(db);

let user = JSON.parse(sessionStorage.getItem("user"));

//get all bursary
function RetrieveAllBursaries() {
    let type = '';
    // Get the type of user and know what to fetch
    get(child(dbref, "Applicants/" + user.uid)).then((snapshot) => type = snapshot.val()['funding-type'])
      .catch((error) => {
        console.log("Error retrieving user details:", error);
      });
    


    const container = document.getElementById("container");
    container.innerHTML = ''; // Clear the container
    get(child(dbref, "funding-advertisements"))
        .then((snapshot) => {

            snapshot.forEach((childSnapshot) => {
                var bursary = childSnapshot.val();
                bursary["id"] = childSnapshot.key;
                console.log(bursary);
                //display the bursaries to the user
                if(type == bursary['funding-type']){
                    addOpportunity(bursary);
                }
                
            });

        })
        .catch((error) => {
            alert("A network issue is causing some errors with the operation");
            console.log(error);
        });
}

// Function to show user's applications
function ShowMyApplications() {
    const container = document.getElementById('container');
    container.innerHTML = ''; // Clear previous content
    // Retrieve and display user applications
    const userId = user.uid;
    get(child(dbref, `StudentApplicant`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const application = childSnapshot.val();
                    if(application.uid == user.uid){
                    displayApplication(application);

                    }
                });
            } else {
                container.innerHTML = '<p>No applications found.</p>';
            }
        })
        .catch((error) => {
            console.error("Error retrieving applications:", error);
        });
}


function displayApplication(application) {
    const article = document.createElement("article");
    article.classList.add("opportunity");

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("opportunity-details");

    const h3 = document.createElement("h3");
    h3.textContent = application['bursary-title'];
    detailsDiv.appendChild(h3);

    const motivationP = document.createElement("p");
    motivationP.textContent = `Motivation: ${application.motivation}`;
    detailsDiv.appendChild(motivationP);

    const transcriptLink = document.createElement("a");
    transcriptLink.href = application.transcript;
    transcriptLink.textContent = "View Transcript ";
    transcriptLink.target = "_blank";
    detailsDiv.appendChild(transcriptLink);

    // Add a breakline
    detailsDiv.appendChild(document.createElement("br"));

    const payslipsLink = document.createElement("a");
    payslipsLink.href = application.payslips;
    payslipsLink.textContent = "View Payslips ";
    payslipsLink.target = "_blank";
    detailsDiv.appendChild(payslipsLink);

    const statusP = document.createElement("p");
    statusP.textContent = `Status: ${application.status}`;

    if (application.status === "approved") {
        statusP.style.color = "green";
    } else if (application.status === "rejected") {
        statusP.style.color = "red";
    } else {
        statusP.style.color = "orange";
    }
    detailsDiv.appendChild(statusP);

    const viewMoreBtn = document.createElement("button");
    viewMoreBtn.classList.add("view-more-btn");
    viewMoreBtn.textContent = "View More";
    detailsDiv.appendChild(viewMoreBtn);

    viewMoreBtn.addEventListener("click", function () {
        const additionalDetails = document.createElement("div");
        additionalDetails.classList.add("additional-details");

        const contact = document.createElement("p");
        contact.textContent = `Contact: ${application.contact}`;
        additionalDetails.appendChild(contact);

        const deadline = document.createElement("p");
        deadline.textContent = `Deadline: ${application.deadline}`;
        additionalDetails.appendChild(deadline);

        detailsDiv.appendChild(additionalDetails);

        viewMoreBtn.style.display = "none";
    });

    article.appendChild(detailsDiv);
    document.getElementById("container").appendChild(article);
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
        criteria.textContent = 'criteria: ' + bursary.criteria;
        detailsDiv.appendChild(criteria);

        const contact = document.createElement("p");
        contact.textContent = 'contact: ' + bursary.contact;
        detailsDiv.appendChild(contact);

        const deadline = document.createElement("p");
        deadline.textContent = 'Deadline: ' + bursary.deadline;
        detailsDiv.appendChild(deadline);


        const opportunity = this.closest(".opportunity");
        const details = opportunity.querySelector(".opportunity-details");
        details.style.display = "block";
        const applyBtn = document.createElement("button");
        applyBtn.textContent = "Apply";
        applyBtn.classList.add("apply-btn");
        applyBtn.addEventListener("click", function () {
            generateApplicationForm(bursary);

        });
        this.parentNode.appendChild(applyBtn);
        this.style.display = "none";
    });

    article.appendChild(detailsDiv);

    document.getElementById("container").appendChild(article);
}

function submitApplication(event, bursary) {
    event.preventDefault();

    const applicationForm = document.getElementById("applicationForm");
    const file1 = document.getElementById("fileInput1").files[0];
    const file2 = document.getElementById("fileInput2").files[0];
    const motivation = document.getElementById("motivation").value;

    // User information
    let userInfo = {

        motivation: motivation
    };

    const fundingId = bursary['id'];
    console.log(bursary);
    const uid = user.uid;

    const StoragePath = `fundingApplications/${fundingId}/${uid}`;
    Promise.all([
        //uploading files to Students storage
        uploadFile(file1, file1.name),
        uploadFile(file2, file2.name),
    ]).then(() => {
        Promise.all([
            getDownloadURL(storageRef(storage, StoragePath + file1.name)),
            getDownloadURL(storageRef(storage, StoragePath + file2.name)),
        ]).then((urls) => {
            // store urls in userInfo object
            userInfo["transcript"] = urls[0];
            userInfo["payslips"] = urls[1];
            userInfo["name"] = user.displayName;
            userInfo["email"] = user.email;
            userInfo["status"] = "pending";
            userInfo = {...userInfo,...bursary};
            // Output the URLs
            // console.log('Uploaded both PDF files with unique ID:', uniqueId);
            addToDatabase(userInfo);
            alert('submited!');
            window.location.reload();

        }).catch((error) => {
            console.error("Error getting PDF URLs:", error);
        });
    }).catch((error) => {
        console.error("Error uploading PDF files:", error);
    });

    //uploads pdf files and ensures they are stored in the same folder i.e fingApplications/UniqueID/
    function uploadFile(file, fileName) {
        const fileStorageRef = storageRef(storage, StoragePath + fileName);
        // Upload the file to Firebase Storage
        return uploadBytes(fileStorageRef, file);
    }

    function addToDatabase(userInfo) {
        const uid = user.uid;
        const uniqueId = Date.now(); //user ID for testing only
        // Get a reference to the fundingOpportunity node
        const fundingRef = ref(db, "StudentApplicant/" + uniqueId);
        userInfo['uid'] = uid; 

        set(fundingRef, userInfo).then(() => {
            console.log("Submission Received");
        }).catch((error) => {
            alert("Issue with Submission, please try again");
            console.log(error);
        });
    }

}

// Function to handle form submission
function handleSubmit(event, bursary) {
    event.preventDefault();
    submitApplication(event, bursary);
}

function generateApplicationForm(bursary) {
    const formContainer = document.getElementById("bursaryApplicationForm");
    formContainer.style.display = "flex";
    const closeButton = document.getElementById("closeButton");

    closeButton.addEventListener("click", function () {
        window.location.reload();
    });

    const bursaryName = document.getElementById('bursaryName');
    bursaryName.innerText = bursary['bursary-title'];

    const form = document.getElementById('applicationForm');

    // Remove existing event listeners to prevent multiple submissions
    form.removeEventListener('submit', handleSubmit);

    // Add new event listener
    form.addEventListener('submit', function(event) {
        handleSubmit(event, bursary);
    });
}





// Function to set the active tab
function setActiveTab(activeElement) {
    const dashViewArticles = document.querySelectorAll("#dashview article");
    dashViewArticles.forEach(article => article.classList.remove("active"));
    activeElement.classList.add("active");
}

/*
// Function to display an application
function displayApplication(application) {
    const article = document.createElement("article");
    article.classList.add("application");

    const h3 = document.createElement("h3");
    h3.textContent = application.name;
    article.appendChild(h3);

    const motivationP = document.createElement("p");
    motivationP.textContent = `Motivation: ${application.motivation}`;
    article.appendChild(motivationP);

    const transcriptLink = document.createElement("a");
    transcriptLink.href = application.transcript;
    transcriptLink.textContent = "View Transcript";
    transcriptLink.target = "_blank";
    article.appendChild(transcriptLink);

    const payslipsLink = document.createElement("a");
    payslipsLink.href = application.payslips;
    payslipsLink.textContent = "View Payslips";
    payslipsLink.target = "_blank";
    article.appendChild(payslipsLink);

    document.getElementById("container").appendChild(article);
}

*/

if (!user) {
    window.location.href = '../../index.html';

}
else {
    document.addEventListener("DOMContentLoaded", function () {
        const overlay = document.getElementById("overlay");
        const completeProfileBtn = document.getElementById("completeProfileBtn");
        const dashViewArticles = document.querySelectorAll("#dashview article");
        const name = user.displayName;
        //making the navigation tabs work


        RetrieveAllBursaries();

        document.getElementById('availableFunding').addEventListener('click', function () {
            setActiveTab(this);
            RetrieveAllBursaries();
        });

        document.getElementById('viewApplications').addEventListener('click', function () {
            setActiveTab(this);
            ShowMyApplications();
        });

        document.getElementById('username').textContent = name.split(' ')[0];
        document.getElementById('welcome').textContent = 'Welcome ' + name.split(' ')[0] + '!';

        const isFirstLogin = sessionStorage.getItem('firstLogin');

        console.log('isFirstLogin', isFirstLogin);
        if (isFirstLogin == 'true') {
            overlay.style.display = "flex";
        } else {
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

            formData.forEach((value, key) => {
                applicantData[key] = value;
            });

            // Post the new applicant to the database
            set(ref(db, 'Applicants/' + uid), applicantData)
                .then(() => {
                    // Hide the overlay/modal
                    overlay.style.display = "none";
                    sessionStorage.setItem('firstLogin', false);
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
}
