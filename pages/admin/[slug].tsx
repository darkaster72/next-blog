import {
  doc,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import AuthCheck from "../../components/AuthCheck";
import { Loader } from "../../components/Loader";
import { Post } from "../../components/PostFeed";
import { auth, db } from "../../lib/firebase";

const EditPostPage: NextPage = () => {
  return (
    <div className="container px-6 py-4">
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    </div>
  );
};

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;
  const postRef = doc(
    db,
    "users",
    auth.currentUser!.uid,
    "posts",
    slug as string
  );
  const [post] = useDocumentDataOnce<Post>(postRef as any);

  return (
    <main>
      {post ? (
        <div className="flex flex-row">
          <section className="flex-1 flex gap-4 flex-col">
            <h1 className="text-5xl font-bold">{post.title}</h1>
            <p>Slug: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside className="flex flex-col gap-2 card card-bordered p-4">
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)} className="btn">
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${slug}`}>
              <button className="btn">Live View</button>
            </Link>
          </aside>
        </div>
      ) : (
        <Loader show />
      )}
    </main>
  );
}
type PostFormProps = {
  postRef: DocumentReference<DocumentData>;
  defaultValues: Post;
  preview: boolean;
};

function PostForm({ postRef, defaultValues, preview }: PostFormProps) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost: SubmitHandler<Post> = async ({ content, published }) => {
    const data: Partial<Post> = {
      content,
      published,
      updatedAt: serverTimestamp() as any,
    };

    await updateDoc(postRef, data);
    reset({ content, published });
    toast.success("Post Updated! Successfully");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview ? (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            {...register("content")}
            cols={30}
            rows={10}
            className="input input-bordered"
          ></textarea>
          <fieldset className="input-group gap-2 mb-4">
            <input {...register("published")} type="checkbox" />
            <label>Published</label>
          </fieldset>
          <button className="btn btn-success">Update Post</button>
        </div>
      )}
    </form>
  );
}

export default EditPostPage;
