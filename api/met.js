export const config = {
  runtime: 'nodejs18.x'
};

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }

  const url = `https://openaccess.pf.api.met.ie/metno-wdb2ts/locationforecast?lat=${lat};long=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'isitsunny/1.0'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const xml = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=10800');

    res.status(200).send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Met Éireann data' });
  }
}
