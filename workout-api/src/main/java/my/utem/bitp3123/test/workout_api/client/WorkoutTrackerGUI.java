package my.utem.bitp3123.test.workout_api.client;

import javax.swing.*;
import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class WorkoutTrackerGUI extends JFrame {

    private JTextField txtExerciseName;
    private JTextField txtDuration;
    private JTextField txtCalories;
    private JComboBox<String> comboCategory;
    private JButton btnSave;
    private JButton btnCancel;
    private JLabel lblStatus;

    public WorkoutTrackerGUI() {
        // Set up the Frame
        setTitle("Workout Tracker — Modern Entry Form");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(450, 420);
        setLocationRelativeTo(null);

        // Apply a clean modern Look and Feel if available
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception ignored) {}

        // Main Container Panel
        JPanel mainPanel = new JPanel(new GridBagLayout());
        mainPanel.setBorder(BorderFactory.createEmptyBorder(25, 25, 25, 25));
        mainPanel.setBackground(Color.WHITE);
        setContentPane(mainPanel);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Title
        JLabel lblTitle = new JLabel("Workout Tracker", JLabel.CENTER);
        lblTitle.setFont(new Font("SansSerif", Font.BOLD, 22));
        lblTitle.setForeground(new Color(33, 33, 33));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        mainPanel.add(lblTitle, gbc);

        JLabel lblSubtitle = new JLabel("Modern Entry Form", JLabel.CENTER);
        lblSubtitle.setFont(new Font("SansSerif", Font.PLAIN, 12));
        lblSubtitle.setForeground(new Color(117, 117, 117));
        gbc.gridy = 1;
        mainPanel.add(lblSubtitle, gbc);

        // Fields Setup
        gbc.gridwidth = 1;

        // Exercise Name
        JLabel lblExerciseName = new JLabel("Exercise Name:");
        lblExerciseName.setFont(new Font("SansSerif", Font.BOLD, 12));
        gbc.gridx = 0;
        gbc.gridy = 2;
        mainPanel.add(lblExerciseName, gbc);

        txtExerciseName = new JTextField();
        txtExerciseName.setPreferredSize(new Dimension(200, 28));
        gbc.gridx = 1;
        mainPanel.add(txtExerciseName, gbc);

        // Duration (min)
        JLabel lblDuration = new JLabel("Duration (min):");
        lblDuration.setFont(new Font("SansSerif", Font.BOLD, 12));
        gbc.gridx = 0;
        gbc.gridy = 3;
        mainPanel.add(lblDuration, gbc);

        txtDuration = new JTextField();
        txtDuration.setPreferredSize(new Dimension(200, 28));
        gbc.gridx = 1;
        mainPanel.add(txtDuration, gbc);

        // Calories Burned
        JLabel lblCalories = new JLabel("Calories Burned:");
        lblCalories.setFont(new Font("SansSerif", Font.BOLD, 12));
        gbc.gridx = 0;
        gbc.gridy = 4;
        mainPanel.add(lblCalories, gbc);

        txtCalories = new JTextField();
        txtCalories.setPreferredSize(new Dimension(200, 28));
        gbc.gridx = 1;
        mainPanel.add(txtCalories, gbc);

        // Category Dropdown
        JLabel lblCategory = new JLabel("Category:");
        lblCategory.setFont(new Font("SansSerif", Font.BOLD, 12));
        gbc.gridx = 0;
        gbc.gridy = 5;
        mainPanel.add(lblCategory, gbc);

        String[] categories = {"Cardio", "Strength", "Flexibility"};
        comboCategory = new JComboBox<>(categories);
        comboCategory.setPreferredSize(new Dimension(200, 28));
        gbc.gridx = 1;
        mainPanel.add(comboCategory, gbc);

        // Status Label (for loading indication)
        lblStatus = new JLabel(" ", JLabel.CENTER);
        lblStatus.setFont(new Font("SansSerif", Font.ITALIC, 11));
        lblStatus.setForeground(new Color(25, 118, 210));
        gbc.gridx = 0;
        gbc.gridy = 6;
        gbc.gridwidth = 2;
        mainPanel.add(lblStatus, gbc);

        // Buttons Panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        buttonPanel.setBackground(Color.WHITE);

        btnCancel = new JButton("Cancel");
        btnCancel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        btnCancel.addActionListener(e -> clearForm());

        btnSave = new JButton("Save Workout");
        btnSave.setFont(new Font("SansSerif", Font.BOLD, 12));
        btnSave.setBackground(new Color(33, 150, 243));
        btnSave.setForeground(Color.WHITE);
        btnSave.setFocusPainted(false);

        buttonPanel.add(btnCancel);
        buttonPanel.add(btnSave);

        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.NONE;
        gbc.anchor = GridBagConstraints.EAST;
        mainPanel.add(buttonPanel, gbc);

        // Add Save Event Listener
        btnSave.addActionListener(e -> saveWorkout());
    }

    private void clearForm() {
        txtExerciseName.setText("");
        txtDuration.setText("");
        txtCalories.setText("");
        comboCategory.setSelectedIndex(0);
        lblStatus.setText(" ");
    }

    private void setUIEnabled(boolean enabled) {
        txtExerciseName.setEnabled(enabled);
        txtDuration.setEnabled(enabled);
        txtCalories.setEnabled(enabled);
        comboCategory.setEnabled(enabled);
        btnSave.setEnabled(enabled);
        btnCancel.setEnabled(enabled);
    }

    private void saveWorkout() {
        String exerciseName = txtExerciseName.getText().trim();
        String durationStr = txtDuration.getText().trim();
        String caloriesStr = txtCalories.getText().trim();
        String category = (String) comboCategory.getSelectedItem();

        // Swing Client-Side Validation
        if (exerciseName.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Exercise Name cannot be blank!", "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int duration;
        double calories;
        try {
            duration = Integer.parseInt(durationStr);
            calories = Double.parseDouble(caloriesStr);
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Duration and Calories Burned must be numeric!", "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Disable UI and show flight status to remain responsive
        setUIEnabled(false);
        lblStatus.setText("Saving workout to server...");

        // WEEK 4: Run HTTP request on a separate worker thread (not on EDT)
        new Thread(() -> {
            try {
                // Prepare JSON request body
                String jsonPayload = String.format(
                        "{\"exerciseName\":\"%s\",\"durationMinutes\":%d,\"caloriesBurned\":%.2f,\"category\":\"%s\"}",
                        exerciseName.replace("\"", "\\\""), duration, calories, category
                );

                // Build HttpClient & Request
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:8080/api/workouts"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                // Send synchronous HTTP POST request in this worker thread
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                // Update UI components on the Event Dispatch Thread (EDT)
                SwingUtilities.invokeLater(() -> {
                    setUIEnabled(true);
                    lblStatus.setText(" ");
                    if (response.statusCode() == 201) {
                        JOptionPane.showMessageDialog(this, "Workout saved successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                        clearForm();
                    } else if (response.statusCode() == 400) {
                        JOptionPane.showMessageDialog(this, "Failed to save: Bad Request (400) from server.", "Validation Error", JOptionPane.ERROR_MESSAGE);
                    } else {
                        JOptionPane.showMessageDialog(this, "Failed to save. Server returned status code: " + response.statusCode(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                });

            } catch (Exception ex) {
                // If network/server is down, handle on EDT
                SwingUtilities.invokeLater(() -> {
                    setUIEnabled(true);
                    lblStatus.setText(" ");
                    JOptionPane.showMessageDialog(this, "Error connecting to server:\n" + ex.getMessage(), "Connection Error", JOptionPane.ERROR_MESSAGE);
                });
            }
        }).start();
    }

    public static void main(String[] args) {
        // Start the Swing application on the Event Dispatch Thread
        SwingUtilities.invokeLater(() -> {
            WorkoutTrackerGUI frame = new WorkoutTrackerGUI();
            frame.setVisible(true);
        });
    }
}
