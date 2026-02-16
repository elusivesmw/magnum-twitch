'use client';

import UserMenu from './user-menu';
import { useSession, signIn } from 'next-auth/react';

export default function Login() {
  const session = useSession();

  return (
    <div className="relative flex p-4">
      {session.status === 'authenticated' ? (
        <UserMenu />
      ) : (
        <button
          onClick={() => signIn('twitch')}
          className="inline-flex items-center text-sm font-semibold px-4 text-twbuttontext bg-twbuttonbg bg-opacity-[0.38] hover:bg-opacity-[0.48] rounded-[4px]"
        >
          Log In
        </button>
      )}
    </div>
  );
}
