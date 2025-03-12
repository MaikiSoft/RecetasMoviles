import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [SelectedFood, setSelectedFood] = useState({});  
  const [DataFood, setDataFood] = useState({
    text: 'Beef',
    filtro: 'c',
  }) 

  return (
    <GlobalContext.Provider value={{ SelectedFood, setSelectedFood, DataFood, setDataFood }}>
      {children}
    </GlobalContext.Provider>
  );
};
