import React from 'react';

const SingleGroupPage = ({ groupName, members, meetingTime, meetingLocation, courseName }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{groupName}</h1>
        <p className="text-gray-600 mb-2"><strong>Course:</strong> {courseName}</p>
        <p className="text-gray-600 mb-2"><strong>Meeting Time:</strong> {meetingTime}</p>
        <p className="text-gray-600 mb-4"><strong>Meeting Location:</strong> {meetingLocation}</p>

        <h2 className="text-xl font-semibold text-gray-700 mb-2">Members</h2>
        <ul className="list-disc list-inside text-gray-600">
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleGroupPage;