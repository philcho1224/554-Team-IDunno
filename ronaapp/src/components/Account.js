import React, { useContext, useState, useEffect } from 'react';
import SignOutBtn from './SignOut';
import PwdReset from './PwdReset';
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import { getUser } from '../firebase/FirebaseFunc';



function Account() {
    const { currentUser } = useContext(AuthContext);
    const [userInfo, setUesrInfo] = useState(undefined);

    // const uid = currentUser.uid;
    // console.log(`email is ${uid}`);

    useEffect(() => {
        async function getUserInfo(uid) {
            let userInfo;
            try {
                userInfo = await getUser(uid);
                console.log(userInfo);
                setUesrInfo(userInfo);
            } catch (error) {
                console.log(`call getUser catch err ${error}`);
            }
        }
        getUserInfo(currentUser.uid);
        console.log(userInfo);
        console.log(`userInfooooooooo is ${userInfo}`);
    }, []);

    if (userInfo) {
        console.log(`userInfo is ${userInfo}`);
        console.log('dfvsdfvgsdf');
        console.log(userInfo.email);
        return (
            <div>
            <h2>Profile Page</h2>
            <p>Profile Pic </p>
            <p>Username: </p>  
                {userInfo.username}
            <p>Email: </p>
                {userInfo.email}
            <br />
            <p>Post: </p>
            <PwdReset />
            <SignOutBtn />
            </div>
        );
    } else {
        return (
            <div>
            <h2>Profile Page</h2>
            <p>User Data didn't detected </p>
            <p>Post: </p>
            <PwdReset />
            <SignOutBtn />
            </div>
        );
    }
    
}

export default Account;