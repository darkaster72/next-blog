import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Loader } from "../components/Loader";
import PostFeed, { Post } from "../components/PostFeed";
import { db, fromMillis } from "../lib/firebase";
import { jsonToPost } from "./[username]";

const LIMIT = 10;

export const getServerSideProps: GetServerSideProps = async () => {
  const postRef = collectionGroup(db, "posts");
  const postQuery = query(
    postRef,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  const posts = (await getDocs(postQuery)).docs.map((doc) =>
    jsonToPost(doc.data())
  );
  return { props: { posts } };
};

const Home: NextPage<{ posts: Post[] }> = (props) => {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postEnd, setPostEnd] = useState(posts.length == 0);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const postRef = collectionGroup(db, "posts");

    const cursor =
      typeof last?.createdAt == "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const postQuery = query(
      postRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );
    const newPosts = (await getDocs(postQuery)).docs.map((doc) =>
      jsonToPost(doc.data())
    );
    setPosts(posts.concat(newPosts));
    setLoading(false);
  };

  return (
    <div className="container px-6 py-4">
      <Head>
        <title>Next Blog App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostFeed posts={posts} />
      {!loading && !postEnd && (
        <button className="btn mt-4" onClick={getMorePosts}>
          Load More
        </button>
      )}
      <Loader show={loading} />
    </div>
  );
};

export default Home;
