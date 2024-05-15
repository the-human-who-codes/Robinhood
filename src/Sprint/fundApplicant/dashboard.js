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



//get all bursary
function RetrieveAllBursaries() {
    get(child(dbref, "funding-advertisements"))
        .then((snapshot) => {

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
    const phone = document.getElementById('phone');
    const university = document.getElementById('university');

    // User information
    let userInfo = {
        university: university,
        phone: phone,
        motivation: motivation
    };

    const fundingId = bursary['id'];
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
            // Output the URLs
            // console.log('Uploaded both PDF files with unique ID:', uniqueId);
            addToDatabase(userInfo, fundingId);
            const form = document.getElementById('applicationForm');
            form.reset();
            document.getElementById("bursaryApplicationForm").style.display = "none";
            alert('submited!');

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

    function addToDatabase(userInfo, fundingId) {
        const uid = user.uid;

        // Get a reference to the fundingOpportunity node
        const uniqueId = Date.now(); //user ID for testing only
        const fundingRef = ref(db, "StudentApplicant/" + uniqueId);

        // Set the application data
        set(fundingRef, {
            name: userInfo.name,
            university: userInfo.university,
            email: userInfo.email,
            phone: userInfo.phone,
            motivation: userInfo.motivation,
            transcript: userInfo.transcript,
            payslips: userInfo.payslips,
            uid: uid
        }).then(() => {
            console.log("Submission Received");
        }).catch((error) => {
            alert("Issue with Submission, please try again");
            console.log(error);
        });
    }

}

function generateApplicationForm(bursary) {
    const formContainer = document.getElementById("bursaryApplicationForm");
    formContainer.style.display = "flex";
    const closeButton = document.getElementById("closeButton");

    closeButton.addEventListener("click", function () {
        const form = document.getElementById('applicationForm');
        const overlay = document.getElementById("bursaryApplicationForm");
        form.reset();
        overlay.style.display = "none";


    });

    const bursaryName = document.getElementById('bursaryName');
    bursaryName.innerText = bursary['bursary-title'];

    //set the submit button to send the application appropriately
    const form = document.getElementById('applicationForm');
    form.addEventListener('submit', function (event) {
        submitApplication(event, bursary);
    });


}

let user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
    window.location.href = '../../index.html';

}
else {
    document.addEventListener("DOMContentLoaded", function () {
        const overlay = document.getElementById("overlay");
        const completeProfileBtn = document.getElementById("completeProfileBtn");
        const dashViewArticles = document.querySelectorAll("#dashview article");
        const name = user.displayName;

        try {
            document.getElementById('username').textContent = name.split(' ')[0];
            document.getElementById('welcome').textContent = 'Welcome ' + name.split(' ')[0] + '!';

        } catch (error) {
            alert('please login!');
        }

        RetrieveAllBursaries();

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
