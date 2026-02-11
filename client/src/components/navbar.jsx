import './navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = ({ onToggleLogin }) => {
    return (
        <nav className="nav-bar">
            <div className="brand-title">StudyScheduler</div>
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>My Profile & Schedule</NavLink>
                <NavLink to="/groups" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Find Groups</NavLink>
                <button type="button" className="user-toggle" onClick={onToggleLogin}>
                    <span className="user-name">[User Name]</span>
                    <div className="user-icon"></div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
