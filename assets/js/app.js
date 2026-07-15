import { 
  getLigaMXFixtures, 
  getLigaMXStandings, 
  getLiveMatches,
  getMexicoNextFixtures,
  getMexicoLastResults
} from './api.js';

const { useState, useEffect } = React;

// Score Ticker Component
function ScoreTicker() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [ligaMXMatches, setLigaMXMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const live = await getLiveMatches();
      if (live?.response) {
        setLiveMatches(live.response.filter(m => m.league.id === 31));
      }
      
      const fixtures = await getLigaMXFixtures();
      if (fixtures?.response) {
        setLigaMXMatches(fixtures.response.slice(0, 10));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const matches = liveMatches.length > 0 ? liveMatches : ligaMXMatches;

  return (
    <div className="bg-[#080808] border-b border-white/10 h-[80px] overflow-hidden relative z-100">
      <div className="bg-f1-primary text-white font-header font-extrabold flex items-center px-6 text-[0.8rem] uppercase whitespace-nowrap z-20 h-full">
        {liveMatches.length > 0 ? '🔴 EN VIVO' : 'LIGA MX'}
      </div>
      <div className="flex animate-scroll whitespace-nowrap items-center h-full">
        {[...matches, ...matches].map((game, i) => (
          <div key={i} className="min-w-[280px] px-6 border-r border-white/10 py-2 flex flex-col justify-center">
            <div className="flex justify-between text-[0.6rem] font-bold text-white/40 uppercase">
              <span>{game.league?.name || 'LIGA MX'}</span>
              <span>{game.fixture?.date ? new Date(game.fixture.date).toLocaleDateString('es-MX') : ''}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center gap-2">
                <img src={game.teams?.home?.logo} className="w-5 h-5" alt="" />
                <span className="text-[0.8rem]">{game.teams?.home?.name}</span>
              </div>
              <span className="font-header text-f1-accent font-bold">
                {game.goals?.home ?? '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={game.teams?.away?.logo} className="w-5 h-5" alt="" />
                <span className="text-[0.8rem]">{game.teams?.away?.name}</span>
              </div>
              <span className="font-header text-f1-accent font-bold">
                {game.goals?.away ?? '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Standings Table Component
function StandingsTable() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchStandings = async () => {
      const data = await getLigaMXStandings();
      if (data?.response?.[0]?.league?.standings?.[0]) {
        setStandings(data.response[0].league.standings[0]);
      }
    };
    fetchStandings();
  }, []);

  if (standings.length === 0) return <div className="text-white p-4">Cargando tabla...</div>;

  return (
    <div className="bg-f1-card border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-1.5 h-8 bg-f1-accent"></div>
        <h3 className="font-header text-xl font-bold uppercase">Tabla de Posiciones</h3>
      </div>
      <table className="w-full text-sm">
        <thead className="text-[0.65rem] uppercase text-white/50">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">Equipo</th>
            <th className="text-center p-3">PJ</th>
            <th className="text-center p-3">Pts</th>
            <th className="text-center p-3">DG</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-3 text-white/50">{team.rank}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <img src={team.team.logo} className="w-6 h-6" alt="" />
                  <span className="font-medium">{team.team.name}</span>
                </div>
              </td>
              <td className="p-3 text-center text-white/70">{team.all.played}</td>
              <td className="p-3 text-center font-header font-bold text-f1-accent">{team.points}</td>
              <td className="p-3 text-center text-white/70">{team.goalsDiff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Mexico National Team Component
function MexicoSection() {
  const [nextMatches, setNextMatches] = useState([]);
  const [lastResults, setLastResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const next = await getMexicoNextFixtures();
      if (next?.response) setNextMatches(next.response);
      
      const last = await getMexicoLastResults();
      if (last?.response) setLastResults(last.response);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-10 bg-green-600"></div>
        <h2 className="font-header text-3xl font-bold uppercase tracking-tight">
          Selección Mexicana 🇲🇽
        </h2>
      </div>

      {/* Próximos partidos */}
      <div className="bg-f1-card border border-white/10 rounded-xl p-6">
        <h3 className="font-header text-lg font-bold uppercase mb-4 text-f1-accent">Próximos Partidos</h3>
        {nextMatches.length > 0 ? (
          <div className="space-y-4">
            {nextMatches.map((match) => (
              <div key={match.fixture.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4">
                  <img src={match.teams.home.logo} className="w-10 h-10" alt="" />
                  <div>
                    <div className="font-medium">{match.teams.home.name}</div>
                    <div className="text-white/50 text-sm">vs</div>
                    <div className="font-medium">{match.teams.away.name}</div>
                  </div>
                  <img src={match.teams.away.logo} className="w-10 h-10" alt="" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/50">{match.league.name}</div>
                  <div className="text-f1-accent font-bold">
                    {new Date(match.fixture.date).toLocaleDateString('es-MX', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-sm">{match.fixture.date ? new Date(match.fixture.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/50">No hay partidos programados</p>
        )}
      </div>

      {/* Últimos resultados */}
      <div className="bg-f1-card border border-white/10 rounded-xl p-6">
        <h3 className="font-header text-lg font-bold uppercase mb-4">Últimos Resultados</h3>
        {lastResults.length > 0 ? (
          <div className="space-y-3">
            {lastResults.map((match) => (
              <div key={match.fixture.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={match.teams.home.logo} className="w-8 h-8" alt="" />
                  <span className="font-medium">{match.teams.home.name}</span>
                </div>
                <div className="font-header text-xl font-bold text-f1-accent">
                  {match.goals.home} - {match.goals.away}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{match.teams.away.name}</span>
                  <img src={match.teams.away.logo} className="w-8 h-8" alt="" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/50">Cargando resultados...</p>
        )}
      </div>
    </div>
  );
}

// Upcoming Liga MX Fixtures
function LigaMXFixtures() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      const data = await getLigaMXFixtures();
      if (data?.response) {
        setFixtures(data.response.filter(f => f.fixture.status.short === 'NS').slice(0, 9));
      }
    };
    fetchFixtures();
  }, []);

  if (fixtures.length === 0) return null;

  return (
    <div className="bg-f1-card border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-8 bg-f1-accent"></div>
        <h3 className="font-header text-lg font-bold uppercase">Próximos Partidos Liga MX</h3>
      </div>
      <div className="space-y-3">
        {fixtures.map((match) => (
          <div key={match.fixture.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <img src={match.teams.home.logo} className="w-8 h-8" alt="" />
              <span className="font-medium text-sm">{match.teams.home.name}</span>
            </div>
            <div className="text-center">
              <div className="text-f1-accent font-bold">
                {new Date(match.fixture.date).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-white/50">
                {new Date(match.fixture.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-sm">{match.teams.away.name}</span>
              <img src={match.teams.away.logo} className="w-8 h-8" alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App
function App() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-f1-bg text-white">
      {/* Header */}
      <header className="sticky top-0 z-[2000] bg-black/90 backdrop-blur-md border-b border-white/10 px-[5%] py-4 flex items-center justify-between">
        <a href="index.html" className="flex items-center gap-3 group">
          <img src="logof1.png" className="h-10 w-auto rounded" alt="Logo" />
          <span className="font-header font-bold italic text-2xl tracking-tighter uppercase">
            F1RST<span className="text-f1-accent group-hover:text-white transition-colors">SPORTS</span>
          </span>
        </a>
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="font-header font-bold text-sm uppercase tracking-wider text-f1-accent">Inicio</a>
          <a href="#" className="font-header font-bold text-sm uppercase tracking-wider text-f1-muted hover:text-f1-accent transition-colors">Liga MX</a>
          <a href="#" className="font-header font-bold text-sm uppercase tracking-wider text-f1-muted hover:text-f1-accent transition-colors">Selección</a>
          <a href="#" className="font-header font-bold text-sm uppercase tracking-wider text-f1-muted hover:text-f1-accent transition-colors">Estadísticas</a>
          <a href="mundial-2026.html" className="bg-f1-primary px-6 py-2 rounded font-bold uppercase text-xs tracking-widest">Mundial '26</a>
        </nav>
      </header>

      {/* Score Ticker */}
      <ScoreTicker />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto w-full px-5 py-10">
        {/* Hero Banner */}
        <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden rounded-xl border-b-4 border-f1-accent bg-black mb-10">
          <img src="mexico-grupo.jpg" className="absolute inset-0 w-full h-full object-cover brightness-50" alt="Selección Mexicana" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-10">
            <span className="bg-green-600 text-white font-header font-extrabold text-[0.75rem] px-3 py-1 rounded-sm uppercase mb-4 inline-block">
              SELECCIÓN MEXICANA
            </span>
            <h1 className="font-header text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter max-w-4xl mb-4">
              Portal del Fútbol Mexicano
            </h1>
            <p className="text-white/70 text-lg max-w-2xl">
              Resultados en vivo, estadísticas y noticias de la Liga MX y la Selección Mexicana
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <LigaMXFixtures />
            <MexicoSection />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <StandingsTable />
            
            {/* World Cup 2026 Banner */}
            <div className="bg-gradient-to-br from-f1-primary to-blue-900 rounded-xl p-6 border border-white/10">
              <h3 className="font-header text-lg font-bold uppercase mb-2">Mundial 2026 🏆</h3>
              <p className="text-white/70 text-sm mb-4">
                México como anfitrión. Sigue toda la cobertura del torneo más grande del mundo.
              </p>
              <a href="mundial-2026.html" className="inline-block bg-white text-black font-bold px-6 py-2 rounded text-sm uppercase tracking-wider hover:bg-f1-accent transition-colors">
                Ver más
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-20 px-5 text-center mt-auto">
        <div className="mb-6">
          <span className="font-header font-black italic text-5xl tracking-tighter uppercase">F1RST<span className="text-f1-accent">SPORTS</span></span>
        </div>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-white text-[0.8rem] md:text-[0.95rem] font-bold uppercase tracking-widest leading-relaxed">
            SIEMPRE PR1MERO EN LA INFORMACIÓN DEPORTIVA. RESULTADOS EN VIVO Y ESTADÍSTICAS DEL FÚTBOL MEXICANO.
          </p>
        </div>
        <div className="flex justify-center gap-10 mb-16 text-3xl text-white">
          <i className="fa-brands fa-facebook hover:text-f1-accent cursor-pointer"></i>
          <i className="fa-brands fa-x-twitter hover:text-f1-accent cursor-pointer"></i>
          <i className="fa-brands fa-instagram hover:text-f1-accent cursor-pointer"></i>
        </div>
        <div className="text-[0.65rem] text-white/30 font-black uppercase tracking-[0.3em]">
          &copy; 2026 F1RSTSPORTS MEDIA. TODOS LOS DERECHOS RESERVADOS.
        </div>
        <div className="text-[0.6rem] text-white/20 mt-4">
          Datos proporcionados por <a href="https://www.api-football.com" className="underline hover:text-white/50">API-Football</a>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
