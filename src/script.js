
var user = JSON.parse(sessionStorage.getItem('user'));

console.log(user.displayName);


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
        window.location.href = './Sprint/dash_board.html';
    } else if (formType === 'fundManager') {
        window.location.href = './fundManager/applicant.html';
    }
}


