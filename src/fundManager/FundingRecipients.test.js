//creating rows for student table(shows students in our database as it grows)
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

import {getDatabase,ref,child,get,set,update,remove,onValue} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js"
const db=getDatabase();
 function createNewRow(data){
    let Table=document.getElementById('recipientTable');
        let id='';
        let name='';
        let email=''; 
        let date='';
        let status='';
    data.forEach(applicant => {
            id=applicant.id;
           name=applicant.name+' '+applicant.surname;
           email=applicant.email; 
           date=applicant.date;
           status=applicant.status;
           let newTableRow=document.createElement('tr');
          // newTableRow.setAttribute('id',`${id}`);

           let ApplicantDetailsName=document.createElement('td');
           let ApplicantDetailsEmail=document.createElement('td');
           let ApplicantDetailsDate=document.createElement('td');
           let ApplicantView=document.createElement('td');
           let viewButton=document.createElement('button');

           ApplicantDetailsName.textContent=name;
           ApplicantDetailsEmail.textContent=email;
           ApplicantDetailsDate.textContent=date;
           viewButton.setAttribute('id',`${id}`);
           viewButton.textContent='review';
            ApplicantView.append(viewButton);
           viewButton.onclick=function(){
                // let id=viewButton.id;
                // view1(id);
            };
            

           newTableRow.append(ApplicantDetailsName);
           newTableRow.append(ApplicantDetailsEmail);
           newTableRow.append(ApplicantDetailsDate);
            newTableRow.append( ApplicantView);

           Table.append(newTableRow);
})
}
//function to get relevant info from students in our database
function getAllData(){
    const dbref= ref(db);
    get(child(dbref,"StudentApplicant/"))
    .then((snapshot)=>{
        if(snapshot.exists()){
            let Students=[];
           // let pendingStudents=[];
            let id1='';
            snapshot.forEach(childSnapShot=>{
                id1=childSnapShot.key;
                if(childSnapShot.val().status=='approved'){
                    let data=childSnapShot.val();
                    data.id=id1;
                    Students.push(data);
                }
             });
             if(Students.length===0){
                const h2=document.getElementById('Beneficiaries');
                h2.innerText="No Accepted Applications"  
             }
             else{
                createNewRow(Students); 
             }  
        }else{
            const h2=document.getElementById('Beneficiaries');
            h2.innerText="No Existing Beneficiaries"
        }
        
        
    }).catch((error)=>{
        console.log(error);
    })

}

//eventlistner fetches relevant student data to display on fundManager Dashboard
document.addEventListener('DOMContentLoaded',function(){
    getAllData();
});