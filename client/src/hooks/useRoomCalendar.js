import { useState, useEffect } from "react";
import { get } from "../apiServices/apiServices";
import { useNavigate } from "react-router-dom";
import { formatEvents } from "../utils/calendarUtils";

/**
 * Custom hook for managing room calendar functionality
 * @param {string} roomId - The room identifier (e.g., "room1", "room2")
 * @returns {Object} Calendar state and handlers
 */
const useRoomCalendar = (roomId) => {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await get(`/event/room/${roomId}`);
        const formattedEvents = formatEvents(data.events);
        setEvents(formattedEvents);
      } catch (error) {
        console.error(`Error fetching events for ${roomId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [roomId]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    navigate(`/${roomId}/createSchedule`, {
      state: { defaultStart: start, defaultEnd: end },
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleScheduleClick = () => {
    navigate(`/${roomId}/createSchedule`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return {
    events,
    selectedSlot,
    view,
    showModal,
    selectedEvent,
    loading,
    handleSelectSlot,
    handleSelectEvent,
    handleViewChange,
    handleScheduleClick,
    handleBack,
    closeModal
  };
};

export default useRoomCalendar;