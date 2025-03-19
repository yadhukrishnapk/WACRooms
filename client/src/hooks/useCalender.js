import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { get } from "../apiServices/apiServices";
const useCalendar = (initialEvents = [], room, setParentLoading = null) => {
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date(2025, 2, 14));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      if (setParentLoading) setParentLoading(true);
      
      if (!room) {
        setIsLoading(false);
        if (setParentLoading) setParentLoading(false);
        return;
      }

      const response = await get(`/event/room/${room}`);

      const formattedEvents = response.events.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
      if (setParentLoading) setParentLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [room]);

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

  const handleSaveEvent = async (eventData) => {
    setIsLoading(true);
    if (setParentLoading) setParentLoading(true);

    try {
      setEvents((prev) => [
        ...prev,
        {
          id: eventData.id || prev.length + 1,
          ...eventData
        },
      ]);

      await fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
      if (setParentLoading) setParentLoading(false);
    }
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
    closeModal,
    isLoading
  };
};

export default useCalendar;