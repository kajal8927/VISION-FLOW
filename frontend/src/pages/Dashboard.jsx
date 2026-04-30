import { useEffect, useState } from "react";
import IdeaCard from "../components/IdeaCard.jsx";
import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getStoredIdeas } from "../services/ideaService.js";

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    setIdeas(getStoredIdeas());
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Ideas" value={ideas.length} />
      </div>

      {ideas.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;