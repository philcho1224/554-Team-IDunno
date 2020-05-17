import React from 'react';
import {  Button } from '@material-ui/core';
import { doSignOut } from '../firebase/FirebaseFunc';

const SignOutBtn = () => {
  return (
    <Button type="button" variant="contained" color="primary" onClick={doSignOut}>
        Sign Out
    </Button>
  );
};

export default SignOutBtn;