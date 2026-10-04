import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        setUser(response.data.user);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        if (error.response?.status === 401) {
          sessionStorage.removeItem("token");

          navigate("/login", {
            replace: true,
            state: {
              message: "Please log in again.",
            },
          });
        } else {
          setError(
            error.response?.data?.message ||
              "Could not connect to the server"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => controller.abort();
  }, [navigate]);

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  if (loading) {
    return (
      <p className="p-10 text-center">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-5">
          <h1 className="text-xl font-bold text-indigo-700">
            College Study Hub
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {user.name}!
          </h2>

          <p className="mt-2 text-slate-600">
            {user.email}
          </p>

          <p className="mt-4 text-slate-600">
            Find study materials and manage your assignments.
          </p>
        </section>

        <nav
          aria-label="Dashboard"
          className="mt-6 grid gap-5 sm:grid-cols-2"
        >
          <Link
            to="/materials"
            className="rounded-xl bg-white p-6 shadow hover:bg-indigo-50"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              Study Materials
            </h3>

            <p className="mt-2 text-slate-600">
              Search subject notes and download PDFs.
            </p>
          </Link>

          <Link
            to="/materials/upload"
            className="rounded-xl bg-white p-6 shadow hover:bg-indigo-50"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              Upload Material
            </h3>

            <p className="mt-2 text-slate-600">
              Share a PDF with other students.
            </p>
          </Link>

          <Link
            to="/my-uploads"
            className="rounded-xl bg-white p-6 shadow hover:bg-indigo-50"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              My Uploads
            </h3>

            <p className="mt-2 text-slate-600">
              View, edit and delete your uploaded material.
            </p>
          </Link>

          <Link
            to="/assignments"
            className="rounded-xl bg-white p-6 shadow hover:bg-indigo-50"
          >
            <h3 className="text-lg font-semibold text-indigo-700">
              My Assignments
            </h3>

            <p className="mt-2 text-slate-600">
              Track your deadlines and completion status.
            </p>
          </Link>
        </nav>
      </div>
    </main>
  );
}

export default Dashboard;