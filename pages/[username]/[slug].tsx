import {
  collection,
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { jsonToPost } from ".";
import { Post } from "../../components/PostFeed";
import { db, getUserWithUsername } from "../../lib/firebase";

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const { slug, username } = params;
  const userDoc = await getUserWithUsername(username as string);
  let path;
  let post;

  if (userDoc) {
    const postRef = doc(userDoc.ref, "posts", slug as string);
    post = jsonToPost((await getDoc(postRef)).data() as DocumentData);
    path = postRef.path;
  }

  return { props: { post, path }, revalidate: 5000 };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postsRef = collectionGroup(db, "posts");

  const paths = (await getDocs(postsRef)).docs.map((doc) => {
    const { username, slug } = doc.data();
    return { params: { username, slug } };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

const PostPage: NextPage<{ post: Post; path: string }> = ({ post, path }) => {
  return (
    <div className="container px-6 py-4">
      <h1 className="text-4xl">{post.title}</h1>
    </div>
  );
};

export default PostPage;
