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
    if ($_GET['action'] === 'add_topic') {
        $requestData = json_decode(file_get_contents('php://input'), true);

        $topicName = $requestData['topicName'];
        $courseId = $requestData['courseId'];

        if (empty($topicName)) {
            echo json_encode(['error' => 'Please provide a valid topic name.']);
        } else {
            echo json_encode(addTopic($conn, $topicName, $courseId));
        }
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'get_topics') {
        $courseId = $_GET['courseId'];
        echo json_encode(getTopics($conn, $courseId));
    } elseif ($_GET['action'] === 'delete_topic') {
        $topicId = $_GET['topicId'];
        echo json_encode(deleteTopic($conn, $topicId));
    } else {
        echo json_encode(['error' => 'Invalid action']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

$conn->close();

function addTopic($conn, $topicName, $courseId) {
    $stmt = $conn->prepare('INSERT INTO topics (topicName, course_id) VALUES (?, ?)');
    $stmt->bind_param('si', $topicName, $courseId);

    if ($stmt->execute() === TRUE) {
        $newTopicId = $stmt->insert_id;
        $newTopic = ['id' => $newTopicId, 'topicName' => $topicName, 'courseId' => $courseId];
        return ['message' => 'Topic added successfully', 'topic' => $newTopic];
    } else {
        return ['error' => 'Error adding topic: ' . $stmt->error];
    }
}

function getTopics($conn, $courseId) {
    $stmt = $conn->prepare('SELECT * FROM topics WHERE course_id = ?');
    $stmt->bind_param('i', $courseId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $topics = [];

    while ($row = $result->fetch_assoc()) {
        $topics[] = $row;
    }

    return $topics;
}

function deleteTopic($conn, $topicId) {
    $stmt = $conn->prepare('DELETE FROM topics WHERE id = ?');
    $stmt->bind_param('i', $topicId);

    if ($stmt->execute() === TRUE) {
        return ['message' => 'Topic deleted successfully!'];
    } else {
        return ['error' => 'Error deleting topic: ' . $stmt->error];
    }
}

?>
