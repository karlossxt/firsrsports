import API_CONFIG from './config.js';

const headers = {
  'x-apisports-key': API_CONFIG.API_KEY
};

// Cache helper
const cache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

async function fetchWithCache(endpoint, duration = CACHE_DURATION) {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.time < duration) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, { headers });
    const data = await response.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return cached ? cached.data : null;
  }
}

// Liga MX - Partidos por jornada
export async function getLigaMXFixtures(round = null) {
  let endpoint = `/fixtures?league=${API_CONFIG.LEAGUE_ID_LIGA_MX}&season=${API_CONFIG.SEASON}`;
  if (round) endpoint += `&round=${round}`;
  return fetchWithCache(endpoint, 300000); // 5 min cache
}

// Liga MX - Tabla de posiciones
export async function getLigaMXStandings() {
  const endpoint = `/standings?league=${API_CONFIG.LEAGUE_ID_LIGA_MX}&season=${API_CONFIG.SEASON}`;
  return fetchWithCache(endpoint, 300000); // 5 min cache
}

// Liga MX - Goleadores
export async function getLigaMXTopScorers() {
  const endpoint = `/players/topscorers?league=${API_CONFIG.LEAGUE_ID_LIGA_MX}&season=${API_CONFIG.SEASON}`;
  return fetchWithCache(endpoint, 3600000); // 1 hour cache
}

// Livescore - Partidos en vivo
export async function getLiveMatches() {
  const endpoint = `/fixtures?live=all`;
  return fetchWithCache(endpoint, 30000); // 30 sec cache
}

// Selección Mexicana - Próximos partidos
export async function getMexicoNextFixtures() {
  const endpoint = `/fixtures?team=${API_CONFIG.TEAM_ID_MEXICO}&next=5`;
  return fetchWithCache(endpoint, 3600000); // 1 hour cache
}

// Selección Mexicana - Últimos resultados
export async function getMexicoLastResults() {
  const endpoint = `/fixtures?team=${API_CONFIG.TEAM_ID_MEXICO}&last=5`;
  return fetchWithCache(endpoint, 3600000); // 1 hour cache
}

// Detalle de partido
export async function getMatchDetails(fixtureId) {
  const endpoint = `/fixtures?id=${fixtureId}`;
  return fetchWithCache(endpoint, 60000); // 1 min cache
}

// Estadísticas de partido
export async function getMatchStatistics(fixtureId) {
  const endpoint = `/fixtures/statistics?fixture=${fixtureId}`;
  return fetchWithCache(endpoint, 60000);
}
