import { useNavigate } from "react-router-dom";

import Avatar from "./Avatar";
import ClassPill from "./ClassPill";
import { formatTime, normalizeClasses } from "../lib/helpers";

export default function GroupCard({ group }) {
    const navigate = useNavigate();
    const classList = normalizeClasses(group?.classes);
    const users = Array.isArray(group?.users) ? group.users.filter(Boolean) : [];

    function handleCardClick() {
        if (!group?.id) return;
        navigate(`/groups/${group.id}`);
    }

    return (
        <div
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >

            {/* Title */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {group?.group_name || "Untitled Group"}
                </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
                {group?.goals || "No group goals listed."}
            </p>

            {/* Meeting Link */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Study Location
                </p>
                {group?.meet_spot ? (
                    <a
                        href={group.meet_spot}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
                    >
                        {group.meet_spot}
                    </a>
                ) : (
                    <p className="text-sm text-gray-500">None provided</p>
                )}
            </div>

            {/* Schedule */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Schedule
                </p>
                <p className="text-sm text-gray-700">
                    {group?.day_of_week || "TBD"} {formatTime(group?.time)}
                </p>
            </div>

            {/* Classes */}
            <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Classes
                </p>
                <div className="flex flex-wrap gap-2">
                    {classList.length > 0 ? (
                        classList.map((classItem) => (
                            <ClassPill key={classItem} value={classItem} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No classes listed</p>
                    )}
                </div>
            </div>

            {/* Members */}
            <div className="flex items-center">
                <div className="flex -space-x-2">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <Avatar
                                key={user.id || `${group?.id}-user-${index}`}
                                src={user.avatar_url}
                                alt={`${user?.name || "member"} avatar`}
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                            />
                        ))
                    ) : (
                        <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-200" />
                    )}
                </div>

                <span className="ml-3 text-sm text-gray-500">
                    {users.length} member{users.length !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
}