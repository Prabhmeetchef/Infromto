"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.from.trim()) newErrors.from = "Origin is required";
    if (!formData.to.trim()) newErrors.to = "Destination is required";
    if (!formData.date) newErrors.date = "Date is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Encode the form data for URL parameters
      const params = new URLSearchParams({
        from: formData.from,
        to: formData.to,
        date: formData.date,
      });
      
      router.push(`/results?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 pb-10">
      <img src="infromto.png" alt="Infromto Logo" className="w-52 mb-6" />
      <p className="text-lg text-black text-center max-w-md mb-8">
        Enter your details below to find the best and cheapest flights for your journey.
      </p>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 py-6 max-w-lg w-full border-[1px] border-gray-200">
        <div className="mb-4">
          <label htmlFor="from" className="block text-sm font-medium text-black mb-1">
            From
          </label>
          <input
            type="text"
            id="from"
            value={formData.from}
            onChange={handleInputChange}
            placeholder="City or Airport"
            className={`w-full p-3 border ${errors.from ? 'border-red-500' : 'border-red-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-black mb-1">
            To
          </label>
          <input
            type="text"
            id="to"
            value={formData.to}
            onChange={handleInputChange}
            placeholder="City or Airport"
            className={`w-full p-3 border ${errors.to ? 'border-red-500' : 'border-red-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-black mb-1">
            Departure Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full p-3 border ${errors.date ? 'border-red-500' : 'border-red-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <button
          type="submit"
          className="my-2 w-full bg-red-600 text-white text-lg font-medium py-2 rounded-md hover:bg-black transition"
        >
          Find Flights
        </button>
      </form>
    </div>
  );
}