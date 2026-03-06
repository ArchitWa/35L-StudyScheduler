import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { fetchGroupDetails } from '../lib/api';
import Navbar from '../components/navbar';
import { ClassPill } from '../components';
import { normalizeClasses } from '../lib/helpers';

const SingleGroupPage = () => {
  const { id } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [error, setError] = useState(null);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const getGroupDetails = async () => {
      try {
        const data = await fetchGroupDetails(id);
        setGroupData(data.group);
        console.log(data)
        setClassList(normalizeClasses(data.classes));
        console.log(classList)
      } catch (err) {
        setError(err.message);
      }
    };

    getGroupDetails();
  }, [id]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!groupData) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center py-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">

          <h1 className="text-2xl font-bold text-gray-800 mb-4">{groupData.group_name}</h1>
          
          <div className="flex flex-wrap gap-2">
              {classList.map((classItem) => (
                  <ClassPill key={classItem} value={classItem} />
              ))}
          </div>  
          <p className="text-gray-600 mb-2"><strong>Course:</strong> {groupData.classes}</p>
                    
          <p className="text-gray-600 mb-2"><strong>Meeting Time:</strong> {groupData.time}</p>
          <p className="text-gray-600 mb-4"><strong>Meeting Location:</strong> {groupData.location}</p>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Members</h2>
          <ul className="list-disc list-inside text-gray-600">
            {groupData.members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>

          <button
            onClick={() => alert(`Group with ID ${id} has been deleted.`)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleGroupPage;