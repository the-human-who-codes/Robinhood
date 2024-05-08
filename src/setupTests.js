const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push, set } = require("firebase/database");


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

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database
global.firebaseDatabase = getDatabase(firebaseApp);
