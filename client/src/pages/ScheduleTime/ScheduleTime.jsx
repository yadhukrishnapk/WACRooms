import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "../../hooks/useCalender";
import CustomToolbar from "./CustomToolbar";
import { injectCalendarStyles, eventStyleGetter, dayPropGetter } from "./calendarStyles";
import { initialEvents } from "./eventsData";
import EventModal from "./EventModal";
import { useParams } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth";

const localizer = momentLocalizer(moment);
const ScheduleTime = () => {
    const {room} = useParams();
const { user } = useAuth();
  const {
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
  } = useCalendar(initialEvents,room);


  console.log("user:-", user);
  
  useEffect(() => {
    return injectCalendarStyles();
  }, []);

  return (
    <div className="bg-white border border-black">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={(event) =>
          alert(`${event.title}\nCategory: ${event.category}`)
        }
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        components={{ 
          toolbar: (toolbarProps) => (
            <CustomToolbar
              {...toolbarProps}
              date={date}
              view={view}
              goToPrevious={goToPrevious}
              goToNext={goToNext}
              goToToday={goToToday}
              handleViewChange={handleViewChange}
              openModal={openModal}
            />
          )
        }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        className="min-h-screen"
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveEvent}
        initialStart={selectedSlot?.start || new Date()}
        initialEnd={selectedSlot?.end || new Date()}
        room={room}
        userId={user?.id}
      />
    </div>
  );
};

export default ScheduleTime;