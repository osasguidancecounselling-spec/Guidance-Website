import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = ({
  events = [],
  onSelectSlot,
  onSelectEvent,
  selectable = false,
}) => {

  return (
    <div className="appointment-calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        selectable={selectable}
      />
    </div>
  );
};

export default AppointmentCalendar;
