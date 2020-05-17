import firebase from 'firebase/app';
import 'firebase/firestore';

/********************** Auth Functions ***********************/
function doCreateUserWithEmailAndPassword(email, password, displayName) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(
    function(responceData) {
      const { user } = responceData;
      const userUID = user.uid;
      const userEmail = user.email;

      console.log(user);
      console.log(`newUser's uid is ${userUID}`);

      const account = {
        username: displayName,
        email: userEmail
      }
      firebase.firestore().collection('users').doc(userUID).set(account);
      // responceData.updateProfile({ displayName: displayName });
    }
  )
  .catch(function(error) {
    var errCode = error.code;
    var errMsg = error.message;
    console.log(`create user with error code ${errCode}, msg: ${errMsg}`);
  })
  ;
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
  console.log("Added item with ID: ", insertItem.id);
}

/********************** DB Functions ***********************/
async function getUser(uid) {
  const db = firebase.firestore();
  console.log('error here?');
  let userInfo = await db.collection('users').doc(uid).get();
  if (!userInfo) {
    console.log('fdsvsdfv')
  }
  else {
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

async function getWantItems(uid) {
  const db = firebase.firestore();
  const wantItems = await db.collection('users').doc(uid).collection('wantItem').get();
  console.log(wantItems);
  return wantItems;
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
async function deleteItem(userEmail, itemId){
  console.log("ItemID,", itemId)
  const db = firebase.firestore();
  let marketCollection = db.collection("marketItems");
  const getItem  = await marketCollection.doc(itemId).get();
  console.log(getItem.data());
  if(getItem.data().email !== userEmail){
    console.log("Cant delete item that is not yours")
  }
  else{
    const deleteItem = await marketCollection.doc(itemId).delete();
  }
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
  getWantItems,
  getUserItems,
  deleteItem
};