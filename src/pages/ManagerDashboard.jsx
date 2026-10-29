import { useEffect, useState } from "react";
import {
  getAllContent,
  addContent,
  updateContent,
  deleteContent,
} from "../api/contentService";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  author: "",
  category: "",
  description: "",
  fileUrl: "",
};

export default function ManagerDashboard() {
  const authContext = useAuth();
  const user = authContext?.user || null;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const assignedCategory = user?.category || localStorage.getItem("category") || "";

  const loadItems = async () => {
    try {
      const response = await getAllContent();
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch {
      setError("Could not load resources.");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const targetCategory = assignedCategory || form.category;

    if (!targetCategory) {
      setError("Please specify or assign a category.");
      return;
    }

    if (!/^https?:\/\/\S+$/i.test(form.fileUrl)) {
      setError("Enter a valid HTTP or HTTPS resource URL.");
      return;
    }

    const payload = {
      title: form.title,
      author: form.author,
      description: form.description,
      fileUrl: form.fileUrl,
      category: targetCategory.toUpperCase(),
    };

    try {
      if (editingId !== null) {
        await updateContent(editingId, payload);
        setMessage("Resource updated successfully.");
      } else {
        await addContent(payload);
        setMessage("Resource added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Operation failed. Check your permissions and backend."
      );
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      author: item.author || "",
      category: item.category || assignedCategory,
      description: item.description || "",
      fileUrl: item.fileUrl || "",
    });
    setMessage("");
    setError("");
  };

  const removeItem = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    setMessage("");
    setError("");

    try {
      await deleteContent(id);
      setMessage("Resource deleted.");
      await loadItems();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Delete failed. Check your permissions."
      );
    }
  };

  return (
    <div className="page">
      <h1>Manager Dashboard</h1>
      <p>
        Assigned category:{" "}
        <strong>{assignedCategory || "Not assigned (manual input enabled)"}</strong>
      </p>

      <form className="resource-form" onSubmit={handleSubmit}>
        <h2>{editingId !== null ? "Edit Resource" : "Add Resource"}</h2>

        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Author</label>
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        {assignedCategory ? (
          <input value={assignedCategory} readOnly disabled />
        ) : (
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. NOVELS, NEWSPAPERS, COMICS"
            required
          />
        )}

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>PDF or Resource URL</label>
        <input
          type="url"
          name="fileUrl"
          placeholder="https://example.com/resource.pdf"
          value={form.fileUrl}
          onChange={handleChange}
          required
        />

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">
          {editingId !== null ? "Update Resource" : "Add Resource"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2>Manage Resources</h2>

      <div className="resource-grid">
        {items
          .filter(
            (item) =>
              !assignedCategory ||
              item.category?.toUpperCase() === assignedCategory.toUpperCase()
          )
          .map((item) => (
            <article className="resource-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>
                <strong>{item.category}</strong>
              </p>
              <p>{item.description}</p>

              <button onClick={() => startEdit(item)}>Edit</button>
              <button className="danger" onClick={() => removeItem(item.id)}>
                Delete
              </button>
            </article>
          ))}
      </div>
    </div>
  );
}