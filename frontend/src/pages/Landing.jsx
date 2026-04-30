import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-black text-cyan-300">VisionFlow</h1>
        <p className="mt-4 text-lg text-slate-300">
          AI-driven idea incubation and roadmap generation platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-white"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-5 py-3 font-bold text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Landing;