import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Auth state observer
auth.onAuthStateChanged((user) => {
  const authButtons = document.querySelector('.auth-buttons');
  const userProfile = document.querySelector('.user-profile');

  if (user) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'flex';
    document.querySelector('.username').textContent = user.email;
    showNotification(`Welcome back, ${user.email}`, 'success');
  } else {
    authButtons.style.display = 'flex';
    userProfile.style.display = 'none';
    document.querySelector('.username').textContent = '';
  }
});

// Google login handler
window.handleGoogleLogin = async () => {
  try {
    showNotification('Signing in with Google...', 'info');
    const result = await signInWithPopup(auth, googleProvider);
    showNotification(`Welcome ${result.user.displayName || result.user.email}!`, 'success');
    closeAuthModal();
  } catch (error) {
    showNotification(`Login failed: ${error.message}`, 'error');
  }
};

// Logout handler
window.handleLogout = function () {
  auth.signOut().then(() => {
    showNotification('Logged out successfully', 'info');
  }).catch((error) => {
    showNotification('Error logging out', 'error');
  });
};

// Make auth and functions available globally
window.auth = auth;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
