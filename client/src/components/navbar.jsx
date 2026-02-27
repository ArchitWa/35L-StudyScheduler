import { NavLink } from 'react-router-dom';

const Navbar = ({ onToggleLogin }) => {
    const on_style = "flex items-center gap-[30px] border-b-2 border-white pb-[4px] text-[0.9rem] !text-white";
    const off_style = "flex items-center gap-[30px] !text-white";

    return (
        <nav className="flex items-center justify-between px-10 py-5 bg-blue-500">
            <div className="text-[1.25rem] font-semibold">StudyScheduler</div>
            <div className="flex items-center gap-7.5">
                <NavLink to="/" className={({ isActive }) => isActive ? on_style : off_style}>Home</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? on_style : off_style}>My Profile & Schedule</NavLink>
                <NavLink to="/groups" className={({ isActive }) => isActive ? on_style : off_style}>Find Groups</NavLink>
                <span className="text-white! font-medium user-name">[User Name]</span>
            </div>
        </nav>
    );
};

export default Navbar;
