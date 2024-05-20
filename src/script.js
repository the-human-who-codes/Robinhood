
var user = JSON.parse(sessionStorage.getItem('user'));

console.log(user.displayName);

function showForm(formType) {
    if (formType === 'applicant') {
        sessionStorage.setItem('firstLogin',true);
        window.location.href = './Sprint/fundApplicant/dash_board.html';
    } else if (formType === 'fundManager') {
        window.location.href = './fundManager/applicant.html';
    }
}


