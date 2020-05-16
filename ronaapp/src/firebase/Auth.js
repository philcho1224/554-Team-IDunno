import React, { useState, useEffect } from 'react';
import firebaseApp from "./Firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
  }, []);

  if (loadingUser) {
    return <div>Loading....</div>;
  }

  // let { data } = currentUser;
  // console.log(`currentUser is ${currentUser}`);
  // console.log(`UID is ${currentUser.uid}`);
  // console.log(`data is ${data}`);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};