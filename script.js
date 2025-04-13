// Save Case Function
saveCaseBtn.addEventListener('click', async () => {
    const caseTitle = document.getElementById('case-title').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const treatmentPlan = document.getElementById('treatment-plan').value;
    const outcome = document.getElementById('outcome').value;
    const reflectionNotes = document.getElementById('reflection-notes').value;
    const uploadImage = document.getElementById('upload-image').files[0];

    if (caseTitle && diagnosis && treatmentPlan && outcome && reflectionNotes) {
        let imageUrl = null;
        if (uploadImage) {
            const imageRef = storage.ref().child('case_images/' + uploadImage.name);
            await imageRef.put(uploadImage);
            imageUrl = await imageRef.getDownloadURL();
        }

        // Save case data to Firestore
        const caseData = {
            title: caseTitle,
            diagnosis: diagnosis,
            treatmentPlan: treatmentPlan,
            outcome: outcome,
            reflectionNotes: reflectionNotes,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        try {
            await db.collection('cases').add(caseData);
            alert('Case saved successfully!');
            loadCases(); // Reload the case list
        } catch (error) {
            console.error('Error saving case: ', error);
        }
    } else {
        alert('Please fill in all the fields!');
    }
});

// Load Cases from Firestore
async function loadCases() {
    const casesSnapshot = await db.collection('cases').orderBy('createdAt', 'desc').get();
    caseLogList.innerHTML = ''; // Clear the list first

    casesSnapshot.forEach((doc) => {
        const caseData = doc.data();
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h4>${caseData.title}</h4>
            <p><strong>Diagnosis:</strong> ${caseData.diagnosis}</p>
            <p><strong>Treatment Plan:</strong> ${caseData.treatmentPlan}</p>
            <p><strong>Outcome:</strong> ${caseData.outcome}</p>
            <p><strong>Reflection Notes:</strong> ${caseData.reflectionNotes}</p>
            ${caseData.imageUrl ? `<img src="${caseData.imageUrl}" alt="Case Image" style="max-width: 100%;">` : ''}
        `;
        caseLogList.appendChild(listItem);
    });
}

// Initialize and Load Cases on Page Load
window.onload = () => {
    const user = auth.currentUser;
    if (user) {
        authSection.style.display = 'none';
        caseLogbookSection.style.display = 'block';
        loadCases();
    }
};
