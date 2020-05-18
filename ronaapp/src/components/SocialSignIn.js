import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunc';
import { Button } from '@material-ui/core';


const SocialSignIn = () => {
    const socialSignOn = async (provider) => {
        try {
            await doSocialSignIn(provider);
        } catch (error) {
        alert(error);
        }
    };

    return (
        <div>
            <Button type="button"  color="secondary" onClick={() => socialSignOn('google')}>
                Sign In with Google
            </Button>
        </div>
    );
};

export default SocialSignIn;