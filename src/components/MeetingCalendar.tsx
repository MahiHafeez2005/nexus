// Import React's useState hook - for storing data that changes
import { useState } from 'react';
// Import the calendar component
import Calendar from 'react-calendar';
// Import calendar styles
import 'react-calendar/dist/Calendar.css';

// Type definitions (TypeScript)
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// The main component
export default function MeetingCalendar() {
  // State for selected date (starts as today)
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  
  // State for availability list (array of dates)
  const [availability, setAvailability] = useState<Date[]>([]);
  
  // State for meeting requests (simulated data)
  const [meetingRequests, setMeetingRequests] = useState([
    { id: 1, investor: "Michael Rodriguez", date: "June 20, 2026", status: "pending" },
    { id: 2, investor: "Sarah Chen", date: "June 22, 2026", status: "pending" }
  ]);

  // Function: Add selected date to availability
  const addAvailability = () => {
    if (selectedDate instanceof Date) {
      const alreadyExists = availability.some(
        (date) => date.toDateString() === selectedDate.toDateString()
      );
      if (!alreadyExists) {
        setAvailability([...availability, selectedDate]);
        alert(`Added ${selectedDate.toDateString()} to your availability`);
      } else {
        alert('This date is already in your availability');
      }
    }
  };

  // Function: Remove a date from availability
  const removeAvailability = (dateToRemove: Date) => {
    setAvailability(availability.filter(
      (date) => date.toDateString() !== dateToRemove.toDateString()
    ));
  };

  // Function: Accept a meeting request
  const acceptRequest = (id: number) => {
    setMeetingRequests(meetingRequests.map(request => 
      request.id === id ? { ...request, status: "accepted" } : request
    ));
  };

  // Function: Decline a meeting request
  const declineRequest = (id: number) => {
    setMeetingRequests(meetingRequests.map(request => 
      request.id === id ? { ...request, status: "declined" } : request
    ));
  };

  // The HTML/JSX that renders on screen
  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Set Your Availability
        </h3>
        
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
          className="mx-auto"
        />
        
        <div className="mt-4 flex justify-center">
          <button 
            onClick={addAvailability}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Mark as Available
          </button>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Your Available Dates:</h4>
          {availability.length === 0 ? (
            <p className="text-gray-500 text-sm mt-2">No dates added yet</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {availability.map((date, index) => (
                <li key={index} className="flex justify-between items-center text-sm text-gray-600 border-b border-gray-100 py-2">
                  <span>{date.toDateString()}</span>
                  <button
                    onClick={() => removeAvailability(date)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Meeting Requests Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Meeting Requests
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({meetingRequests.filter(r => r.status === "pending").length} pending)
          </span>
        </h3>
        
        {meetingRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No meeting requests</p>
        ) : (
          <div className="space-y-3">
            {meetingRequests.map(request => (
              <div key={request.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-900">{request.investor}</p>
                  <p className="text-sm text-gray-500">{request.date}</p>
                </div>
                
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => acceptRequest(request.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => declineRequest(request.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Decline
                    </button>
                  </div>
                )}
                
                {request.status === "accepted" && (
                  <span className="text-green-600 text-sm font-medium">✓ Accepted</span>
                )}
                
                {request.status === "declined" && (
                  <span className="text-red-600 text-sm font-medium">✗ Declined</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}