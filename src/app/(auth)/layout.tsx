import React from "react";

interface AuthProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthProps) => {
  return <div className='bg-background text-foreground p-10 rounded-md'>{children}</div>;
};

export default AuthLayout;
