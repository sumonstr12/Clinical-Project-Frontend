import { useState } from 'react';
import { CheckCircle, XCircle, UserPlus } from 'lucide-react';

export default function CaregiverRequests() {
  const [caregiverRequests, setCaregiverRequests] = useState([
    { id: 1, caregiverName: 'Maria Garcia', patientName: 'William Johnson', requestDate: '2024-01-14' },
    { id: 2, caregiverName: 'John Smith', patientName: 'Patricia Davis', requestDate: '2024-01-14' },
    { id: 3, caregiverName: 'Emily Wilson', patientName: 'Robert Miller', requestDate: '2024-01-13' },
  ]);

  const handleApproveRequest = (id) => {
    setCaregiverRequests(requests => requests.filter(req => req.id !== id));
  };

  const handleRejectRequest = (id) => {
    setCaregiverRequests(requests => requests.filter(req => req.id !== id));
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold mb-6">Pending Caregiver Requests</h3>
      <div className="space-y-4">
        {caregiverRequests.map((request) => (
          <div
            key={request.id}
            className="bg-slate-700 rounded-xl p-4 hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">{request.caregiverName}</p>
                  <p className="text-sm text-slate-400">Patient: {request.patientName}</p>
                </div>
              </div>
              <span className="text-sm text-slate-400">{request.requestDate}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApproveRequest(request.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}