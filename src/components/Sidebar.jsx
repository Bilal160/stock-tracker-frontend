import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Navigation</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/charts"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            Charts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            Alerts
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `block p-2 rounded transition-colors ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            API Stats
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
