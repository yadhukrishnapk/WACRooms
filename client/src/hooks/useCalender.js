// hooks/useCalendar.js
import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import axios from "axios";

const useCalendar = (initialEvents = [], room) => { // Add room parameter
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date(2025, 2, 14));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchEvents = async () => {
    try {
      if (!room) return; // Don't fetch if room isn't defined
      const response = await axios.get(`http://localhost:3000/api/event/room/${room}`, {
        withCredentials: true
      });
      // Map the events to ensure dates are properly formatted
      const formattedEvents = response.data.events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [room]); // Add room as dependency so it refetches when room changes

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  const handleSelect = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData) => {
    setEvents((prev) => [
      ...prev,
      {
        id: eventData.id || prev.length + 1, // Use backend ID if available
        ...eventData
      },
    ]);
    fetchEvents(); // Refresh events after saving
  };

  const navigateByView = (direction) => {
    let newDate;
    const amount = direction === 'next' ? 1 : -1;
    
    switch (view) {
      case "month":
        newDate = moment(date).add(amount, "month").toDate();
        break;
      case "week":
        newDate = moment(date).add(amount, "week").toDate();
        break;
      case "day":
        newDate = moment(date).add(amount, "day").toDate();
        break;
      default:
        newDate = date;
    }
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const goToPrevious = () => navigateByView('prev');
  const goToNext = () => navigateByView('next');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return {
    events,
    view,
    date,
    isModalOpen,
    selectedSlot,
    handleNavigate,
    handleViewChange,
    handleSelect,
    handleSaveEvent,
    goToToday,
    goToPrevious,
    goToNext,
    openModal,
    closeModal
  };
};

export default useCalendar;