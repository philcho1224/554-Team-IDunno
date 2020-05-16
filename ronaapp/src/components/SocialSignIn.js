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
            <Button type="button" variant="contained" color="primary" onClick={() => socialSignOn('google')}>
                Sign In with Google
            </Button>
            {/* <button type="button" onClick={() => socialSignOn('google')}>
                Sign In with Google
            </button> */}
            {/* <img
                onClick={() => socialSignOn('facebook')}
                alt="google signin"
                src="/imgs/facebook_signin.png"
            /> */}
        </div>
    );
};

export default SocialSignIn;