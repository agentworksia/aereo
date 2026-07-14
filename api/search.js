const https = require('https');
const { normalizeAirportCode, buildSearchQuery } = require('../lib/search');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { origin, destination, date, returnDate, type } = req.query;
  const originCode = normalizeAirportCode(origin || '');
  const destinationCode = normalizeAirportCode(destination || '');

  if (type === 'miles') {
    const programs = [
      { name: 'Azul Fidelidade', url: `https://www.google.com/search?q=${encodeURIComponent(`site:azul.com.br fidelidade ${destination || 'rota'} ${date || ''}`)}` },
      { name: 'LATAM Pass', url: `https://www.google.com/search?q=${encodeURIComponent(`site:latam.com.br pass ${destination || 'rota'} ${date || ''}`)}` },
      { name: 'Smiles', url: `https://www.google.com/search?q=${encodeURIComponent(`site:smiles.com.br ${destination || 'rota'} ${date || ''}`)}` }
    ];
    res.status(200).json({ programs });
    return;
  }

  const query = buildSearchQuery(origin, destination, date);
  const routeQuery = `${originCode || origin || 'origem'}-${destinationCode || destination || 'destino'}`;
  const searchUrl = `https://api.aviationstack.com/v1/flights?access_key=demo&dep_iata=${originCode || 'GRU'}&arr_iata=${destinationCode || 'GIG'}`;

  try {
    const payload = await fetchJson(searchUrl);
    const flights = (payload.data || []).slice(0, 6).map((flight) => ({
      airline: flight.airline?.name || 'Companhia aérea',
      flightNumber: flight.flight?.number || 'N/A',
      departure: flight.departure?.scheduled || '',
      arrival: flight.arrival?.scheduled || '',
      price: 'Verifique no site da companhia',
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`${flight.airline?.name || 'voo'} ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}`
    }));

    res.status(200).json({
      origin,
      destination,
      date,
      returnDate,
      routeQuery,
      query,
      flights: flights.length ? flights : [
        { airline: 'Azul', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`Azul ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` },
        { airline: 'LATAM', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`LATAM ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` },
        { airline: 'GOL', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`GOL ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` }
      ]
    });
  } catch (error) {
    res.status(200).json({
      origin,
      destination,
      date,
      returnDate,
      routeQuery,
      query,
      flights: [
        { airline: 'Azul', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`Azul ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` },
        { airline: 'LATAM', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`LATAM ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` },
        { airline: 'GOL', flightNumber: 'N/A', departure: '', arrival: '', price: 'Disponível em site oficial', searchUrl: `https://www.google.com/search?q=${encodeURIComponent(`GOL ${origin || 'origem'} ${destination || 'destino'} ${date || ''}`)}` }
      ]
    });
  }
};
