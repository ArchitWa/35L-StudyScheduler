import React from 'react';
import useEffect from 'react';
import { useParams } from 'react-router';

const SingleGroupPage = () => {
  const { id } = useParams();

  // Mock data for demonstration purposes
  const groupData = {
    members: ['Alice', 'Bob', 'Charlie'],
    meetingTime: 'Monday 10:00 AM',
    meetingLocation: 'Room 101',
    courseName: 'Math 101',
  };

  const handleDeleteGroup = () => {
    // Placeholder for delete logic
    

    alert(`Group with ID ${id} has been deleted.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{groupName}</h1>
        <p className="text-gray-600 mb-2"><strong>Course:</strong> {groupData.courseName}</p>
        <p className="text-gray-600 mb-2"><strong>Meeting Time:</strong> {groupData.meetingTime}</p>
        <p className="text-gray-600 mb-4"><strong>Meeting Location:</strong> {groupData.meetingLocation}</p>

        <h2 className="text-xl font-semibold text-gray-700 mb-2">Members</h2>
        <ul className="list-disc list-inside text-gray-600">
          {groupData.members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>

        <button
          onClick={handleDeleteGroup}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete Group
        </button>
      </div>
    </div>
  );
};

export default SingleGroupPage;