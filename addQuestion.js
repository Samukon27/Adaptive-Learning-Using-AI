$(document).ready(function () {
    var courseId = new URLSearchParams(window.location.search).get('id'); // Assuming the course ID is passed through the URL

    // Handle change in question type
    $('#questionType').change(function () {
        updateAdditionalForm();
    });

    // Handle the form submission
    $('#addQuestionForm').submit(function (event) {
        event.preventDefault();
        addQuestion();
    });

    // Function to add a new question
    window.addQuestion = function () {
        var questionText = $('#questionText').val();
        var questionType = $('#questionType').val();
        var additionalFormData = getAdditionalFormData();
        var difficulty = $('#difficulty').val();

        if (!questionText || !questionType) {
            alert('Please provide both question text and type.');
            return;
        }

        var newQuestion = {
            questionText: questionText,
            questionType: questionType,
            courseId: courseId,
            additionalFormData: additionalFormData,
            difficulty: difficulty
        };

        $.ajax({
            type: 'POST',
            url: 'addQuestion.php',
            data: JSON.stringify(newQuestion),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                if (response.error) {
                    alert(response.error);
                } else {
                    // Clear the form
                    $('#questionText').val('');
                    $('#questionType').val('');
                    $('#additionalFormContainer').empty();
                    $('#difficulty').val('3');
                    $('.difficulty-value').text('3');

                    // Display a success message or perform any other actions
                    alert('Question added successfully!');

                    // Fetch and update questions for the topic
                    fetchQuestions();
                }
            },
            error: function (error) {
                console.error('Error adding question:', error.responseText);
            }
        });
    };

    // Function to get data from the additional form based on the question type
    function getAdditionalFormData() {
        var questionType = $('#questionType').val();
        var additionalFormData = {};

        if (questionType === 'MCQ') {
            additionalFormData.correctChoice = $('input[name="correctChoice"]:checked').val();
            additionalFormData.choices = [];
            $('[id^="choice"]').each(function () {
                additionalFormData.choices.push($(this).val());
            });
        } else if (questionType === 'Match') {
            additionalFormData.pairs = [];
            $('[id^="left"]').each(function (index) {
                var leftValue = $(this).val();
                var rightValue = $('[id^="right"]').eq(index).val();
                additionalFormData.pairs.push({ left: leftValue, right: rightValue });
            });
        } else if (questionType === 'Problem') {
            additionalFormData.finalAnswer = $('#finalAnswer').val();
        }

        return additionalFormData;
    }

    // Function to update the additional form based on the question type
    function updateAdditionalForm() {
        var questionType = $('#questionType').val();
        var additionalFormContainer = $('#additionalFormContainer');
        additionalFormContainer.empty();

        if (questionType === 'MCQ') {
            for (var i = 1; i <= 4; i++) {
                var choiceLabel = 'Choice ' + i + ':';
                var choiceId = 'choice' + i;

                var choiceFormGroup = $('<div class="form-group"></div>');
                choiceFormGroup.append('<label for="' + choiceId + '">' + choiceLabel + '</label>');
                choiceFormGroup.append('<input type="text" class="form-control" id="' + choiceId + '" required>');
                choiceFormGroup.append('<input type="radio" name="correctChoice" value="' + i + '"> Correct');

                additionalFormContainer.append(choiceFormGroup);
            }
        } else if (questionType === 'Match') {
            for (var j = 1; j <= 4; j++) {
                var leftLabel = 'Left ' + j + ':';
                var rightLabel = 'Right ' + j + ':';
                var leftId = 'left' + j;
                var rightId = 'right' + j;

                var matchFormGroup = $('<div class="form-group"></div>');
                matchFormGroup.append('<label for="' + leftId + '">' + leftLabel + '</label>');
                matchFormGroup.append('<input type="text" class="form-control" id="' + leftId + '" required>');

                matchFormGroup.append('<label for="' + rightId + '" class="ml-2">' + rightLabel + '</label>');
                matchFormGroup.append('<input type="text" class="form-control" id="' + rightId + '" required>');

                additionalFormContainer.append(matchFormGroup);
            }
        } else if (questionType === 'Problem') {
            var answerFormGroup = $('<div class="form-group"></div>');
            answerFormGroup.append('<label for="finalAnswer">Final Answer:</label>');
            answerFormGroup.append('<input type="text" class="form-control" id="finalAnswer" required>');

            additionalFormContainer.append(answerFormGroup);
        }
    }

    // Function to fetch and update questions for the topic
    function fetchQuestions() {
        $.ajax({
            type: 'GET',
            url: 'addQuestion.php?topicId=' + courseId,
            success: function (response) {
                console.log(response);

                if (Array.isArray(response)) {
                    updateQuestionTable(response);
                } else {
                    console.error('Invalid response format. Expected an array:', response);
                }
            },
            error: function (error) {
                console.error('Error fetching questions:', error.responseText);
            }
        });
    }

    // Function to update the question table
    function updateQuestionTable(questions) {
        $('#questionTableBody').empty();

        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];

            var row = '<tr>';
            row += '<td>' + question.questionText + '</td>';
            row += '<td>' + question.type + '</td>';
            row += '<td>' + question.difficulty + '</td>';
            row += '</tr>';

            $('#questionTableBody').append(row);
        }
    }

    // Initial call to update additional form on page load
    updateAdditionalForm();
    // Initial call to fetch and update questions for the topic on page load
    fetchQuestions();
});