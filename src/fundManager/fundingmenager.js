const tblApplicant = document.getElementById("applicantTable");
        const finacialReport = document.getElementById('finacialReport');
        const applications1 = document.getElementById('applications');
        const adverts1 = document.getElementById('Adverts');
        const apply = document.getElementById('apply');
        const recipients = document.getElementById('Recipients');


        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

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

        import { getDatabase, ref, child, get, set, update, remove, onValue, query } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
        const db = getDatabase();

        function openNav() {
            document.getElementById("mySidebar").style.left = "0";
            document.getElementById("openBtn").style.left = "250px";
            document.getElementsByTagName("header")[0].style.left = "250px";
        }

        function closeNav() {
            document.getElementById("mySidebar").style.left = "-250px";
            document.getElementById("openBtn").style.left = "10px";
            document.getElementsByTagName("header")[0].style.left = "0";
        }
        function view() {
            window.location.href = 'Applicant1.html';
        }

        function view1(applicantID) {
            window.location.href = `Applicant1.html?id=${applicantID}`;
        }


        function navigateToApplyPage() {
            window.location.href = 'fundmaneger.html';
        }

        function applications() {
            window.location.href = 'Applications.html';
        }

        function finance() {
            window.location.href = 'Financial-report.html';
        }

        function advert() {
            window.location.href = 'Advertisements.html';
        }

        function showStudentDetails(name, email, date) {
            window.location.href = 'Applicant.html';
        }

        function showRecipients() {
            window.location.href = 'FundingRecipients.html';
        }


        //creating rows for student table(shows students in our database as it grows)
        function createNewRow(data) {
            let Table = document.getElementById('applicantTable');
            let id = '';
            let name = '';
            let email = '';
            let date = '';
            let status = '';
            data.forEach(applicant => {
                id = applicant.id;
                name = applicant.name + ' ' + applicant.surname;
                email = applicant.email;
                date = applicant.date;
                status = applicant.status;
                let newTableRow = document.createElement('tr');
                // newTableRow.setAttribute('id',`${id}`);

                let ApplicantDetailsName = document.createElement('td');
                let ApplicantDetailsEmail = document.createElement('td');
                let ApplicantDetailsDate = document.createElement('td');
                let ApplicantView = document.createElement('td');
                let viewButton = document.createElement('button');

                ApplicantDetailsName.textContent = name;
                ApplicantDetailsEmail.textContent = email;
                ApplicantDetailsDate.textContent = date;
                viewButton.setAttribute('id', `${id}`);
                viewButton.textContent = 'view';
                ApplicantView.append(viewButton);
                viewButton.onclick = function () {
                    let id = viewButton.id;
                    view1(id);
                };


                newTableRow.append(ApplicantDetailsName);
                newTableRow.append(ApplicantDetailsEmail);
                newTableRow.append(ApplicantDetailsDate);
                newTableRow.append(ApplicantView);

                Table.append(newTableRow);
            })
        }
        //function to get relevant info from students in our database
        // Function to get relevant info from students in our database
        function getAllData() {
            const dbref = ref(db);
            get(child(dbref, "StudentApplicant/"))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        let Students = [];
                        let id1 = '';
                        snapshot.forEach(childSnapShot => {
                            id1 = childSnapShot.key;
                            let data = childSnapShot.val();
                            if (!data.hasOwnProperty('status') || data.status === 'pending') {
                                data.id = id1;
                                Students.push(data);
                            }
                        });
                        if (Students.length === 0) {
                            const h2 = document.getElementById('pending');
                            h2.innerText = "No Pending Applications"
                        } else {
                            createNewRow(Students);
                        }
                    } else {
                        const h2 = document.getElementById('pending');
                        h2.innerText = "No Active Applications"
                    }
                }).catch((error) => {
                    console.log(error);
                })
        }


        //eventlistner fetches relevant student data to display on fundManager Dashboard
        document.addEventListener('DOMContentLoaded', function () {
            getAllData();
        });


        finacialReport.addEventListener('click', function () {
            finance();
        });
        applications1.addEventListener('click', function () {
            applications();
        });
        adverts1.addEventListener('click', function () {
            advert();
        });

        apply.addEventListener('click', function () {
            navigateToApplyPage();
        });

        recipients.addEventListener('click', function () {
            showRecipients();
        });
        // Function to get current user ID from session storage
        function getCurrentUserID() {
            let user = JSON.parse(sessionStorage.getItem("user"));
            const uid = user.uid;
            return uid;
        }

        // Function to show notification
        function showNotification(message) {
            const notification = document.getElementById("notification");
            notification.innerText = message;
            notification.style.display = "block";
            setTimeout(() => {
                notification.style.display = "none";
            }, 5000); // Hide notification after 5 seconds
        }

        // Function to check fund manager application status
        // Function to check fund manager application status
        function checkApplicationStatus() {
            const userId = getCurrentUserID();
            if (userId) {
                const applicationsRef = ref(db, "fund_manager-applications");

                onValue(applicationsRef, (snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            const application = childSnapshot.val();
                            if (application.uid === userId) {
                                const status = application.status;
                                if (status === "accepted") {
                                    showNotification("Your application has been approved!");
                                } else if (status === "rejected") {
                                    showNotification("Your application has been rejected. Please contact the admin for more details.");
                                }
                            }
                        });
                    }
                });
            } else {
                console.log("User ID not found in session storage.");
            }
        }

        // Call the function to check application status when the page loads
        document.addEventListener('DOMContentLoaded', function () {
            checkApplicationStatus();
        });