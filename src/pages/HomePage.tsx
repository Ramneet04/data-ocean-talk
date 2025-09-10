import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-sky-200 via-sky-300 to-blue-500 relative overflow-hidden">
    {/* Ocean waves background effect */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#38bdf8" fillOpacity="0.5" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,181.3C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        <path fill="#0ea5e9" fillOpacity="0.7" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,186.7C840,203,960,181,1080,154.7C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
      </svg>
    </div>
    <div className="relative z-10 flex flex-col items-center text-center px-6">
      <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-float">Ocean Data Explorer</h1>
      <p className="text-xl md:text-2xl text-sky-100 mb-8 max-w-2xl">
        Welcome to the SIH ARGO Ocean Data Platform.<br />
        Explore, analyze, and visualize Indian Ocean ARGO float data with AI-powered tools.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Link to="/chat">
          <button className="px-8 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow-lg hover:bg-sky-700 transition">AI Chat</button>
        </Link>
        <Link to="/data">
          <button className="px-8 py-3 rounded-lg bg-blue-700 text-white font-semibold shadow-lg hover:bg-blue-800 transition">Analytics</button>
        </Link>
        <Link to="/argo-floats">
          <button className="px-8 py-3 rounded-lg bg-cyan-700 text-white font-semibold shadow-lg hover:bg-cyan-800 transition">ARGO Floats</button>
        </Link>
        <Link to="/erddap-api">
          <button className="px-8 py-3 rounded-lg bg-blue-900 text-white font-semibold shadow-lg hover:bg-blue-950 transition">ERDDAP API</button>
        </Link>
      </div>
      <div className="text-white/80 text-lg mt-4">
        <span className="inline-block bg-white/20 px-4 py-2 rounded-lg shadow">Smart India Hackathon 2024</span>
      </div>
    </div>
  </div>
);

export default HomePage;
