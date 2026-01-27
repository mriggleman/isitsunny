export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: 'Missing lat or lon' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Round coordinates to 2 decimal places for better cache hit rates
  const roundedLat = Math.round(parseFloat(lat) * 100) / 100;
  const roundedLon = Math.round(parseFloat(lon) * 100) / 100;

  // Met Éireann API requires 'long' parameter (not 'lon') and uses semicolon separator
  const url = `http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${roundedLat};long=${roundedLon}`;

  try {
    console.log(`Fetching from Met Éireann: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IsSunnyInIreland/1.0)',
        'Accept': 'application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000),
      // Tell Vercel to cache this fetch request
      cf: {
        cacheTtl: 10800, // 3 hours
        cacheEverything: true
      }
    });

    if (!response.ok) {
      console.error(`HTTP ${response.status} from Met Éireann API`);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch Met Éireann data',
          details: `HTTP ${response.status}`,
          message: 'The Met Éireann API returned an error. Please try again later.'
        }), 
        {
          status: response.status,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const xml = await response.text();
    
    if (!xml.includes('<?xml') && !xml.includes('<weatherdata')) {
      console.error('Response does not appear to be valid XML');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Met Éireann',
          message: 'The API did not return valid weather data.'
        }), 
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        // Aggressive caching: 3 hours, plus serve stale for 1 day if API is down
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=86400, stale-if-error=86400',
        // Help Vercel identify this as cacheable
        'CDN-Cache-Control': 'public, s-maxage=10800',
      }
    });

  } catch (err) {
    console.error(`Error fetching from Met Éireann:`, err.message);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Met Éireann data',
        details: err.message,
        message: 'Unable to connect to the Met Éireann API. Please try again later.'
      }), 
      {
        status: 503,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
