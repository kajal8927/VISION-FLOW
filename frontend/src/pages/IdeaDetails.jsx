import { useParams } from "react-router-dom";
import { getIdeaById } from "../services/ideaService.js";

const IdeaDetails = () => {
  const { id } = useParams();
  const idea = getIdeaById(id);

  if (!idea) return <p>Idea not found</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{idea.title}</h1>
      <p>{idea.description}</p>
    </main>
  );
};

export default IdeaDetails;