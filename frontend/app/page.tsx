"use client";

import { useState, useEffect } from "react";

interface Workout {
  id?: number;
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
  category: string;
}

export default function Home() {
  // Form State
  const [exerciseName, setExerciseName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [category, setCategory] = useState("Cardio");

  // App State
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHighIntensityOnly, setShowHighIntensityOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const backendUrl = "http://localhost:8080/api/workouts";

  // Fetch all workouts or high intensity workouts
  const fetchWorkouts = async (highIntensity = showHighIntensityOnly) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const url = highIntensity ? `${backendUrl}/high-intensity` : backendUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch workouts from backend.");
      const data = await res.json();
      setWorkouts(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Could not connect to Spring Boot backend. Please make sure the backend server is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [showHighIntensityOnly]);

  // Handle Save Workout
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!exerciseName.trim()) {
      setErrorMessage("Exercise Name cannot be blank.");
      return;
    }

    const duration = parseInt(durationMinutes);
    const calories = parseFloat(caloriesBurned);

    if (isNaN(duration) || duration <= 0) {
      setErrorMessage("Duration must be a positive number.");
      return;
    }

    if (isNaN(calories) || calories < 0) {
      setErrorMessage("Calories Burned must be a positive number.");
      return;
    }

    setSubmitting(true);

    try {
      const newWorkout: Workout = {
        exerciseName: exerciseName.trim(),
        durationMinutes: duration,
        caloriesBurned: calories,
        category,
      };

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWorkout),
      });

      if (res.status === 201) {
        setSuccessMessage("Workout saved successfully!");
        handleCancel();
        fetchWorkouts();
      } else if (res.status === 400) {
        setErrorMessage("Bad Request: Please check your input fields.");
      } else {
        setErrorMessage(`Server error: Returned status ${res.status}`);
      }
    } catch (err) {
      setErrorMessage("Error connecting to backend server. Please check your network.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Cancel (Reset Form)
  const handleCancel = () => {
    setExerciseName("");
    setDurationMinutes("");
    setCaloriesBurned("");
    setCategory("Cardio");
    setErrorMessage("");
  };

  // Handle Delete Workout
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        setSuccessMessage("Workout deleted successfully!");
        fetchWorkouts();
      } else if (res.status === 404) {
        setErrorMessage("Workout not found or already deleted.");
      } else {
        setErrorMessage(`Could not delete: Server returned status ${res.status}`);
      }
    } catch (err) {
      setErrorMessage("Error connecting to backend server to delete.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent pointer-events-none blur-3xl z-0" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-6 border-b border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 text-xs font-bold tracking-wider uppercase text-indigo-400 bg-indigo-950/50 border border-indigo-900 rounded-full">
              Lab Test — DAD
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            🏋️‍♂️ Workout Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Modern distributed entry form & dynamic analytics dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchWorkouts()}
            className="px-4 py-2 text-sm font-medium bg-slate-900 border border-slate-800 hover:bg-slate-850 active:scale-95 transition rounded-lg flex items-center gap-2"
          >
            🔄 Sync Data
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        
        {/* Left Column: Form (Modern Entry Form) */}
        <section className="lg:col-span-5">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-1">
              Workout Entry Form
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Enter your session details to save and track your progress.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Exercise Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g. Morning Jog, Bench Press..."
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 text-sm rounded-lg px-4 py-3 outline-none transition placeholder:text-slate-600"
                  disabled={submitting}
                />
              </div>

              {/* Grid for Duration & Calories */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 text-sm rounded-lg px-4 py-3 outline-none transition placeholder:text-slate-600"
                    disabled={submitting}
                  />
                </div>

                {/* Calories Burned */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/20 text-sm rounded-lg px-4 py-3 outline-none transition placeholder:text-slate-600"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-indigo-500/80 text-sm rounded-lg px-4 py-3 outline-none transition appearance-none cursor-pointer"
                    disabled={submitting}
                  >
                    <option value="Cardio">🏃‍♂️ Cardio</option>
                    <option value="Strength">🏋️‍♀️ Strength</option>
                    <option value="Flexibility">🧘‍♂️ Flexibility</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    ▼
                  </div>
                </div>
              </div>

              {/* Notification Alerts */}
              {errorMessage && (
                <div className="p-3.5 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-300">
                  ⚠️ {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-xs text-emerald-300">
                  ✨ {successMessage}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4.5 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-transparent border border-slate-850 hover:bg-slate-850 active:scale-95 transition rounded-lg"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="relative px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-650 hover:from-indigo-450 hover:to-indigo-600 focus:ring-2 focus:ring-indigo-500/20 active:scale-95 transition duration-150 rounded-lg shadow-lg shadow-indigo-500/10 flex items-center justify-center min-w-[130px]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </</svg>
                      Saving...
                    </div>
                  ) : (
                    "Save Workout"
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column: Workouts List & Filters */}
        <section className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col flex-1">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  Saved Sessions
                </h2>
                <p className="text-xs text-slate-400">
                  Manage and monitor your logged workout routines.
                </p>
              </div>

              {/* High Intensity Filter */}
              <div className="flex items-center bg-slate-950 p-1 border border-slate-850 rounded-lg">
                <button
                  onClick={() => setShowHighIntensityOnly(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${!showHighIntensityOnly ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setShowHighIntensityOnly(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${showHighIntensityOnly ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  🔥 High Intensity
                </button>
              </div>
            </div>

            {/* List & Loading States */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 flex-1">
                <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-sm text-slate-400">Fetching workouts...</p>
              </div>
            ) : workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-850 rounded-xl flex-1">
                <span className="text-4xl mb-3">📭</span>
                <h3 className="font-bold text-slate-300 mb-1">No workouts found</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  {showHighIntensityOnly 
                    ? "No sessions have burned more than 300 kcal yet." 
                    : "Get started by logging your very first workout in the form!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="pb-3 pl-4">Exercise</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3 text-right">Duration</th>
                      <th className="pb-3 text-right">Calories</th>
                      <th className="pb-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-sm">
                    {workouts.map((w) => (
                      <tr 
                        key={w.id} 
                        className={`hover:bg-slate-850/40 transition group ${w.caloriesBurned > 300 ? "bg-rose-950/5" : ""}`}
                      >
                        <td className="py-3.5 pl-4 font-semibold text-slate-200">
                          {w.exerciseName}
                          {w.caloriesBurned > 300 && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              INTENSE
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-400">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            w.category === "Cardio" 
                              ? "bg-sky-500/10 text-sky-400 border-sky-500/20" 
                              : w.category === "Strength"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {w.category}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-medium text-slate-300">
                          {w.durationMinutes} min
                        </td>
                        <td className="py-3.5 text-right font-semibold text-indigo-400">
                          {w.caloriesBurned.toFixed(0)} kcal
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            onClick={() => handleDelete(w.id!)}
                            className="text-xs text-slate-500 hover:text-rose-400 p-1.5 rounded bg-transparent hover:bg-rose-500/10 active:scale-95 transition"
                            title="Delete record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
