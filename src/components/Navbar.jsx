
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        ScholarSphere
      </Link>

      <div className="nav-links">
        {user?.role === "USER" && (
          <Link to="/resources">Library</Link>
        )}

        {user?.role === "MANAGER" && (
          <Link to="/manager">Manager Dashboard</Link>
        )}

        {user?.role === "ADMIN" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {user ? (
          <>
            <span>{user.username} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
