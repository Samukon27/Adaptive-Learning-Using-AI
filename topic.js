$(document).ready(function () {
    var topics = [];
    var courseId = new URLSearchParams(window.location.search).get('courseId');

    // Fetch topics for the specific course from the server on page load
    fetchTopics();

    // Use event delegation to handle button clicks
    $(document).on('click', '#addTopicButton', function () {
        addTopic();
    });
    
    function addTopic() {
        var topicName = $('#topicName').val();

        if (!topicName) {
            alert('Please provide a valid topic name.');
            return;
        }

        var newTopic = {
            topicName: topicName,
            courseId: courseId
        };

        $.ajax({
            type: 'POST',
            url: 'topic.php?action=add_topic',
            data: JSON.stringify(newTopic),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                if (response.error) {
                    alert(response.error);
                } else {
                    // Update the local data and the table
                    topics.push(response.topic);
                    updateTable();

                    // Clear the form
                    $('#topicName').val('');

                    // Close the modal
                    $('#topicModal').modal('hide');
                }
            },
            error: function (error) {
                console.error('Error adding topic:', error.responseText);
            }
        });
    }

    function deleteTopic(index) {
        var topicIdToDelete = topics[index].id;

        $.ajax({
            type: 'GET',
            url: 'topic.php?action=delete_topic&topicId=' + topicIdToDelete,
            success: function (response) {
                console.log(response.message);

                // Update the local data and the table
                topics.splice(index, 1);
                updateTable();
            },
            error: function (error) {
                console.error('Error deleting topic:', error.responseText);
            }
        });
    }

    function fetchTopics() {
        $.ajax({
            type: 'GET',
            url: 'topic.php?action=get_topics&courseId=' + courseId,
            success: function (response) {
                console.log(response);

                if (Array.isArray(response)) {
                    topics = response;
                    updateTable();
                } else {
                    console.error('Invalid response format. Expected an array:', response);
                }
            },
            error: function (error) {
                console.error('Error fetching topics:', error.responseText);
            }
        });
    }

    function updateTable() {
        $('#topicTableBody').empty();

        for (var i = 0; i < topics.length; i++) {
            var topic = topics[i];

            var row = '<tr>';
            row += '<td>' + topic.topicName + '</td>';
            row += '<td>';
            row += '<a href="addQuestion.html?id=' + topic.id + '" class="btn btn-success" role="button">Add Question</a>';
            row += ' <a href="addContent.html?id=' + topic.id + '" class="btn btn-info" role="button">Add Content</a>';
            row += ' <button type="button" class="btn btn-danger deleteTopicButton" data-index="' + i + '">Delete</button>';
            row += '</td>';
            row += '</tr>';

            $('#topicTableBody').append(row);
        }
    }

    // Add event listener for the delete buttons
    $(document).on('click', '.deleteTopicButton', function () {
        var index = $(this).data('index');

        // Show confirmation dialog
        var isConfirmed = confirm('Are you sure you want to delete this topic?');

        if (isConfirmed) {
            deleteTopic(index);
        }
    });
});
