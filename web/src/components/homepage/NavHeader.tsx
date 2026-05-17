import { cookies } from "next/headers";
import NavHeaderClient from "./NavHeaderClient";

const TOKEN_COOKIE_NAME = "accessToken";

export default async function NavHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

  return <NavHeaderClient hasToken={Boolean(token)} />;
}
