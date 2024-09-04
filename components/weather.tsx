"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, Divide, MapPinIcon, ThermometerIcon } from "lucide-react";
import { Elsie } from "next/font/google";

interface WeatherData {
  temperature: number,
  description: string,
  location: string,
  unit: string
}

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature}°${unit}`;
    }
  }

  const getWeatherMessage=(description:string):string=>{
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }

const getLocationMessage=(location:string):string=>{
  const hour=new Date().getHours();
  if(hour>=5 && hour<12){
    return `${location} in morning.`
  }
  else{
    return `${location} at night.`
  }
}

return (
  <div className="flex flex-col items-center justify-center h-screen">
    <Card className="max-w-md mx-auto p-4 shadow-lg rounded-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Weather Widget</CardTitle>
        <CardDescription className="text-gray-600">Enter a location to get the current weather.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex flex-col items-center space-y-4">
          <Input
            type="text"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white py-2 rounded-md">
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {weather && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold">{getLocationMessage(weather.location)}</h2>
            <p className="text-lg">{getTemperatureMessage(weather.temperature, weather.unit)}</p>
            <p className="text-md text-gray-700">{getWeatherMessage(weather.description)}</p>
            <div className="flex justify-around mt-4">
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-around mt-4">
        <CloudIcon className="w-6 h-6 text-gray-500" />
        <MapPinIcon className="w-6 h-6 text-gray-500" />
        <ThermometerIcon className="w-6 h-6 text-gray-500" />
      </CardFooter>
    </Card>
    </div>
  )

}

