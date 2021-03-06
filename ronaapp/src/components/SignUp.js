import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunc';
import { AuthContext } from '../firebase/Auth';
// import SocialSignIn from './SocialSignIn';
import { FormControl, InputLabel, Input, FormHelperText, Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';


function SignUp() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { displayName, email, passwordOne, passwordTwo } = e.target.elements;

        if (passwordOne.value !== passwordTwo.value) {
            setPwMatch('Passwords do not match');
            return false;
        }

        try {
            await doCreateUserWithEmailAndPassword(
                email.value,
                passwordOne.value,
                displayName.value
            );
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser) {
        // console.log(`current user isssss ${currentUser}`);
        return <Redirect to="/" />;
    }

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <h1>Sign up</h1>

                <form onSubmit={handleSignUp}>

                    <Box mt={4}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="name-input">Name</InputLabel>
                            <Input id="name-input" name="displayName" required="true" autoFocus="true" />
                        </FormControl>
                    </Box>


                    <Box mt={4}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="email-input">Email</InputLabel>
                            <Input id="email-input" name="email" type="email" required="true" />
                        </FormControl>
                    </Box>

                    <Box mt={4}>
                        <FormControl >
                            <InputLabel htmlFor="passwordOne-input">Password</InputLabel>
                            <Input id="passwordOne-input" name="passwordOne" type="password" required="true" />
                        </FormControl>

                        <FormControl style={{ float: 'right' }}>
                            <InputLabel htmlFor="passwordTwo-input">Confirm Password</InputLabel>
                            <Input id="passwordTwo-input" name="passwordTwo" type="password" required="true" />
                            {pwMatch && <FormHelperText error className="error" id="password-helper-text">{pwMatch}</FormHelperText>}

                        </FormControl>
                    </Box>

                    <Box mt={4} mb={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sign Up
                        </Button>
                        {/* <Box mt={1}>
                            <SocialSignIn />
                        </Box> */}
                    </Box>


                </form>
            </Container>

        </div>
    );
}

export default SignUp;