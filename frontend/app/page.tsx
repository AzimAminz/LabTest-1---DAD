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
  const [durationMinutes, setDurationMinutes] = useState(30); // Default 30 as in the image
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [category, setCategory] = useState("Cardio");

  // App State
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nextId, setNextId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHighIntensityOnly, setShowHighIntensityOnly] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const backendUrl = "http://localhost:8080/api/workouts";

  // Fetch all workouts
  const fetchWorkouts = async (highIntensity = showHighIntensityOnly) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const url = highIntensity ? `${backendUrl}/high-intensity` : backendUrl;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch workouts.");
      const data = await res.json();
      setWorkouts(data);

      // Determine next auto-increment ID
      if (data.length > 0) {
        const maxId = Math.max(...data.map((w: Workout) => w.id || 0));
        setNextId(maxId + 1);
      } else {
        setNextId(1);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Cannot connect to Spring Boot API. Please ensure the backend is running on http://localhost:8080");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [showHighIntensityOnly]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!exerciseName.trim()) {
      setErrorMessage("Exercise Name cannot be blank.");
      return;
    }

    const duration = durationMinutes;
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
        setSuccessMessage("Workout successfully saved!");
        handleCancel();
        fetchWorkouts();
      } else if (res.status === 400) {
        setErrorMessage("Bad Request: Please check input fields.");
      } else {
        setErrorMessage(`Server error: Returned status ${res.status}`);
      }
    } catch (err) {
      setErrorMessage("Connection error. Is the Spring Boot backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Cancel (Reset Form)
  const handleCancel = () => {
    setExerciseName("");
    setDurationMinutes(30);
    setCaloriesBurned("");
    setCategory("Cardio");
    setErrorMessage("");
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`${backendUrl}/${id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        setSuccessMessage("Workout successfully deleted!");
        fetchWorkouts();
      } else if (res.status === 404) {
        setErrorMessage("Workout not found.");
      } else {
        setErrorMessage(`Could not delete: Status ${res.status}`);
      }
    } catch (err) {
      setErrorMessage("Error connecting to server.");
    }
  };

  // Stepper helper
  const incrementDuration = () => setDurationMinutes(prev => prev + 5);
  const decrementDuration = () => setDurationMinutes(prev => Math.max(1, prev - 5));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white pb-16 relative overflow-hidden">
      
      {/* Decorative gradient spot in the background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 pt-12">
        
        {/* Header */}
        <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">🏋️‍♂️</span>
              Workout Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              A modern, elegant web edition of your desktop entry form.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              API Connected
            </span>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: The Modern Entry Form (Matches the Wireframe exactly but with high aesthetics) */}
          <div className="lg:col-span-5 flex justify-center">
            
            {/* The Window-style Card */}
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              
              {/* Blue Header Banner - "Workout Record" (Matches wireframe perfectly but beautiful) */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-6 text-center relative">
                <div className="absolute top-3 left-4 flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-400/80 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-yellow-400/80 rounded-full" />
                  <span className="w-2.5 h-2.5 bg-green-400/80 rounded-full" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide mt-2">
                  Workout Record
                </h2>
                <p className="text-xs text-blue-100/80 mt-1">Modern Entry Form</p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
                
                {/* ID Field at the Top (Matches the empty box at the top of the image) */}
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Workout ID: <span className="text-slate-800 font-mono">#{workouts.length + 1}</span>
                  </div>
                </div>

                {/* Grid layout for fields */}
                <div className="space-y-4">
                  
                  {/* Exercise Name */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 text-right pr-2">
                      Exercise Name:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        placeholder="e.g. Bench Press"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm rounded-lg px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Duration (min) with custom Spin Stepper (Matches wireframe spinner!) */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 text-right pr-2">
                      Duration (min):
                    </label>
                    <div className="col-span-2 flex">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden w-full max-w-[150px]">
                        <button
                          type="button"
                          onClick={decrementDuration}
                          className="px-3 py-2 text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition text-sm font-bold"
                          disabled={submitting}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={durationMinutes}
                          onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full bg-transparent text-center text-sm font-bold text-slate-800 outline-none"
                          disabled={submitting}
                        />
                        <button
                          type="button"
                          onClick={incrementDuration}
                          className="px-3 py-2 text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition text-sm font-bold"
                          disabled={submitting}
                        >
                          +
                        </button>
                      </div>
                      <span className="self-center ml-2 text-xs text-slate-400 font-medium">mins</span>
                    </div>
                  </div>

                  {/* Calories Burned */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 text-right pr-2">
                      Calories Burned:
                    </label>
                    <div className="col-span-2 relative">
                      <input
                        type="number"
                        value={caloriesBurned}
                        onChange={(e) => setCaloriesBurned(e.target.value)}
                        placeholder="e.g. 250"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm rounded-lg px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400 pr-12"
                        disabled={submitting}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">kcal</span>
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-sm font-bold text-slate-700 text-right pr-2">
                      Category:
                    </label>
                    <div className="col-span-2 relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm rounded-lg px-3 py-2 outline-none transition cursor-pointer appearance-none pr-8 text-slate-700 font-medium"
                        disabled={submitting}
                      >
                        <option value="Cardio">🏃‍♂️ Cardio</option>
                        <option value="Strength">🏋️‍♀️ Strength</option>
                        <option value="Flexibility">🧘‍♂️ Flexibility</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>
                  </div>

                </div>

                {/* Messages Box */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 flex items-center gap-2">
                    <span>⚠️</span> {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-600 flex items-center gap-2">
                    <span>✨</span> {successMessage}
                  </div>
                )}

                {/* Footer Buttons (Matches wireframe but highly stylized) */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2 text-sm font-bold text-rose-500 bg-white border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50/50 active:scale-95 transition-all duration-150 rounded-lg"
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  {/* Save Workout Button */}
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-bold text-emerald-600 bg-white border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 active:scale-95 transition-all duration-150 rounded-lg shadow-sm flex items-center justify-center min-w-[130px]"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-1.5">
                        <svg className="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </div>
                    ) : (
                      "Save Workout"
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: Modern Fitness Dashboard (List of workouts) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 sm:p-8">
              
              {/* Header inside Dashboard */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Logged Workouts
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time synchronization with Spring Boot backend API.
                  </p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center bg-slate-100 p-1 border border-slate-200 rounded-lg">
                  <button
                    onClick={() => setShowHighIntensityOnly(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${!showHighIntensityOnly ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setShowHighIntensityOnly(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${showHighIntensityOnly ? "bg-rose-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    🔥 High Intensity
                  </button>
                </div>
              </div>

              {/* Table List of Sessions */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xs text-slate-450">Loading sessions...</p>
                </div>
              ) : workouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-xl">
                  <span className="text-3xl mb-2">📋</span>
                  <h4 className="font-bold text-slate-450 text-sm">No records logged</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    {showHighIntensityOnly 
                      ? "No records with calories burned > 300 kcal." 
                      : "Create your first workout session to display here!"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider font-bold">
                        <th className="pb-3 pl-3">ID</th>
                        <th className="pb-3">Exercise</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-right">Duration</th>
                        <th className="pb-3 text-right">Calories</th>
                        <th className="pb-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {workouts.map((w) => (
                        <tr 
                          key={w.id} 
                          className={`hover:bg-slate-50/80 transition-all ${w.caloriesBurned > 300 ? "bg-rose-50/20" : ""}`}
                        >
                          <td className="py-3.5 pl-3 font-mono text-xs font-semibold text-slate-400">
                            #{w.id}
                          </td>
                          <td className="py-3.5 font-semibold text-slate-800">
                            {w.exerciseName}
                            {w.caloriesBurned > 300 && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-100 text-rose-600 border border-rose-200">
                                INTENSE
                              </span>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              w.category === "Cardio" 
                                ? "bg-sky-50 text-sky-600 border-sky-200" 
                                : w.category === "Strength"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-emerald-50 text-emerald-600 border-emerald-200"
                            }`}>
                              {w.category}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-medium text-slate-600">
                            {w.durationMinutes}m
                          </td>
                          <td className="py-3.5 text-right font-bold text-blue-600">
                            {w.caloriesBurned.toFixed(0)} kcal
                          </td>
                          <td className="py-3.5 text-center">
                            <button
                              onClick={() => handleDelete(w.id!)}
                              className="text-xs text-slate-400 hover:text-rose-500 p-1.5 rounded-lg bg-transparent hover:bg-rose-50 active:scale-90 transition-all duration-150"
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
          </div>

        </div>

      </div>

    </div>
  );
}
