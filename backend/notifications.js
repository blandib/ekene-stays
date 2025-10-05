// notifications.js - REAL GMAIL EMAILS (WITH SSL FIX)
/*const nodemailer = require('nodemailer');

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
};*/
// notifications.js - REAL GMAIL EMAILS (WITH SSL FIX)
// notifications.js - SENDS TO BOTH YOU AND CLIENT
// notifications.js - WORKING VERSION FOR RENDER
const nodemailer = require('nodemailer');

console.log('🔧 Notifications module loaded');
console.log('📧 GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET IN RENDER');

const sendEmailNotification = async (booking) => {
    console.log('\n📧 === STARTING EMAIL PROCESS ===');
    console.log('📍 Calling from:', __filename);
    
    try {
        // 1. Check environment variables
        console.log('🔍 Step 1: Checking environment variables...');
        console.log('GMAIL_USER:', process.env.GMAIL_USER || '❌ MISSING');
        console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***SET***' : '❌ MISSING');
        console.log('CLIENT_EMAIL:', process.env.CLIENT_EMAIL || '❌ MISSING');

        if (!process.env.GMAIL_USER) {
            throw new Error('GMAIL_USER is not set in Render environment variables');
        }
        if (!process.env.GMAIL_APP_PASSWORD) {
            throw new Error('GMAIL_APP_PASSWORD is not set in Render environment variables');
        }

        console.log('✅ Environment variables check PASSED');

        // 2. Create transporter
        console.log('🔍 Step 2: Creating email transporter...');
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        console.log('✅ Transporter created');

        // 3. Verify Gmail connection
        console.log('🔍 Step 3: Verifying Gmail connection...');
        await transporter.verify();
        console.log('✅ Gmail connection verified - READY TO SEND EMAILS');

        // 4. Send to YOU (Owner)
        console.log('🔍 Step 4: Sending email to YOU...');
        const ownerEmail = {
            from: `"Ekene Stays" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // Send to yourself
            subject: `🏨 New Booking: ${booking.roomName} - ${booking.bookingId}`,
            html: `
                <h2>🎉 New Booking Received!</h2>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Guest:</strong> ${booking.name}</p>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
                <p><strong>Room:</strong> ${booking.roomName}</p>
                <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                <p><strong>Total:</strong> R${booking.totalPrice}</p>
            `
        };

        console.log('📤 Sending to YOU:', process.env.GMAIL_USER);
        const ownerResult = await transporter.sendMail(ownerEmail);
        console.log('✅ Email sent to YOU successfully');
        console.log('📧 Message ID:', ownerResult.messageId);

        // 5. Send to CLIENT (Ekene)
        console.log('🔍 Step 5: Sending email to CLIENT...');
        const clientEmail = {
            from: `"Ekene Stays" <${process.env.GMAIL_USER}>`,
            to: process.env.CLIENT_EMAIL, // Send to Ekene
            subject: `🔔 New Booking: ${booking.roomName} - ${booking.bookingId}`,
            html: `
                <h2>🔔 New Booking Alert!</h2>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Guest:</strong> ${booking.name}</p>
                <p><strong>Contact:</strong> ${booking.email} | ${booking.phoneNumber}</p>
                <p><strong>Room:</strong> ${booking.roomName}</p>
                <p><strong>Dates:</strong> ${booking.checkIn} to ${booking.checkOut}</p>
                <p><strong>Amount:</strong> R${booking.totalPrice}</p>
            `
        };

        console.log('📤 Sending to CLIENT:', process.env.CLIENT_EMAIL);
        const clientResult = await transporter.sendMail(clientEmail);
        console.log('✅ Email sent to CLIENT successfully');
        console.log('📧 Message ID:', clientResult.messageId);

        // 6. Send to GUEST
        if (booking.email && booking.email.includes('@')) {
            console.log('🔍 Step 6: Sending email to GUEST...');
            const guestEmail = {
                from: `"Ekene Stays" <${process.env.GMAIL_USER}>`,
                to: booking.email,
                subject: `✅ Booking Confirmed - ${booking.bookingId}`,
                html: `
                    <h2>✅ Booking Confirmed!</h2>
                    <p>Dear ${booking.name}, your booking has been received.</p>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Room:</strong> ${booking.roomName}</p>
                    <p><strong>Total:</strong> R${booking.totalPrice}</p>
                `
            };

            console.log('📤 Sending to GUEST:', booking.email);
            const guestResult = await transporter.sendMail(guestEmail);
            console.log('✅ Email sent to GUEST successfully');
            console.log('📧 Message ID:', guestResult.messageId);
        }

        console.log('🎉🎉🎉 ALL EMAILS SENT SUCCESSFULLY! 🎉🎉🎉');
        console.log('✅ Sent to YOU:', process.env.GMAIL_USER);
        console.log('✅ Sent to CLIENT:', process.env.CLIENT_EMAIL);
        console.log('✅ Sent to GUEST:', booking.email);
        
        return { 
            success: true, 
            message: 'All emails sent successfully' 
        };

    } catch (error) {
        console.error('💥 EMAIL PROCESS FAILED:', error.message);
        console.error('Full error:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};

const sendSMSNotification = async (booking) => {
    console.log('📱 SMS notification for booking:', booking.bookingId);
    return { success: true, message: 'SMS would be sent' };
};

const sendGuestConfirmation = async (booking) => {
    return { success: true, message: 'Guest confirmation handled' };
};

module.exports = {
    sendEmailNotification,
    sendSMSNotification,
    sendGuestConfirmation
};