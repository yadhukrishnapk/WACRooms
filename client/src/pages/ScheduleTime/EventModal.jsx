import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import moment from "moment";
import axios from "axios";

const EventModal = ({ isOpen, onClose, onSave, initialStart, initialEnd, room, userId }) => {
  const defaultStart = moment(initialStart).set({
    hour: moment().hour(),
    minute: moment().minute(),
  });

  const defaultEnd = moment(defaultStart).add(1, "hour");

  const [formData, setFormData] = useState({
    title: "",
    category: "default",
    start: moment(initialStart).format("YYYY-MM-DDTHH:mm"),
    end: moment(initialEnd).format("YYYY-MM-DDTHH:mm"),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updatedStart = moment(initialStart).set({
      hour: moment().hour(),
      minute: moment().minute(),
    });
    const updatedEnd = moment(updatedStart).add(1, "hour");

    setFormData({
      ...formData,
      start: updatedStart.format("YYYY-MM-DDTHH:mm"),
      end: updatedEnd.format("YYYY-MM-DDTHH:mm"),
    });
  }, [initialStart]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const eventData = {
      title: formData.title,
      start: new Date(formData.start),
      end: new Date(formData.end),
      category: formData.category,
      room: room,
      userId: userId
    };

    try {
      const response = await axios.post('http://localhost:3000/api/event/create', eventData, {
        withCredentials: true // Include credentials for authentication
      });

      // Call onSave with the response data from backend
      onSave({
        ...eventData,
        id: response.data.event._id // Include the ID from the backend
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-black w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-black">
          <h2 className="text-xl font-normal text-black tracking-tight uppercase">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white appearance-none"
              disabled={loading}
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center'
              }}
            >
              <option value="default">Default</option>
              <option value="work">Work</option>
              <option value="important">Important</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-black border border-black hover:bg-gray-100 focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-white bg-black border border-black hover:bg-gray-800 focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;