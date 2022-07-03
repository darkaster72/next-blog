import { createContext } from "react";

export const UserContext = createContext<{
  user: User | null | undefined;
  username: string | null;
}>({ user: null, username: null });

export interface User {
  photoURL: string;
  username: string;
  displayName: string;
}
