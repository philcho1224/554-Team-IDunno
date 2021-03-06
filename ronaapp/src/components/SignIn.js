import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import {
    doSignInWithEmailAndPassword,
    doPasswordReset
} from '../firebase/FirebaseFunc';
import { FormControl, InputLabel, Input, Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function SignIn() {
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    const handleLogin = async (event) => {
        event.preventDefault();
        let { email, password } = event.target.elements;

        try {
            await doSignInWithEmailAndPassword(email.value, password.value);
        } catch (error) {
            alert(error);
        }
    };

    const passwordReset = (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        if (email) {
            doPasswordReset(email);
            alert('Password reset email was sent');
        } else {
            alert(
                'Please enter an email address below before you click the forgot password link'
            );
        }
    };

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <h1>Log in</h1>
                <form onSubmit={handleLogin}>

                    <Box mt={4}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="email">Email address</InputLabel>
                            <Input id="email" required="true" autoFocus="true" />
                        </FormControl>
                    </Box>
                    <Box mt={4}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input id="password" type="password" />
                        </FormControl>
                    </Box>
                    <Box mt={5}>
                        <Button type="submit" variant="contained" color="primary" fullWidth >
                            Log in
                        </Button>
                    </Box>
                    <Box mt={1}>
                        <Grid container fullWidth>
                            {/* <Grid item xs>
                                <SocialSignIn />
                            </Grid> */}
                            <Grid item>
                                <Button onClick={passwordReset}>
                                    Forgot Password
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>

                </form>


            </Container>
        </div>
    );
}

export default SignIn;