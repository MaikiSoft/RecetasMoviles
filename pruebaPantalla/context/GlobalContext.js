import React, { createContext, useState } from "react";

// Crear el contexto
export const GlobalContext = createContext();

// Proveedor del contexto
export const GlobalProvider = ({ children }) => {
  const [SelectedFood, setSelectedFood] = useState({});  // Guardar datos del usuario
  const [DataFood, setDataFood] = useState({
    text: 'Beef',
    filtro: 'c',
  }) // Guardar tema de la app

  return (
    <GlobalContext.Provider value={{ SelectedFood, setSelectedFood, DataFood, setDataFood }}>
      {children}
    </GlobalContext.Provider>
  );
};
