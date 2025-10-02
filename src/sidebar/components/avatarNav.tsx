// components/AvatarIconUsers.tsx

"use client";

import { GetUserImageById } from "@/app/actions/userImage/get-image-user-by-id";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";

interface AvatarIconUsersProps {
  userId: number;
}

const AvatarNavigations = ({ userId }: AvatarIconUsersProps) => {
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      if (!userId) {
        return;
      }

      const result = await GetUserImageById();
      if (result.success && result.image) {
        setUserImageSrc(result.image);
      }
    };

    fetchUserImage();
  }, [userId]);

  return (
    <div>
      <Avatar>
        <AvatarImage
          src={userImageSrc || "https://github.com/shadcn.png"}
          alt='User Avatar'
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarNavigations;
