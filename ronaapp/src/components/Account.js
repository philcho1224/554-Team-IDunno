import React, { useContext, useState, useEffect } from 'react';
import SignOutBtn from './SignOut';
import PwdReset from './PwdReset';
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import { getUser, getUserItems,  deleteItem} from '../firebase/FirebaseFunc';
import Container from '@material-ui/core/Container';
import { Box, Button, Card, CardContent, CardActions, CardHeader, CardMedia, Grid, Typography} from '@material-ui/core';

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
                trades = info;
                console.log(trades);
                setTrades(trades);
            } catch (error) {
                console.log(`call getUser catch err ${error}`);
            }
        }

        getUserInfo(currentUser.uid);
        getItems(currentUser.email);
    }, []);

    let cards = null;
    if (trades) {
        cards = trades && trades.map((value, index) => {
            return (
                <Card>
                    <CardHeader 
                        title={"Want Item: " + value.name}
                    />
                    <CardMedia 
                        image={value.image}
                        title={value.name}
                    />
                    
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {value.description ? "Description: " + value.description : " "}
                            
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Availble to trade: 
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs = {4}>
                                {value.tradeitems[0]}
                            </Grid>
                            <Grid item xs = {4}>
                                {value.tradeitems[1]}
                            </Grid>
                            <Grid item xs = {4}>
                                {value.tradeitems[2]}
                            </Grid>
                        </Grid>
                        <CardActions>
                            <Button>Edit</Button>
                            <Button onClick={() => deleteItem(value.email, value.name)}>Delete</Button>
                        </CardActions>

                    </CardContent>
                </Card>
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
                    <p>Username: </p>
                        {userInfo.username}
                    <p>Email: </p>
                        {userInfo.email}
                    <br />
                    <p> My Items: </p>
                        {cards}
                        <Button>Add Item</Button>
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
                    <PwdReset />
                    <SignOutBtn />
                </Container>
            </div>
        );
    }

}

export default Account;