import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";

const TimeZoneDashboard = () => {
  const [cairoTime, setCairoTime] = useState("");
  const [selectedTimeZone, setSelectedTimeZone] = useState("UTC");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeZones, setTimeZones] = useState([]);

  // Fetch time zones from API
  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await axios.get("https://worldtimeapi.org/api/timezone");
        setTimeZones(response.data);
      } catch (error) {
        console.error("Error fetching time zones", error);
      }
    };

    fetchTimeZones();
  }, []);

  // Update Cairo and selected time every second
  useEffect(() => {
    const updateTime = () => {
      setCairoTime(moment().tz("Africa/Cairo").format("YYYY-MM-DD hh:mm:ss A")); // 12-hour format with AM/PM
      setSelectedTime(moment().tz(selectedTimeZone).format("YYYY-MM-DD hh:mm:ss A")); // 12-hour format with AM/PM
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedTimeZone]);

  return (
    <div className="pt-6">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Time Zone Dashboard</h1>

        {/* Cairo Time Section */}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Cairo Time</h2>
          <p className="text-2xl font-bold text-gray-800">{cairoTime}</p>
        </div>

        {/* Time Zone Selector */}
        <div>
          <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Zone
          </label>
          <select
            id="timeZone"
            value={selectedTimeZone}
            onChange={(e) => setSelectedTimeZone(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Time Zone Section */}
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Selected Time Zone</h2>
          <p className="text-2xl font-bold text-gray-800">{selectedTime}</p>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneDashboard;
