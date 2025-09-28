document.getElementById('contactSubmit').addEventListener('click', function() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Your message has been sent!');
        } else {
            alert('Failed to send the message');
        }
    })
    .catch(err => {
        alert('Error: ' + err);
    });
});
