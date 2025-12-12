import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TbGitFork, 
  TbGitCommit, 
  TbCode, 
  TbCalendarStats,
  TbActivity,
  TbFlame,
  TbStar,
  TbExternalLink
} from "react-icons/tb";

// --- HELPER COMPONENTS ---

const AnimatedCounter = ({ end, duration = 2000, loading = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (loading) return;
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, loading]);

  return <span>{count.toLocaleString()}</span>;
};

const Card = ({ children, className = "", ...props }) => (
  <motion.div
    className={`relative overflow-hidden rounded-xl border border-white/20 
      bg-gradient-to-br from-[rgba(17,25,40,0.9)] to-[rgba(30,41,59,0.8)] 
      backdrop-blur-md shadow-lg transition-all duration-300
      hover:shadow-xl hover:border-[#854CE6]/50 hover:-translate-y-1 ${className}`}
    style={{
      boxShadow: 'rgba(23, 92, 230, 0.3) 0px 8px 32px, inset rgba(255, 255, 255, 0.1) 0px 1px 0px'
    }}
    {...props}
  >
    {children}
  </motion.div>
);

const StatCard = ({ icon, value, label, loading, delay = 0 }) => (
  <Card 
    className="p-6 group cursor-pointer relative flex flex-col justify-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02, y: -4 }}
  >
    <div className="flex items-center space-x-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg group-hover:shadow-[#854CE6]/25 transition-shadow">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-[#F2F3F4] truncate">
          {loading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-[#1C1E27]"></div>
          ) : (
            <AnimatedCounter end={value} loading={loading} />
          )}
        </div>
        <p className="text-sm font-medium text-[#b1b2b3] truncate">{label}</p>
      </div>
    </div>
  </Card>
);

const PinnedRepoCard = ({ repo, delay }) => (
  <Card 
    className="p-5 flex flex-col h-full hover:border-[#854CE6]/40"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 text-[#667eea]">
        <TbCode className="h-5 w-5" />
        <h4 className="font-bold text-lg truncate text-[#F2F3F4]">{repo.name}</h4>
      </div>
      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[#b1b2b3] hover:text-[#F2F3F4]">
        <TbExternalLink />
      </a>
    </div>
    
    <p className="text-[#b1b2b3] text-sm mb-4 line-clamp-2 flex-grow">
      {repo.description || "No description available."}
    </p>

    <div className="flex items-center gap-4 text-xs text-[#b1b2b3] mt-auto">
      {repo.primaryLanguage && (
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.primaryLanguage.color }}></span>
          {repo.primaryLanguage.name}
        </div>
      )}
      <div className="flex items-center gap-1">
        <TbStar className="text-yellow-500" />
        {repo.stargazerCount}
      </div>
      <div className="flex items-center gap-1">
        <TbGitFork className="text-[#b1b2b3]" />
        {repo.forkCount}
      </div>
    </div>
  </Card>
);

const LanguageBar = ({ languages }) => {
  const totalSize = languages.reduce((acc, lang) => acc + lang.size, 0);
  
  return (
      <div className="w-full">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#171721]">
        {languages.map((lang, i) => (
          <div 
            key={lang.name}
            style={{ width: `${(lang.size / totalSize) * 100}%`, backgroundColor: lang.color }}
            className="h-full"
            title={`${lang.name}: ${Math.round((lang.size / totalSize) * 100)}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 justify-center">
        {languages.slice(0, 5).map(lang => (
          <div key={lang.name} className="flex items-center gap-2 text-sm text-[#b1b2b3]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }}></span>
            <span className="font-medium">{lang.name}</span>
            <span className="text-[#b1b2b3]/60 text-xs">
              {Math.round((lang.size / totalSize) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CHART COMPONENT WITH AXIS LABELS ---

const InteractiveChart = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [viewportStart, setViewportStart] = useState(0); 
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef(null);
  const initializedRef = useRef(false);
  
  const MIN_ZOOM = 0.5; const MAX_ZOOM = 4; const BASE_DAYS = 14; 
  const currentVisibleDays = Math.round(BASE_DAYS / zoomLevel);

  useEffect(() => {
    const handleResize = () => { if (chartRef.current) setChartDimensions({ width: chartRef.current.offsetWidth, height: 400 }); };
    handleResize(); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (data.length > 0 && !initializedRef.current) { setViewportStart(Math.max(0, data.length - BASE_DAYS)); initializedRef.current = true; }
  }, [data.length]);

  useEffect(() => {
    const maxStart = Math.max(0, data.length - currentVisibleDays);
    if (viewportStart > maxStart) setViewportStart(maxStart);
  }, [data.length, currentVisibleDays, viewportStart]);

  if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-[#b1b2b3]">Loading chart...</div>;

  // INCREASED MARGINS FOR AXIS LABELS
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const chartWidth = Math.max(chartDimensions.width, 600) - margin.left - margin.right;
  const chartHeight = 400 - margin.top - margin.bottom;
  
  const visibleData = data.slice(viewportStart, viewportStart + currentVisibleDays);
  const yValues = visibleData.map(d => d.count);
  const maxY = Math.max(...yValues, 5); 
  const minY = 0;
  
  const scaleX = (index) => margin.left + (index / (visibleData.length - 1)) * chartWidth;
  const scaleY = (val) => margin.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
  
  const linePath = visibleData.length > 1 ? visibleData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.count)}`).join(' ') : '';
  const areaPath = visibleData.length > 1 ? `${linePath} L ${scaleX(visibleData.length - 1)} ${margin.top + chartHeight} L ${scaleX(0)} ${margin.top + chartHeight} Z` : '';

  const handleZoom = (delta) => setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * delta)));
  const handlePanMove = (e) => {
    if (!isPanning) return;
    const deltaX = e.clientX - panStart.x;
    const daysMoved = Math.round(-deltaX / (chartWidth / currentVisibleDays));
    if (daysMoved !== 0) { setViewportStart(prev => Math.max(0, Math.min(data.length - currentVisibleDays, prev + daysMoved))); setPanStart({ x: e.clientX, y: e.clientY }); }
  };

  return (
    <div ref={chartRef} className="w-full relative select-none">
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex items-center bg-[#171721] rounded-lg p-1 border border-white/20">
          <button onClick={() => handleZoom(0.8)} className="px-3 py-1 hover:bg-[#1C1E27] rounded text-[#F2F3F4]">-</button>
          <span className="px-3 text-xs text-[#b1b2b3]">{currentVisibleDays} days view</span>
          <button onClick={() => handleZoom(1.2)} className="px-3 py-1 hover:bg-[#1C1E27] rounded text-[#F2F3F4]">+</button>
        </div>
      </div>
      
      <div className="h-[400px] cursor-grab active:cursor-grabbing"
           onMouseDown={e => { setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY }); }}
           onMouseMove={handlePanMove} onMouseUp={() => setIsPanning(false)} onMouseLeave={() => setIsPanning(false)}>
        <svg width="100%" height="400" className="overflow-visible">
          <defs><linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#854CE6" stopOpacity="0.4" /><stop offset="100%" stopColor="#854CE6" stopOpacity="0" /></linearGradient></defs>
          
          {/* Y-AXIS GRID & LABELS */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => { 
            const y = margin.top + chartHeight * (1 - t);
            const value = Math.round(minY + (maxY - minY) * t);
            return (
              <g key={t}>
                <line x1={margin.left} y1={y} x2={margin.left + chartWidth} y2={y} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
                <text x={margin.left - 10} y={y + 4} textAnchor="end" fill="#b1b2b3" fontSize="11" fontWeight="500">
                  {value}
                </text>
              </g>
            ); 
          })}

          {/* X-AXIS LABELS */}
          {visibleData.map((d, i) => {
            const interval = Math.ceil(visibleData.length / 6);
            if (i % interval !== 0 && i !== visibleData.length - 1) return null;
            const x = scaleX(i);
            const dateStr = new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return (
              <text key={i} x={x} y={margin.top + chartHeight + 20} textAnchor="middle" fill="#b1b2b3" fontSize="11" fontWeight="500">
                {dateStr}
              </text>
            );
          })}

          <path d={areaPath} fill="url(#chartGradient)" />
          <path d={linePath} fill="none" stroke="#854CE6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {visibleData.map((d, i) => {
            const x = scaleX(i); const y = scaleY(d.count); const actualIndex = viewportStart + i;
            return (
              <g key={actualIndex} onMouseEnter={() => setHoveredPoint(actualIndex)} onMouseLeave={() => setHoveredPoint(null)}>
                <circle cx={x} cy={y} r={15} fill="transparent" />
                <circle cx={x} cy={y} r={hoveredPoint === actualIndex ? 6 : 4} fill="#fff" stroke="#854CE6" strokeWidth="2" />
                <AnimatePresence>
                  {hoveredPoint === actualIndex && (
                    <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <rect x={x - 60} y={y - 70} width="120" height="50" rx="6" fill="#171721" stroke="rgba(255, 255, 255, 0.2)" />
                      <text x={x} y={y - 45} textAnchor="middle" fill="#F2F3F4" fontSize="12" fontWeight="bold">{new Date(d.date).toLocaleDateString()}</text>
                      <text x={x} y={y - 28} textAnchor="middle" fill="#b1b2b3" fontSize="11">Contributions: <tspan fill="#854CE6" fontWeight="bold">{d.count}</tspan></text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---

const GitHubDashboard = () => {
  const [stats, setStats] = useState({
    repos: 0, commits: 0, lastMonth: 0, activeDays: 0,
    languages: [], pinnedRepos: [],
    loading: true, error: false
  });
  const [contributionData, setContributionData] = useState([]);
  const USERNAME = "ashishmaurya57"; 

  useEffect(() => { fetchGitHubData(); }, []);

  const fetchGitHubData = async () => {
    // SUPPORTS BOTH VITE AND CRA/NEXT ENV VARS
    const token = process.env.REACT_APP_GITHUB_TOKEN || 
                  (import.meta.env && import.meta.env.VITE_GITHUB_TOKEN);

    if (!token) {
      console.error("No GitHub Token found! Please set REACT_APP_GITHUB_TOKEN or VITE_GITHUB_TOKEN in your .env file.");
      setStats(prev => ({ ...prev, loading: false, error: true }));
      return;
    }

    const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
            totalCount
            nodes {
              name
              languages(first: 5) {
                edges { size node { name color } }
              }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage { name color }
              }
            }
          }
          contributionsCollection {
            totalCommitContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { contributionCount date }
              }
            }
          }
        }
      }
    `;

    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { username: USERNAME } })
      });

      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0].message);
      const user = json.data.user;

      // 1. Process Contributions
      const flatContributions = user.contributionsCollection.contributionCalendar.weeks
        .flatMap(week => week.contributionDays)
        .map(day => ({ date: day.date, count: day.contributionCount }));
      
      const last30Days = flatContributions.slice(-30);

      // 2. Process Languages
      const langMap = {};
      user.repositories.nodes.forEach(repo => {
        if (repo.languages) {
          repo.languages.edges.forEach(edge => {
            if (langMap[edge.node.name]) {
              langMap[edge.node.name].size += edge.size;
            } else {
              langMap[edge.node.name] = { name: edge.node.name, color: edge.node.color, size: edge.size };
            }
          });
        }
      });
      const sortedLangs = Object.values(langMap).sort((a, b) => b.size - a.size).slice(0, 6);

      setStats({
        repos: user.repositories.totalCount,
        commits: user.contributionsCollection.totalCommitContributions,
        lastMonth: last30Days.reduce((sum, day) => sum + day.count, 0),
        activeDays: last30Days.filter(day => day.count > 0).length,
        pinnedRepos: user.pinnedItems.nodes,
        languages: sortedLangs,
        loading: false, error: false
      });
      setContributionData(flatContributions);
    } catch (err) {
      console.error("GitHub Fetch Error:", err);
      setStats(prev => ({ ...prev, loading: false, error: true }));
    }
  };

  const statCards = [
    { icon: <TbCode />, value: stats.repos, label: "Repositories" },
    { icon: <TbGitCommit />, value: stats.commits, label: "Total Commits (Year)" },
    { icon: <TbCalendarStats />, value: stats.lastMonth, label: "Contributions (30 Days)" },
    { icon: <TbFlame />, value: stats.activeDays, label: "Active Days (30 Days)" },
  ];

  return (
    <div id="github-dashboard" className="min-h-screen flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-6xl space-y-12">
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            GitHub Analytics
          </h2>
          <p className="text-[#b1b2b3]">Live data fetched via GraphQL</p>
        </div>

        {/* 1. KEY STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <StatCard key={i} {...stat} loading={stats.loading} delay={i * 0.1} />
          ))}
        </div>

        {/* 2. PINNED REPOSITORIES & LANGUAGES */}
        {!stats.loading && !stats.error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Languages */}
            <Card className="p-6 lg:col-span-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-[#F2F3F4] mb-6 flex items-center gap-2">
                <TbCode className="text-[#854CE6]" />
                Most Used Languages
              </h3>
              <LanguageBar languages={stats.languages} />
            </Card>

            {/* Right: Pinned Repos Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               {stats.pinnedRepos.map((repo, i) => (
                 <PinnedRepoCard key={repo.name} repo={repo} delay={i * 0.1} />
               ))}
            </div>
          </div>
        )}

        {/* 3. CONTRIBUTION CHART */}
        {!stats.loading && !stats.error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[rgba(17,25,40,0.9)] to-[rgba(30,41,59,0.8)] border border-white/20 rounded-xl p-6"
            style={{
              boxShadow: 'rgba(23, 92, 230, 0.3) 0px 8px 32px, inset rgba(255, 255, 255, 0.1) 0px 1px 0px'
            }}
          >
            <h3 className="text-xl font-semibold text-[#F2F3F4] mb-6 flex items-center gap-2">
              <TbActivity className="text-[#854CE6]" />
              Contribution History
            </h3>
            <InteractiveChart data={contributionData} />
          </motion.div>
        )}

        {/* ERROR MESSAGE */}
        {stats.error && (
          <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/20">
            Failed to load GitHub data. Check your Token and Internet connection.
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubDashboard;