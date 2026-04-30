const IdeaCard = ({ idea }) => {
  return (
    <div className="p-4 border border-white/10 rounded-xl bg-white/5">
      <h3 className="font-bold">{idea.title}</h3>
      <p className="text-sm text-slate-400">{idea.category}</p>
      <p className="text-sm mt-2">{idea.description}</p>
    </div>
  );
};

export default IdeaCard;