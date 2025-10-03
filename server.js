/*const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// Root route - to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.json({ 
        message: '🏨 EkeneStays Backend API is running!', 
        status: 'OK',
        timestamp: new Date().toLocaleString(),
        endpoints: {
            test: 'GET /api/test',
            getBookings: 'GET /api/bookings',
            createBooking: 'POST /api/bookings'
        }
    });
});

// Store bookings in memory
let bookings = [];
let bookingIdCounter = 1;

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '🎉 EkeneStays Backend is running!', 
        timestamp: new Date().toLocaleString(),
        bookingsCount: bookings.length
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
// Root route - to avoid "Cannot GET /" error
app.get('/', (req, res) => {
    res.json({ 
        message: '🏨 EkeneStays Backend API is running!', 
        status: 'OK',
        timestamp: new Date().toLocaleString(),
        endpoints: {
            test: 'GET /api/test',
            getBookings: 'GET /api/bookings',
            createBooking: 'POST /api/bookings'
        }
    });
});
// Create new booking
app.post('/api/bookings', (req, res) => {
    try {
        const booking = {
            _id: `booking_${bookingIdCounter++}`,
            bookingId: `EKE${Date.now()}`,
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        
        bookings.push(booking);
        
        console.log('📝 New booking received:', {
            id: booking.bookingId,
            name: booking.name,
            room: booking.roomName,
            total: `R${booking.totalPrice}`
        });
        
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 EkeneStays Backend Server started!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
    console.log(`📊 Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(`🌐 Root: http://localhost:${PORT}/`);
});*/
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Import notification services
const { sendEmailNotification, sendSMSNotification, sendGuestConfirmation } = require('./ekenestays-backend/notifications');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

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
        
        // Test the connection with a simple operation
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

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: '🏨 EkeneStays Backend API is running!', 
        status: 'OK',
        timestamp: new Date().toLocaleString(),
        database: db ? '✅ Connected' : '❌ Disconnected',
        notifications: 'Email & SMS alerts enabled',
        endpoints: {
            test: 'GET /api/test',
            getBookings: 'GET /api/bookings',
            createBooking: 'POST /api/bookings',
            getUsers: 'GET /api/users',
            createUser: 'POST /api/users'
        }
    });
});

// Users routes
app.get('/api/users', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const user = {
            ...req.body,
            createdAt: new Date()
        };
        const result = await db.collection('users').insertOne(user);
        res.status(201).json({
            success: true,
            data: { ...user, _id: result.insertedId }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '🎉 EkeneStays Backend is running!', 
        timestamp: new Date().toLocaleString(),
        database: db ? '✅ Connected' : '❌ Disconnected',
        bookingsCount: bookings.length,
        notifications: {
            email: process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured',
            sms: process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured'
        }
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
            createdAt: new Date()
        };
        
        bookings.push(booking);
        
        console.log('📝 New booking received:', {
            id: booking.bookingId,
            name: booking.name,
            room: booking.roomName,
            total: `R${booking.totalPrice}`
        });
        
        // Send notifications to owner
        await sendEmailNotification(booking);
        await sendSMSNotification(booking);
        
        // Send confirmation to guest
        await sendGuestConfirmation(booking);
        
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

// Start the server
async function startServer() {
    try {
        // Connect to MongoDB first
        await connectToMongoDB();
        
        // Then start the server
       app.listen(port, () => {
    console.log(`🚀 EkeneStays Backend Server started!`);
    console.log(`📍 Local: http://localhost:${port}`);
     console.log(`🚀 EkeneStays Backend Server started!`);
   
    console.log(`🗄️  Database: ${db ? '✅ Connected' : '❌ Disconnected'}`);
    console.log(`📧 Email Notifications: ✅ REAL Gmail Active`);
    console.log(`📱 SMS Notifications: ✅ Manual Process`);
    console.log(`💡 System Status: Fully Operational with Real Emails!`);
});
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('🛑 Shutting down server...');
    if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
    process.exit(0);
});

// Start the application
startServer();