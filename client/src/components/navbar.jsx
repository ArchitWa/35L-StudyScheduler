import { NavLink } from 'react-router-dom';

const Navbar = ({ onToggleLogin }) => {
    return (
        <nav className="flex items-center justify-between px-[40px] py-[20px]">
            <div className="text-[1.25rem] font-semibold">StudyScheduler</div>
            <div className="flex items-center gap-[30px]">
                <NavLink to="/" className={({ isActive }) => isActive ? "border-b-2 border-white pb-[4px] text-[0.9rem] text-white" : "flex items-center gap-[30px]"}>Home</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "border-b-2 border-white pb-[4px] text-[0.9rem] text-white" : "flex items-center gap-[30px]"}>My Profile & Schedule</NavLink>
                <NavLink to="/groups" className={({ isActive }) => isActive ? "border-b-2 border-white pb-[4px] text-[0.9rem] text-white" : "flex items-center gap-[30px]"}>Find Groups</NavLink>
                <button type="button" className="user-toggle" onClick={onToggleLogin}>
                    <span className="!text-white font-medium user-name">[User Name]</span>
                    <div className="user-icon"></div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
