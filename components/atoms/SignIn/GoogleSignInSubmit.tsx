'use client';
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import { useFormStatus } from 'react-dom';

export default function GoogleSignInSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      fullWidth
      size="large"
      variant="outlined"
      disabled={pending}
      loading={pending}
      loadingPosition="start"
      startIcon={<GoogleIcon color="primary" />}
    >
      Sign in with Google
    </Button>
  );
}
