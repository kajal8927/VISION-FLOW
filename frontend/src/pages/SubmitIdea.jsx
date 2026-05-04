import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitIdeaApi } from "../services/ideaService.js";
import { Loader2 } from "lucide-react";

<<<<<<< HEAD
const MAX_TITLE_LENGTH = 300;

=======
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
const SubmitIdea = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "Education",
    description: "",
  });
<<<<<<< HEAD

=======
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
<<<<<<< HEAD
    const { name, value } = e.target;

    if (name === "title" && value.length > MAX_TITLE_LENGTH) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
=======
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
<<<<<<< HEAD

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) {
      setError("Idea title is required.");
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Idea title cannot be more than ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (!description) {
      setError("Detailed description is required.");
      return;
    }

    setLoading(true);

    try {
      const result = await submitIdeaApi({
        title,
        category: form.category,
        description,
        problemStatement: description,
        proposedSolution: description,
      });

      if (result.success && result.idea) {
        navigate(`/ideas/${result.idea.id || result.idea._id}`);
      } else {
        setError(result.message || "Failed to submit idea.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong while submitting idea.");
    } finally {
      setLoading(false);
=======
    setLoading(true);

    const result = await submitIdeaApi({
      ...form,
      problemStatement: form.description,
      proposedSolution: form.description,
    });

    setLoading(false);

    if (result.success && result.idea) {
      navigate(`/ideas/${result.idea.id || result.idea._id}`);
    } else {
      setError(result.message || "Failed to submit idea.");
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl">
<<<<<<< HEAD
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300 mb-2">
          Submit New Idea
        </h1>

        <p className="text-slate-400 mb-8">
          Share your concept and let our AI engine analyze and build a roadmap
          for you.
        </p>
=======
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300 mb-2">Submit New Idea</h1>
        <p className="text-slate-400 mb-8">Share your concept and let our AI engine analyze and build a roadmap for you.</p>
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
<<<<<<< HEAD
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Idea Title
                </label>

                <span
                  className={`text-xs ${
                    form.title.length > MAX_TITLE_LENGTH * 0.9
                      ? "text-yellow-400"
                      : "text-slate-500"
                  }`}
                >
                  {form.title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>

=======
              <label className="block text-sm font-semibold text-slate-300 mb-2">Idea Title</label>
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
<<<<<<< HEAD
                maxLength={MAX_TITLE_LENGTH}
=======
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
                placeholder="e.g. AI-powered smart irrigation"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
                required
              />
            </div>

            <div>
<<<<<<< HEAD
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Category
              </label>

=======
              <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition"
              >
                <option className="bg-slate-900">Education</option>
                <option className="bg-slate-900">Healthcare</option>
                <option className="bg-slate-900">Agriculture</option>
                <option className="bg-slate-900">Environment</option>
                <option className="bg-slate-900">AI/ML</option>
                <option className="bg-slate-900">Other</option>
              </select>
            </div>

            <div>
<<<<<<< HEAD
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Detailed Description
              </label>

=======
              <label className="block text-sm font-semibold text-slate-300 mb-2">Detailed Description</label>
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the problem and your proposed solution..."
                rows="6"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition resize-none"
                required
              />
            </div>

<<<<<<< HEAD
            <button
              type="submit"
=======
            <button 
>>>>>>> e2a5599d925553691c60e32d62eb51d55de4abb8
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-4 font-bold text-white shadow-xl shadow-cyan-500/20 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Analyzing & Submitting..." : "Submit Idea"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SubmitIdea;