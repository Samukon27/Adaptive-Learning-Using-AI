<?php

// Manual database connection for simplicity
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the data from the request
$data = json_decode(file_get_contents("php://input"));

$questionText = $data->questionText;
$questionType = $data->questionType;
$courseId = $data->courseId;
$additionalFormData = $data->additionalFormData;
$difficulty = $data->difficulty; // Corrected line

// Insert into questions table
$stmt = $conn->prepare("INSERT INTO questions (topic_id, difficulty, type) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $courseId, $difficulty, $questionType);
$stmt->execute();

// Get the last inserted question_id
$questionId = $conn->insert_id;
$stmt->close();

// Insert into the specific type table
switch ($questionType) {
    case 'MCQ':
        $stmt = $conn->prepare("INSERT INTO mcq (question_id, Question, Answer, choice1, choice2, choice3, choice4) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssss", $questionId, $questionText, $additionalFormData->correctChoice, $additionalFormData->choices[0], $additionalFormData->choices[1], $additionalFormData->choices[2], $additionalFormData->choices[3]);
        break;

    case 'Match':
        $stmt = $conn->prepare("INSERT INTO `match` (question_id, Question, A, 1, B, 2, C, 3, D, 4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssssssss", $questionId, $questionText, $additionalFormData->pairs[0]->left, $additionalFormData->pairs[0]->right, $additionalFormData->pairs[1]->left, $additionalFormData->pairs[1]->right, $additionalFormData->pairs[2]->left, $additionalFormData->pairs[2]->right, $additionalFormData->pairs[3]->left, $additionalFormData->pairs[3]->right);
        break;

    case 'Problem':
        $stmt = $conn->prepare("INSERT INTO problems (question_id, Question, Answer) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $questionId, $questionText, $additionalFormData->finalAnswer);
        break;

    default:
        die("Invalid question type");
}

$stmt->execute();
$stmt->close();

$conn->close();

echo json_encode(['success' => true]);

?>