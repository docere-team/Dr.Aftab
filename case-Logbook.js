// Firebase config (your provided values)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDP-oScHd8G5bMJqjZ15atgQjrwwjdffrg",
  authDomain: "docere-16a25.firebaseapp.com",
  projectId: "docere-16a25",
  storageBucket: "docere-16a25.appspot.com",
  messagingSenderId: "25249080743",
  appId: "1:25249080743:web:238adc1be73839fa740282"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById("caseForm");
const statusMsg = document.getElementById("statusMessage");
const caseList = document.getElementById("caseList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "Saving...";

  const title = document.getElementById("caseTitle").value;
  const diagnosis = document.getElementById("diagnosis").value;
  const treatment = document.getElementById("treatment").value;
  const outcome = document.getElementById("outcome").value;
  const reflection = document.getElementById("reflection").value;
  const imageFiles = document.getElementById("imageUpload").files;

  const imageUrls = [];

  for (let file of imageFiles) {
    const imgRef = ref(storage, `cases/${Date.now()}-${file.name}`);
    await uploadBytes(imgRef, file);
    const downloadURL = await getDownloadURL(imgRef);
    imageUrls.push(downloadURL);
  }

  await addDoc(collection(db, "clinicalCases"), {
    title,
    diagnosis,
    treatment,
    outcome,
    reflection,
    imageUrls,
    timestamp: new Date()
  });

  statusMsg.textContent = "Case Saved Successfully!";
  form.reset();
  loadCases();
});

async function loadCases() {
  caseList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "clinicalCases"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `<strong>${data.title}</strong> - ${data.diagnosis}<br>
      <small>${data.treatment.substring(0, 50)}...</small>`;
    caseList.appendChild(li);
  });
}

loadCases();
