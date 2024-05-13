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

//get all bursary
function RetrieveAllBursaries() {
    get(child(dbref, "funding-advertisements"))
        .then((snapshot) => {

            console.log('opportunities fetched');
            snapshot.forEach((childSnapshot) => {
                var bursary = childSnapshot.val();
                burs["id"] = childSnapshot.key;
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
    img.alt = "Logo";
    article.appendChild(img);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("opportunity-details");

    const h3 = document.createElement("h3");
    h3.textContent = bursary.title;
    detailsDiv.appendChild(h3);

    const descriptionP = document.createElement("p");
    descriptionP.textContent = bursary.description;
    detailsDiv.appendChild(descriptionP);

    const amountP = document.createElement("p");
    amountP.textContent = "Amount: " + bursary.amount;
    detailsDiv.appendChild(amountP);

    const button = document.createElement("button");
    button.classList.add("view-more-btn");
    button.textContent = "View More";
    detailsDiv.appendChild(button);

    article.appendChild(detailsDiv);

    document.getElementById("container").appendChild(article);
}

console.log('opp module loaded')
RetrieveAllBursaries();