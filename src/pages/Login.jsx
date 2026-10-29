
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(form);
      const data = response.data;

      if (!data.token || !data.role) {
        throw new Error("Login response is missing token or role.");
      }

      login(data);

      if (data.role === "ADMIN") {
        navigate("/admin");
      } else if (data.role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/resources");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>ScholarSphere</h1>
        <p>Sign in to your digital library</p>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          New user? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
