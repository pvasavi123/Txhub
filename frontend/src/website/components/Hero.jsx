import React, { useContext } from "react";
// import heroBg from "../assets/hero.png";

import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Compass, Tv, Users, Briefcase } from "lucide-react";

// SVG Line Component with animated glowing packet
const FlowingLine = ({ pathD, delay = 0 }) => (
  <g>
    {/* Base semi-transparent line */}
    <path d={pathD} fill="none" stroke="#94a3b8" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />

    {/* Glowing flow packet */}
    <circle r="4" fill="#3b82f6" filter="drop-shadow(0 0 4px #3b82f6)">
      <animateMotion dur="4s" repeatCount="indefinite" path={pathD} begin={`${delay}s`} />
    </circle>
  </g>
);

// 3D Isometric Node Block
const IsoNode = ({ x, y, icon: Icon, imgSrc, title, delay = 0, isCenter = false, linkTo }) => {
  const content = (
    <div
      className={`relative group animate-float-3d ${linkTo ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${delay}s`, transformStyle: "preserve-3d" }}
    >
      {/* Soft floor shadow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-900/15 blur-[12px] rounded-full transition-all duration-500 group-hover:scale-[1.3] group-hover:bg-blue-600/20" style={{ transform: "translateZ(-1px)" }} />

      {/* Soft Glassmorphic Floating Block */}
      <div
        className={`flex flex-col items-center justify-center p-3 transition-all duration-500 group-hover:translate-z-8 shadow-[0_25px_45px_-5px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.7)] ${isCenter
          ? "w-36 h-36 bg-gradient-to-br from-white to-blue-50 rounded-[2.5rem] border-2 border-blue-400"
          : "w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-white/60"
          }`}
        style={{ transform: "translateZ(10px) rotateZ(45deg) rotateX(-60deg)", transformOrigin: "bottom center" }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className={`object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${isCenter ? 'w-16 h-16 mb-2.5' : 'w-10 h-10 mb-2'}`}
          />
        ) : Icon && (
          <Icon
            className={`mb-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${isCenter ? "text-blue-600" : "text-blue-500"}`}
            size={isCenter ? 44 : 26}
          />
        )}
        <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-center px-1 leading-tight ${isCenter ? "text-blue-700" : "text-slate-700"}`}>
          {title}
        </span>
      </div>
    </div>
  );

  const wrapperStyle = {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-50%, -50%)",
    transformStyle: "preserve-3d"
  };

  if (linkTo) {
    return (
      <Link to={linkTo} className="absolute inline-block pointer-events-auto z-40" style={wrapperStyle}>
        {content}
      </Link>
    );
  }

  return (
    <div className="absolute inline-block pointer-events-auto z-40" style={wrapperStyle}>
      {content}
    </div>
  );
};

const Hero = () => {
  const { isLoggedIn, openAuthModal } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleStartLearning = () => {
    if (!isLoggedIn) {
      openAuthModal();
    } else {
      navigate("/explore");
    }
  };

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-screen w-full bg-slate-50 overflow-hidden flex items-center pt-8 md:pt-0"
      onMouseMove={handleMouseMove}
    >
      {/* Optimized Background Overlay */}
      <div className="absolute inset-0 md:bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent backdrop-blur-[1px]"></div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center pointer-events-none mt-0">

        <div className="w-full lg:w-[45%] lg:-ml-6 xl:-ml-12 pt-0 md:pt-4 pb-8 md:pb-20 pointer-events-auto">
          <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000 ease-out fill-mode-both">

           <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
  Master Your Future
  <span className="block text-blue-600">
    with Expert-Led
  </span>
  <span className="block text-blue-600">
    Learning
  </span>
</h1>

            <p className="mt-6 text-slate-700 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              Learn Online, Offline, or Hybrid with our interconnected comprehensive programs. Build your career network today.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleStartLearning}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300"
              >
                Start Learning
              </button>

              <Link to="/explore">
                <button className="bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-100 transition-all duration-300 shadow-sm">
                  Explore Hub
                </button>
              </Link>
            </div>

            {/* FLOATING PLACEMENT CARD */}
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">

              <Link to="/explore" state={{ mode: "Offline", hideControls: true }}>
                <div className="inline-flex items-center gap-4 bg-white/40 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-blue-500/10 transition-shadow cursor-pointer">

                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Briefcase size={22} />
                  </div>

                  <div>
<h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
  Offline Training Programs
</h4>

<p className="text-xs text-slate-600 font-semibold max-w-[220px] leading-relaxed">
  Explore classroom-based training and internship programs with placement support and real-time projects.
</p>
                  </div>

                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* --- GRAPHIC LAYER (HIDDEN ON MOBILE) --- */}
      <div className="hidden md:block absolute z-0 inset-0 w-full h-full pointer-events-none md:pointer-events-auto overflow-hidden">
        <style>
          {`
            @keyframes float3D {
              0%, 100% { transform: translateY(0px) rotateX(0) rotateY(0); }
              50% { transform: translateY(-15px) rotateX(2deg) rotateY(-1deg); }
            }
            .animate-float-3d {
              animation: float3D 6s ease-in-out infinite;
            }
          `}
        </style>

        <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[55%] h-full flex items-center justify-center opacity-20 sm:opacity-100 pointer-events-none md:pointer-events-auto">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-[400ms] ease-out will-change-transform -translate-y-12 md:-translate-y-20 lg:-translate-y-28 scale-[0.6] sm:scale-[0.8] lg:scale-100"
            style={{
              transform: `perspective(2000px) rotateY(${mousePos.x * 30}deg) rotateX(${-mousePos.y * 10}deg)`,
              transformStyle: "preserve-3d"
            }}
          >
            <div
              className="relative w-[800px] h-[800px]"
              style={{
                transform: "rotateX(60deg) rotateZ(-45deg)",
                transformStyle: "preserve-3d"
              }}
            >
              <div className="absolute inset-0 border-2 border-slate-200 rounded-[3rem] opacity-50 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" style={{
                backgroundImage: "linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}></div>

              <svg className="absolute inset-0 w-full h-full overflow-visible" style={{ transform: "translateZ(1px)" }}>
                <FlowingLine pathD="M 400 400 L 400 200 L 600 200" delay={0} />
                <FlowingLine pathD="M 400 400 L 600 400 L 600 650" delay={1.5} />
                <FlowingLine pathD="M 400 400 L 400 600 L 200 600" delay={0.5} />
                <FlowingLine pathD="M 400 400 L 250 400 L 250 150" delay={2} />
                <FlowingLine pathD="M 600 200 L 750 200" delay={1} />
                <FlowingLine pathD="M 250 150 L 100 150" delay={2.5} />
                <FlowingLine pathD="M 400 400 L 150 400" delay={0.8} />
                <FlowingLine pathD="M 400 400 L 400 450 L 650 450" delay={1.1} />
              </svg>

              <div className="absolute inset-0 w-full h-full" style={{ transform: "translateZ(2px)", transformStyle: "preserve-3d" }}>
                <IsoNode x={400} y={400} imgSrc="https://cdn-icons-png.flaticon.com/512/3048/3048122.png" title="Txhub" delay={0} isCenter={true} linkTo="/" />
                <IsoNode x={600} y={200} icon={Compass} title="Explore" delay={0.3} linkTo="/explore" />
                <IsoNode x={600} y={650} icon={BookOpen} title="My Courses" delay={0.8} linkTo="/my-courses" />
                <IsoNode x={200} y={600} icon={Users} title="About Us" delay={0.5} linkTo="/about" />
                <IsoNode x={250} y={150} icon={Tv} title="Contact" delay={1.2} linkTo="/contact" />
                <IsoNode x={750} y={200} imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" title="React" delay={0.6} linkTo="/explore" />
                <IsoNode x={100} y={150} imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" title="Python" delay={1.5} linkTo="/explore" />
                <IsoNode x={400} y={600} imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" title="AWS Core" delay={0.2} linkTo="/explore" />
                <IsoNode x={150} y={400} imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" title="Java" delay={0.9} linkTo="/explore" />
                <IsoNode x={650} y={450} imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" title="SQL" delay={1.4} linkTo="/explore" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;