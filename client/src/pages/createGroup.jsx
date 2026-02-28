import { useMemo, useState } from "react";
import Navbar from "../components/navbar.jsx";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CreateGroup() {
  const [formData, setFormData] = useState({
    groupName: "",
    meetingDays: [],
    startTime: "",
    endTime: "",
    zoomLink: "",
    classes: "",
    goals: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const daySummary = useMemo(() => {
    if (formData.meetingDays.length === 0) return "";
    return formData.meetingDays.join(", ");
  }, [formData.meetingDays]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.meetingDays.includes(day);
      return {
        ...prev,
        meetingDays: exists
          ? prev.meetingDays.filter((d) => d !== day)
          : [...prev.meetingDays, day],
      };
    });
  };

  const validate = () => {
    if (!formData.groupName.trim()) return "Group name is required.";
    if (formData.meetingDays.length === 0) return "Pick at least one meeting day.";
    if (!formData.startTime || !formData.endTime) return "Meeting start and end time are required.";
    if (formData.startTime >= formData.endTime) return "Meeting end time must be after start time.";
    if (!formData.classes.trim()) return "Classes field is required.";
    if (!formData.goals.trim()) return "Goals field is required.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextError = validate();
    setError(nextError);
    if (nextError) return;

    const payload = {
      groupName: formData.groupName.trim(),
      meetingDays: [...formData.meetingDays],
      startTime: formData.startTime,
      endTime: formData.endTime,
      zoomLink: formData.zoomLink.trim(),
      classes: formData.classes.trim(),
      goals: formData.goals.trim(),
    };

    setSubmitted(payload);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header-section">
        <Navbar />
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Study Group</h1>
          <p className="text-gray-600 mb-8">Set up a new group with your preferred meeting details.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                id="groupName"
                name="groupName"
                type="text"
                value={formData.groupName}
                onChange={handleChange}
                placeholder="Ex: CS 35L Midterm Prep"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Meeting Day(s)</span>
              <div className="flex flex-wrap gap-3">
                {WEEK_DAYS.map((day) => {
                  const checked = formData.meetingDays.includes(day);
                  return (
                    <label
                      key={day}
                      className={`px-3 py-2 border rounded-md text-sm cursor-pointer select-none ${
                        checked
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleDayToggle(day)}
                        className="mr-2"
                      />
                      {day}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="zoomLink" className="block text-sm font-medium text-gray-700 mb-2">
                Zoom Link (Optional)
              </label>
              <input
                id="zoomLink"
                name="zoomLink"
                type="url"
                value={formData.zoomLink}
                onChange={handleChange}
                placeholder="https://ucla.zoom.us/j/123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="classes" className="block text-sm font-medium text-gray-700 mb-2">
                Classes
              </label>
              <input
                id="classes"
                name="classes"
                type="text"
                value={formData.classes}
                onChange={handleChange}
                placeholder="Ex: CS 35L, MATH 33A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                Goals
              </label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Ex: Review lab material, solve practice problems, prep for midterm"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold cursor-pointer"
            >
              Save Group
            </button>
          </form>
        </section>

        {submitted && (
          <section className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Group details recorded</h2>
            <p className="text-sm text-green-700 mb-2">Name: {submitted.groupName}</p>
            <p className="text-sm text-green-700 mb-2">
              Meeting: {daySummary} • {submitted.startTime} - {submitted.endTime}
            </p>
            <p className="text-sm text-green-700 mb-2">Classes: {submitted.classes}</p>
            <p className="text-sm text-green-700 mb-2">Goals: {submitted.goals}</p>
            {submitted.zoomLink && <p className="text-sm text-green-700">Zoom: {submitted.zoomLink}</p>}
          </section>
        )}
      </main>
    </div>
  );
}