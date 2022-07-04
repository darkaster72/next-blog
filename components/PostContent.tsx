import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Post } from "./PostFeed";

type PostContentType = { post: Post };

const PostContent = ({ post }: PostContentType) => {
  const createdAt =
    typeof post.createdAt == "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="card card-bordered px-6 py-4">
      <h1 className="text-4xl">{post.title}</h1>
      <span className="text-sm my-4">
        Written by {""}
        <Link href={`/${post.username}`}>
          <a className="text-info">@{post.username}</a>
        </Link>{" "}
        on {createdAt.toDateString()}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
};

export default PostContent;
