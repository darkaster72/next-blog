import { FieldValue, Timestamp } from "firebase/firestore";
import Link from "next/link";

export interface Post {
  uid: string;
  username: string;
  slug: string;
  content: string;
  published: boolean;
  heartCount: number;
  title: string;
  createdAt: number | Timestamp;
  updatedAt: number | Timestamp;
}

type PostFeedType = {
  posts: Post[];
  admin?: boolean;
};

export default function PostFeed({ posts, admin = false }: PostFeedType) {
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </div>
  );
}

function PostItem({ post, admin = false }: { post: Post; admin: boolean }) {
  const wordCount = post.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card shadow-xl bg-base-100 card-compact card-bordered">
      <div className="card-body">
        <Link href={`/${post.username}`}>
          <a>
            <strong>By @{post.username}</strong>
          </a>
        </Link>
        <Link
          href={
            admin ? `/admin/${post.slug}` : `/${post.username}/${post.slug}`
          }
        >
          <a className="card-title">{post.title}</a>
        </Link>
        <footer className="card-actions">
          <span>
            {wordCount} words. {minutesToRead} min read
          </span>
          <span>❤️ {post.heartCount}</span>
        </footer>
      </div>
    </div>
  );
}
