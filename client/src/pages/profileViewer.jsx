import Navbar from "../components/navbar.jsx";
import { Link } from "react-router-dom";
import { placeholderClasses, placeholderGroups, placeholderSchedules } from "./placeholders.jsx";

// --- BEGIN PLACEHOLDER ---

function getClassById(id) {
    return placeholderClasses.find(c => c.id === id);
}

function getGroupById(id) {
    return placeholderGroups.find(g => g.id === id);
}

function getSchedulesForGroup(groupId) {
    return placeholderSchedules.filter(s => s.group_id === groupId);
}
// --- END PLACEHOLDER ---


const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getScheduleString(s) {
    const formatTime = (timeStr) => {
        const [hour, minute] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(parseInt(hour), parseInt(minute));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const day = DAYS_OF_WEEK[s.day];
    return `${day} ${formatTime(s.start_time)}-${formatTime(s.end_time)}`;
}

function StudyGroupComponent({ group }) {
    const schedules = getSchedulesForGroup(group.id);
    const scheduleStr = schedules.map(getScheduleString).join(", ");

    return (
        <li key={group.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
                <p className="font-medium text-gray-800">{group.title}</p>
                <p className="text-sm text-gray-500">{scheduleStr}</p>
            </div>
            <button className=" bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm  text-indigo-700 rounded font-medium">View</button>
        </li>
    );
}

export default function ProfileViewer() {
    const user = {
        name: "John Smith",
        major: "Computer Science",
        year: "Sophomore",
        phone: "(555) 123-4567",
        email: "jordan@example.com",
        bio: "Passionate about collaborative studying, algorithms, and building helpful tools for classmates.",
        classIds: [1, 2, 3],
        groupIds: [
            1,
            2,
            3
        ]
    };

    const userGroups = user.groupIds.map(getGroupById);
    const userClasses = user.classIds.map(getClassById);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar onToggleLogin={true} />
            </header>

            <main className="max-w-4xl mx-auto p-6">
                <section className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-6">

                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        {user.major} • {user.year}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.location}</p>
                                </div>

                                <Link to="/profile_edit" className="px-4 py-2 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700! rounded">
                                    Edit Profile
                                </Link>
                            </div>

                            <p className="mt-4 text-gray-700">{user.bio}</p>

                            <div className="mt-4">
                                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                                    <div className="font-medium text-gray-800">Contact</div>
                                    <div className="mt-2">Email: <span className="font-medium text-gray-800">{user.email}</span></div>
                                    <div>Phone: <span className="font-medium text-gray-800">{user.phone}</span></div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="font-bold text-gray-800">Classes</div>
                                <div className="mt-2">
                                    {userClasses.map(c => (
                                        <span key={c.id} className="inline-block mr-2 mb-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                            {c.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-medium text-gray-800">Study Groups</h3>
                        <p className="text-sm text-gray-500 mt-1">Groups this user is participating in.</p>

                        <ul className="mt-4 space-y-3">
                            {
                                userGroups.map((g) => g ?
                                    <StudyGroupComponent key={g.id} group={g} /> : null)}
                        </ul>
                    </div>

                    {/* Contact moved to top panel to keep groups list full-height */}
                    <div />
                </section>
            </main>
        </div>
    );
}