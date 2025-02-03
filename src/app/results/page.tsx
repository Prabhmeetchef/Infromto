"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Results() {
  const searchParams = useSearchParams();
  interface Flight {
    airline: string;
    airlineLogo?: string;
    price: number;
    bookingToken: string;
  }

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  useEffect(() => {
    async function fetchFlights() {
      try {
        setLoading(true);
        const response = await fetch(`/api/flights?from=${from}&to=${to}&date=${date}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch flight data");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Sort flights by price from low to high
        const sortedFlights = data.sort((a: { price: number }, b: { price: number }) => a.price - b.price);
        setFlights(sortedFlights);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    if (from && to && date) {
      fetchFlights();
    } else {
      setError("Missing search parameters");
      setLoading(false);
    }
  }, [from, to, date]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-center text-xl text-red-600 font-semibold p-6 bg-red-100 rounded-lg shadow-lg mb-4">
          Error: {error}
        </p>
        <Link href="/">
          <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-black transition">
            Back to Search
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {from} to {to}
          </h2>
          <Link href="/">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-black transition text-sm">
              New Search
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {flights.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">No flights available for this route</p>
            </div>
          ) : (
            flights.map((flight, index) => (
              <div key={index} className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {flight.airlineLogo && (
                      <img 
                        src={flight.airlineLogo} 
                        alt={flight.airline} 
                        className="h-8 w-8 mr-3"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {flight.airline}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold text-red-600">${flight.price}</p>
                    <button 
                      onClick={() => window.open(`https://www.google.com/flights?hl=en#flt=${flight.bookingToken}`, '_blank')}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-black transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
