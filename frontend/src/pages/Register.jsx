import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event) {
    event.preventDefault();


    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password }
      );

      navigate("/login", {
        state: {
          message: "Registration successful! Please log in.",
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Could not connect to the server"
      );
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold text-indigo-700">
          College Study Hub
        </h1>

        <h2 className="mb-6 mt-3 text-center text-lg">
          Create your account
        </h2>

    
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block">
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white disabled:opacity-50"
          >
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;