import React, { createContext, useState, useEffect } from "react";
import { ref, set, onValue } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [SelectedFood, setSelectedFood] = useState({});
  const [DataFood, setDataFood] = useState({
    text: 'Beef',
    filtro: 'c',
  })
  const [favoritos, setFavoritos] = useState(new Set());

  useEffect(() => {
    if (!auth.currentUser) return;
    const favoritosRef = ref(db, `usuarios/${auth.currentUser.uid}/favoritos`);
    const unsubscribe = onValue(favoritosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFavoritos(new Set(Object.keys(data)));
      } else {
        setFavoritos(new Set());
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const toggleFavorito = (recetaId) => {
    const nuevosFavoritos = new Set(favoritos);
    if (nuevosFavoritos.has(recetaId)) {
      nuevosFavoritos.delete(recetaId);
    } else {
      nuevosFavoritos.add(recetaId);
    }
    setFavoritos(nuevosFavoritos);

    set(ref(db, `usuarios/${auth.currentUser.uid}/favoritos/${recetaId}`), nuevosFavoritos.has(recetaId) ? true : null);
  };

  return (
    <GlobalContext.Provider value={{
      SelectedFood, setSelectedFood,
      DataFood, setDataFood,
      favoritos, toggleFavorito,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
