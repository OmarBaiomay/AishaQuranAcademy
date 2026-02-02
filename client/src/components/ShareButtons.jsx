import React from "react";
import {
  FiFacebook,
  FiTwitter,
  FiLink,
  FiMail,
  FiShare2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

const platforms = [
  { name: "Facebook", icon: <FiFacebook />, href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  { name: "Twitter", icon: <FiTwitter />, href: (url) => `https://twitter.com/intent/tweet?url=${url}` },
  { name: "WhatsApp", icon: <FaWhatsapp />, href: (url) => `https://wa.me/?text=${url}` },
  { name: "Email", icon: <FiMail />, href: (url) => `mailto:?subject=Check this out&body=${url}` },
];

const ShareButtons = ({ url }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-3 justify-start items-center">
      {platforms.map((p, i) => (
        <a
          key={i}
          href={p.href(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="tooltip group relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-purple-500 hover:text-white transition"
        >
          {p.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="tooltip group relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-purple-500 hover:text-white transition"
      >
        <FiLink />
        <span className="tooltip-text absolute -left-24 top-1/2 -translate-y-1/2 bg-black text-white px-2 py-1 text-xs rounded hidden group-hover:block">
          Copy Link
        </span>
      </button>
    </div>
  );
};

export default ShareButtons;
