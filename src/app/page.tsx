import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect("/auth/sign-in");
}
