import React, { useContext, useState, useEffect } from 'react';
import SignOutBtn from './SignOut';
import PwdReset from './PwdReset';
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import { getUser } from '../firebase/FirebaseFunc';
import Container from '@material-ui/core/Container';
import { Typography, Box } from '@material-ui/core';



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
                <Container component="main" maxWidth="lg" >
                    <Box mt={3}>
                        <Typography variant="h3">Profile Page</Typography>
                    </Box>
                    <p>Profile Pic </p>
                    <p>Username: </p>
                    {userInfo.username}
                    <p>Email: </p>
                    {userInfo.email}
                    <br />
                    <p>Post: </p>
                    <PwdReset />
                    <SignOutBtn />

                </Container>
            </div>
        );
    } else {
        return (
            <div>
                <Container component="main" maxWidth="lg" >
                    <Box mt={3}>
                        <Typography variant="h3">Profile Page</Typography>
                    </Box>
                    <p>User Data didn't detected </p>
                    <p>Post: </p>
                    <PwdReset />
                    <SignOutBtn />
                </Container>
            </div>
        );
    }

}

export default Account;