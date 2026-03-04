import { useState } from "react";
import Navbar from "../components/navbar.jsx";

export default function ProfileEditor() {
    const initialUser = {
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

    const [formData, setFormData] = useState({
        name: initialUser.name,
        major: initialUser.major,
        year: initialUser.year,
        phone: initialUser.phone,
        bio: initialUser.bio,
        classes: initialUser.classIds
    });

    const [newClass, setNewClass] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setIsSaved(false);
    };

    const handleAddClass = () => {
        if (newClass.trim()) {
            setFormData(prev => ({
                ...prev,
                classes: [...prev.classes, newClass.trim()]
            }));
            setNewClass("");
            setIsSaved(false);
        }
    };

    const handleRemoveClass = (index) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.filter((_, i) => i !== index)
        }));
        setIsSaved(false);
    };

    const handleAddClassKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddClass();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Profile updated:", formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="header-section">
                <Navbar />
            </header>

            <main className="max-w-2xl mx-auto p-6">
                <section className="bg-white rounded-lg shadow-sm p-8">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Profile</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        {/* Major */}
                        <div>
                            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
                                Major
                            </label>
                            <input
                                type="text"
                                id="major"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your major"
                                required
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select your year</option>
                                <option value="Freshman">Freshman</option>
                                <option value="Sophomore">Sophomore</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        {/* Classes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Classes Taking
                            </label>
                            <div className="space-y-3">
                                {/* Add Class Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newClass}
                                        onChange={(e) => setNewClass(e.target.value)}
                                        onKeyPress={handleAddClassKeyPress}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter a class (e.g., CS 35L)"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddClass}
                                        className="bg-indigo-50 hover:bg-indigo-100 cursor-pointer px-3 py-1 text-sm  text-indigo-700 rounded font-medium"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Classes List */}
                                {formData.classes.length > 0 ? (
                                    <ul className="space-y-2">
                                        {formData.classes.map((classItem, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"
                                            >
                                                <span className="text-gray-800">{classItem}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveClass(index)}
                                                    className="bg-red-50 hover:bg-red-100 cursor-pointer px-3 py-1 text-sm  text-red-700 rounded font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No classes added yet</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button and Success Message */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-indigo-800 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                            >
                                Save Changes
                            </button>
                            {isSaved && (
                                <span className="text-green-600 font-medium">✓ Profile updated successfully!</span>
                            )}
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}