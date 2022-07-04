import {
  collectionGroup,
  doc,
  DocumentData,
  getDoc,
  getDocs,
} from "firebase/firestore";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { jsonToPost } from ".";
import PostContent from "../../components/PostContent";
import { Post } from "../../components/PostFeed";
import { db, getUserWithUsername } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import path from "path";

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const { slug, username } = params;
  const userDoc = await getUserWithUsername(username as string);
  let path;
  let post;

  if (userDoc) {
    const postRef = doc(userDoc.ref, "posts", slug as string);
    post = jsonToPost((await getDoc(postRef)).data() as DocumentData);
    path = postRef.path;
  } else {
    return {
      notFound: true,
    };
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

const PostPage: NextPage<{ post: Post; path: string }> = (props) => {
  const postRef = doc(db, props.path);
  const [realtimePost] = useDocumentData(postRef);
  const post: Post = (realtimePost as Post) || props.post;

  return (
    <main className="container flex gap-4 px-6 py-4">
      <section className="flex-1">
        <PostContent post={post}></PostContent>
      </section>
      <aside className="card card-bordered flex">
        <p className="p-4">
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
      </aside>
    </main>
  );
};

export default PostPage;
