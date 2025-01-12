import { useEffect, useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createScrollControllerPlugin } from "@schedule-x/scroll-controller";

import "@schedule-x/theme-default/dist/index.css";

const Calendar = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const scrollController = createScrollControllerPlugin({
    initialScroll: "07:50",
  });

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      // createViewMonthAgenda(),
      createViewMonthGrid(),
      createViewWeek(),
    ],
    callbacks: {
      onEventClick(calendarEvent) {
        console.log("onEventClick", calendarEvent);
      },
      onClickDate(date) {
        console.log("onClickDate", date); // e.g. 2024-01-01
      },
    },
    theme: "shadcn",
    events: [
      {
        id: "1",
        title: "Event 1",
        start: "2024-12-18 09:00",
        end: "2024-12-18 12:00",
      },
    ],
    plugins: [
      eventsService,
      createCurrentTimePlugin(),
      createEventModalPlugin(),
      scrollController,
    ],
  });

  useEffect(() => {
    // get all events
    eventsService.getAll();
  }, []);

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default Calendar;
