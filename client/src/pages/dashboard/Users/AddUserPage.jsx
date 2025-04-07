import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios.js";

function AddUserPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: { countryCode: "", number: "" },
    country: "",
    gender: "Male",
    role: "Student",
    age: "",
    timeZone: "UTC",
  });

  const [countries, setCountries] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  const [timezoneSearch, setTimezoneSearch] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v2/all");
        const data = await res.json();

        const cleaned = data
          .filter((c) => c.name && c.alpha2Code && c.callingCodes.length && c.timezones.length)
          .map((c) => ({
            name: c.name,
            flag: c.flags.png,
            code: `+${c.callingCodes[0]}`,
            timeZones: c.timezones,
          }));

        setCountries(cleaned);
      } catch (error) {
        toast.error("Failed to fetch countries.");
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, country, gender, role, age, timeZone } = formData;

    if (!fullName || !email || !phone.number || !phone.countryCode || !country || !gender || !role || !age || !timeZone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await axiosInstance.post("/user", formData);
      toast.success("User created successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: { countryCode: "", number: "" },
        country: "",
        gender: "Male",
        role: "Student",
        age: "",
        timeZone: "UTC",
      });
    } catch (err) {
      toast.error("Error creating user.");
    }
  };

  const getCountry = (search) =>
    countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const getCodes = (search) =>
    countries.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const getTimeZones = (search) =>
    countries.flatMap((c) =>
      c.timeZones.map((tz) => ({
        name: c.name,
        flag: c.flag,
        timeZone: tz,
      }))
    ).filter((item) =>
      item.timeZone.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="pt-20 px-10 w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zinc-700">Add New User</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="form-input w-full"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="form-input w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        {/* Phone Code Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Phone Code</label>
          <input
            type="text"
            placeholder="Search code..."
            className="form-input mb-2"
            value={codeSearch}
            onChange={(e) => setCodeSearch(e.target.value)}
          />
          <div className="border rounded max-h-40 overflow-auto">
            {getCodes(codeSearch).map((c) => (
              <div
                key={c.code}
                className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  setFormData({
                    ...formData,
                    phone: { ...formData.phone, countryCode: c.code },
                  })
                }
              >
                <img src={c.flag} alt="flag" className="w-5 h-5 mr-2" />
                <span>{c.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <input
          type="text"
          placeholder="Phone Number"
          className="form-input w-full"
          value={formData.phone.number}
          onChange={(e) =>
            setFormData({ ...formData, phone: { ...formData.phone, number: e.target.value } })
          }
          required
        />

        {/* Country Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            placeholder="Search country..."
            className="form-input mb-2"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />
          <div className="border rounded max-h-40 overflow-auto">
            {getCountry(countrySearch).map((c) => (
              <div
                key={c.name}
                className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => setFormData({ ...formData, country: c.name })}
              >
                <img src={c.flag} alt="flag" className="w-5 h-5 mr-2" />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender */}
        <select
          className="form-input w-full"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        {/* Role */}
        <select
          className="form-input w-full"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Administrator">Administrator</option>
        </select>

        {/* Age */}
        <input
          type="number"
          placeholder="Age"
          className="form-input w-full"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />

        {/* Time Zone Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Time Zone</label>
          <input
            type="text"
            placeholder="Search time zones..."
            className="form-input mb-2"
            value={timezoneSearch}
            onChange={(e) => setTimezoneSearch(e.target.value)}
          />
          <div className="border rounded max-h-40 overflow-auto">
            {getTimeZones(timezoneSearch).map((tz, i) => (
              <div
                key={`${tz.timeZone}-${i}`}
                className="flex items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => setFormData({ ...formData, timeZone: tz.timeZone })}
              >
                <img src={tz.flag} alt="flag" className="w-5 h-5 mr-2" />
                <span>{tz.timeZone}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
}

export default AddUserPage;
