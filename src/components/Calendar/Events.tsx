import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface TrainingEvent {
  title: string;
  start: Date;
  end: Date;
}

interface TrainingCalendarProps {
  eventsData: TrainingEvent[];
}

const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ eventsData }) => {
  const [events, setEvents] = useState<TrainingEvent[]>([]);

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default TrainingCalendar;

