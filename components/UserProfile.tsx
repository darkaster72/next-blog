import Image from "next/image";
import { AppUser } from "../lib/context";

export default function UserProfile({ user }: { user: AppUser }) {
  return (
    <div className="flex flex-col gap-4 justify-center place-items-center">
      <Image
        src={user.photoURL ?? ""}
        alt="user Photo"
        className="avatar rounded-full h-32 w-32"
      />
      <p>@{user.username}</p>
      <h1 className="text-4xl">{user.displayName}</h1>
    </div>
  );
}
