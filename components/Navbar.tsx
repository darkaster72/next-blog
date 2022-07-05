import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar bg-base-100 px-8">
      <div className="flex-1">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">Feed</a>
        </Link>
      </div>
      <div className="flex-none">
        {username && (
          <>
            <div className="dropdown dropdown-end">
              <Link href="/admin">
                <a className="btn btn-outline normal-case mr-2">Write Posts</a>
              </Link>
            </div>
            <div className="dropdown dropdown-end">
              <Link href={`/${username}`}>
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <Image src={user?.photoURL ?? ""} />
                  </div>
                </label>
              </Link>
            </div>
          </>
        )}
        {!username && (
          <div className="dropdown dropdown-end">
            <Link href="/enter">
              <a className="btn btn-primary normal-case">Login</a>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
