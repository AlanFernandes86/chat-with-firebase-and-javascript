import { 
  getAuth, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut as _signOut,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const signIn = async () => signInWithRedirect(auth, provider);

export const singOut = async () => _signOut(auth);

export const getResult = () => getRedirectResult(auth);

export const onStateChanged = async (callback) => onAuthStateChanged(auth, callback);
