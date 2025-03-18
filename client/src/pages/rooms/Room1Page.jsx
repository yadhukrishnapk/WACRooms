import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios import

// Configure date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const Room1Page = () => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/event/room/room1', {
          withCredentials: true
        });
        const formattedEvents = response.data.events.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Handle slot selection (date/time click)
  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    const title = window.prompt('Enter event title (optional):');
    if (title) {
      // Optionally save to backend here
      const newEvent = { start, end, title };
      setEvents([...events, newEvent]);
      
      // Optional: Save to backend
      axios.post('http://localhost:3000/api/event/create', {
        ...newEvent,
        room: 'room1',
        category: 'default'
      }, {
        withCredentials: true
      }).catch(error => console.error('Error saving event:', error));
    }
  };

  // Handle navigation to create schedule page
  const handleScheduleClick = () => {
    navigate('/room1/createSchedule');
  };

  // Custom styles for B&W theme
  const customStyles = {
    container: {
      height: '500px',
      backgroundColor: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#1F2937',
      fontWeight: 'bold',
    },
    event: {
      backgroundColor: '#374151',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
    },
    toolbar: {
      color: '#4B5563',
    },
    selected: {
      backgroundColor: '#D1D5DB',
      color: '#1F2937',
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Abin's Room</h1>
        <p className="text-gray-600 mb-6">Schedule meetings and presentations here.</p>

        {/* Calendar */}
        <div style={customStyles.container}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            defaultView="week"
            views={['month', 'week', 'day']}
            step={15}
            timeslots={4}
            style={{ height: '100%' }}
            eventPropGetter={() => ({
              style: customStyles.event,
            })}
            components={{
              toolbar: (toolbar) => (
                <div className="flex justify-between items-center mb-4" style={customStyles.toolbar}>
                  <button
                    onClick={() => toolbar.onNavigate('PREV')}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Prev
                  </button>
                  <span className="text-lg font-semibold">{toolbar.label}</span>
                  <button
                    onClick={() => toolbar.onNavigate('NEXT')}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              ),
            }}
            dayPropGetter={(date) => ({
              style: {
                backgroundColor: selectedSlot && date >= selectedSlot.start && date <= selectedSlot.end
                  ? customStyles.selected.backgroundColor
                  : '#fff',
                color: selectedSlot && date >= selectedSlot.start && date <= selectedSlot.end
                  ? customStyles.selected.color
                  : '#000',
              },
            })}
          />
        </div>

        {/* Display selected slot (optional) */}
        {selectedSlot && (
          <div className="mt-4 text-sm text-gray-600">
            Selected: {format(selectedSlot.start, 'PPp')} - {format(selectedSlot.end, 'p')}
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
          >
            Back to Office
          </button>
          <button 
            onClick={handleScheduleClick}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
          >
            Schedule Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room1Page;