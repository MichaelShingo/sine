import { signIn } from '@/auth';
import GoogleSignInSubmit from '@/components/atoms/SignIn/GoogleSignInSubmit';

type SignInProps = {
  redirectTo?: string;
};

export default function SignIn({ redirectTo }: SignInProps) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', redirectTo ? { redirectTo } : undefined);
      }}
    >
      <GoogleSignInSubmit />
    </form>
  );
}
