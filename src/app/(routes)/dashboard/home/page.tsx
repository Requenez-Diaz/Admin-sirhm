import React from "react";
import { auth } from "../../../../../auth";
import LogoutButton from "@/app/(auth)/components/logout-button";

export default async function Page() {
  const session = await auth();

  console.log(session);

  // if (!session) {
  //   return <div>Not authenticated</div>;
  // }

  if (session?.user.role !== "admin") {
    return <div>Yout not admin</div>;
  }
  return (
    <div>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

      <pre>{JSON.stringify(session, null, 2)}</pre>
      <LogoutButton />
    </div>
  );
}
