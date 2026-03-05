import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <a href="/" className="navbar-brand">
                <svg viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#2563eb" />
                    <path d="M8 22L14 10L18 18L24 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 16L12 14L16 20L24 12" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                RoadNet.AI
            </a>

            <ul className="navbar-links">
                <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
                <li><NavLink to="/map">Map View</NavLink></li>
                <li><NavLink to="/tickets">Tickets</NavLink></li>
                <li><NavLink to="/analytics">Analytics</NavLink></li>
                <li><NavLink to="/departments">Departments</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
            </ul>

            <div className="navbar-right">
                <button className="navbar-bell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                </button>
                <div className="navbar-user">
                    <div className="navbar-user-info">
                        <div className="navbar-user-name">Admin User</div>
                        <div className="navbar-user-dept">Dept. of Transit</div>
                    </div>
                    <div className="navbar-avatar">A</div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
