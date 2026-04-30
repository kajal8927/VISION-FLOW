import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950">
      <Link to="/" className="text-xl font-bold text-cyan-300">
        VisionFlow
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-slate-300">
              {user?.name || "User"}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300"
            >
              Logout
            </button>
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
};

export default Navbar;