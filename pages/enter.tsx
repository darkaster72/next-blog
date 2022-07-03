import { doc, getDoc, writeBatch } from "firebase/firestore";
import type { NextPage } from "next";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, db, signInWithGoogle } from "../lib/firebase";
import debounce from "lodash.debounce";

const Enter: NextPage = () => {
  const { user, username } = useContext(UserContext);

  return (
    <div className="container px-6 py-4">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const { user, username } = useContext(UserContext);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const userDoc = doc(db, `users/${user?.uid}`);
    const usernameDoc = doc(db, `usernames/${formValue}`);

    const batch = writeBatch(db);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user?.photoURL,
      displayName: user?.displayName,
    });
    batch.set(usernameDoc, { uid: user?.uid });
    await batch.commit();
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length > 3) {
        const user = await getDoc(doc(db, `usernames/${username}`));
        setValid(!user.exists());
        console.log("Firebase called to fetch user by name", user);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onChange = (e: any) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setValid(false);
    }
  };

  return !username ? (
    <section>
      <form onSubmit={onSubmit} className="flex flex-col">
        <input
          name="username"
          placeholder="Enter your username"
          value={formValue}
          onChange={onChange}
          className="input input-bordered w-full max-w-xs"
        />
        <UsernameMessage
          loading={loading}
          username={formValue}
          valid={valid}
        ></UsernameMessage>
        <button
          type="submit"
          className="btn btn-success w-full max-w-xs mt-2"
          disabled={!valid}
        >
          Choose
        </button>
        <h3 className="mt-4">Debug State</h3>
        <div className="flex flex-col">
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username valid: {valid.toString()}
        </div>
      </form>
    </section>
  ) : null;
}

const UsernameMessage = ({
  username,
  valid,
  loading,
}: {
  username: string | undefined | null;
  valid: boolean;
  loading: boolean;
}) => {
  if (loading) return <p>Checking</p>;
  else if (valid) return <p className="text-success">{username} is valid</p>;
  else if (username && !valid)
    return <p className="text-error">{username} is taken</p>;
  else return <p></p>;
};

const SignOutButton = () => (
  <button
    className="btn"
    onClick={async () => {
      await auth.signOut();
    }}
  >
    SignOut
  </button>
);

function SignInButton() {
  const signIn = async () => {
    await signInWithGoogle();
  };
  return (
    <button className="btn bg-white text-gray-700" onClick={signIn}>
      Sign In With Google
    </button>
  );
}

export default Enter;
