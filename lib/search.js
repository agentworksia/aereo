const AIRPORTS = {
  'sao paulo': 'GRU',
  'sao paulo guarulhos': 'GRU',
  'guarulhos': 'GRU',
  'campinas': 'VCP',
  'rio de janeiro': 'GIG',
  'rio': 'GIG',
  'belo horizonte': 'CNF',
  'belo': 'CNF',
  'salvador': 'SSA',
  'porto alegre': 'POA',
  'curitiba': 'CWB',
  'recife': 'REC',
  'fortaleza': 'FOR',
  'brasilia': 'BSB',
  'brasilia': 'BSB',
  'manaus': 'MAO',
  'florianopolis': 'FLN',
  'natal': 'NAT'
};

function normalizeAirportCode(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  if (!trimmed) return '';
  const upper = trimmed.toUpperCase();
  if (/^[A-Z]{3}$/.test(upper)) return upper;

  const normalized = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  if (AIRPORTS[normalized]) return AIRPORTS[normalized];
  return '';
}

function buildSearchQuery(origin, destination, date) {
  const originCode = normalizeAirportCode(origin);
  const destinationCode = normalizeAirportCode(destination);
  const route = originCode && destinationCode ? `${originCode}-${destinationCode}` : `${origin || 'origem'}-${destination || 'destino'}`;
  return `${route} ${date || ''}`.trim();
}

module.exports = {
  AIRPORTS,
  normalizeAirportCode,
  buildSearchQuery
};
