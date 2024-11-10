"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/sign-in",
    });
  };
  return (
    <div onClick={handleClick}>
      <Button>Cerrar sesión</Button>;
    </div>
  );
};

export default LogoutButton;
