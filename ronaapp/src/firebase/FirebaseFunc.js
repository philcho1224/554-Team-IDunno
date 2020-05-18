import firebase from 'firebase/app';
import 'firebase/firestore';

import * as algoliasearch from 'algoliasearch';
const client = algoliasearch("NW00BIZJ9O", "73ab8c260b27b919c60e626eaad30649");
const index = client.initIndex("marketitems");

/********************** Auth Functions ***********************/
async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  let userID = await firebase.auth().createUserWithEmailAndPassword(email, password);
  const { user } = userID;
  const userUID = user.uid;
  const userEmail = user.email;
  const db = firebase.firestore();
  let marketCollection = db.collection("users");
  let account = {
    username: displayName,
    email: userEmail
  }
  console.log("ACCOUNT", account);
  console.log("USERUID", userUID);
  const insertItem = await marketCollection.doc(userUID).set(account);

  // await firebase.firestore().collection('users').doc(userUID).add(account);
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

  return itemArray;
}
async function addItem(itemObject){
  const db = firebase.firestore();
  let marketCollection = db.collection("marketItems");
  const insertItem = await marketCollection.add(itemObject);
  console.log("THIS IS INSERTED ITEM", insertItem);
  let algoliaObject = 
    {
      objectID: insertItem.id,
      name: itemObject.name,
      user: itemObject.user,
      email: itemObject.email,
      description: itemObject.description,
      tradeitems: itemObject.tradeitems,
      image: itemObject.image
    };
  const indexInsert = await index.saveObject(algoliaObject);
  console.log("Added item with ID: ", insertItem.id);
}


/********************** DB Functions ***********************/
async function getUser(uid) {
  const db = firebase.firestore();
  // console.log('error here?');
  let userInfo = await db.collection('users').doc(uid).get();
  if (!userInfo) {
    console.log('fail to find userInfo')
  } else {
    return userInfo.data();
  }
}

async function updateCity(uid, city) {
  const db = firebase.firestore();
  const callUpdate = await db.collection('users').doc(uid).update({
      city: city
  });
  return callUpdate;
}

async function getUserItems(userEmail){
  const db = firebase.firestore();
  let marketCollection = db.collection("marketItems");
  const database = await marketCollection.where('email', '==', userEmail).get();
  let itemArray = [];
  database.forEach(doc => {
    itemArray.push(doc.data());
  });
  console.log("UserItems" , itemArray);
  return itemArray;
}



async function deleteItem(userEmail, itemName){
  const db = firebase.firestore();
  const ref = await db.collection("marketItems").where("email", "==", userEmail).where("name", "==", itemName).get();
  const docRefId = ref.docs[0].id;
  const getItem  = await db.collection("marketItems").doc(docRefId).get();
  console.log(getItem.data());
  await db.collection("marketItems").doc(docRefId).delete();
}

async function editUserProfile(userID, editObject){
  const db = firebase.firestore();
  let marketCollection = db.collection("users");
  let setWithOptions = await marketCollection.doc(userID).set(editObject, {merge: true});

}
export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doPasswordUpdate,
  doSignOut,
  doChangePassword,
  getUser,
  updateCity,
  getUserItems,
  deleteItem,
  addItem,
  getAllItems,
  editUserProfile
};