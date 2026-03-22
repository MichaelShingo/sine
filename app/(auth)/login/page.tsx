import { auth } from '@/auth';
import SignIn from '@/components/atoms/SignIn/SignIn';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';

function SineWavePanel() {
  return (
    <div className="relative flex min-h-[220px] flex-1 items-center justify-center overflow-hidden bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 md:min-h-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.35), transparent 50%), radial-gradient(circle at 70% 80%, rgba(56, 189, 248, 0.2), transparent 45%)',
        }}
      />
      <svg
        className="relative z-10 mx-auto h-40 w-full max-w-[360px] text-emerald-400/90 md:h-48"
        viewBox="0 0 400 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="sine-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor="rgb(52, 211, 153)"
              stopOpacity="0.35"
            />
            <stop offset="50%" stopColor="rgb(110, 231, 183)" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor="rgb(45, 212, 191)"
              stopOpacity="0.35"
            />
          </linearGradient>
        </defs>
        <path
          d="M 0 80 Q 50 20, 100 80 T 200 80 T 300 80 T 400 80"
          stroke="url(#sine-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 0 80 C 40 20, 80 140, 120 80 S 200 20, 240 80 S 320 140, 360 80 S 400 50, 400 80"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
          fill="none"
        />
        <path
          d="M 0 95 C 50 35, 90 155, 140 95 S 230 35, 280 95 S 350 155, 400 95"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.25"
          fill="none"
        />
      </svg>
      <p className="absolute bottom-6 left-0 right-0 z-10 px-6 text-center text-sm font-medium tracking-widest text-emerald-100/70">
        Sine
      </p>
    </div>
  );
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    // redirect('/');
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-10"
      style={{
        backgroundImage: [
          'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(16, 185, 129, 0.18), transparent)',
          'radial-gradient(ellipse 80% 50% at 100% 50%, rgba(15, 118, 110, 0.12), transparent)',
          'radial-gradient(ellipse 60% 40% at 0% 80%, rgba(30, 41, 59, 0.9), transparent)',
        ].join(', '),
      }}
    >
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-md">
        <div className="flex min-h-0 flex-col md:min-h-[440px] md:flex-row">
          <SineWavePanel />
          <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-10 md:px-12 md:py-12">
            <div className="flex flex-col gap-2">
              <Typography variant="h2">Sign in</Typography>
              <Typography variant="body1">
                Continue with your Google account to access the app.
              </Typography>
            </div>
            <SignIn redirectTo="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
