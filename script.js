// Function to open the case log popup
function openCaseLogPopup() {
    document.getElementById('case-log-popup').style.display = 'flex';
}

// Function to close the case log popup
function closeCaseLogPopup() {
    document.getElementById('case-log-popup').style.display = 'none';
}

// Optional: Form handling for case logbook
document.getElementById('case-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert("Case saved successfully!");
    closeCaseLogPopup();
});
