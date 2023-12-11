<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "GP";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_GET['action'] === 'add_course') {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $courseName = $requestData['courseName'];

        if (empty($courseName)) {
            echo json_encode(['error' => 'Please provide a valid course name.']);
        } else {
            echo json_encode(addCourse($conn, $courseName));
        }
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'get_courses') {
        echo json_encode(getCourses($conn));
    } elseif ($_GET['action'] === 'delete_course') {
        $courseId = $_GET['courseId'];
        echo json_encode(deleteCourse($conn, $courseId));
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

$conn->close();

function addCourse($conn, $courseName) {
    $stmt = $conn->prepare('INSERT INTO lectures (courseName) VALUES (?)');
    $stmt->bind_param('s', $courseName);

    if ($stmt->execute() === TRUE) {
        $newCourseId = $stmt->insert_id; // Get the ID of the newly inserted course
        $newCourse = ['id' => $newCourseId, 'courseName' => $courseName];
        return ['message' => 'Course added successfully', 'course' => $newCourse];
    } else {
        return ['error' => 'Error adding course: ' . $stmt->error];
    }
}

function getCourses($conn) {
    $result = $conn->query('SELECT * FROM lectures');
    $courses = [];

    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }

    return $courses;
}

function deleteCourse($conn, $courseId) {
    $stmt = $conn->prepare('DELETE FROM lectures WHERE id = ?');
    $stmt->bind_param('i', $courseId);

    if ($stmt->execute() === TRUE) {
        return ['message' => 'Course deleted successfully!'];
    } else {
        return ['error' => 'Error deleting course: ' . $stmt->error];
    }
}

?>