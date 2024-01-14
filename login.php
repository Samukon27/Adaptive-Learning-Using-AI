<?php
include('header.html');

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get username and password from the form
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Create a database connection (move this to a separate file for better organization)
    $servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $dbname = "yourdbname";

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Securely hash the password (use password_hash in a real-world scenario)
    $hashedPassword = md5($password);

    // SQL query to check user credentials
    $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$hashedPassword'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Redirect to the profile page with the username as a parameter
        header("Location: profile.php?username=" . urlencode($username));
        exit();
    } else {
        // Display an error message
        echo "<div class='container mt-5 alert alert-danger'>Invalid username or password</div>";
    }

    // Close the database connection
    $conn->close();
}
?>

<div class="container mt-5">
    <h2>Login</h2>
    <form method="post" action="">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
</div>

<?php include('footer.html'); ?>
