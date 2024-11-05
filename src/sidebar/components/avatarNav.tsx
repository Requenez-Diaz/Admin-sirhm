import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

const AvatarIconUsers = () => {
  return (
    <div>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>CN</AvatarFallback>
    </div>
  );
};

export default AvatarIconUsers;
