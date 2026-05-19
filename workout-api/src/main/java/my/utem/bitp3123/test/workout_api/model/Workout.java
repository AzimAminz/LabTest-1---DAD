package my.utem.bitp3123.test.workout_api.model;

public class Workout {
    private int id;
    private String exerciseName;
    private int durationMinutes;
    private double caloriesBurned;
    private String category;

    // No-arg constructor
    public Workout() {
    }

    // All-args constructor
    public Workout(int id, String exerciseName, int durationMinutes, double caloriesBurned, String category) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.category = category;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getExerciseName() {
        return exerciseName;
    }

    public void setExerciseName(String exerciseName) {
        this.exerciseName = exerciseName;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
