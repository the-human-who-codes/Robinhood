// Import the functions you need from the SDKs you need
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
//   // TODO: Add SDKs for Firebase products that you want to use
//   // https://firebase.google.com/docs/web/setup#available-libraries

//   // Your web app's Firebase configuration
//   const firebaseConfig = {
//     apiKey: "AIzaSyAggweKZiVORgr_GRNlYjuCuBr98H47YqI",
//     authDomain: "basiccrud-b641d.firebaseapp.com",
//     projectId: "basiccrud-b641d",
//     storageBucket: "basiccrud-b641d.appspot.com",
//     messagingSenderId: "718378951065",
//     appId: "1:718378951065:web:9a1dd1d3089b4d70c9f308"
//   };

//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);

//   import{getDatabase,ref,child,get,set,update,remove} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
//   const db=getDatabase();

// //buttons
// const btnAdd=document.getElementById('btnAdd');
// const btnRetrieve=document.getElementById('btnRetrieve');
// const btnUpdate=document.getElementById('btnUpdate');
// const btnDelete=document.getElementById('btnDelete');

// //input
// const FName=document.getElementById('FName');
// const LName=document.getElementById('LName');
// const ID=document.getElementById('ID');
// const AGE=document.getElementById('Age');
// const SCHOOL=document.getElementById('School');
// const DEGREE=document.getElementById('Degree');

// //add student to DB using ID
// function AddStudent(){
//     set(ref(db,'Students/'+ID),{
//         name:FName.value,
//         surname:LName.value,
//         id:ID.value,
//         age:AGE.value,
//         school:SCHOOL.value,
//         degree:DEGREE.value
//     }).then(()=>{
//         alert("Submission Recieved");
//     }).catch((error)=>{
//         alert("Issue with Submission try again")  ;
//         console.log(error);  
//     })
// };

// //fetch studennt from DB using ID
// function RetrieveStudent(){
//     const dbRef=ref(db);
//     get(child(dbRef,'Students/'+ID)).then((snapshot)=>{
//        if(snapshot.exists()){
//             FName.value=snapshot.val().name;
//             LName.value=snapshot.val().surname;
//             ID.value=snapshot.val().id;
//             AGE.value=snapshot.val().age;
//             SCHOOL.value=snapshot.val().school;
//             DEGREE.value=snapshot.val().degree;
//        }
//        else{
//             alert(`Student with ID:${ID.value} does not exist`);
//        }
//     }).catch((error)=>{
//         alert("A network issue is causing some errors with the operation")  ;
//         console.log(error);  
//     })
// };

// //update student attributes DB using ID
// function UpdateStudent(){
//     update(ref(db,'Students/'+ID),{
//         name:FName.value,
//         surname:LName.value,
//         id:ID.value,
//         age:AGE.value,
//         school:SCHOOL.value,
//         degree:DEGREE.value
//     }).then(()=>{
//         alert("Data Updated succesful");
//     }).catch((error)=>{
//         alert("Issue updating user data")  ;
//         console.log(error);  
//     })
// };
// //remove student  using ID
// function RemoveStudent(){
//     remove(ref(db,'Students/'+ID)).then(()=>{
//         alert("Student Deleted succesfully");
//     }).catch((error)=>{
//         alert("Issue Deleting User Data")  ;
//         console.log(error);  
//     })
// };



 