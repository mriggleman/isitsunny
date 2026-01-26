export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }

  const url = `https://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${lat};long=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        // Some Met Éireann endpoints are picky
        'User-Agent': 'is-it-sunny-in-ireland/1.0'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(await response.text());
    }

    const data = await response.text();

    // CORS headers (important!)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Met Éireann data' });
  }
}
