export const config = {
  runtime: 'edge'
};

// Simple in-memory cache for Edge runtime
const cache = new Map();

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

  // Create cache key
  const cacheKey = `${lat}_${lon}`;
  const now = Date.now();
  const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Cache hit for ${lat},${lon}`);
    return new Response(cached.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=3600',
        'X-Cache': 'HIT'
      }
    });
  }

  // Met Éireann API requires 'long' parameter (not 'lon') and uses semicolon separator
  const url = `http://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${lat};long=${lon}`;

  try {
    console.log(`Fetching from Met Éireann: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IsSunnyInIreland/1.0)',
        'Accept': 'application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      console.error(`HTTP ${response.status} from Met Éireann API`);
      
      // If we have stale cache, return it on error
      if (cached) {
        console.log(`Returning stale cache for ${lat},${lon} due to API error`);
        return new Response(cached.data, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml',
            'Access-Control-Allow-Origin': '*',
            'X-Cache': 'STALE'
          }
        });
      }
      
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

    // Store in cache
    cache.set(cacheKey, {
      timestamp: now,
      data: xml
    });

    // Clean up old cache entries (simple cleanup)
    if (cache.size > 200) {
      const entries = Array.from(cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest 50 entries
      for (let i = 0; i < 50; i++) {
        cache.delete(entries[i][0]);
      }
    }

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=3600',
        'X-Cache': 'MISS'
      }
    });

  } catch (err) {
    console.error(`Error fetching from Met Éireann:`, err.message);
    
    // Return stale cache on error if available
    if (cached) {
      console.log(`Returning stale cache for ${lat},${lon} due to fetch error`);
      return new Response(cached.data, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'X-Cache': 'STALE'
        }
      });
    }
    
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
