import ClassPill from './ClassPill.jsx';

function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(parseInt(hour), parseInt(minute));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getScheduleString(scheduleItem) {
    return `${scheduleItem.day} ${formatTime(scheduleItem.start_time)}`;
}

const GroupCard = ({ group }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            {/* Title + View Button */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
                <button className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm  text-indigo-700 rounded font-medium">
                    View Group
                </button>
            </div>

            {/* Description (goals of group) */}
            <p className="text-sm text-gray-600 mb-4">{group.description}</p>

            {/* Zoom Link */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Meeting Link</p>
                <a
                    href={group.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-700 break-all"
                >
                    {group.meeting_link}
                </a>
            </div>

            {/* When the group meets */}
            <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Schedule</p>
                <div className="space-y-1">
                    {group.schedule_ids && group.schedule_ids.length > 0 ? (
                        group.schedule_ids.map((schedule, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                                {getScheduleString(schedule)}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No schedule available</p>
                    )}
                </div>
            </div>

            {/* Class Tags */}
            <div className="mb-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Classes</p>
                <div className="flex flex-wrap gap-2">
                    {group.class_ids && group.class_ids.length > 0 ? (
                        group.class_ids.map((className, idx) => (
                            <ClassPill key={idx} value={className} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No classes listed</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupCard;
