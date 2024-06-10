import React, { createContext, useState } from 'react';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
    const [itemToEdit, setItemToEdit] = useState(null);

    return (
        <ItemContext.Provider value={{ itemToEdit, setItemToEdit }}>
            {children}
        </ItemContext.Provider>
    );
};
