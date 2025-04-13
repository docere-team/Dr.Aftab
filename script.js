// script.js

const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const saveCaseBtn = document.getElementById('save-case');
const caseLogSection = document.getElementById('case-log-section');
const caseLogList = document.getElementById('case-log-list');
const caseLogbookSection = document.getElementById('case-logbook-section');
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const authTitle = document.getElementById('auth-title');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const registerErrorMessage = document.getElementById('register-error-message');
const loginErrorMessage = document.getElementById('login-error-message');

// Initialize Firebase
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// Register Function
registerBtn.addEventListener('click', async () => {
    console.log('Register button clicked');
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (email && password) {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            alert("Account created successfully. Please login.");
            showLoginSection(); // Show Login after successful Registration
        } catch (error) {
            console.error(error);
            registerErrorMessage.textContent = error.message;
        }
    } else {
        registerErrorMessage.textContent = "Please enter email and password.";
    }
});

// Login Function
loginBtn.addEventListener('click', async () => {
    console.log('Login button clicked');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            loginSection.style.display = 'none';
            caseLogbookSection.style.display = 'block';
            loadCases();
        } catch (error) {
            console.error(error);
            loginErrorMessage.textContent = "Invalid login credentials.";
        }
    } else {
        loginErrorMessage.textContent = "Please enter email and password.";
    }
});

// Switch to Register form
switchToRegister.addEventListener('click', () => {
    console.log('Switching to Register form');
    showRegisterSection();
});

// Switch to Login form
switchToLogin.addEventListener('click', () => {
    console.log('Switching to Login form');
    showLoginSection();
});

// Show Register section and hide Login section
function showRegisterSection() {
    console.log('Showing Register section');
    registerSection.style.display = 'block';
    loginSection.style.display = 'none';
    switchToRegister.style.display = 'none';
    switchToLogin.style.display = 'block';
    authTitle.innerText = "Register";
}

// Show Login section and hide Register section
function showLoginSection() {
    console.log('Showing Login section');
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
    switchToRegister.style.display = 'block';
    switchToLogin.style.display = 'none';
    authTitle.innerText = "Login";
}

// Save Case Function
saveCaseBtn.addEventListener('click', async () => {
    console.log('Save case button clicked');
    const title = document.getElementById('case-title').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const treatmentPlan = document.getElementById('treatment-plan').value;
    const outcome = document.getElementById('outcome').value;
    const reflectionNotes = document.getElementById('reflection-notes').value;
    const file = document.getElementById('upload-image').files[0];

    if (title && diagnosis && treatmentPlan && outcome && reflectionNotes) {
        const userId = auth.currentUser.uid;

        // Save case data to Firestore
        const caseRef = db.collection('cases').doc();
        await caseRef.set({
            title,
            diagnosis,
            treatmentPlan,
            outcome,
            reflectionNotes,
            userId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Upload image to Firebase Storage
        if (file) {
            const storageRef = storage.ref(`cases/${caseRef.id}/${file.name}`);
            await storageRef.put(file);
        }

        alert("Case saved successfully!");
        loadCases(); // Reload cases
    }
});

// Load cases from Firestore
async function loadCases() {
    const userId = auth.currentUser.uid;
    const querySnapshot = await db.collection('cases').where('userId', '==', userId).get();

    caseLogList.innerHTML = ''; // Clear previous cases

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${data.title}</strong>
            <p><strong>Diagnosis:</strong> ${data.diagnosis}</p>
            <p><strong>Treatment:</strong> ${data.treatmentPlan}</p>
            <p><strong>Outcome:</strong> ${data.outcome}</p>
            <p><strong>Reflection:</strong> ${data.reflectionNotes}</p>
        `;
        caseLogList.appendChild(li);
    });

    caseLogSection.style.display = 'block';
}
