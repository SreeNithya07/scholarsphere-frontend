
import { useEffect, useState } from "react";
import {
  getAllContent,
  getContentByCategory,
  searchContent,
} from "../api/contentService";

const categories = ["NEWSPAPERS", "NOVELS", "COMICS"];

export default function Resources() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const loadResources = async () => {
    try {
      setError("");
      const response = category
        ? await getContentByCategory(category)
        : await getAllContent();

      setItems(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Unable to load resources. Check the backend.");
    }
  };

  useEffect(() => {
    loadResources();
  }, [category]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!title.trim()) {
        await loadResources();
        return;
      }

      const response = await searchContent(title.trim());
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Search failed. Please try again.");
    }
  };

  return (
    <div className="page">
      <h1>Digital Library</h1>
      <p>Explore newspapers, novels, and comics.</p>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Search</button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setTitle("");
            setCategory("");
            loadResources();
          }}
        >
          Show All
        </button>
      </form>

      <div className="filters">
        <button
          className={!category ? "active" : ""}
          onClick={() => setCategory("")}
        >
          All Categories
        </button>

        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="resource-grid">
        {items.map((item) => (
          <article className="resource-card" key={item.id}>
            <span className="category-tag">{item.category}</span>
            <h2>{item.title}</h2>
            <p>Author: {item.author || "Not specified"}</p>
            <p>{item.description}</p>

            {item.fileUrl && /^https?:\/\//i.test(item.fileUrl) ? (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Resource ↗
              </a>
            ) : (
              <p className="error">Resource link unavailable.</p>
            )}
          </article>
        ))}
      </div>

      {!error && items.length === 0 && (
        <p>No resources found.</p>
      )}
    </div>
  );
}
