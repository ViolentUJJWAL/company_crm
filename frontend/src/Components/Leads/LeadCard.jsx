import React from "react";
import { MdDelete, MdEmail } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaWhatsapp, FaLink } from "react-icons/fa6";
import { IoPersonAdd } from "react-icons/io5";
import { FiSend } from "react-icons/fi";

const LeadCard = ({ lead, onLeadClick }) => (
  <div
    onClick={() => onLeadClick(lead)}
    className="bg-white shadow-md rounded-lg p-4 border border-gray-200 text-left hover:shadow-[0_8px_10px_rgba(0,0,0,0.2)] transition duration-300"
  >
    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
      {lead.label}
    </span>
    <h3 className="font-semibold text-lg mt-2">{lead.name}</h3>
    <p className="text-gray-600">📞 {lead.phone}</p>
    {lead.reference && (
      <div className="mt-2 bg-gray-50 p-2 rounded">
        <p className="text-sm font-medium">Reference:</p>
        <p className="text-sm text-gray-600">{lead.reference.name}</p>
        <p className="text-sm text-gray-600">{lead.reference.phoneNo}</p>
      </div>
    )}
    <p className="text-sm text-gray-500">CD: {lead.cd}</p>
    <p className="text-sm text-gray-500">BY: {lead.by}</p>
    <p className="text-sm text-gray-500">TO: {lead.to}</p>
    <p className="text-sm text-gray-500">NFD: {lead.nfd}</p>
    <div className="mt-2 flex space-x-2 text-gray-500">
      <span className="cursor-pointer">
        <MdDelete />
      </span>
      <span className="cursor-pointer">
        <CiEdit />
      </span>
      <span className="cursor-pointer">
        <MdEmail />
      </span>
      <span className="cursor-pointer">
        <FaWhatsapp />
      </span>
      <span className="cursor-pointer">
        <FaLink />
      </span>
      <span className="cursor-pointer">
        <IoPersonAdd />
      </span>
      <span className="cursor-pointer">
        <FiSend />
      </span>
    </div>
  </div>
);

export default LeadCard;