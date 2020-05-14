import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunc';

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
        <button type="button" onClick={() => socialSignOn('google')}>
            Sign In with Google
        </button>
        {/* <img
            onClick={() => socialSignOn('facebook')}
            alt="google signin"
            src="/imgs/facebook_signin.png"
        /> */}
        </div>
    );
};

export default SocialSignIn;