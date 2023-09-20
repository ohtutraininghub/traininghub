'use client'

import Button from '@mui/material/Button';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
    return(
        <Button 
            variant="contained"
            onClick={() => signOut()}>
                Sign out
        </Button>
    );
};