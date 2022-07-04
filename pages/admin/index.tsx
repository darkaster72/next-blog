import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import kebabcase from "lodash.kebabcase";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import PostFeed, { Post } from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, db } from "../../lib/firebase";

const AdminPostsPage: NextPage = () => {
  return (
    <main className="container px-6 py-4">
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
};

function PostList() {
  const adminUserDoc = doc(collection(db, "users"), auth.currentUser?.uid);
  const postsRef = collection(adminUserDoc, "posts");
  const q = query(postsRef, orderBy("createdAt"));
  const [posts] = useCollectionData<Post>(q as any);

  return (
    <div>
      <h1 className="text-3xl mb-4">Manage your Posts</h1>
      {posts && <PostFeed posts={posts} admin></PostFeed>}
    </div>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabcase(title));
  const isValid = slug.length > 3 && slug.length < 100;

  const createPost = async (e: any) => {
    e.preventDefault();

    const userId = auth.currentUser!.uid;
    const postRef = doc(db, "users", userId, "posts", slug);
    const data: Post = {
      title,
      slug,
      uid: userId,
      username: username as string,
      published: false,
      content: "#Hello World",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };
    await setDoc(postRef, data);
    toast.success("Created Post!");
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        className="input mt-8 mb-4 input-bordered w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your title"
      />
      <p className="mb-2">
        <strong>Slug: </strong>
        {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn btn-success">
        Create Post
      </button>
    </form>
  );
}

export default AdminPostsPage;
