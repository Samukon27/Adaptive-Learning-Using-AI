<?php
include('header.html');
include('config.php');

// Check if the form is submitted to add a new course
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["course_name"])) {
    $courseName = $_POST["course_name"];

    // Insert the new course into the database
    $sql = "INSERT INTO courses (course_name) VALUES ('$courseName')";
    if ($conn->query($sql) === TRUE) {
        echo "<div class='container mt-5 alert alert-success'>Course added successfully</div>";
    } else {
        echo "<div class='container mt-5 alert alert-danger'>Error adding course: " . $conn->error . "</div>";
    }
}

// Fetch and display existing courses from the database
$sql = "SELECT * FROM courses";
$result = $conn->query($sql);

?>

<div class="container mt-5">
    <h2>Courses</h2>
    <p>Here are the available courses:</p>
    <ul>
        <?php
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<li>" . htmlspecialchars($row["course_name"]) . "</li>";
            }
        } else {
            echo "<li>No courses available</li>";
        }
        ?>
    </ul>

    <!-- Form to add a new course -->
    <form method="post" action="">
        <div class="form-group">
            <label for="course_name">Add New Course:</label>
            <input type="text" class="form-control" id="course_name" name="course_name" required>
        </div>
        <button type="submit" class="btn btn-primary">Add Course</button>
    </form>
</div>

<?php include('footer.html'); ?>
