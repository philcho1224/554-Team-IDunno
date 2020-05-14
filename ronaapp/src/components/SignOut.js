import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunc';

const SignOutBtn = () => {
  return (
    <button type="button" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutBtn;