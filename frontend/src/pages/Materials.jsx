import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Materials() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
        state: { message: "Please log in to upload study material." },
      });
      return;
    }

    if (!pdf) {
      setError("Please select a PDF to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("unit", unit);
    formData.append("pdf", pdf);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/material",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || "Material uploaded successfully.");
      setTitle("");
      setSubject("");
      setUnit("");
      setPdf(null);
      event.target.reset();
    } catch (error) {
      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        navigate("/login", {
          replace: true,
          state: { message: "Please log in again to upload material." },
        });
        return;
      }

      setError(
        error.response?.data?.message || "Could not upload material."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="w-full max-w-xl rounded-xl bg-white p-8 shadow">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          Upload Study Material
        </h1>
        <p className="mb-6 mt-2 text-slate-600">
          Add the material details and select a PDF to share with students.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-green-50 p-3 text-green-700"
          >
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="material-title"
              className="mb-1 block font-medium text-slate-700"
            >
              Title
            </label>
            <input
              id="material-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              placeholder="e.g. Introduction to Algorithms"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="material-subject"
              className="mb-1 block font-medium text-slate-700"
            >
              Subject
            </label>
            <input
              id="material-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={100}
              placeholder="e.g. Computer Science"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="material-unit"
              className="mb-1 block font-medium text-slate-700"
            >
              Unit
            </label>
            <input
              id="material-unit"
              type="number"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              min="1"
              max="5"
              step="1"
              placeholder="1–5"
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="material-pdf"
              className="mb-1 block font-medium text-slate-700"
            >
              PDF file
            </label>
            <input
              id="material-pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) =>
                setPdf(event.target.files?.[0] || null)
              }
              required
              className="w-full rounded-lg border border-slate-300 p-3 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-medium file:text-indigo-700"
            />
            <p className="mt-1 text-sm text-slate-500">
              PDF only, up to 5 MB.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Material"}
          </button>
        </form>
      </section>
    </main>
    
  );
}

export default Materials;