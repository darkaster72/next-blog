import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query as firebaseQuery,
  where,
} from "firebase/firestore";
import type { GetServerSideProps, NextPage } from "next";
import PostFeed, { Post } from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { User } from "../../lib/context";
import { getUserWithUsername } from "../../lib/firebase";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query;
  const userDoc = await getUserWithUsername(username as string);
  let user;
  let posts;

  if (userDoc) {
    user = userDoc.data();
    const postQuery = firebaseQuery(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(postQuery)).docs.map((doc) =>
      jsonToPost(doc.data())
    );
  }

  return { props: { user, posts } };
};

const UserPage: NextPage<{ user: User; posts: Post[] }> = ({ user, posts }) => {
  return (
    <div className="container px-6 py-4">
      {user && <UserProfile user={user} />}
      <PostFeed posts={posts} />
    </div>
  );
};

export function jsonToPost(post: DocumentData): Post {
  return {
    ...post,
    createdAt: post.createdAt?.toMillis(),
    updatedAt: post.updatedAt?.toMillis(),
  } as Post;
}

export default UserPage;
