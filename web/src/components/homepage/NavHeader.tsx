import { cookies } from "next/headers";
import NavHeaderClient from "./NavHeaderClient";

export default async function NavHeader() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const hasAuthCookie = Boolean(accessToken || refreshToken);

  return <NavHeaderClient hasToken={hasAuthCookie} />;
}