import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");

    if (!from || !to || !date) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Construct the SerpAPI URL for Google Flights
    const serpApiUrl = new URL('https://serpapi.com/search');
    serpApiUrl.searchParams.append('engine', 'google_flights');
    serpApiUrl.searchParams.append('departure_id', from.toUpperCase()); // Ensure uppercased
    serpApiUrl.searchParams.append('arrival_id', to.toUpperCase()); // Ensure uppercased
    serpApiUrl.searchParams.append('outbound_date', date);
    serpApiUrl.searchParams.append('type', '2'); // One-way flight type
    console.log("Loaded SERP_API_KEY:", process.env.SERP_API_KEY);
    serpApiUrl.searchParams.append('api_key', process.env.SERP_API_KEY);

    const response = await fetch(serpApiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Extract only needed information from flights
    const flights = [...(data.best_flights || []), ...(data.other_flights || [])];
    const simplifiedFlights = flights.map(flight => ({
      airline: flight.flights[0].airline,
      airlineLogo: flight.flights[0].airline_logo,
      price: flight.price,
      bookingToken: flight.booking_token
    }));

    // Return the flights as JSON
    return NextResponse.json(simplifiedFlights);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
