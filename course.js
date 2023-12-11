$(document).ready(function () {
    var courses = [];

    // Fetch courses from the server on page load
    fetchCourses();

    // Use event delegation to handle button clicks
    $(document).on('click', '#addCourseButton', function () {
        addCourse();
    });

    $(document).on('click', '.deleteCourseButton', function () {
        var index = $(this).data('index');
        deleteCourse(index);
    });

    window.addCourse = function () {
        var courseName = $('#courseName').val();

        if (!courseName) {
            alert('Please provide a valid course name.');
            return;
        }

        var newCourse = {
            courseName: courseName
        };

        $.ajax({
            type: 'POST',
            url: 'course.php?action=add_course',
            data: JSON.stringify(newCourse),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);

                if (response.error) {
                    alert(response.error);
                } else {
                    // Update the local data and the table
                    courses.push(response.course);
                    updateTable();

                    // Clear the form
                    $('#courseName').val('');

                    // Close the modal
                    $('#courseModal').modal('hide');
                }
            },
            error: function (error) {
                console.error('Error adding course:', error.responseText);
            }
        });
    };

    window.deleteCourse = function (index) {
        var courseIdToDelete = courses[index].id;

        $.ajax({
            type: 'GET',
            url: 'course.php?action=delete_course&courseId=' + courseIdToDelete,
            success: function (response) {
                console.log(response.message);

                // Update the local data and the table
                courses.splice(index, 1);
                updateTable();
            },
            error: function (error) {
                console.error('Error deleting course:', error.responseText);
            }
        });
    };

    function fetchCourses() {
        $.ajax({
            type: 'GET',
            url: 'course.php?action=get_courses',
            success: function (response) {
                console.log(response);

                if (Array.isArray(response)) {
                    courses = response;
                    updateTable();
                } else {
                    console.error('Invalid response format. Expected an array:', response);
                }
            },
            error: function (error) {
                console.error('Error fetching courses:', error.responseText);
            }
        });
    }

    function updateTable() {
        $('#courseTableBody').empty();
    
        for (var i = 0; i < courses.length; i++) {
            var course = courses[i];
    
            var row = '<tr>';
            row += '<td>' + course.courseName + '</td>';
            row += '<td>';
            row += '<button type="button" class="btn btn-danger deleteCourseButton" data-index="' + i + '">Delete</button>';
            row += '<a href="topic.html?courseId=' + course.id + '" class="btn btn-info detailsButton ml-2" data-index="' + i + '">Details</a>';
            row += '</td>';
            row += '</tr>';
    
            $('#courseTableBody').append(row);
        }
    }
});
