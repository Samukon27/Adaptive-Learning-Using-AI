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

        if (!questionText || !questionType) {
            alert('Please provide both question text and type.');
            return;
        }

        var newQuestion = {
            questionText: questionText,
            questionType: questionType,
            courseId: courseId,
            additionalFormData: additionalFormData
        };

        $.ajax({
            type: 'POST',
            url: 'question.php?action=add_question',
            data: JSON.stringify(newQuestion),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                if (response.error) {
                    alert(response.error);
                } else {
                    // Clear the form
                    $('#questionText').val('');
                    $('#questionType').val(''); // Reset the question type dropdown
                    $('#additionalFormContainer').empty(); // Clear additional form elements

                    // Display a success message or perform any other actions
                    alert('Question added successfully!');
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
            additionalFormData.choices = [];
            $('input[name="correctChoice"]:checked').each(function () {
                additionalFormData.correctChoice = $(this).val();
            });
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
        additionalFormContainer.empty(); // Clear previous additional form elements

        if (questionType === 'MCQ') {
            // For MCQ type, add text boxes for choices with radio buttons
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
            // For Match type, add pairs of text boxes
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
            // For Problem type, add a text box for the final answer
            var answerFormGroup = $('<div class="form-group"></div>');
            answerFormGroup.append('<label for="finalAnswer">Final Answer:</label>');
            answerFormGroup.append('<input type="text" class="form-control" id="finalAnswer" required>');

            additionalFormContainer.append(answerFormGroup);
        }
    }
});
