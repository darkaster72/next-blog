import Link from "next/link";

export function Navbar() {
  const user = null;
  const username = null;

  return (
    <nav className="navbar bg-base-100 px-8">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Feed</a>
      </div>
      <div className="flex-none">
        {username && (
          <>
            <div className="dropdown dropdown-end">
              <Link href="/admin">
                <a className="btn btn-ghost normal-case">Write Posts</a>
              </Link>
            </div>
            <div className="dropdown dropdown-end">
              <Link href={`/${username}`}>
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="" />
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
