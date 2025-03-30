import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase, ref} from "firebase/database"

const firebaseConfig = {
  //Poner su config de firebase
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene y exporta la instancia de auth
const auth = getAuth(app);
const db = getDatabase();

export { auth };
export { db };
export default app;