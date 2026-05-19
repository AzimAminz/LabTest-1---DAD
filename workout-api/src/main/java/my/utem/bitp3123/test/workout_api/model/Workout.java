package my.utem.bitp3123.test.workout_api.model;

public class Workout {
    private Integer id;
    private String exerciseName;
    private Integer durationMinutes;
    private Double caloriesBurned;
    private String category;

    // No-arg constructor
    public Workout() {
    }

    // All-args constructor
    public Workout(Integer id, String exerciseName, Integer durationMinutes, Double caloriesBurned, String category) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.category = category;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExerciseName() {
        return exerciseName;
      }
  
      public void setExerciseName(String exerciseName) {
          this.exerciseName = exerciseName;
      }
  
      public Integer getDurationMinutes() {
          return durationMinutes;
      }
  
      public void setDurationMinutes(Integer durationMinutes) {
          this.durationMinutes = durationMinutes;
      }
  
      public Double getCaloriesBurned() {
          return caloriesBurned;
      }
  
      public void setCaloriesBurned(Double caloriesBurned) {
          this.caloriesBurned = caloriesBurned;
      }
  
      public String getCategory() {
          return category;
      }
  
      public void setCategory(String category) {
          this.category = category;
      }
  }

