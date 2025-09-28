document.getElementById('bookSubmit').addEventListener('click', function() {
    const name = document.getElementById('bookName').value;
    const email = document.getElementById('bookEmail').value;
    const phone = document.getElementById('bookPhone').value;
    const reservation_date = document.getElementById('bookDate').value;
    const reservation_time = document.getElementById('bookTime').value;
    const people_count = document.getElementById('bookPeople').value;
    const message = document.getElementById('bookMessage').value;

    fetch('/book-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, reservation_date, reservation_time, people_count, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Your table has been booked!');
        } else {
            alert('Failed to book the table');
        }
    })
    .catch(err => {
        alert('Error: ' + err);
    });
});
