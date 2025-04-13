import Image from 'next/image';
import { External, LogOut, Settings } from './icons';
import Link from 'next/link';
import { User } from '@/types/twitch';
import {
  Menu,
  MenuButton,
  MenuHeading,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuSeparator,
} from '@headlessui/react';
import { clearLsToken } from '@/lib/local-storage';

export default function UserMenu({
  user,
  setAccessToken,
}: {
  user: User | undefined;
  setAccessToken: (token: string | undefined) => void;
}) {
  if (!user) return;

  function logout() {
    clearLsToken();
    setAccessToken(undefined);
  }

  return (
    <Menu>
      <MenuButton className="w-[30px] cursor-pointer">
        <Image
          src={user.profile_image_url}
          alt={`${user.login} profile`}
          className="w-full max-w-full rounded-full object-cover"
          width={30}
          height={30}
          unoptimized
        />
      </MenuButton>
      <MenuItems className="absolute top-[4.5rem] right-4 z-30 flex flex-col bg-sidepanel p-4 min-w-[200px] user-menu-shadow rounded-xl text-sm">
        <MenuSection>
          <MenuHeading className="flex items-center p-2">
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
          </MenuHeading>
        </MenuSection>
        <MenuSeparator className="border-t border-twborder mt-4 mx-2 pb-4"></MenuSeparator>
        <MenuSection>
          <MenuItem>
            <Link
              href="/settings"
              className="flex p-2 rounded-lg hover:bg-twbuttonbg hover:bg-opacity-[0.48]"
            >
              <div className="pr-2 h-[20px]">
                <Settings className="fill-twbuttontext" />
              </div>
              <span className="">Settings</span>
            </Link>
          </MenuItem>
        </MenuSection>
        <MenuSeparator className="border-t border-twborder mt-4 mx-2 pb-4"></MenuSeparator>
        <MenuSection>
          <MenuItem>
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
          </MenuItem>
          <MenuItem>
            <button
              onClick={logout}
              className="w-full flex p-2 rounded-lg hover:bg-twbuttonbg hover:bg-opacity-[0.48]"
            >
              <div className="pr-2 h-[20px]">
                <LogOut className="fill-twbuttontext" />
              </div>
              <span className="">Log Out</span>
            </button>
          </MenuItem>
        </MenuSection>
      </MenuItems>
    </Menu>
  );
}
