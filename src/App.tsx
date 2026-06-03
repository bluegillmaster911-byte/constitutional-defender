import { useState } from 'react'
import { Home, Users, Scale, BookOpen, User } from 'lucide-react'

type Screen = 'home' | 'characters' | 'courtroom' | 'evidence' | 'case-studies' | 'profile'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')

  const navItems = [
    { id: 'home' as Screen, label: 'Home', icon: Home },
    { id: 'characters' as Screen, label: 'Characters', icon: Users },
    { id: 'courtroom' as Screen, label: 'Courtroom', icon: Scale },
    { id: 'evidence' as Screen, label: 'Evidence', icon: BookOpen },
    { id: 'case-studies' as Screen, label: 'Case Studies', icon: BookOpen },
    { id: 'profile' as Screen, label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-[#0f1629] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Constitutional Defender</h1>
            <p className="text-xs text-slate-400">Courtroom Simulation</p>
          </div>
          <div className="text-sm text-slate-400">Counselor • Tier 3</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* HOME SCREEN */}
        {currentScreen === 'home' && (
          <div>
            <h2 className="text-3xl font-semibold mb-2">Welcome back, Counselor</h2>
            <p className="text-slate-400 mb-8">Ready to defend the Constitution today?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
                <div className="text-blue-400 text-sm mb-1">CURRENT RANK</div>
                <div className="text-2xl font-semibold">Senior Counsel</div>
                <div className="text-emerald-400 mt-4">12,450 Reputation</div>
              </div>
              <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
                <div className="text-blue-400 text-sm mb-1">CASES WON</div>
                <div className="text-4xl font-semibold">47</div>
              </div>
              <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6">
                <div className="text-blue-400 text-sm mb-1">NEXT GOAL</div>
                <div className="text-lg">Lead Attorney</div>
                <div className="text-xs text-slate-500 mt-1">7,550 reputation needed</div>
              </div>
            </div>
          </div>
        )}

        {/* CHARACTERS SCREEN */}
        {currentScreen === 'characters' && (
          <div>
            <h2 className="text-3xl font-semibold mb-2">Characters</h2>
            <p className="text-slate-400 mb-8">Your team and the courtroom NPCs</p>

            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">Your Team</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Elena Rodriguez", role: "Lead Counsel", image: "/characters/elena-rodriguez.jpg" },
                  { name: "James Mitchell", role: "Junior Associate", image: "/characters/james-mitchell.jpg" },
                  { name: "Marcus Williams", role: "Constitutional Expert", image: "/characters/marcus-williams.jpg" },
                  { name: "Sarah Chen", role: "Trial Strategist", image: "/characters/sarah-chen.jpg" },
                ].map((char, i) => (
                  <div key={i} className="group bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <img src={char.image} alt={char.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-5">
                      <div className="font-semibold text-xl tracking-tight">{char.name}</div>
                      <div className="inline-block mt-2 px-3 py-0.5 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
                        {char.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-amber-400">Courtroom NPCs</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: "Judge Chen", role: "Presiding Judge", image: "/characters/judge-chen.jpg" },
                  { name: "Prosecutor Stone", role: "Lead Prosecutor", image: "/characters/prosecutor-stone.jpg" },
                  { name: "Clerk Williams", role: "Court Clerk", image: "/characters/clerk-williams.jpg" },
                  { name: "Defendant Rivera", role: "The Accused", image: "/characters/defendant-rivera.jpg" },
                  { name: "Mentor Richardson", role: "Senior Advisor", image: "/characters/mentor-richardson.jpg" },
                ].map((npc, i) => (
                  <div key={i} className="group bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <img src={npc.image} alt={npc.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4 text-center">
                      <div className="font-semibold text-lg">{npc.name}</div>
                      <div className="text-amber-400 text-sm mt-1">{npc.role}</
