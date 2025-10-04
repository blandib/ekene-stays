// notifications.js - REAL GMAIL EMAILS (WITH SSL FIX)
const nodemailer = require('nodemailer');

// Create real Gmail transporter - WITH SSL FIX
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // ← ADD THIS LINE TO FIX SSL ERROR
    }
});

const sendEmailNotification = async (booking) => {
    try {
        console.log('📧 ATTEMPTING TO SEND REAL EMAILS...');
        console.log('🔧 Using Gmail:', process.env.GMAIL_EMAIL);
        console.log('🔧 To Owner:', process.env.CLIENT_EMAIL);
        console.log('🔧 To Guest:', booking.email);

        // Validate email format
        if (!booking.email || !booking.email.includes('@')) {
            throw new Error('Invalid guest email address: ' + booking.email);
        }

        // 1. Real email to Property Owner (your client)
        const ownerEmail = {
            from: `"${process.env.PROPERTY_NAME}" <${process.env.GMAIL_EMAIL}>`,
            to: process.env.CLIENT_EMAIL,
            subject: `🏨 New Booking: ${booking.roomName} - ${booking.bookingId}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2563eb;">🎉 New Booking Received!</h2>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #1e293b;">Booking Details:</h3>
                        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                        <p><strong>Guest Name:</strong> ${booking.name}</p>
                        <p><strong>Email:</strong> ${booking.email}</p>
                        <p><strong>Phone:</strong> ${booking.phoneNumber || 'Not provided'}</p>
                        <p><strong>Room:</strong> ${booking.roomName}</p>
                        <p><strong>Check-in:</strong> ${booking.checkIn || 'Not provided'}</p>
                        <p><strong>Check-out:</strong> ${booking.checkOut || 'Not provided'}</p>
                        <p><strong>Guests:</strong> ${booking.guests || 'Not provided'}</p>
                        <p><strong>Total Price:</strong> R${booking.totalPrice}</p>
                    </div>
                    <p style="margin-top: 20px; color: #64748b;">
                        This booking was received through your ${process.env.PROPERTY_NAME} booking system.
                    </p>
                </div>
            `
        };

        // 2. Real email to Guest
        const guestEmail = {
            from: `"${process.env.PROPERTY_NAME}" <${process.env.GMAIL_EMAIL}>`,
            to: booking.email,
            subject: `✅ Booking Confirmed - ${booking.bookingId}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #059669;">✅ Booking Confirmed!</h2>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #065f46;">Dear ${booking.name},</h3>
                        <p>Thank you for booking with ${process.env.PROPERTY_NAME}! Your reservation has been confirmed.</p>
                        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                        <p><strong>Property:</strong> ${booking.roomName}</p>
                        <p><strong>Check-in:</strong> ${booking.checkIn || 'To be confirmed'}</p>
                        <p><strong>Check-out:</strong> ${booking.checkOut || 'To be confirmed'}</p>
                        <p><strong>Guests:</strong> ${booking.guests || 'Not specified'}</p>
                        <p><strong>Total Amount:</strong> R${booking.totalPrice}</p>
                    </div>
                    <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <h4 style="color: #1e40af;">📞 Contact Information</h4>
                        <p>If you have any questions, please contact us:</p>
                        <p><strong>Email:</strong> ${process.env.CLIENT_EMAIL}</p>
                        <p><strong>Phone:</strong> ${process.env.CLIENT_PHONE}</p>
                    </div>
                    <p style="text-align: center; margin-top: 20px; color: #64748b;">
                        We look forward to hosting you at ${process.env.PROPERTY_NAME}!
                    </p>
                </div>
            `
        };

        // Send both emails
        await emailTransporter.sendMail(ownerEmail);
        console.log('✅ REAL EMAIL SENT: Owner notification delivered to', process.env.CLIENT_EMAIL);

        await emailTransporter.sendMail(guestEmail);
        console.log('✅ REAL EMAIL SENT: Guest confirmation delivered to', booking.email);

        return { 
            success: true, 
            message: 'Real emails sent successfully to both owner and guest' 
        };

    } catch (error) {
        console.error('❌ REAL EMAIL FAILED:', error.message);
        
        // Fallback to manual instructions
        console.log('\n💡 MANUAL PROCESS REQUIRED:');
        console.log('1. Send email to guest:', booking.email);
        console.log('   Subject: "Booking Confirmed - ' + booking.bookingId + '"');
        console.log('2. Send email to owner:', process.env.CLIENT_EMAIL);
        console.log('   Subject: "New Booking - ' + booking.roomName + '"');
        console.log('3. Copy SMS messages below');
        
        return { 
            success: false, 
            message: 'Email failed - manual process required: ' + error.message 
        };
    }
};

const sendSMSNotification = async (booking) => {
    console.log('\n📱 MANUAL SMS REQUIRED:');
    console.log('══════════════════════════════════════════════');
    console.log('TO PROPERTY OWNER (' + process.env.CLIENT_PHONE + '):');
    console.log('"New booking: ' + booking.name + ' - ' + booking.roomName + ' - R' + booking.totalPrice + '"');
    console.log('');
    
    if (booking.phoneNumber) {
        console.log('TO GUEST (' + booking.phoneNumber + '):');
        console.log('"Booking confirmed! ID: ' + booking.bookingId + ' - ' + booking.roomName + '"');
        console.log('Send via WhatsApp: https://wa.me/' + booking.phoneNumber.replace('+', ''));
    } else {
        console.log('❌ Cannot SMS guest - no phone number provided');
    }
    console.log('══════════════════════════════════════════════\n');
    
    return { success: true, message: 'SMS requires manual sending' };
};

const sendGuestConfirmation = async (booking) => {
    return { success: true, message: 'Guest confirmation handled via email' };
};

module.exports = {
    sendEmailNotification,
    sendSMSNotification,
    sendGuestConfirmation
};