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

  // Try multiple URL formats for Met Éireann
  const urls = [
    `https://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${lat};long=${lon}`,
    `https://prodapi.metweb.ie/location/forecast/${lat}/${lon}`,
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      console.log(`Attempting to fetch: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IsSunnyInIreland/1.0)',
          'Accept': 'application/xml, text/xml, */*',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        console.error(`HTTP ${response.status} from ${url}`);
        lastError = `HTTP ${response.status}`;
        continue;
      }

      const xml = await response.text();
      
      // Basic validation that we got XML
      if (!xml.includes('<?xml') && !xml.includes('<weatherdata')) {
        console.error('Response does not appear to be XML');
        lastError = 'Invalid XML response';
        continue;
      }

      return new Response(xml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=3600',
        }
      });

    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  // All attempts failed
  return new Response(
    JSON.stringify({ 
      error: 'Failed to fetch Met Éireann data',
      details: lastError,
      message: 'All API endpoints failed. The service may be temporarily unavailable.'
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
