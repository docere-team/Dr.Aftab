function openCaseLogPopup(editIndex = null) {
    document.getElementById('case-log-popup').style.display = 'flex';

    if (editIndex !== null) {
        const caseData = cases[editIndex];
        document.getElementById("patient-name").value = caseData.patientName;
        document.getElementById("case-name").value = caseData.caseName;
        document.getElementById("diagnosis").value = caseData.diagnosis;
        document.getElementById("treatment").value = caseData.treatment;
        document.getElementById("date").value = caseData.date;
        document.getElementById("scan").value = '';
        document.getElementById("case-form").dataset.editing = editIndex;
    } else {
        document.getElementById("case-form").reset();
        delete document.getElementById("case-form").dataset.editing;
    }
}

function closeCaseLogPopup() {
    document.getElementById('case-log-popup').style.display = 'none';
}

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
            <button onclick="editCase(${index})">Edit</button>
            <button onclick="deleteCase(${index})">Delete</button>
        `;
        container.appendChild(div);
    });
}

function editCase(index) {
    openCaseLogPopup(index);
}

function deleteCase(index) {
    if (confirm("Are you sure you want to delete this case?")) {
        cases.splice(index, 1);
        localStorage.setItem("caseLog", JSON.stringify(cases));
        renderCases();
    }
}

document.getElementById("case-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const isEditing = this.dataset.editing !== undefined;
    const newCase = {
        patientName: document.getElementById("patient-name").value,
        caseName: document.getElementById("case-name").value,
        diagnosis: document.getElementById("diagnosis").value,
        treatment: document.getElementById("treatment").value,
        date: document.getElementById("date").value,
        scanName: document.getElementById("scan").files[0]?.name || null
    };

    if (isEditing) {
        cases[this.dataset.editing] = newCase;
    } else {
        cases.push(newCase);
    }

    localStorage.setItem("caseLog", JSON.stringify(cases));
    renderCases();
    this.reset();
    closeCaseLogPopup();
    alert(isEditing ? "Case updated!" : "Case saved!");
});

renderCases();

// Export as PDF
function exportToPDF() {
    const printWindow = window.open('', '_blank');
    const printableContent = document.getElementById('saved-cases').innerHTML;
    printWindow.document.write(`
        <html>
        <head><title>Case Log Export</title></head>
        <body>${printableContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
