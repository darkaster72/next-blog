import type { NextPage } from "next";
import AuthCheck from "../../components/AuthCheck";

const AdminPostsPage: NextPage = () => {
  return (
    <main className="container px-6 py-4">
      <AuthCheck></AuthCheck>
    </main>
  );
};

export default AdminPostsPage;
