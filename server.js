
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB connection variables
let db;
let client;

// Connect to MongoDB on startup
async function connectToMongoDB() {
    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        db = client.db(process.env.DB_NAME);
        await db.command({ ping: 1 });
        console.log('✅ MongoDB connection test successful');
        
        return db;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
}

// Store bookings in memory (temporary)
let bookings = [];
let bookingIdCounter = 1;

// ✅ Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Root API route
app.get('/api', (req, res) => {
    res.json({ 
        message: '🏨 EkeneStays Backend API is running!', 
        status: 'OK',
        timestamp: new Date().toLocaleString(),
        database: db ? '✅ Connected' : '❌ Disconnected',
        endpoints: {
            test: 'GET /api/test',
            getBookings: 'GET /api/bookings',
            createBooking: 'POST /api/bookings'
        }
    });
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ Backend working!',
        timestamp: new Date().toLocaleString()
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

// Create new booking - SIMPLIFIED (no email handling)
app.post('/api/bookings', async (req, res) => {
    try {
        const booking = {
            _id: `booking_${bookingIdCounter++}`,
            bookingId: `EKE${Date.now()}`,
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        
        bookings.push(booking);
        
        console.log('📝 New booking saved:', {
            id: booking.bookingId,
            name: booking.name,
            email: booking.email,
            room: booking.roomName,
            total: `R${booking.totalPrice}`
        });
        
        // Fast response - emails handled by frontend via FormSubmit
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
        
    } catch (error) {
        console.error('❌ Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// Update booking status
app.patch('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const bookingIndex = bookings.findIndex(b => b._id === id);
    if (bookingIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found'
        });
    }
    
    bookings[bookingIndex].status = status;
    
    res.json({
        success: true,
        message: 'Booking status updated',
        data: bookings[bookingIndex]
    });
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
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
});

// ✅ Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
async function startServer() {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`🚀 EkeneStays Server started on port ${port}`);
            console.log(`📧 Emails: Handled by Frontend via FormSubmit`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        app.listen(port, () => {
            console.log(`🚀 EkeneStays Server started (without MongoDB) on port ${port}`);
        });
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    if (client) {
        await client.close();
    }
    process.exit(0);
});

// Start the application
startServer();