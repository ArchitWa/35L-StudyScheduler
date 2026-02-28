import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const on_style = "flex items-center gap-[30px] border-b-2 border-white pb-[4px] text-[0.9rem] !text-white";
    const off_style = "flex items-center gap-[30px] !text-white";

    return (
        <nav className="flex items-center justify-between px-10 py-5 bg-blue-500">
            <div className="text-[1.25rem] font-semibold">StudyScheduler</div>
            <div className="flex items-center gap-7.5">
                <NavLink to="/" className={({ isActive }) => isActive ? on_style : off_style}>Home</NavLink>
                {isLoggedIn && (
                    <>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? on_style : off_style}>My Profile & Schedule</NavLink>
                        <NavLink to="/groups" className={({ isActive }) => isActive ? on_style : off_style}>Find Groups</NavLink>
                    </>
                )}
            </div>
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <button
                            type="button"
                            onClick={logout}
                            className="!bg-transparent border border-white text-white text-[0.9rem] font-semibold px-4 py-2 rounded cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            Log&nbsp;out
                        </button>
                        <span className="text-white font-medium user-name">{user?.email || '[User]'}</span>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => isActive ? on_style : off_style}>Log In</NavLink>
                        <NavLink to="/signup" className={({ isActive }) => isActive ? on_style : off_style}>Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
