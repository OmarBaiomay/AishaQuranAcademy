import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloating = () => {
  const whatsappLink =
    "https://wa.me/201227307646?text=Hello%20I%20Want%20To%20Know%20More%20About%20The%20Academy%20Courses%20and%20Offers";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default WhatsAppFloating;
