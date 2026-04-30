import { getStoredIdeas } from "../services/ideaService.js";

const AdminDashboard = () => {
  const ideas = getStoredIdeas();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {ideas.map((idea) => (
        <div key={idea.id} className="border p-3 mt-3">
          {idea.title}
        </div>
      ))}
    </main>
  );
};

export default AdminDashboard;