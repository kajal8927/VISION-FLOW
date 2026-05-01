import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getIdeaByIdApi } from "../services/ideaService.js";
import { Loader2 } from "lucide-react";

const IdeaDetails = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdea = async () => {
      setLoading(true);
      const result = await getIdeaByIdApi(id);
      
      if (result.success && result.idea) {
        setIdea(result.idea);
      } else {
        setError(result.message || "Idea not found.");
      }
      setLoading(false);
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-cyan-500" />
        <p>Loading idea details...</p>
      </main>
    );
  }

  if (error || !idea) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-200">Idea not found</h2>
          <p className="text-slate-400 mb-8">{error || "The idea you're looking for doesn't exist or has been removed."}</p>
          <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-cyan-500 font-bold text-white hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/20">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 pt-24 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-300 mb-8 transition">
          ← Back to Dashboard
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                {idea.title}
              </h1>
              <span className="self-start md:self-auto px-4 py-1.5 rounded-full bg-white/5 text-slate-200 text-sm font-bold border border-white/10 shrink-0">
                {idea.category}
              </span>
            </div>

            <div className="grid gap-8">
              <div>
                <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Description</h3>
                <div className="bg-black/20 p-5 md:p-6 rounded-2xl border border-white/5 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {idea.description}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Status</h3>
                    <div className="capitalize font-bold text-slate-200">
                      {idea.status || "Pending"}
                    </div>
                 </div>
                 {idea.feasibilityScore !== undefined && (
                   <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Feasibility</h3>
                      <div className="font-black text-xl text-green-400">
                        {idea.feasibilityScore}/100
                      </div>
                   </div>
                 )}
                 <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Risk Level</h3>
                    <div className="font-bold text-slate-200">
                      {idea.riskLevel || "Not assessed"}
                    </div>
                 </div>
                 <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Duplicates</h3>
                    <div className="font-bold text-slate-200">
                      {idea.duplicatePercentage !== undefined ? `${idea.duplicatePercentage}%` : "0%"}
                    </div>
                 </div>
              </div>

              {idea.roadmap && idea.roadmap.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">Generated Roadmap</h3>
                  <div className="bg-black/20 p-5 md:p-6 rounded-2xl border border-white/5">
                    <ol className="list-decimal list-inside space-y-3 text-slate-300">
                      {idea.roadmap.map((step, idx) => (
                        <li key={idx} className="pl-2 leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {idea.aiFeedback && (
                <div>
                  <h3 className="text-xs font-bold text-violet-400/70 mb-3 uppercase tracking-widest">AI Analysis Feedback</h3>
                  <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-5 md:p-6 rounded-2xl border border-violet-500/20 text-slate-200 leading-relaxed shadow-inner whitespace-pre-wrap">
                    {idea.aiFeedback}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IdeaDetails;