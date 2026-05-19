package my.utem.bitp3123.test.workout_api.service;

import my.utem.bitp3123.test.workout_api.model.Workout;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkoutService {
    private final List<Workout> workouts = new ArrayList<>();
    private int nextId = 1;

    // Constructor to initialise 3 sample workout records
    public WorkoutService() {
        add(new Workout(0, "Running", 30, 350.0, "Cardio"));
        add(new Workout(0, "Weightlifting", 45, 200.0, "Strength"));
        add(new Workout(0, "Swimming", 60, 450.0, "Cardio"));
    }

    // returns all workouts
    public List<Workout> findAll() {
        return new ArrayList<>(workouts);
    }

    // returns a single workout or an indication that it does not exist
    public Optional<Workout> findById(int id) {
        return workouts.stream()
                .filter(w -> w.getId() == id)
                .findFirst();
    }

    // adds a new workout
    public Workout add(Workout w) {
        w.setId(nextId++);
        workouts.add(w);
        return w;
    }

    // removes a workout 
    public boolean delete(int id) {
        return workouts.removeIf(w -> w.getId() == id);
    }

    // returns workouts where caloriesBurned > 300
    public List<Workout> findHighIntensity() {
        return workouts.stream()
                .filter(w -> w.getCaloriesBurned() > 300)
                .collect(Collectors.toList());
    }
}
