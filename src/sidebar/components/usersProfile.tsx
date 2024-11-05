import { Avatar } from "@/components/ui/avatar";
import React from "react";
import { MenuDrop } from "./menuDrop";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      <div className='flex items-center'>
        <span className='hidden text-right lg:block mr-4'>
          <span className='block text-sm font-medium text-black dark:text-white'>
            {session?.user.role}
          </span>
          <span className='block text-xs'>{session?.user.name}</span>
        </span>
        <div className='bg-blue-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center'>
          <Avatar>
            <MenuDrop />
          </Avatar>
        </div>
      </div>
    </div>
  );
}
