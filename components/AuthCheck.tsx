import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

type AppProps = {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function AuthCheck(props: AppProps) {
  const { user } = useContext(UserContext);

  return (
    <>
      {user
        ? props.children
        : props.fallback || (
            <Link href="/enter">
              <button className="btn ">You must sign in</button>
            </Link>
          )}
    </>
  );
}
