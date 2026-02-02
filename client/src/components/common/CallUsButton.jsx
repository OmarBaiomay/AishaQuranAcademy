import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const CallUsButton = ({
  className = "",
  label = "Call Us",
  icon: Icon = FaPhoneAlt,
}) => {
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();

        if (data.country_code === "US") {
          setPhone("+1-782-222-6612");
        } else if (data.country_code === "GB") {
          setPhone("+44-74-413-0098");
        } else {
          setPhone(null);
        }
      } catch (error) {
        console.error("Failed to get location:", error.message);
        setPhone(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (loading || !phone) return null;

  return (
    <div className={`relative inline-block ${className}`}>
      <a
        href={`tel:${phone}`}
        className="btn primary-purple-btn flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow animate-grow-pulse"
      >
        {Icon && <Icon />} {label}
      </a>
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-semibold flex justify-center items-center gap-1">
        24/7 Support
      </span>
    </div>
  );
};

export default CallUsButton;
