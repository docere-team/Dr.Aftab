function openCaseLogPopup() {
    document.getElementById('case-log-popup').style.display = 'flex';
}

function closeCaseLogPopup() {
    document.getElementById('case-log-popup').style.display = 'none';
}

// Local storage for simplicity
let cases = JSON.parse(localStorage.getItem("caseLog")) || [];

function renderCases() {
    const container = document.getElementById("saved-cases");
    container.innerHTML = "";

    cases.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "case-card";
        div.innerHTML = `
            <h4>${c.patientName}</h4>
            <p><strong>Case:</strong> ${c.caseName}</p>
            <p><strong>Diagnosis:</strong> ${c.diagnosis}</p>
            <p><strong>Treatment:</strong> ${c.treatment}</p>
            <p><strong>Date:</strong> ${c.date}</p>
            ${c.scanName ? `<p><strong>Scan:</strong> ${c.scanName}</p>` : ""}
        `;
        container.appendChild(div);
    });
}

// Form handling
document.getElementById("case-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const newCase = {
        patientName: document.getElementById("patient-name").value,
        caseName: document.getElementById("case-name").value,
        diagnosis: document.getElementById("diagnosis").value,
        treatment: document.getElementById("treatment").value,
        date: document.getElementById("date").value,
        scanName: document.getElementById("scan").files[0]?.name || null
    };

    cases.push(newCase);
    localStorage.setItem("caseLog", JSON.stringify(cases));
    renderCases();
    this.reset();
    closeCaseLogPopup();
    alert("Case saved successfully!");
});

// Render saved cases on page load
renderCases();
