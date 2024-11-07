import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import React from "react";

const AvatarIconUsers = () => {
  return (
    <div>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarIconUsers;
