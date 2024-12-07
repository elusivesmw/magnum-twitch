import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { External, LogOut, Settings } from './icons';
import Link from 'next/link';
import { User } from '@/types/twitch';

export default function UserMenu({
  user,
  clearAccessToken,
}: {
  user: User | undefined;
  clearAccessToken: () => void;
}) {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const pathname = usePathname();
  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  if (!user) return;

  function logout() {
    clearAccessToken();
  }

  return (
    <>
      <div className="w-[30px] cursor-pointer" onClick={toggleUserMenu}>
        <Image
          src={user.profile_image_url}
          alt={`${user.login} profile`}
          className="w-full max-w-full rounded-full object-cover"
          width={30}
          height={30}
          unoptimized
        />
      </div>
      <div
        id="user-menu"
        className={`${
          userMenuOpen ? 'block' : 'hidden'
        } absolute top-[4.5rem] right-4 z-30 flex flex-col bg-sidepanel p-4 min-w-[200px] user-menu-shadow rounded-l-xl border-r border-twbuttontext text-sm`}
      >
        <div className="flex items-center p-2">
          <div className="w-[40px]">
            <Image
              src={user.profile_image_url}
              alt={`${user.login} profile`}
              className="w-full max-w-full rounded-full object-cover"
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <span className="pl-4 font-semibold">{user.display_name}</span>
        </div>
        <div
          role="separator"
          className="border-t border-twborder mt-4 mx-2 pb-4"
        ></div>
        <div>
          <Link
            href="/settings"
            className="flex p-2 rounded-lg hover:bg-twbuttonbg hover:bg-opacity-[0.48]"
          >
            <div className="pr-2 h-[20px]">
              <Settings className="fill-twbuttontext" />
            </div>
            <span className="">Settings</span>
          </Link>
        </div>
        <div
          role="separator"
          className="border-t border-twborder mt-4 mx-2 pb-4"
        ></div>
        <div>
          <a
            href="https://www.twitch.tv/settings/connections"
            target="_blank"
            className="flex p-2 rounded-lg hover:bg-twbuttonbg hover:bg-opacity-[0.48]"
          >
            <div className="pr-2 h-[20px]">
              <External className="fill-twbuttontext" />
            </div>
            <span className="">Disconnect</span>
          </a>
        </div>
        <div>
          <button
            onClick={logout}
            className="w-full flex p-2 rounded-lg hover:bg-twbuttonbg hover:bg-opacity-[0.48]"
          >
            <div className="pr-2 h-[20px]">
              <LogOut className="fill-twbuttontext" />
            </div>
            <span className="">Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
