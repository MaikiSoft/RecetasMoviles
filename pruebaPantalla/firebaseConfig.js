// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importar getAuth correctamente
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7DozXYfL9sFY3EQokXVdmc8Wc_505Jco",
  authDomain: "realtime2025-755eb.firebaseapp.com",
  databaseURL: "https://realtime2025-755eb-default-rtdb.firebaseio.com",
  projectId: "realtime2025-755eb",
  storageBucket: "realtime2025-755eb.firebasestorage.app",
  messagingSenderId: "188629165026",
  appId: "1:188629165026:web:d0e44202341bd936790fbb",
  measurementId: "G-JWWDXMP6WH"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene y exporta la instancia de auth
const auth = getAuth(app);

export { auth };
export default app;