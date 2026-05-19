package my.utem.bitp3123.test.workout_api.controller;

import my.utem.bitp3123.test.workout_api.model.Workout;
import my.utem.bitp3123.test.workout_api.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*") 
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    // 1. GET /api/workouts 
    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutService.findAll();
    }

    // 2. GET /api/workouts/{id} 
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable int id) {
        return workoutService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. GET /api/workouts/high-intensity 
    @GetMapping("/high-intensity")
    public List<Workout> getHighIntensityWorkouts() {
        return workoutService.findHighIntensity();
    }

    // 4. POST /api/workouts 
    @PostMapping
    public ResponseEntity<Workout> addWorkout(@RequestBody Workout workout) {
        if (workout.getExerciseName() == null || workout.getExerciseName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Workout created = workoutService.add(workout);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5. DELETE /api/workouts/{id} 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable int id) {
        boolean deleted = workoutService.delete(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
