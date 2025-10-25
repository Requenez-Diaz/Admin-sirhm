"use client";

import { GetUserImageById } from "@/app/actions/userImage/get-image-user-by-id";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const AvatarNavigations = () => {
  const { data: session } = useSession();
  const [userImageSrc, setUserImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const result = await GetUserImageById();
      if (result.success && result.image) {
        setUserImageSrc(result.image);
      } else {
        setUserImageSrc(null);
      }
    };

    fetchUserImage();
  }, []);

  const initials = session?.user?.name
    ? session.user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
    : "U";

  return (
    <Avatar className="w-12 h-12">
      {userImageSrc ? (
        <AvatarImage src={userImageSrc} alt="User Avatar" />
      ) : (
        <AvatarFallback>{initials}</AvatarFallback>
      )}
    </Avatar>
  );
};

export default AvatarNavigations;
