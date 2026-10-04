import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );

      sessionStorage.setItem("token", response.data.token);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not connect to the server"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold text-indigo-700">
          College Study Hub
        </h1>

        <h2 className="mb-6 mt-3 text-center text-lg">
          Login to your account
        </h2>

        {location.state?.message && (
          <p
            role="status"
            className="mb-4 rounded bg-green-50 p-3 text-green-700"
          >
            {location.state.message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-50 p-3 text-red-700"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          New student?{" "}
          <Link to="/register" className="text-indigo-700">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;