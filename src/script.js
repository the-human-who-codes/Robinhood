
const adminButton = document.querySelector('.admin');
const adminInput = document.querySelector('.admin-input');
const submitPinButton = document.querySelector('.submit-pin');

adminButton.addEventListener('click', function() {
    
    adminInput.style.display = 'block';
    
    submitPinButton.style.display = 'block';
});

function showForm(formType) {
    var formWrapper = document.getElementById('formWrapper');
    var formHTML = '';
    var backButtonHTML = '<a href="#" onclick="goBack()">Back</a>';

    if (formType === 'applicant') {
        formHTML = document.getElementById('applicantFormTemplate').innerHTML;
    } else if (formType === 'fundManager') {
        formHTML = document.getElementById('fundManagerFormTemplate').innerHTML;
    }
    formHTML = backButtonHTML + formHTML;
    formWrapper.innerHTML = formHTML;
}

function goBack() {
    location.reload();
}

function showForm(formType) {
    if (formType === 'applicant') {
        window.location.href = './fundApplicant/applicant.html';
    } else if (formType === 'fundManager') {
        window.location.href = './fundManager/fundmanager.html';
    }
}

document.getElementById('continueWithGoogle').addEventListener('click', function() {
    window.location.href = 'createacc.html';
});
