export function formatTime(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return "TBD";
    const [hour, minute] = timeStr.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) return timeStr;

    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function normalizeClasses(classes) {
    if (!classes) return [];
    if (Array.isArray(classes)) return classes;

    if (typeof classes === "string") {
        try {
            const parsed = JSON.parse(classes);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            return classes.split(",").map(v => v.trim()).filter(Boolean);
        }
    }

    return [];
}

