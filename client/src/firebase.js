import { useEffect, useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import axios from "axios";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDc8C1lPzlxB3mhi6Y0sOgHA0YGjujZ_iI",
    authDomain: "connectnuts-854d6.firebaseapp.com",
    projectId: "connectnuts-854d6",
    storageBucket: "connectnuts-854d6.appspot.com",
    messagingSenderId: "565687535705",
    appId: "1:565687535705:web:a31833771d6feea3248948"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Custom Hook
export function useAuth() { // hook generates a firebase user object and updates it when it detects change
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}

// Storage
export async function uploadPost(file, currentUser, setLoading) {
  console.log(file);
  const fileRef = ref(storage, currentUser.uid + file.name);
  // upload fileref to mongoDB under posts
  setLoading(true);
  
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  console.log(photoURL)
  updateProfile(currentUser, {photoURL});
  
  setLoading(false);
  alert("Uploaded file!");
  return photoURL;
}

export async function uploadPFP(file, currentUser, setLoading) {
  console.log(file);
  const fileRef = ref(storage, currentUser.uid + file.name);
  // upload fileref to mongoDB
  setLoading(true);
  
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {photoURL});
  
  setLoading(false);
  alert("Uploaded file!");
  return photoURL;
}