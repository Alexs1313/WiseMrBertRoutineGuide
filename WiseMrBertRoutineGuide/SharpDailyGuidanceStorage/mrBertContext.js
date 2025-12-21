import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
export const StoreContext = createContext(undefined);
export const useStore = () => useContext(StoreContext);

export const ContextProvider = ({ children }) => {
  const [mrBertBookmarks, setMrBertBookmarks] = useState([]);
  const mrBertLoadBookmarks = async () => {
    const isSavedBookmarks = await AsyncStorage.getItem('mrbert_bookmarks');
    if (isSavedBookmarks) setMrBertBookmarks(JSON.parse(isSavedBookmarks));
  };

  const mrBertDeleteBookmark = async quoteText => {
    const updatedBookmarks = mrBertBookmarks.filter(
      currBookmark => currBookmark.text !== quoteText,
    );
    setMrBertBookmarks(updatedBookmarks);
    await AsyncStorage.setItem(
      'mrbert_bookmarks',
      JSON.stringify(updatedBookmarks),
    );
  };

  const contextValue = {
    mrBertBookmarks,
    setMrBertBookmarks,
    mrBertLoadBookmarks,
    mrBertDeleteBookmark,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
