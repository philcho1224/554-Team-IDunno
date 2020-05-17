import React, { useContext, useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import { doChangePassword } from '../firebase/FirebaseFunc';
import '../App.css';
import { FormControl } from '@material-ui/core';
import { InputLabel, Input, FormHelperText, Button, Box } from '@material-ui/core';

function PwdReset() {
    const { currentUser } = useContext(AuthContext);
    const [pwMatch, setPwMatch] = useState('');
    //   console.log(currentUser);

    const submitForm = async (event) => {
        event.preventDefault();
        const {
            currentPassword,
            newPasswordOne,
            newPasswordTwo
        } = event.target.elements;

        if (newPasswordOne.value !== newPasswordTwo.value) {
            setPwMatch('New Passwords do not match, please try again');
            return false;
        }

        try {
            await doChangePassword(
                currentUser.email,
                currentPassword.value,
                newPasswordOne.value
            );
            alert('Password has been changed, you will now be logged out');
        } catch (error) {
            alert(error);
        }
    };

    if (currentUser.providerData[0].providerId === 'password') {
        return (
            <div>
                <h2>Change Password</h2>
                <form onSubmit={submitForm}>
                    <FormControl >
                        <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                        <Input id="currentPassword" name="currentPassword" type="password" required="true" />
                    </FormControl>

                    <Box mt={2}>
                        <FormControl >
                            <InputLabel htmlFor="newPasswordOne">New Password</InputLabel>
                            <Input id="newPasswordOne" name="newPasswordOne" type="password" required="true" />
                        </FormControl>
                    </Box>

                    <Box mt={2}>
                        <FormControl >
                            <InputLabel htmlFor="newPasswordTwo">Confirm New Password</InputLabel>
                            <Input id="newPasswordTwo" name="newPasswordTwo" type="password" required="true" />
                            {pwMatch && <FormHelperText error className="error" id="password-helper-text">{pwMatch}</FormHelperText>}
                        </FormControl>
                    </Box>

                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary">Change Password</Button>
                    </Box>
                </form>
                <br />
            </div>
        );
    } else {
        return (
            <div>
                <h2>
                    You are signed in using a Social Media Provider, You cannot change
                    your password
                </h2>
            </div>
        );
    }
}

export default PwdReset;