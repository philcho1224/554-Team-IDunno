import React, { useContext, useState, useEffect } from 'react';
import SignOutBtn from './SignOut';
import PwdReset from './PwdReset';
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import { getUser, getUserItems } from '../firebase/FirebaseFunc';
import Container from '@material-ui/core/Container';
import { Box, Button, Card, CardContent, Typography, List, ListItem, ListItemText } from '@material-ui/core';

function Account() {
    const { currentUser } = useContext(AuthContext);
    const [userInfo, setUesrInfo] = useState(undefined);
    const [trades, setTrades] = useState(undefined);

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

        async function getItems(email) {
            let trades;
            try {
                let info = await getUserItems(email);
                trades = info[0].tradeitems
                console.log(trades);
                setTrades(trades);
            } catch (error) {
                console.log(`call getUser catch err ${error}`);
            }
        }

        getUserInfo(currentUser.uid);
        getItems(currentUser.email);
        // console.log(userInfo);
        // console.log(trades);
        // console.log(`userInfooooooooo is ${userInfo}`);
        // console.log(`traaaaaaades is ${trades}`);
    }, []);

    let cards = null;
    if (trades) {
        cards = trades && trades.map((value, index) => {
            return (
                // <Card>
                //     <CardContent>
                //         <Typography>
                //             {value}
                //         </Typography>
                //     </CardContent>
                // </Card>

                <List>
                    <ListItem>
                        <ListItemText>
                            {value}
                        </ListItemText>
                    </ListItem>
                </List>
            )
        })
    } else {
        cards = () => {
            return (
                <Card>
                    <CardContent>
                        <Typography>
                            You have not added any trade items.
                        </Typography>
                    </CardContent>
                </Card> 
            )
        }
    }

    if (userInfo) {
        console.log(`userInfo is ${userInfo}`);
        console.log('dfvsdfvgsdf');
        console.log(userInfo.email);
        return (
            <div>
                <Container component="main" maxWidth="lg" >
                    <Box mt={3}>
                        <Typography variant="h2">Profile Page</Typography>
                    </Box>
                    <p>Profile Pic </p>
                    <p>Username: </p>
                    {userInfo.username}
                    <p>Email: </p>
                    {userInfo.email}
                    <br />
            <p> My Trades: </p>
                {cards}
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
                        <Typography variant="h2">Profile Page</Typography>
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