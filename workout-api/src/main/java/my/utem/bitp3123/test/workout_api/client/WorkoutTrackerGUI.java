package my.utem.bitp3123.test.workout_api.client;

import javax.swing.*;
import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class WorkoutTrackerGUI extends JFrame {

    private JTextField txtExerciseName;
    private JTextField txtDuration;
    private JTextField txtCalories;
    private JComboBox<String> cmbCategory;
    private JButton btnSave;
    private JButton btnCancel;
    private JLabel lblStatus;

    public WorkoutTrackerGUI() {
        // Set up the Frame matching the wireframe layout
        setTitle("Workout Tracker — Modern Entry Form");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(450, 420);
        setLocationRelativeTo(null);

        // Apply a clean Nimbus Look and Feel for better aesthetics
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
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(10, 10, 10, 10);

        // 1. Title Banner (Workout Record)
        JPanel bannerPanel = new JPanel();
        bannerPanel.setBackground(new Color(51, 122, 183)); // Slate Blue from image
        bannerPanel.setLayout(new BorderLayout());
        bannerPanel.setBorder(BorderFactory.createEmptyBorder(10, 15, 10, 15));
        
        JLabel lblTitle = new JLabel("Workout Record", JLabel.CENTER);
        lblTitle.setFont(new Font("Segoe UI", Font.BOLD, 22));
        lblTitle.setForeground(Color.WHITE);
        bannerPanel.add(lblTitle, BorderLayout.CENTER);

        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        gbc.weightx = 1.0;
        mainPanel.add(bannerPanel, gbc);

        // 2. ID Spacer (Matches empty box in the image)
        JPanel spacerPanel = new JPanel();
        spacerPanel.setPreferredSize(new Dimension(80, 25));
        spacerPanel.setBorder(BorderFactory.createLineBorder(Color.LIGHT_GRAY));
        spacerPanel.setBackground(Color.WHITE);
        
        JLabel lblIdText = new JLabel("[ Auto Generated ID ]", JLabel.CENTER);
        lblIdText.setFont(new Font("Segoe UI", Font.ITALIC, 11));
        lblIdText.setForeground(Color.GRAY);
        spacerPanel.add(lblIdText);

        gbc.gridy = 1;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.NONE;
        mainPanel.add(spacerPanel, gbc);

        // Re-enable horizontal fill for form grid
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridwidth = 1;

        // Font settings for labels & fields
        Font labelFont = new Font("Segoe UI", Font.BOLD, 13);
        Font fieldFont = new Font("Segoe UI", Font.PLAIN, 13);

        // 3. Exercise Name
        JLabel lblExercise = new JLabel("Exercise Name:", JLabel.RIGHT);
        lblExercise.setFont(labelFont);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.weightx = 0.3;
        mainPanel.add(lblExercise, gbc);

        txtExerciseName = new JTextField();
        txtExerciseName.setFont(fieldFont);
        gbc.gridx = 1;
        gbc.weightx = 0.7;
        mainPanel.add(txtExerciseName, gbc);

        // 4. Duration
        JLabel lblDuration = new JLabel("Duration (min):", JLabel.RIGHT);
        lblDuration.setFont(labelFont);
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.weightx = 0.3;
        mainPanel.add(lblDuration, gbc);

        txtDuration = new JTextField("30"); // default 30
        txtDuration.setFont(fieldFont);
        gbc.gridx = 1;
        gbc.weightx = 0.7;
        mainPanel.add(txtDuration, gbc);

        // 5. Calories Burned
        JLabel lblCalories = new JLabel("Calories Burned:", JLabel.RIGHT);
        lblCalories.setFont(labelFont);
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.weightx = 0.3;
        mainPanel.add(lblCalories, gbc);

        txtCalories = new JTextField();
        txtCalories.setFont(fieldFont);
        gbc.gridx = 1;
        gbc.weightx = 0.7;
        mainPanel.add(txtCalories, gbc);

        // 6. Category
        JLabel lblCategory = new JLabel("Category:", JLabel.RIGHT);
        lblCategory.setFont(labelFont);
        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.weightx = 0.3;
        mainPanel.add(lblCategory, gbc);

        cmbCategory = new JComboBox<>(new String[]{"Cardio", "Strength", "Flexibility"});
        cmbCategory.setFont(fieldFont);
        cmbCategory.setBackground(Color.WHITE);
        gbc.gridx = 1;
        gbc.weightx = 0.7;
        mainPanel.add(cmbCategory, gbc);

        // 7. Status Label
        lblStatus = new JLabel("Ready", JLabel.CENTER);
        lblStatus.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lblStatus.setForeground(new Color(120, 120, 120));
        gbc.gridx = 0;
        gbc.gridy = 6;
        gbc.gridwidth = 2;
        mainPanel.add(lblStatus, gbc);

        // 8. Buttons Panel (Footer)
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 5));
        buttonPanel.setBackground(Color.WHITE);

        btnCancel = new JButton("Cancel");
        btnCancel.setFont(labelFont);
        btnCancel.setForeground(new Color(169, 68, 66)); // Soft red
        btnCancel.setBackground(Color.WHITE);

        btnSave = new JButton("Save Workout");
        btnSave.setFont(labelFont);
        btnSave.setForeground(new Color(60, 118, 61)); // Soft green
        btnSave.setBackground(Color.WHITE);

        buttonPanel.add(btnCancel);
        buttonPanel.add(btnSave);

        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.gridwidth = 2;
        mainPanel.add(buttonPanel, gbc);

        // --- Action Listeners ---

        // Cancel resets the form
        btnCancel.addActionListener(e -> resetForm());

        // Save Workout initiates background EDT offloading
        btnSave.addActionListener(e -> saveWorkoutWithThreading());
    }

    private void resetForm() {
        txtExerciseName.setText("");
        txtDuration.setText("30");
        txtCalories.setText("");
        cmbCategory.setSelectedIndex(0);
        lblStatus.setText("Ready");
        lblStatus.setForeground(Color.GRAY);
    }

    private void setFieldsEnabled(boolean enabled) {
        txtExerciseName.setEnabled(enabled);
        txtDuration.setEnabled(enabled);
        txtCalories.setEnabled(enabled);
        cmbCategory.setEnabled(enabled);
        btnSave.setEnabled(enabled);
        btnCancel.setEnabled(enabled);
    }

    /**
     * PEMATUHAN MINGGU 4:
     * Melakukan panggilan API POST pada Thread berasingan (EDT Offloading)
     * untuk memastikan UI Swing kekal responsif, hidup, dan tidak tergantung.
     */
    private void saveWorkoutWithThreading() {
        String name = txtExerciseName.getText().trim();
        String durationStr = txtDuration.getText().trim();
        String caloriesStr = txtCalories.getText().trim();
        String category = (String) cmbCategory.getSelectedItem();

        // Validasi ringkas sebelum mulakan thread
        if (name.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Exercise Name cannot be blank.", "Validation Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // 1. Matikan borang pada EDT supaya tiada input bertindih berlaku sewaktu "in-flight"
        setFieldsEnabled(false);
        lblStatus.setText("Saving workout to server...");
        lblStatus.setForeground(new Color(0, 102, 204));

        // 2. Lancarkan Thread pekerja baharu (EDT Offloading!)
        new Thread(() -> {
            try {
                // Sediakan request JSON payload
                int duration = Integer.parseInt(durationStr);
                double calories = Double.parseDouble(caloriesStr);

                String jsonPayload = String.format(
                        "{\"exerciseName\":\"%s\",\"durationMinutes\":%d,\"caloriesBurned\":%.2f,\"category\":\"%s\"}",
                        name, duration, calories, category
                );

                // Bina HttpClient
                HttpClient client = HttpClient.newBuilder()
                        .connectTimeout(Duration.ofSeconds(5))
                        .build();

                // Bina POST request (Pematuhan Minggu 6: Menggunakan kata kerja POST)
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:8080/api/workouts"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                // Hantar segerak di atas thread pekerja baharu ini (bukan EDT!)
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                // 3. Kembalikan kawalan ke EDT secara selamat untuk kemaskini UI (SwingUtilities.invokeLater)
                SwingUtilities.invokeLater(() -> {
                    if (response.statusCode() == 201) {
                        lblStatus.setText("Workout successfully saved!");
                        lblStatus.setForeground(new Color(60, 118, 61));
                        JOptionPane.showMessageDialog(WorkoutTrackerGUI.this, "Workout saved successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                        resetForm();
                    } else {
                        lblStatus.setText("Server returned bad request status: " + response.statusCode());
                        lblStatus.setForeground(Color.RED);
                        JOptionPane.showMessageDialog(WorkoutTrackerGUI.this, "Server returned status: " + response.statusCode(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                    setFieldsEnabled(true);
                });

            } catch (NumberFormatException ex) {
                // Ralat format nombor
                SwingUtilities.invokeLater(() -> {
                    lblStatus.setText("Invalid duration or calories formatting.");
                    lblStatus.setForeground(Color.RED);
                    JOptionPane.showMessageDialog(WorkoutTrackerGUI.this, "Please enter valid numbers for Duration and Calories.", "Input Error", JOptionPane.ERROR_MESSAGE);
                    setFieldsEnabled(true);
                });
            } catch (Exception ex) {
                // Ralat sambungan/network
                SwingUtilities.invokeLater(() -> {
                    lblStatus.setText("Error connecting to backend server.");
                    lblStatus.setForeground(Color.RED);
                    JOptionPane.showMessageDialog(WorkoutTrackerGUI.this, "Could not connect to Spring Boot. Ensure it is running on port 8080.", "Connection Error", JOptionPane.ERROR_MESSAGE);
                    setFieldsEnabled(true);
                });
            }
        }).start(); // Memulakan thread
    }

    public static void main(String[] args) {
        // Membuka Frame Swing dengan selamat di atas EDT pada permulaan
        SwingUtilities.invokeLater(() -> {
            WorkoutTrackerGUI gui = new WorkoutTrackerGUI();
            gui.setVisible(true);
        });
    }
}
