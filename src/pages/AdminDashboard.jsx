
import { useState } from "react";
import { createManager } from "../api/authService";

const initialForm = {
  username: "",
  email: "",
  password: "",
  category: "NOVELS",
};

export default function AdminDashboard() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createManager(form);
      setMessage("Manager account created successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not create manager. Verify your admin token and API."
      );
    }
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p>Create manager accounts and assign their content categories.</p>

      <form className="resource-form" onSubmit={handleSubmit}>
        <h2>Create Manager</h2>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Temporary Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Assigned Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="NEWSPAPERS">NEWSPAPERS</option>
          <option value="NOVELS">NOVELS</option>
          <option value="COMICS">COMICS</option>
        </select>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Create Manager</button>
      </form>
    </div>
  );
}
