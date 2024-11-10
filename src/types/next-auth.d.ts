import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["admin"];
  }

  interface User {
    role: string;
  }

  declare module "next-auth/jwt" {
    interface JWT {
      role: string;
    }
  }
}
