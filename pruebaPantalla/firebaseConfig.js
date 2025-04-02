import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase, ref} from "firebase/database"

const firebaseConfig = {
  //Poner su config de firebase
  apiKey: "AIzaSyCx6SulJnOgskyN-QrEfHKYB8jktCVmOrc",
  authDomain: "reactnativeprueba-b0a21.firebaseapp.com",
  databaseURL: "https://reactnativeprueba-b0a21-default-rtdb.firebaseio.com",
  projectId: "reactnativeprueba-b0a21",
  storageBucket: "reactnativeprueba-b0a21.firebasestorage.app",
  messagingSenderId: "287703928740",
  appId: "1:287703928740:web:ad1131d6514c13ad857b31"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene y exporta la instancia de auth
const auth = getAuth(app);
const db = getDatabase();

export { auth };
export { db };
export default app;