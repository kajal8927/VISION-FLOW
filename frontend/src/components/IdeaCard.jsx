import { Link } from "react-router-dom";

const IdeaCard = ({ idea }) => {
  return (
    <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">{idea.title}</h3>
        </div>
        <span className="inline-block mb-3 px-2.5 py-1 rounded-md bg-white/5 text-xs font-medium text-slate-300 border border-white/10">
          {idea.category}
        </span>
        <p className="text-sm text-slate-400 line-clamp-3 mb-4">{idea.description}</p>
      </div>
      <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{idea.status}</span>
        <Link 
          to={`/ideas/${idea.id}`} 
          className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold text-sm hover:bg-cyan-500 hover:text-white transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default IdeaCard;