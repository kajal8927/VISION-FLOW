import { Link } from "react-router-dom";

const IdeaCard = ({ idea }) => {
  const ideaId = idea._id || idea.id;

  return (
    <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Rank Badge */}
      {idea.rank && (
        <div className="absolute top-0 right-0 bg-gradient-to-bl from-cyan-500 to-violet-500 text-white font-bold px-3 py-1 rounded-bl-xl text-sm shadow-md">
          #{idea.rank}
        </div>
      )}

      <div className="flex-1 mt-2">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 pr-6">{idea.title}</h3>
        </div>
        <span className={`inline-block mb-3 px-2.5 py-1 rounded-md text-xs font-medium border ${idea.status === "selected" ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" :
          idea.status === "rejected" ? "bg-red-500/10 text-red-300 border-red-500/20" :
            "bg-white/5 text-slate-300 border-white/10"
          } capitalize`}>
          {idea.status}
        </span>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">{idea.description}</p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="text-slate-500 mb-1">Idea Value</div>
            <div className="font-bold text-slate-200">{idea.ideaValue ?? "N/A"}</div>
          </div>
          <div className="bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="text-slate-500 mb-1">Feasibility</div>
            <div className="font-bold text-green-400">{idea.feasibilityScore ?? 0}%</div>
          </div>
          <div className="bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="text-slate-500 mb-1">Duplicates</div>
            <div className="font-bold text-slate-200">{idea.duplicatePercentage ?? 0}%</div>
          </div>
          <div className="bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="text-slate-500 mb-1">Risk</div>
            <div className={`font-bold ${idea.riskLevel === 'High' ? 'text-red-400' : idea.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{idea.riskLevel || "N/A"}</div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-end">
        <Link
          to={`/ideas/${ideaId}`}
          className="px-4 py-2 w-full text-center rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold text-sm hover:bg-cyan-500 hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default IdeaCard;