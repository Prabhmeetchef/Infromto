"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({ from: "", to: "", date: "" });
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });
  const [searchResults, setSearchResults] = useState<{ from: any[]; to: any[] }>({
    from: [],
    to: [],
  });
  const [errors, setErrors] = useState<{ from?: string; to?: string; date?: string }>({});

  // Fetch airport suggestions
  const fetchAirports = async (query: string, type: "from" | "to") => {
    if (query.length < 1) {
      setSearchResults((prev) => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const response = await fetch(`/api/airports?query=${query}`);
      const data = await response.json();
      setSearchResults((prev) => ({ ...prev, [type]: data.slice(0, 5) }));
    } catch (error) {
      console.error("Error fetching airports:", error);
    }
  };

  // Handle input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, type: "from" | "to") => {
    const value = e.target.value;
    setSearchQuery((prev) => ({ ...prev, [type]: value }));
    fetchAirports(value, type);
  };

  // Handle selecting an airport
  const handleSelectAirport = (airport: { name: string; code: string }, type: "from" | "to") => {
    setFormData((prev) => ({ ...prev, [type]: airport.code })); // Store only the airport code
    setSearchQuery((prev) => ({ ...prev, [type]: `${airport.name} (${airport.code})` })); // Display name + code
    setSearchResults((prev) => ({ ...prev, [type]: [] })); // Hide suggestions
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { from?: string; to?: string; date?: string } = {};
    if (!formData.from) newErrors.from = "Origin is required";
    if (!formData.to) newErrors.to = "Destination is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const params = new URLSearchParams(formData);
      router.push(`/results?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-red-600 to-white px-4 pb-10">
      <img src="infromto.png" alt="Infromto Logo" className="w-52 mb-6" />
      <p className="text-lg text-black text-center max-w-md mb-8">
        Enter your details below to find the best and cheapest flights for your journey.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg px-8 py-6 max-w-lg w-full border border-gray-200"
      >
        {/* From Field */}
        <div className="relative mb-4">
          <label htmlFor="from" className="block text-sm font-medium text-black mb-1">
            From
          </label>
          <input
            type="text"
            id="from"
            value={searchQuery.from}
            onChange={(e) => handleSearchChange(e, "from")}
            placeholder="Enter city or airport name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {searchResults.from.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md max-h-40 overflow-y-auto z-10">
              {searchResults.from.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => handleSelectAirport(airport, "from")}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {airport.name} ({airport.code})
                </li>
              ))}
            </ul>
          )}
          {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
        </div>

        {/* To Field */}
        <div className="relative mb-4">
          <label htmlFor="to" className="block text-sm font-medium text-black mb-1">
            To
          </label>
          <input
            type="text"
            id="to"
            value={searchQuery.to}
            onChange={(e) => handleSearchChange(e, "to")}
            placeholder="Enter city or airport name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {searchResults.to.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md max-h-40 overflow-y-auto z-10">
              {searchResults.to.map((airport) => (
                <li
                  key={airport.code}
                  onClick={() => handleSelectAirport(airport, "to")}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {airport.name} ({airport.code})
                </li>
              ))}
            </ul>
          )}
          {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
        </div>

        {/* Date Field */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-sm font-medium text-black mb-1">
            Departure Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
