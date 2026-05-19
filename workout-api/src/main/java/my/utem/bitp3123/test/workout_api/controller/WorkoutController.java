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
@CrossOrigin(origins = "*") // Membolehkan panggilan daripada frontend (Next.js) pada port 3000
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    // 1. GET /api/workouts - Mengembalikan semua list workout (200 OK)
    @GetMapping
    public List<Workout> getAllWorkouts() {
        return workoutService.findAll();
    }

    // 2. GET /api/workouts/{id} - Mengembalikan satu workout berdasarkan id (200 OK / 404 Not Found)
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable int id) {
        return workoutService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. GET /api/workouts/high-intensity - Mengembalikan workout berintensiti tinggi (200 OK)
    @GetMapping("/high-intensity")
    public List<Workout> getHighIntensityWorkouts() {
        return workoutService.findHighIntensity();
    }

    // 4. POST /api/workouts - Menambah workout baharu (201 Created / 400 Bad Request jika exerciseName kosong)
    @PostMapping
    public ResponseEntity<Workout> addWorkout(@RequestBody Workout workout) {
        if (workout.getExerciseName() == null || workout.getExerciseName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Workout created = workoutService.add(workout);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 5. DELETE /api/workouts/{id} - Memadam workout (204 No Content / 404 Not Found)
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
