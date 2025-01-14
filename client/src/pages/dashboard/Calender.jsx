import React, { useEffect, useState, useRef } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { extend } from "@syncfusion/ej2-base";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";

const Calender = () => {
  const scheduleObj = useRef(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch classes from the backend
  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get("/classroom"); // Adjust the endpoint as necessary
      const classes = response.data.flatMap((classroom) =>
        classroom.classes.map((cls) => ({
          Id: `${classroom._id}-${cls.date}`, // Unique identifier for each event
          Subject: `Class with ${classroom.student.fullName}`,
          StartTime: new Date(cls.date),
          EndTime: new Date(new Date(cls.date).getTime() + 60 * 60 * 1000), // Assuming 1-hour classes
          Location: cls.zoomLink,
          Description: `Teacher: ${classroom.teacher.fullName}, Supervisor: ${classroom.supervisor.fullName}`,
        }))
      );
      setScheduleData(classes);
    } catch (error) {
      toast.error("Error fetching classes for the calendar!");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onDragStart = (args) => {
    args.navigation.enable = true;
  };

  const changeDate = (args) => {
    setSelectedDate(args.value);
    scheduleObj.current.dataBind();
  };

  return (
    <div className="pt-20 px-10 w-full">
      <h1 className="text-2xl font-bold text-zinc-600 pb-7">Classrooms</h1>
      <div className="schedule-control-section">
        <div className="col-lg-9 control-section">
          <div className="control-wrapper">
            <ScheduleComponent
              height="650px"
              ref={scheduleObj}
              selectedDate={selectedDate}
              eventSettings={{ dataSource: scheduleData }}
              dragStart={onDragStart}
            >
              <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="WorkWeek" />
                <ViewDirective option="Month" />
                <ViewDirective option="Agenda" />
              </ViewsDirective>
              <Inject
                services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
              />
            </ScheduleComponent>
          </div>
        </div>
        <div className="col-lg-3 property-section">
          <div className="property-panel">
            <table id="property" title="Properties" className="property-panel-table" style={{ width: "100%" }}>
              <tbody>
                <tr style={{ height: "50px" }}>
                  <td style={{ width: "100%" }}>
                    <div className="datepicker-control-section">
                      <DatePickerComponent
                        value={selectedDate}
                        showClearButton={false}
                        change={changeDate}
                        placeholder="Current Date"
                        floatLabelType="Always"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calender