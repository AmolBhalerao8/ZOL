
import React, { useState } from 'react';
import { 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Users, 
  Clock, 
  Menu, 
  X, 
  Loader2, 
  Globe, 
  Star, 
  Activity, 
  Award, 
  Building2, 
  Car 
} from 'lucide-react';

// --- Types ---
interface NavItemProps {
  label: string;
  href: string;
  onClick?: () => void;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

// --- Helper Components ---

// Smooth scroll handler to ensure internal navigation works perfectly
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, callback?: () => void) => {
  if (href.startsWith('#')) {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (callback) callback();
    }
  }
};

const NavItem: React.FC<NavItemProps> = ({ label, href, onClick }) => (
  <a 
    href={href} 
    onClick={(e) => handleNavClick(e, href, onClick)}
    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
  >
    {label}
  </a>
);

const SectionTitle: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = true }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 transition-all duration-300">
    <div className="w-12 h-12 bg-slate-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Step: React.FC<StepProps> = ({ number, title, description }) => (
  <div className="relative flex flex-col items-center text-center px-4">
    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-indigo-100">
      {number}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="mt-4 text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">{answer}</p>}
    </div>
  );
};

const LogoPlaceholder = ({ text, subtext, icon, imgSrc }: { text: string; subtext?: string; icon?: React.ReactNode; imgSrc?: string }) => (
  <div className="group flex flex-col items-center justify-center px-10 py-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 min-w-[320px]">
    <div className="flex items-center justify-center bg-white border border-slate-100 rounded-2xl px-8 py-5 shadow-sm hover:shadow-md transition-shadow w-full h-24">
      {/* 
        REPLACING WITH REAL LOGO IMAGE:
        Pass the path to your logo file to the 'imgSrc' prop of this component.
        If imgSrc is provided, it will render the image; otherwise, it falls back to text/icons.
      */}
      {imgSrc ? (
        <img src={imgSrc} alt={text} className="max-h-full max-w-full object-contain" />
      ) : (
        <div className="flex items-center space-x-4 overflow-hidden">
          {icon && <div className="text-slate-300 group-hover:text-indigo-600 transition-colors flex-shrink-0">{icon}</div>}
          <div className="flex flex-col items-start overflow-hidden">
            <span className="font-black text-slate-800 uppercase tracking-tight text-base leading-none mb-1 whitespace-nowrap">
              {text}
            </span>
            {subtext && <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold whitespace-nowrap">{subtext}</span>}
          </div>
        </div>
      )}
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [isPartnerSubmitted, setIsPartnerSubmitted] = useState(false);
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPartner(true);
    setTimeout(() => {
      setIsSubmittingPartner(false);
      setIsPartnerSubmitted(true);
    }, 1500);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDemo(true);
    setTimeout(() => {
      setIsSubmittingDemo(false);
      setIsDemoSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen selection:bg-indigo-100">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">ZOL</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <NavItem label="How it Works" href="#how-it-works" />
              <NavItem label="Benefits" href="#benefits" />
              <NavItem label="Dashboard" href="#dashboard" />
              <NavItem label="Design Partners" href="#design-partner-program" />
              <NavItem label="Contact" href="#contact" />
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Request Demo
              </a>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
            <NavItem label="How it Works" href="#how-it-works" onClick={() => setMobileMenuOpen(false)} />
            <NavItem label="Benefits" href="#benefits" onClick={() => setMobileMenuOpen(false)} />
            <NavItem label="Dashboard" href="#dashboard" onClick={() => setMobileMenuOpen(false)} />
            <NavItem label="Design Partners" href="#design-partner-program" onClick={() => setMobileMenuOpen(false)} />
            <NavItem label="Contact" href="#contact" onClick={() => setMobileMenuOpen(false)} />
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact', () => setMobileMenuOpen(false))} className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold mt-4">Request Demo</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
              Automated Dealership Intelligence
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Never Miss a <br />Lead Again.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
              ZOL engages every lead in under 30 seconds. Fully automated, human-like conversations that drive high-quality appointments 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, '#contact')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group"
              >
                Request Demo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#design-partner-program" 
                onClick={(e) => handleNavClick(e, '#design-partner-program')}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-900 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all"
              >
                Become a Design Partner
              </a>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
            {/* YouTube Video */}
            <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl relative z-10 transition-transform hover:scale-[1.01]">
              <div className="bg-white rounded-[22px] overflow-hidden border border-slate-200">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-[22px]"
                    src="https://www.youtube.com/embed/3FW-I_fF6cg"
                    title="ZOL Demo Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            {/* Background Decorations */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse delay-700"></div>
          </div>
        </div>
      </section>

      {/* Design Partners Marquee Section */}
      <section id="design-partners" className="py-16 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Our Strategic Design Partners</p>
          <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="relative">
          <div className="animate-marquee">
            {/* Design Partners with real logos */}
            <LogoPlaceholder text="Wittmeier" imgSrc="/logos/wittmeier.png" />
            <LogoPlaceholder text="Chico Nissan Hyundai" imgSrc="/logos/chico-nissan.jpg" />
            <LogoPlaceholder text="Pajouh Automotive" imgSrc="/logos/pajouh.jpg" />
            <LogoPlaceholder text="Volkswagen Mazda" imgSrc="/logos/volkswagen-mazda.jpg" />
            <LogoPlaceholder text="Chuck Patterson" imgSrc="/logos/chuck-patterson.jpg" />
            
            {/* Duplicate set for seamless looping */}
            <LogoPlaceholder text="Wittmeier" imgSrc="/logos/wittmeier.png" />
            <LogoPlaceholder text="Chico Nissan Hyundai" imgSrc="/logos/chico-nissan.jpg" />
            <LogoPlaceholder text="Pajouh Automotive" imgSrc="/logos/pajouh.jpg" />
            <LogoPlaceholder text="Volkswagen Mazda" imgSrc="/logos/volkswagen-mazda.jpg" />
            <LogoPlaceholder text="Chuck Patterson" imgSrc="/logos/chuck-patterson.jpg" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="The 12-Hour Follow-Up Gap" 
            subtitle="The industry average response time is 12 hours. In that window, your customer has already found another store." 
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Lost Opportunities", desc: "1 in 5 leads are never contacted due to human error and manual tracking.", icon: <X className="w-6 h-6" /> },
              { title: "Speed to Lead", desc: "Leads not contacted within 5 minutes drop their close probability by 8x.", icon: <Clock className="w-6 h-6" /> },
              { title: "Resource Drain", desc: "Sales teams waste 40% of their day on unqualified prospects instead of closing sales.", icon: <Users className="w-6 h-6" /> },
              { title: "Black Hole Data", desc: "Managers lack visibility into why leads went cold during the handoff process.", icon: <BarChart3 className="w-6 h-6" /> }
            ].map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50">
                <div className="w-10 h-10 text-red-500 mb-4 bg-red-50 rounded-lg flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{p.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="The ZOL Advantage" 
            subtitle="Intelligent engagement that scales with your store, ensuring every lead receives the white-glove treatment."
          />
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap />} 
              title="Lightning Response" 
              description="Automated 30-second first response via SMS or Email, putting you first in the customer's mind." 
            />
            <FeatureCard 
              icon={<MessageSquare />} 
              title="Persona-Driven Dialog" 
              description="AI that learns your dealership's voice, answering specific questions and overcoming common objections." 
            />
            <FeatureCard 
              icon={<Calendar />} 
              title="Direct Appointment Booking" 
              description="Seamlessly pushes confirmed appointments directly into your showroom or service drive schedule." 
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="How it Works" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            <div className="hidden lg:block absolute top-6 left-1/4 right-1/4 h-[2px] bg-indigo-100/20 z-0"></div>
            
            <Step 
              number="1" 
              title="Capture" 
              description="ZOL integrates with your website and third-party lead providers to capture data instantly." 
            />
            <Step 
              number="2" 
              title="Engage" 
              description="Within 30 seconds, ZOL starts a tailored conversation with the customer." 
            />
            <Step 
              number="3" 
              title="Nurture" 
              description="Continuous, persistent follow-up that adapts to the customer's unique timeline." 
            />
            <Step 
              number="4" 
              title="Convert" 
              description="Confirmed appointments and 'Ready to Buy' leads are handed to your team to close." 
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Data-Backed Growth.</h2>
            <div className="space-y-6">
              {[
                "Instant, 24/7 Lead Response Guarantee",
                "Automated Nurture Campaigns (Up to 90 Days)",
                "Full Conversation History Sync to CRM",
                "Advanced Sentiment Analysis for Lead Scoring",
                "Live Dashboard for Real-time Monitoring"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center space-x-3 transition-all hover:translate-x-1 duration-200">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg font-medium text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Performance uplift</div>
              <div className="text-7xl font-black mb-6">+42%</div>
              <p className="text-slate-300 text-xl leading-relaxed">Dealerships using ZOL see a massive increase in appointment-to-show ratios within the first quarter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Full Transparency Dashboard" 
            subtitle="Access deep analytics and real-time conversation logs to see exactly how your store is performing."
          />
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Real-time Metrics */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50">
              <h3 className="text-xl font-bold mb-8 flex items-center">
                <Clock className="mr-2 text-indigo-600 animate-pulse" /> Today's Live Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Incoming Leads</div>
                  <div className="text-3xl font-black text-slate-900">126</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Responded &lt; 30s</div>
                  <div className="text-3xl font-black text-indigo-600">100%</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Active AI Chats</div>
                  <div className="text-3xl font-black text-slate-900">58</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Hot Intent Leads</div>
                  <div className="text-3xl font-black text-orange-500">34</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Confirmed Appts</div>
                  <div className="text-3xl font-black text-green-600">19</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Avg AI Sentiment</div>
                  <div className="text-3xl font-black text-slate-900">8.4</div>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-xl hover:shadow-slate-200/50">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <BarChart3 className="mr-2 text-indigo-600" /> Weekly Summary
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <span className="text-slate-500 font-medium">Total Volume</span>
                  <span className="font-bold">742</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <span className="text-slate-500 font-medium">Response Time</span>
                  <span className="font-bold text-green-600">21s</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <span className="text-slate-500 font-medium">Total Booked</span>
                  <span className="font-bold">112</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Capture Rate</span>
                  <span className="font-bold text-indigo-600">98.2%</span>
                </div>
                <div className="mt-8">
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-600 w-[15%] transition-all duration-1000"></div>
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-tighter">Current month conversion: 15.1%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Message Banner */}
      <section className="py-20 bg-indigo-900 text-white px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            ZOL is the bridge to your CRM.
          </h2>
          <p className="text-xl md:text-2xl text-indigo-200 font-medium max-w-2xl mx-auto leading-relaxed">
            We handle the first 90 days of the lead lifecycle so your team can focus on the next 90 minutes of closing.
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </section>

      {/* Design Partner Program */}
      <section id="design-partner-program" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-50 rounded-[40px] p-12 lg:p-16 border border-slate-200 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">Strategic Partnership</span>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Join the Design <br /> Partner Program</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We are building the next generation of dealership software in collaboration with store owners and GMs. Help us shape the roadmap.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold">Priority feature requests built for your store</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold">Exclusive weekly roadmap calls</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <span className="text-slate-700 font-semibold">Lifetime 'Early Adopter' discount</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-2xl border border-slate-100 min-h-[400px] flex flex-col justify-center">
              {isPartnerSubmitted ? (
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                  <p className="text-slate-600">A member of our team will contact you for a vetting interview shortly.</p>
                  <button onClick={() => setIsPartnerSubmitted(false)} className="mt-8 text-indigo-600 font-bold hover:underline">Submit another interest</button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-6 text-slate-900">Apply for Partner Status</h3>
                  <form className="space-y-4" onSubmit={handlePartnerSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300" />
                      <input required type="text" placeholder="Store Name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <input required type="email" placeholder="Professional Email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-300" />
                    <button 
                      type="submit"
                      disabled={isSubmittingPartner}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmittingPartner ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {isSubmittingPartner ? 'Sending Application...' : 'Apply Now'}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-4">By clicking 'Apply Now', you agree to our Partnership Terms and Data Policy.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionTitle title="Common Questions" />
          <div className="space-y-2">
            <FAQItem 
              question="Does ZOL replace my BDC?" 
              answer="No. ZOL empowers your BDC. We handle the 1,000s of initial 'tire kicker' messages and nurture cold leads, allowing your BDC team to spend their time only talking to high-intent, ready-to-book customers."
            />
            <FAQItem 
              question="What happens if a customer wants to talk to a person?" 
              answer="ZOL detects human-transfer requests instantly. The conversation is immediately flagged, and a notification is sent to your managers via SMS or Email with the full context."
            />
            <FAQItem 
              question="How long does onboarding take?" 
              answer="We can have ZOL live in your store in under 48 hours. We handle the CRM integration and persona setup so your team doesn't have to lift a finger."
            />
            <FAQItem 
              question="How is data security handled?" 
              answer="Security is our top priority. We use enterprise-grade encryption and are fully SOC2 compliant. Your customer data is never shared or used to train public models."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Ready to boost your <br /> show rate?</h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
              Stop letting leads slip through the cracks. Join the dealerships running on ZOL intelligence.
            </p>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <ShieldCheck />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Enterprise Reliability</h4>
                  <p className="text-sm text-slate-500">99.9% uptime and SOC2 security standards.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Zap />
                </div>
                <div>
                  <h4 className="font-bold">Immediate ROI</h4>
                  <p className="text-sm text-slate-500">Noticeable results within the first 48 hours.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl relative min-h-[580px] flex flex-col justify-center overflow-hidden">
            {isDemoSubmitted ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-4">You're booked!</h3>
                <p className="text-indigo-200 text-lg mb-8 leading-relaxed">Check your professional inbox for a demo confirmation and meeting link.</p>
                <button onClick={() => setIsDemoSubmitted(false)} className="text-indigo-400 font-bold hover:text-white transition-colors border-b border-indigo-400">Request another slot</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-8">Schedule a Demo</h3>
                <form className="space-y-6" onSubmit={handleDemoSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input required type="text" className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600" placeholder="John Smith" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dealership</label>
                      <input required type="text" className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600" placeholder="Riverside Ford" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Email</label>
                      <input required type="email" className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600" placeholder="jsmith@ford.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cell Number</label>
                      <input required type="tel" className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder:text-slate-600" placeholder="(555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Volume (Monthly)</label>
                    <select className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-white appearance-none cursor-pointer">
                      <option className="text-slate-900">Less than 500</option>
                      <option className="text-slate-900">500 - 1,500</option>
                      <option className="text-slate-900">1,500+</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmittingDemo}
                    className="w-full py-5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-lg shadow-2xl shadow-indigo-900/50 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmittingDemo ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                    {isSubmittingDemo ? 'Reserving Slot...' : 'Book Discovery Call'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
          <div className="mb-12 md:mb-0">
            <span className="text-3xl font-black text-indigo-600 tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>ZOL</span>
            <p className="mt-6 text-slate-500 text-sm max-w-xs leading-relaxed">
              ZOL provides the frontend intelligence that dealership CRMs are missing. Built by auto industry veterans for the modern dealership environment.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Platform</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><NavItem label="How it Works" href="#how-it-works" /></li>
                <li><NavItem label="Benefits" href="#benefits" /></li>
                <li><NavItem label="Analytics" href="#dashboard" /></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Connect</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><NavItem label="Design Partners" href="#design-partner-program" /></li>
                <li><NavItem label="Contact Sales" href="#contact" /></li>
                <li><a href="#" className="hover:text-indigo-600" onClick={(e) => e.preventDefault()}>Support</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Legal</h5>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600" onClick={(e) => e.preventDefault()}>Compliance</a></li>
                <li><a href="#" className="hover:text-indigo-600" onClick={(e) => e.preventDefault()}>Terms</a></li>
                <li><a href="#" className="hover:text-indigo-600" onClick={(e) => e.preventDefault()}>Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          <p>© 2024 ZOL AI Intelligence. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-8">
            <span>Powered by Gemini 2.5</span>
            <span>Made in California</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
