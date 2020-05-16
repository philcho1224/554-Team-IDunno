import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../firebase/FirebaseFunc';
import { FormControl, InputLabel, Input, FormHelperText, ButtonGroup, Button } from '@material-ui/core';

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
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>

                <FormControl>
                    <InputLabel htmlFor="email">Email address</InputLabel>
                    <Input id="email" aria-describedby="email-helper-text" required="true" autoFocus="true"/>
                    <FormHelperText id="email-helper-text" required="true">We'll never share your email.</FormHelperText>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type="password" aria-describedby="password-helper-text" />
                    <FormHelperText id="password-helper-text">Chose a good one.</FormHelperText>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Log in
                </Button>
                <Button onClick={passwordReset}>
                    Forgot Password
                </Button>
            </form>
            <SocialSignIn />





            {/* <div className="form-group">
                <label>
                    Email:
                    <input
                    className="form-control"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    />
                </label>
            </div>

            <div className="form-group">
                <label>
                    Password:
                    <input
                    className="form-control"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    />
                </label>
            </div>
            <button type="submit">Log in</button>

            <button className="forgotPassword" onClick={passwordReset}>
                Forgot Password
            </button>
        </form>

        <br />
        <SocialSignIn /> */}
        </div>
    );
}

export default SignIn;