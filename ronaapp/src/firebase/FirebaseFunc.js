import firebase from 'firebase/app';
import 'firebase/firestore';
// import firebaseApp from "./Firebase";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
  firebase.auth().currentUser.updateProfile({ displayName: displayName });
}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = firebase.auth.EmailAuthProvider.credential(
    email,
    oldPassword
  );
  await firebase.auth().currentUser.reauthenticateWithCredential(credential);
  await firebase.auth().currentUser.updatePassword(newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === 'google') {
    socialProvider = new firebase.auth.GoogleAuthProvider();
  } else if (provider === 'facebook') {
    socialProvider = new firebase.auth.FacebookAuthProvider();
  }
  await firebase.auth().signInWithPopup(socialProvider);
}

async function doPasswordReset(email) {
  await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
  await firebase.auth().updatePassword(password);
}

async function doSignOut() {
  await firebase.auth().signOut();
}
async function getAllItems(){
  const db = firebase.firestore();
  let marketCollection = db.collection("marketItems");
  const database = await marketCollection.get();
  let itemArray = [];
  database.forEach(doc => {
    itemArray.push(doc.data());
  });
  
  console.log("TESTING");
  console.log(itemArray);
  return itemArray;
}
async function addItem(itemObject){
  const db = firebase.firestore();
  let marketCollection = db.collection("marketItems");
  const insertItem = await marketCollection.add(itemObject);
  console.log("Added item with ID: ", insertItem.id);
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
  getAllItems,
  addItem
};