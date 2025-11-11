import React from "react";
import { MenuDrop } from "./menuDrop";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();
  return (
    <div>
      <div className='flex items-center'>
        <span className='hidden text-right lg:block mr-4'>
          <span className='block text-sm font-medium text-black dark:text-white'>
            {session?.user.role}
          </span>
          <span className='block text-xs'>{session?.user.name}</span>
        </span>
        <div>
          <MenuDrop />
        </div>
      </div>
    </div>
  );
}
