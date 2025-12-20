import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Đăng nhập và cập nhật state ngay lập tức ---
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentUser(userData);
  };

  // đăng xuất  firebase docs/build/authentication/web/ps authentication
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    return signOut(auth);
  };

  // đăng nhập = google   firebase docs/build/authentication/web/đăng nhập = google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  //Người quản lý   firebase docs/build/authentication/web/manage user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (token && localUser) {
      try {
        setCurrentUser(JSON.parse(localUser));
        setLoading(false);
        return;
      } catch (error) {
        console.error(error);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        setCurrentUser({
          email,
          username: displayName,
          photoURL,
          role: "user",
        });
      } else {
        if (!token) setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    signInWithGoogle,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
