import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, Star, Loader2, AlertTriangle, Info } from 'lucide-react';

const COOL_PLACES = [
  { name: 'Dublin', lat: 53.3498, lon: -6.2603 },
  { name: 'Cork', lat: 51.8985, lon: -8.4756 },
  { name: 'Galway', lat: 53.2707, lon: -9.0568 },
  { name: 'Killarney', lat: 52.0599, lon: -9.5044 },
  { name: 'Dingle', lat: 52.1410, lon: -10.2681 },
  { name: 'Kinsale', lat: 51.7059, lon: -8.5308 },
  { name: 'Kilkenny', lat: 52.6541, lon: -7.2448 },
  { name: 'Westport', lat: 53.8004, lon: -9.5188 },
  { name: 'Doolin', lat: 53.0149, lon: -9.3776 },
  { name: 'Cobh', lat: 51.8514, lon: -8.2947 },
  { name: 'Adare', lat: 52.5632, lon: -8.7883 },
  { name: 'Howth', lat: 53.3873, lon: -6.0678 },
  { name: 'Glendalough', lat: 53.0123, lon: -6.3385 },
  { name: 'Waterford', lat: 52.2593, lon: -7.1101 },
  { name: 'Sligo', lat: 54.2697, lon: -8.4694 },
  { name: 'Limerick', lat: 52.6638, lon: -8.6267 },
  { name: 'Cliffs of Moher', lat: 52.9715, lon: -9.4265 },
  { name: 'Donegal', lat: 54.6540, lon: -8.1090 },
  { name: 'Kenmare', lat: 51.8809, lon: -9.5844 },
  { name: 'Bray', lat: 53.2026, lon: -6.0983 },
  { name: 'Letterfrack', lat: 53.5504, lon: -9.9516 },
  { name: 'Bundoran', lat: 54.4778, lon: -8.2815 },
  { name: 'Athlone', lat: 53.4239, lon: -7.9406 },
  { name: 'Enniskillen', lat: 54.3436, lon: -7.6385 },
  { name: 'Carrick-on-Shannon', lat: 53.9450, lon: -8.0901 },
  { name: 'Dunmore East', lat: 52.1498, lon: -6.9943 },
  { name: 'Achill Island', lat: 53.9628, lon: -10.0903 },
  { name: 'Clifden', lat: 53.4886, lon: -10.0203 },
  { name: 'Glengarriff', lat: 51.7514, lon: -9.5519 },
  { name: 'Killybegs', lat: 54.6337, lon: -8.4483 },
  { name: 'Malahide', lat: 53.4508, lon: -6.1541 },
  { name: 'Ardmore', lat: 51.9487, lon: -7.7279 },
  { name: 'Youghal', lat: 51.9542, lon: -7.8469 },
  { name: 'Skibbereen', lat: 51.5509, lon: -9.2659 },
  { name: 'Baltimore', lat: 51.4841, lon: -9.3718 },
  { name: 'Clonmacnoise', lat: 53.3257, lon: -7.9879 },
  { name: 'Trim', lat: 53.5551, lon: -6.7914 },
  { name: 'Birr', lat: 53.0952, lon: -7.9124 },
  { name: 'Cashel', lat: 52.5166, lon: -7.8886 },
  { name: 'Dalkey', lat: 53.2796, lon: -6.1018 },
  { name: 'Dungarvan', lat: 52.0884, lon: -7.6252 },
  { name: 'Roundstone', lat: 53.4036, lon: -9.9072 },
  { name: 'Sneem', lat: 51.8315, lon: -9.9036 },
  { name: 'Cong', lat: 53.5487, lon: -9.2681 },
  { name: 'Killorglin', lat: 52.1067, lon: -9.7854 },
  { name: 'Schull', lat: 51.5270, lon: -9.5467 },
  { name: 'Leenane', lat: 53.5998, lon: -9.7047 },
  { name: 'Arranmore Island', lat: 54.9975, lon: -8.5388 },
  { name: 'Inishbofin', lat: 53.6147, lon: -10.2203 },
  { name: 'Inis Meáin', lat: 53.0920, lon: -9.5703 }
];

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sortByRecommended, setSortByRecommended] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [dates, setDates] = useState([]);
  const [warnings, setWarnings] = useState(null);
  const [showWarnings, setShowWarnings] = useState(false);

  useEffect(() => {
    const today = new Date();
    const nextWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextWeek.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IE', { weekday: 'long', month: 'short', day: 'numeric' })
      });
    }
    setDates(nextWeek);
    setSelectedDate(nextWeek[0].value);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 53.2026, lon: -6.0983 });
        }
      );
    } else {
      setUserLocation({ lat: 53.2026, lon: -6.0983 });
    }

    fetchWeatherWarnings();
  }, []);

  const fetchWeatherWarnings = async () => {
    try {
      const response = await fetch('https://www.met.ie/Open_Data/xml/xWarningPage.xml');
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      
      const awarenessLevel = xml.querySelector('globalAwarenessLevel');
      const warningTypes = xml.querySelectorAll('warningType');
      
      const warningsList = [];
      warningTypes.forEach(warnType => {
        const header = warnType.querySelector('header')?.textContent;
        const warnText = warnType.querySelector('warnText')?.textContent;
        const validFrom = warnType.querySelector('validFromTime')?.textContent;
        const validTo = warnType.querySelector('validToTime')?.textContent;
        
        if (header && warnText) {
          warningsList.push({
            header,
            text: warnText,
            validFrom,
            validTo
          });
        }
      });

      if (warningsList.length > 0 || (awarenessLevel && awarenessLevel.querySelector('text')?.textContent !== 'Green')) {
        setWarnings({
          level: awarenessLevel?.querySelector('text')?.textContent || 'Green',
          color: awarenessLevel?.querySelector('colourcode')?.textContent || '#00FF00',
          warnings: warningsList
        });
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const getWeatherSymbol = (symbol) => {
    if (!symbol) return { icon: Cloud, text: 'Cloudy', sunny: false };
    
    const num = parseInt(symbol);
    if (num === 1 || num === 2) return { icon: Sun, text: 'Sunny', sunny: true };
    if (num === 3 || num === 4) return { icon: Sun, text: 'Partly Cloudy', sunny: true };
    if (num >= 9) return { icon: CloudRain, text: 'Rainy', sunny: false };
    return { icon: Cloud, text: 'Cloudy', sunny: false };
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchWeatherForLocation = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${lat};long=${lon}`
      );
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      return xml;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  };

  const getWeatherForDate = (xml, targetDate) => {
    if (!xml) return null;
    
    const times = xml.querySelectorAll('time');
    let bestForecast = null;
    
    for (let time of times) {
      const from = time.getAttribute('from');
      const dateStr = from.split('T')[0];
      
      if (dateStr === targetDate) {
        const symbol = time.querySelector('symbol');
        const temp = time.querySelector('temperature');
        
        if (symbol && temp) {
          const weather = getWeatherSymbol(symbol.getAttribute('number'));
          const temperature = parseFloat(temp.getAttribute('value'));
          
          if (!bestForecast || (weather.sunny && temperature > bestForecast.temperature)) {
            bestForecast = {
              symbol: symbol.getAttribute('number'),
              weather,
              temperature,
              time: from
            };
          }
        }
      }
    }
    
    return bestForecast;
  };

  const checkSunnyDay = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    setResults(null);

    try {
      const locations = sortByRecommended ? COOL_PLACES : COOL_PLACES;
      const weatherResults = [];

      for (const place of locations) {
        const xml = await fetchWeatherForLocation(place.lat, place.lon);
        const forecast = getWeatherForDate(xml, selectedDate);
        
        if (forecast && forecast.weather.sunny) {
          const distance = userLocation 
            ? calculateDistance(userLocation.lat, userLocation.lon, place.lat, place.lon)
            : 0;
          
          weatherResults.push({
            ...place,
            forecast,
            distance
          });
        }
      }

      if (!sortByRecommended && userLocation) {
        weatherResults.sort((a, b) => a.distance - b.distance);
      }

      setResults({
        anySunny: weatherResults.length > 0,
        locations: weatherResults
      });
    } catch (error) {
      console.error('Error checking weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWarningIcon = (level) => {
    if (level === 'Red' || level === 'Orange') return AlertTriangle;
    return Info;
  };

  const getWarningBgColor = (level) => {
    if (level === 'Red') return 'bg-red-100 border-red-300';
    if (level === 'Orange') return 'bg-orange-100 border-orange-300';
    if (level === 'Yellow') return 'bg-yellow-100 border-yellow-300';
    return 'bg-blue-100 border-blue-300';
  };

  const getWarningTextColor = (level) => {
    if (level === 'Red') return 'text-red-900';
    if (level === 'Orange') return 'text-orange-900';
    if (level === 'Yellow') return 'text-yellow-900';
    return 'text-blue-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-2">
            Is Ireland Sunny? ☀️
          </h1>
          <p className="text-blue-700">Find out where the sun is shining across Ireland</p>
        </div>

        {warnings && warnings.warnings.length > 0 && (
          <div className={`mb-6 rounded-2xl shadow-lg border-2 overflow-hidden ${getWarningBgColor(warnings.level)}`}>
            <button
              onClick={() => setShowWarnings(!showWarnings)}
              className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3">
                {React.createElement(getWarningIcon(warnings.level), {
                  className: getWarningTextColor(warnings.level),
                  size: 24
                })}
                <div className="text-left">
                  <p className={`font-bold ${getWarningTextColor(warnings.level)}`}>
                    {warnings.level} Weather Warning Active
                  </p>
                  <p className={`text-sm ${getWarningTextColor(warnings.level)} opacity-75`}>
                    {warnings.warnings.length} warning{warnings.warnings.length !== 1 ? 's' : ''} in effect
                  </p>
                </div>
              </div>
              <span className={`text-sm ${getWarningTextColor(warnings.level)}`}>
                {showWarnings ? 'Hide' : 'Show'} details
              </span>
            </button>
            
            {showWarnings && (
              <div className="px-4 pb-4 space-y-3">
                {warnings.warnings.map((warning, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">{warning.header}</p>
                    <p className="text-sm text-gray-700">{warning.text}</p>
                    {warning.validFrom && warning.validTo && (
                      <p className="text-xs text-gray-500 mt-2">
                        Valid: {new Date(warning.validFrom).toLocaleString('en-IE')} to{' '}
                        {new Date(warning.validTo).toLocaleString('en-IE')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick a day
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dates.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Show only cool places
              </span>
              <button
                onClick={() => setSortByRecommended(!sortByRecommended)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sortByRecommended ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sortByRecommended ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={checkSunnyDay}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Checking weather...
                </>
              ) : (
                'Check if it\'s sunny'
              )}
            </button>
          </div>
        </div>

        {results && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {results.anySunny ? (
              <>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Sun className="text-yellow-500" size={32} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Yes! {results.locations.length} sunny {results.locations.length === 1 ? 'place' : 'places'} found
                  </h2>
                </div>
                <div className="space-y-3">
                  {results.locations.map((location, idx) => {
                    const Icon = location.forecast.weather.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          {sortByRecommended && <Star className="text-yellow-600" size={20} />}
                          {!sortByRecommended && <MapPin className="text-blue-600" size={20} />}
                          <div>
                            <p className="font-semibold text-gray-900">{location.name}</p>
                            <p className="text-sm text-gray-600">
                              {location.forecast.weather.text} • {location.forecast.temperature.toFixed(1)}°C
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!sortByRecommended && userLocation && (
                            <span className="text-sm text-gray-500">
                              {location.distance.toFixed(0)} km away
                            </span>
                          )}
                          <Icon className="text-yellow-500" size={28} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Cloud className="mx-auto text-gray-400 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No ☹️</h2>
                <p className="text-gray-600">
                  Unfortunately, no sunny spots found on {dates.find(d => d.value === selectedDate)?.label.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Weather data from Met Éireann</p>
          <p className="text-xs mt-1">
            © Met Éireann · <a href="https://www.met.ie" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">met.ie</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
