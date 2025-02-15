import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
    const apikey = process.env.SERP_API_KEY;
    serpApiUrl.searchParams.append('engine', 'google_flights');
    serpApiUrl.searchParams.append('departure_id', from.toUpperCase());
    serpApiUrl.searchParams.append('arrival_id', to.toUpperCase());
    serpApiUrl.searchParams.append('outbound_date', date);
    serpApiUrl.searchParams.append('type', '2'); // One-way flight type

    if (!apikey) {
      throw new Error("API key is missing");
    }
    serpApiUrl.searchParams.append('api_key', apikey);

    const response = await fetch(serpApiUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Fetch the latest exchange rate (USD to INR)
    const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeRateData = await exchangeRateResponse.json();
    const usdToInr = exchangeRateData.rates.INR;

    if (!usdToInr) {
      throw new Error("Failed to fetch exchange rate");
    }

    // Extract and convert prices
    const flights = [...(data.best_flights || []), ...(data.other_flights || [])];
    const simplifiedFlights = flights.map(flight => ({
      airline: flight.flights[0].airline,
      airlineLogo: flight.flights[0].airline_logo,
      price: Math.round(flight.price * usdToInr), // Convert USD to INR
      currency: "INR",
      bookingToken: flight.booking_token
    }));

    return NextResponse.json(simplifiedFlights);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
