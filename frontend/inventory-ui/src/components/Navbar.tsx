import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <nav className="bg-linear-to-r from-gray-50 to-white shadow-md">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        
        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-gray-800">
          Inventory Cost Optimization
        </h1>

        {/* Links */}
        <div className="flex gap-4">
          <Link to="/" className={linkStyle("/")}>
            Home
          </Link>
          <Link to="/predictor" className={linkStyle("/predictor")}>
            Prediction
          </Link>
        </div>
      </div>
    </nav>
  );
}