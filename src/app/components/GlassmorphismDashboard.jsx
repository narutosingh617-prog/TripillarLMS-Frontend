import React from 'react';

const GlassmorphismDashboard = () => {
  const games = [
    {
      id: 1,
      title: "Cyber Odyssey",
      version: "v2.4.1",
      progress: 75,
      image: "🎮",
      color: "from-blue-500 to-cyan-400",
      accent: "bg-cyan-400"
    },
    {
      id: 2,
      title: "Starfield Elite",
      version: "v1.8.0",
      progress: 45,
      image: "🚀",
      color: "from-purple-500 to-pink-400",
      accent: "bg-pink-400"
    },
    {
      id: 3,
      title: "Fantasy Realms",
      version: "v3.2.1",
      progress: 90,
      image: "🐉",
      color: "from-orange-500 to-yellow-400",
      accent: "bg-yellow-400"
    }
  ];

  const stats = [
    { label: "Total Hours", value: "248h", emoji: "⏱️", color: "from-blue-400 to-cyan-400" },
    { label: "Achievements", value: "156", emoji: "🏆", color: "from-yellow-400 to-orange-400" },
    { label: "Level", value: "Lv. 42", emoji: "⚡", color: "from-purple-400 to-pink-400" },
    { label: "Rank", value: "#42", emoji: "🔥", color: "from-red-400 to-pink-400" }
  ];

  const quickActions = [
    { emoji: "🎁", label: "Daily Rewards", color: "from-green-400 to-emerald-400" },
    { emoji: "🏅", label: "Leaderboard", color: "from-yellow-400 to-orange-400" },
    { emoji: "📦", label: "Inventory", color: "from-purple-400 to-indigo-400" },
    { emoji: "💎", label: "Shop", color: "from-cyan-400 to-blue-400" },
    { emoji: "🎫", label: "Events", color: "from-pink-400 to-red-400" },
    { emoji: "👥", label: "Clan", color: "from-teal-400 to-green-400" }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Background Blurred Colorful Shapes */}
      <div className="absolute top-10 -left-10 w-96 h-96 bg-cyan-400/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 -right-10 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-400/20 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-pink-500/25 rounded-full blur-[80px]"></div>
      <div className="absolute top-40 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-[60px]"></div>
      <div className="absolute bottom-40 right-1/3 w-32 h-32 bg-green-400/20 rounded-full blur-[60px]"></div>

      {/* Main Glass Container */}
      <div className="w-[90%] mx-auto my-6 rounded-[30px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[95vh]">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-72 p-6 lg:p-8 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Profile Image with Colorful Ring */}
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 blur-md"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl border-2 border-white/30">
                <span>👤</span>
              </div>
              {/* Online Status */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            
            {/* Name with Gradient Text */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-1">
              Alex Gaming
            </h2>
            <p className="text-white/60 text-sm mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Online Now
            </p>

            {/* XP Bar */}
            <div className="w-full mb-6">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>Level 42</span>
                <span>8500 / 10000 XP</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Menu List */}
            <nav className="w-full flex-1">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white border border-white/10 transition-all duration-300 hover:from-cyan-500/40 hover:to-purple-500/40">
                    <span className="text-lg">🎮</span>
                    <span className="font-semibold">My Games</span>
                    <span className="ml-auto bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
                    <span className="text-lg">🏆</span>
                    <span className="font-medium">Tournaments</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
                    <span className="text-lg">👥</span>
                    <span className="font-medium">Friends</span>
                    <span className="ml-auto text-white/40 text-xs">124</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
                    <span className="text-lg">💬</span>
                    <span className="font-medium">Messages</span>
                    <span className="ml-auto bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
                    <span className="text-lg">🎬</span>
                    <span className="font-medium">Streams</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
                    <span className="text-lg">⚙️</span>
                    <span className="font-medium">Settings</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Wallet Balance */}
            <div className="w-full mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="text-white/60 text-xs">Balance</p>
                    <p className="text-white font-bold">$1,250</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  + Add
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button className="w-full px-4 py-3 rounded-2xl text-white/70 bg-white/5 hover:bg-red-500/30 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 hover:border-red-400/30">
              <span>🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  Active <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Games</span>
                </h1>
                <p className="text-white/60">Continue your epic adventures</p>
              </div>

              {/* Glass Search Bar */}
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search games..." 
                  className="w-full md:w-80 px-5 py-3.5 pl-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all duration-300"
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">🔍</span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/50">⌘</kbd>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/50">K</kbd>
                </div>
              </div>
            </div>

            {/* Stats Row - Colorful */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="relative group rounded-2xl p-5 bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                  <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white flex items-center gap-2">
                    <span>{stat.emoji}</span>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Game Cards */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>🎯</span> Continue Playing
              </h2>
              
              {games.map((game) => (
                <div 
                  key={game.id}
                  className="relative group bg-white/5 rounded-2xl p-4 lg:p-5 backdrop-blur-sm border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                >
                  {/* Decorative Glow */}
                  <div className={`absolute top-0 right-0 w-40 h-full bg-gradient-to-l ${game.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                  {/* Game Image */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {game.image}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs">▶️</span>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:${game.color.split(' ')[1]} transition-all">
                        {game.title}
                      </h3>
                      <span className="text-white/40 text-sm">{game.version}</span>
                    </div>
                    
                    {/* Progress Bar with Gradient */}
                    <div className="relative">
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${game.color} rounded-full transition-all duration-700 shadow-lg`}
                          style={{ width: `${game.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Percentage */}
                  <div className="text-right min-w-[80px]">
                    <p className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {game.progress}%
                    </p>
                    <p className="text-white/40 text-xs">Complete</p>
                  </div>

                  {/* Play Button */}
                  <button className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30">
                    <span className="text-xl">▶️</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Actions - Colorful Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className="relative group bg-white/5 hover:bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <span className="text-2xl group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">{action.emoji}</span>
                    <span className="text-white text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 p-5 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>📜</span> Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-400">✅</span>
                  <span className="text-white/70">Completed "Cyber Odyssey" achievement</span>
                  <span className="text-white/30 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white/70">Earned 500 XP</span>
                  <span className="text-white/30 ml-auto">5h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-purple-400">👥</span>
                  <span className="text-white/70">New friend request from @ProGamer123</span>
                  <span className="text-white/30 ml-auto">1d ago</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphismDashboard;
