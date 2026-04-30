import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitIdea } from "../services/ideaService.js";

const SubmitIdea = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Education",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newIdea = submitIdea({
      ...form,
      problemStatement: form.description,
      proposedSolution: form.description,
    });

    navigate(`/ideas/${newIdea.id}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-cyan-300">Submit Idea</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Idea title"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
          >
            <option className="bg-slate-900">Education</option>
            <option className="bg-slate-900">Healthcare</option>
            <option className="bg-slate-900">Agriculture</option>
            <option className="bg-slate-900">Environment</option>
            <option className="bg-slate-900">AI/ML</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Explain your idea"
            rows="6"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            required
          />

          <button className="rounded-xl bg-cyan-500 px-6 py-3 font-bold text-white">
            Submit Idea
          </button>
        </form>
      </div>
    </main>
  );
};

export default SubmitIdea;