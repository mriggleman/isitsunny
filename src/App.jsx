import React, { useState, useEffect } from 'react';
import { Sun, Cloud, MapPin, Calendar, AlertTriangle, Info } from 'lucide-react';

// Top 400+ Irish cities/towns with coordinates (sample - you'd need complete list)
const IRISH_LOCATIONS = [
  { name: 'Dublin', lat: 53.3498, lon: -6.2603 },
  { name: 'Cork', lat: 51.8969, lon: -8.4863 },
  { name: 'Limerick', lat: 52.6638, lon: -8.6267 },
  { name: 'Galway', lat: 53.2707, lon: -9.0568 },
  { name: 'Waterford', lat: 52.2593, lon: -7.1101 },
  { name: 'Drogheda', lat: 53.7189, lon: -6.3478 },
  { name: 'Dundalk', lat: 54.0000, lon: -6.4167 },
  { name: 'Sligo', lat: 54.2697, lon: -8.4694 },
  { name: 'Kilkenny', lat: 52.6541, lon: -7.2448 },
  { name: 'Wexford', lat: 52.3369, lon: -6.4633 },
  // Add remaining 390+ locations here
];

const IsSunnyInIreland = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sunnyLocations, setSunnyLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [weatherWarnings, setWeatherWarnings] = useState([]);
  const [showWarnings, setShowWarnings] = useState(false);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default (Dublin)');
          setUserLocation({ lat: 53.3498, lon: -6.2603 });
        }
      );
    } else {
      setUserLocation({ lat: 53.3498, lon: -6.2603 });
    }

    // Fetch weather warnings
    fetchWeatherWarnings();
  }, []);

  const fetchWeatherWarnings = async () => {
    // Met Éireann warnings API (you'd need the actual endpoint)
    // This is a placeholder - check Met Éireann's documentation
    try {
      const response = await fetch('https://www.met.ie/Open_Data/json/warning_EIXX.json');
      if (response.ok) {
        const data = await response.json();
        setWeatherWarnings(data.warnings || []);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const getCachedForecast = (location) => {
    const cacheKey = `weather_${location.lat}_${location.lon}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const data = JSON.parse(cached);
      const cacheAge = Date.now() - data.timestamp;
      // 3 hours = 10,800,000 milliseconds
      if (cacheAge < 10800000) {
        return data.forecast;
      }
    }
    return null;
  };

  const cacheForecast = (location, forecast) => {
    const cacheKey = `weather_${location.lat}_${location.lon}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      forecast: forecast
    }));
  };

  const fetchWeatherForLocation = async (location) => {
    // Check cache first
    const cached = getCachedForecast(location);
    if (cached) {
      return cached;
    }

    // Fetch from Met Éireann API
    try {
      const response = await fetch(
        `http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${location.lat};long=${location.lon}`
      );
      
      if (!response.ok) throw new Error('API request failed');
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Parse forecast data (simplified - you'd need proper XML parsing)
      const forecast = parseMetEireannForecast(xmlDoc);
      
      // Cache the result
      cacheForecast(location, forecast);
      
      return forecast;
    } catch (error) {
      console.error(`Error fetching weather for ${location.name}:`, error);
      return null;
    }
  };

  const parseMetEireannForecast = (xmlDoc) => {
    // This is a simplified parser - you'd need to properly parse the XML
    // Based on Met Éireann's XML format
    const times = xmlDoc.querySelectorAll('time');
    const dailyForecasts = {};

    times.forEach(time => {
      const from = time.getAttribute('from');
      const date = from.split('T')[0];
      
      const symbol = time.querySelector('symbol');
      const symbolCode = symbol?.getAttribute('number') || '4'; // Default cloudy
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(parseInt(symbolCode));
    });

    // Determine if day is sunny (symbol codes 1-3 are sunny/fair)
    const result = {};
    Object.keys(dailyForecasts).forEach(date => {
      const codes = dailyForecasts[date];
      const sunnyPeriods = codes.filter(c => c <= 3).length;
      result[date] = sunnyPeriods >= codes.length * 0.5; // 50% sunny = sunny day
    });

    return result;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const checkSunnyLocations = async () => {
    if (!selectedDate || !userLocation) return;

    setLoading(true);
    setSunnyLocations([]);

    const dateStr = selectedDate.toISOString().split('T')[0];
    const sunny = [];

    // Check all locations (with rate limiting)
    for (let i = 0; i < IRISH_LOCATIONS.length; i++) {
      const location = IRISH_LOCATIONS[i];
      
      // Add small delay to avoid overwhelming API (only for non-cached requests)
      if (!getCachedForecast(location) && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const forecast = await fetchWeatherForLocation(location);
      
      if (forecast && forecast[dateStr]) {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lon,
          location.lat, location.lon
        );
        sunny.push({ ...location, distance: Math.round(distance) });
      }
    }

    // Sort by distance
    sunny.sort((a, b) => a.distance - b.distance);
    setSunnyLocations(sunny);
    setLoading(false);
  };

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-IE', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Sun className="text-yellow-500" size={48} />
            Is it Sunny in Ireland?
          </h1>
          <p className="text-gray-600">Find sunshine anywhere on the island</p>
        </div>

        {/* Weather Warnings Banner */}
        {weatherWarnings.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-600" size={20} />
                <span className="font-semibold text-yellow-800">
                  {weatherWarnings.length} Active Weather Warning{weatherWarnings.length > 1 ? 's' : ''}
                </span>
              </div>
              <span className="text-yellow-600 text-sm">
                {showWarnings ? 'Hide' : 'Show'}
              </span>
            </button>
            {showWarnings && (
              <div className="mt-3 space-y-2">
                {weatherWarnings.map((warning, i) => (
                  <div key={i} className="text-sm text-yellow-800">
                    • {warning.description || 'Weather warning active'}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={24} />
            Select a Day
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getNextSevenDays().map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDate?.toDateString() === date.toDateString()
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-sm font-semibold text-gray-700">
                  {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(date)}
                </div>
              </button>
            ))}
          </div>
          
          <button
            onClick={checkSunnyLocations}
            disabled={!selectedDate || loading}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Checking all locations...' : 'Find Sunshine ☀️'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking weather across Ireland...</p>
          </div>
        )}

        {!loading && sunnyLocations.length === 0 && selectedDate && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Cloud className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No sunshine found</h3>
            <p className="text-gray-600">Unfortunately, no sunny weather forecast for this day</p>
          </div>
        )}

        {!loading && sunnyLocations.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sun className="text-yellow-500" />
              {sunnyLocations.length} Sunny Location{sunnyLocations.length > 1 ? 's' : ''} Found!
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sunnyLocations.map((location, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-500" size={20} />
                    <span className="font-medium text-gray-800">{location.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{location.distance} km away</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attribution */}
        <div className="mt-8 text-center text-sm text-gray-600 bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info size={16} />
            <span className="font-semibold">Weather Data</span>
          </div>
          <p>
            Forecast data provided by{' '}
            <a 
              href="https://www.met.ie" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Met Éireann
            </a>
            , the Irish National Meteorological Service
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Data cached for 3 hours per location • Last updated: {new Date().toLocaleTimeString('en-IE')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IsSunnyInIreland;
