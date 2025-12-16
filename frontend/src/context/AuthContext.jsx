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
    setCurrentUser(userData); // Cập nhật state để React render lại giao diện ngay
  };

  // đăngkí    firebase docs/build/authentication/web/get started
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // đăng nhập
  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // đăng nhập = google   firebase docs/build/authentication/web/đăng nhập = google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // đăng xuất  firebase docs/build/authentication/web/ps authentication
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    return signOut(auth);
  };

  //Người quản lý   firebase docs/build/authentication/web/manage user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, displayName, photoURL } = user;
        const userData = {
          email,
          username: displayName,
          photo: photoURL,
        };
        setCurrentUser(userData);
      } else {
        const localUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token || !localUser) {
          setCurrentUser(null);
        } else {
          setCurrentUser(JSON.parse(localUser));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
