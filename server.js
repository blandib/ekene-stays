
/*const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// In-memory storage
let bookings = [];
let bookingIdCounter = 1;

// Email notification function
async function sendEmailNotification(booking) {
  try {
    const transporter = createTransporter();
    
    const ownerMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: `📅 New Booking: ${booking.roomName} - ${booking.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🏨 New Booking Received!</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #27ae60;">Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Guest Name:</strong> ${booking.name}</p>
            <p><strong>Room:</strong> ${booking.roomName}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Price:</strong> R${booking.totalPrice}</p>
            <p><strong>Contact:</strong> ${booking.email} | ${booking.phoneNumber}</p>
            ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
          </div>
          <p style="margin-top: 20px; color: #7f8c8d;">
            This booking was received via the EkeneStays website.
          </p>
        </div>
      `
    };

    const guestMailOptions = {
      from: process.env.GMAIL_USER,
      to: booking.email,
      subject: `🏨 Booking Confirmation - ${booking.bookingId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for your booking!</h2>
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h3 style="color: #27ae60;">Booking Confirmed ✅</h3>
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Room:</strong> ${booking.roomName}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
            <p><strong>Total Amount:</strong> R${booking.totalPrice}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <h4 style="color: #1976d2;">Next Steps:</h4>
            <p>We will contact you within 24 hours to confirm your reservation and provide payment details.</p>
            <p>If you have any questions, please reply to this email.</p>
          </div>
          <p style="margin-top: 20px; color: #7f8c8d;">
            Best regards,<br>
            <strong>EkeneStays Team</strong>
          </p>
        </div>
      `
    };

    // Send emails
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(guestMailOptions);
    
    console.log('✅ Emails sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: '🏨 EkeneStays API is running on Vercel!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    email: process.env.GMAIL_USER ? 'Configured' : 'Not configured'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎉 EkeneStays Backend is running on Vercel!', 
    timestamp: new Date().toLocaleString(),
    bookingsCount: bookings.length,
    environment: process.env.NODE_ENV || 'development',
    email: process.env.GMAIL_USER ? 'Configured' : 'Not configured'
  });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json({ 
    success: true, 
    data: bookings,
    count: bookings.length
  });
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = {
      _id: `booking_${bookingIdCounter++}`,
      bookingId: `EKE${Date.now()}`,
      ...req.body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'checkIn', 'checkOut', 'guests', 'totalPrice'];
    for (const field of requiredFields) {
      if (!booking[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    bookings.push(booking);
    
    console.log('📝 New booking received:', {
      id: booking.bookingId,
      name: booking.name,
      room: booking.roomName,
      total: `R${booking.totalPrice}`
    });
    
    // Send email notifications
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const emailSent = await sendEmailNotification(booking);
      if (emailSent) {
        console.log('✅ Email notifications sent');
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
      emailSent: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
});

// Update booking status
app.patch('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (pending, confirmed, cancelled) is required'
      });
    }
    
    const bookingIndex = bookings.findIndex(b => b._id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date();
    
    res.json({
      success: true,
      message: 'Booking status updated',
      data: bookings[bookingIndex]
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = bookings.length;
    
    bookings = bookings.filter(b => b._id !== id);
    
    if (bookings.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 EkeneStays Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email: ${process.env.GMAIL_USER ? 'Configured' : 'Not configured'}`);
});

module.exports = app;*/
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from ALL directories
app.use(express.static(__dirname));

// API routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎉 EkeneStays Backend is running!', 
    timestamp: new Date().toLocaleString(),
    status: 'working'
  });
});

// Booking routes (add your existing booking logic here)
let bookings = [];
let bookingIdCounter = 1;

app.get('/api/bookings', (req, res) => {
  res.json({ 
    success: true, 
    data: bookings,
    count: bookings.length
  });
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = {
      _id: `booking_${bookingIdCounter++}`,
      bookingId: `EKE${Date.now()}`,
      ...req.body,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'checkIn', 'checkOut', 'guests', 'totalPrice'];
    for (const field of requiredFields) {
      if (!booking[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }
    
    bookings.push(booking);
    
    console.log('📝 New booking received:', {
      id: booking.bookingId,
      name: booking.name,
      room: booking.roomName,
      total: `R${booking.totalPrice}`
    });
    
    // Add your email notification logic here
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      console.log('📧 Email would be sent for booking:', booking.bookingId);
    }
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking'
    });
  }
});

app.patch('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (pending, confirmed, cancelled) is required'
      });
    }
    
    const bookingIndex = bookings.findIndex(b => b._id === id);
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date();
    
    res.json({
      success: true,
      message: 'Booking status updated',
      data: bookings[bookingIndex]
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = bookings.length;
    
    bookings = bookings.filter(b => b._id !== id);
    
    if (bookings.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting booking'
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all route - serve index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📁 Serving from: ${__dirname}`);
});

module.exports = app;