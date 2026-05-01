import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import IdeaCard from "../components/IdeaCard.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getMyIdeasApi } from "../services/ideaService.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Selected");
  const { user } = useAuth();

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const result = await getMyIdeasApi();
      if (result.success) {
        setIdeas(result.ideas);
      } else {
        setError(result.message || "Failed to fetch ideas.");
      }
      setLoading(false);
    };

    fetchIdeas();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300 mb-4">
                <Sparkles className="w-3 h-3" />
                <span>Workspace Active</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">{user?.name?.split(' ')[0] || "Innovator"}</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Ready to transform another idea into reality? Here's an overview of your current projects.
              </p>
            </div>

            <Link
              to="/submit-idea"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 font-bold text-white shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all shrink-0"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Submit New Idea</span>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Ideas" value={ideas.length} />
          <StatCard title="Pending Review" value={ideas.filter(i => i.status === 'pending').length} />
          <StatCard title="Completed" value={ideas.filter(i => i.status === 'completed').length} />
        </div>

        {/* Ideas Grid Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            Your Projects
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-slate-300">
              {ideas.length}
            </span>
          </h2>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            {["All", "Selected", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f
                  ? "bg-cyan-500/20 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Ideas Grid */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
              <p>Loading your ideas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 border border-red-500/20 rounded-2xl bg-red-500/5 text-red-400">
              <p>{error}</p>
            </div>
          ) : ideas.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ideas
                .filter((idea) => {
                  if (filter === "All") return true;
                  if (filter === "Selected") return idea.status === "selected";
                  if (filter === "Rejected") return idea.status === "rejected";
                  return true;
                })
                .map((idea) => (
                  <IdeaCard key={idea.id || idea._id} idea={idea} />
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;