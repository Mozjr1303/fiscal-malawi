import { Link } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Zap, Lock, ArrowRight, CheckCircle2, 
  BarChart3, Globe, Smartphone, Users, ChevronRight, PlayCircle,
  Database, Fingerprint, Search, Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('retail');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const industrySolutions = {
    retail: {
      title: "Retail & POS Ingestion",
      desc: "Connect your local POS systems directly to our cloud. Automatically monitor inventory spikes and unusual transaction volumes at the till.",
      features: ["MRA EFD Integration Ready", "Night-shift anomaly detection", "Inventory-linked fraud checks"]
    },
    fintech: {
      title: "Fintech & Mobile Money",
      desc: "Secure your mobile wallet ecosystems. Detect velocity attacks on Airtel Money and TNM Mpamba integrations in milliseconds.",
      features: ["Transaction velocity monitoring", "Wallet balance integrity checks", "High-volume batch processing"]
    },
    banking: {
      title: "Enterprise Banking",
      desc: "Bank-grade oversight for internal operations and customer-facing digital services. Audit every movement with AI precision.",
      features: ["Compliance audit logs", "Internal threat detection", "Customer behavioral profiling"]
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-300 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <Activity className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">FISCALTECH</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-400">
              <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
              <a href="#platform" className="hover:text-white transition-colors">Platform</a>
              <a href="#impact" className="hover:text-white transition-colors">Impact</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-widest">
                Login
              </Link>
              <Link to="/login" className="bg-white text-slate-950 px-8 py-3.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/10 flex items-center gap-2 group">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-56 overflow-hidden">
        {/* Abstract Background Particles (Simulating the 3D grid in image) */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none overflow-hidden">
          <div className="grid grid-cols-12 gap-4 -rotate-12 translate-x-20">
            {[...Array(48)].map((_, i) => (
              <div key={i} className={`h-16 w-16 rounded-xl border border-indigo-500/30 ${i % 7 === 0 ? 'bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : ''}`}></div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-10 animate-fade-in">
              <Zap size={14} className="fill-indigo-400" />
              Advanced AI Fraud Protection
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-10 leading-[0.9] animate-slide-up">
              Malawi's Most Trusted <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Fraud & Risk Sentinel.
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl font-medium animate-fade-in delay-200">
              Empower your enterprise with real-time transaction monitoring and AI-driven compliance tailored for the Malawian fiscal ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in delay-300">
              <Link to="/login" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group">
                Get Started Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-5 text-white font-black text-lg uppercase tracking-widest hover:text-indigo-400 transition-colors border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                Watch the Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Map (The Circular Diagram Section) */}
      <section className="py-32 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">Future-Proof Your <br />Fiscal Integrity</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">The only platform in Malawi integrating native PayChangu support with deep-learning anomaly detection.</p>
          </div>

          <div className="relative flex flex-col items-center justify-center min-h-[600px]">
            {/* Center Hub */}
            <div className="relative z-20 w-48 h-48 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] shadow-[0_0_80px_rgba(79,70,229,0.4)] flex items-center justify-center group">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-white/30 rounded-sm"></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-[3rem]"></div>
            </div>

            {/* Orbiting Cards */}
            <div className="grid md:grid-cols-2 gap-20 mt-16 w-full max-w-5xl">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md hover:bg-white/10 transition-colors group">
                <ShieldCheck className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-2xl font-black text-white mb-4">ML Sentinel Core</h3>
                <p className="text-slate-400 leading-relaxed">Isolation Forest and LOF models working in tandem to identify outliers in Malawian SME cash flows.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md hover:bg-white/10 transition-colors group">
                <Database className="text-purple-400 mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-2xl font-black text-white mb-4">Real-Time Ingestion</h3>
                <p className="text-slate-400 leading-relaxed">Instantly sync transactions from POS, EFD devices, or digital wallets via our low-latency API.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Cards (The Dark Blue Cards) */}
      <section id="solutions" className="py-32 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <p className="text-indigo-500 font-black uppercase tracking-widest text-sm mb-4">Smarter Solutions</p>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter">Stronger Results.</h2>
            </div>
            <Link to="/login" className="text-white font-bold flex items-center gap-2 hover:text-indigo-400 transition-colors group uppercase tracking-widest text-sm">
              Explore All Solutions
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Trust Engine", icon: Fingerprint, desc: "Verify every customer interaction with behavioral biometrics and history profiling." },
              { title: "Risk Pulse", icon: BarChart3, desc: "Visual heatmap of transaction risks across multiple business branches instantly." },
              { title: "Compliance Automator", icon: Search, desc: "Automated MRA-ready reports and audit trails for seamless fiscal end-of-day." }
            ].map((sol, i) => (
              <div key={i} className="bg-[#0f172a] p-12 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <sol.icon className="text-indigo-500 mb-10 group-hover:rotate-12 transition-transform" size={48} />
                <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{sol.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{sol.desc}</p>
                <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Learn More</span>
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <ChevronRight size={20} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Outcomes (Stats Section) */}
      <section id="impact" className="py-32 bg-white text-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-6">Impact Report</p>
              <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-tight">Proven Outcomes <br />That Drive Growth.</h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-12">We help Malawian businesses scale by removing the risk of revenue leakage and fraud.</p>
              
              <div className="space-y-12">
                {[
                  { val: "97%", label: "Detection rate for night-time anomalies" },
                  { val: "80%", label: "Reduction in fiscal processing time" },
                  { val: "20%", label: "Average revenue growth for protected SMEs" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-8 border-b border-slate-100 pb-8">
                    <span className="text-5xl font-black text-indigo-600 tracking-tighter">{stat.val}</span>
                    <span className="text-lg font-bold text-slate-700">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-[4rem] shadow-inner relative">
              <img src="/hero-dashboard.png" alt="Impact Dashboard" className="rounded-[3.5rem] w-full h-auto shadow-2xl shadow-indigo-500/10" />
              <div className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 hidden xl:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Bell className="text-white" size={20} />
                  </div>
                  <span className="font-black text-slate-900 tracking-tight">Active Alert</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Unusual activity detected in <br /><span className="text-indigo-600 font-bold">Blantyre Branch #02</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions (Tabbed Section) */}
      <section className="py-32 bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">Innovative Solutions Built <br />For Your Industry</h2>
            <p className="text-slate-400 text-lg">Deeply integrated with the Malawian business landscape.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 flex flex-col gap-2">
              {Object.keys(industrySolutions).map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`text-left px-8 py-6 rounded-3xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-between ${
                    activeTab === id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  {id}
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
            
            <div className="lg:col-span-8 bg-[#0f172a] p-16 rounded-[4rem] border border-white/5 relative group">
              <div className="absolute top-0 right-0 p-8">
                <Globe className="text-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity" size={64} />
              </div>
              <h3 className="text-4xl font-black text-white mb-8 tracking-tight">
                {industrySolutions[activeTab as keyof typeof industrySolutions].title}
              </h3>
              <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl">
                {industrySolutions[activeTab as keyof typeof industrySolutions].desc}
              </p>
              <ul className="grid md:grid-cols-2 gap-6">
                {industrySolutions[activeTab as keyof typeof industrySolutions].features.map((f, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                      <CheckCircle2 className="text-indigo-400" size={20} />
                    </div>
                    <span className="font-bold text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-16">
                <Link to="/login" className="inline-flex items-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                  Get Solution
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30 group">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-5xl lg:text-8xl font-black text-white mb-12 relative z-10 tracking-tighter leading-[0.9]">
              Secure Your Fiscal <br />Growth Today.
            </h2>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="bg-white text-indigo-600 px-12 py-6 rounded-3xl font-black text-xl uppercase tracking-widest hover:shadow-2xl transition-all">
                Create Account
              </Link>
              <button className="text-white font-black text-xl uppercase tracking-widest hover:text-white/80 transition-colors underline underline-offset-8">
                Talk to Sales
              </button>
            </div>
            <p className="text-indigo-100/70 mt-16 font-bold uppercase tracking-[0.2em] text-sm">Join the Malawian Enterprise standard.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] text-white pt-32 pb-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-10">
                <Activity className="text-indigo-500" size={32} />
                <span className="text-3xl font-black tracking-tighter uppercase">FISCALTECH</span>
              </div>
              <p className="text-slate-500 leading-relaxed mb-10 max-w-sm font-bold text-lg">
                Building the future of Malawian financial infrastructure with secure, AI-powered integration tools.
              </p>
              <div className="flex gap-6">
                {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-all cursor-pointer"><Globe size={20} /></div>)}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-10">Product</h4>
              <ul className="space-y-6 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">POS Ingestion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fraud Engine</a></li>
                <li><a href="#" className="hover:text-white transition-colors">PayChangu Sync</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cloud Invoicing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-10">Enterprise</h4>
              <ul className="space-y-6 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">MRA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Keys</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Audit Logs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team Access</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400 mb-10">Contact</h4>
              <ul className="space-y-6 text-slate-500 font-bold">
                <li><a href="#" className="hover:text-white transition-colors">Blantyre Office</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Lilongwe Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sales Dept</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
            <p className="text-slate-600 font-black text-xs uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} FISCALTECH MALAWI. BUILT FOR THE FUTURE.
            </p>
            <div className="flex gap-10 text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


