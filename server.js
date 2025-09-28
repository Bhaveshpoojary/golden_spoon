const express = require('express');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'golden_spoon',
    password: '',   // put the password if any
    database: 'golden_spoon'
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Nodemailer setup for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-email-password'   // Your email password or app-specific password
  }
});

// Route to send contact form message
app.post('/send-message', (req, res) => {
  const { name, email, subject, message } = req.body;

  const query = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, subject, message], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to send message' });
    }

    // Send email to restaurant owner
    const mailOptions = {
      from: email,
      to: 'restaurant-owner-email@example.com',
      subject: `Message from ${name} - ${subject}`,
      text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ error: 'Failed to send email' });
      }
      res.send({ success: true, message: 'Message sent successfully' });
    });
  });
});

// Route to handle table reservations
app.post('/book-table', (req, res) => {
  const { name, email, phone, reservation_date, reservation_time, people_count, message } = req.body;

  const query = 'INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, people_count, message) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, email, phone, reservation_date, reservation_time, people_count, message], (err, result) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to book reservation' });
    }

    // Send booking confirmation to the customer
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Booking Confirmation',
      text: `Hello ${name},\n\nYour reservation for ${people_count} people on ${reservation_date} at ${reservation_time} has been confirmed.\n\nMessage: ${message}\n\nThank you for choosing our restaurant!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({ error: 'Failed to send confirmation email' });
      }
      res.send({ success: true, message: 'Reservation booked and confirmation email sent' });
    });
  });
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
