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
const nodemailer = require('nodemailer');

console.log('🔧 Notifications module loaded');

const sendEmailNotification = async (booking) => {
    console.log('\n📧 === STARTING EMAIL PROCESS ===');
    console.log('Booking ID:', booking.bookingId);
    console.log('Guest:', booking.name, booking.email);
    console.log('Sending to OWNER:', process.env.GMAIL_USER);
    console.log('Sending to CLIENT:', process.env.CLIENT_EMAIL);
    
    try {
        // Check environment variables
        if (!process.env.GMAIL_USER) {
            throw new Error('GMAIL_USER is not set');
        }
        if (!process.env.GMAIL_APP_PASSWORD) {
            throw new Error('GMAIL_APP_PASSWORD is not set');
        }
        if (!process.env.CLIENT_EMAIL) {
            throw new Error('CLIENT_EMAIL is not set');
        }

        console.log('✅ Environment variables check passed');

        // Create transporter
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

        // Verify connection
        await transporter.verify();
        console.log('✅ Connected to Gmail successfully');

        // 1. Send email to YOU (Owner/Manager)
        const ownerEmail = {
            from: `"Ekene Stays" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER, // This goes to YOU
            subject: `🏨 NEW BOOKING: ${booking.roomName} - ${booking.bookingId}`,
            html: `
                <h2 style="color: #2563eb;">🎉 New Booking Received!</h2>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #1e293b;">Booking Details:</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Guest Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
                    <p><strong>Room:</strong> ${booking.roomName}</p>
                    <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                    <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                    <p><strong>Guests:</strong> ${booking.guests}</p>
                    <p><strong>Total Price:</strong> R${booking.totalPrice}</p>
                    ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
                </div>
                <p style="margin-top: 20px; color: #64748b;">
                    This booking was received through your Ekene Stays booking system.
                </p>
            `
        };

        console.log('📤 Sending owner email to YOU:', process.env.GMAIL_USER);
        const ownerResult = await transporter.sendMail(ownerEmail);
        console.log('✅ Owner email sent to YOU:', ownerResult.messageId);

        // 2. Send email to CLIENT (Ekene)
        const clientEmail = {
            from: `"Ekene Stays Booking System" <${process.env.GMAIL_USER}>`,
            to: process.env.CLIENT_EMAIL, // This goes to EKENE
            subject: `🔔 New Booking Notification: ${booking.roomName} - ${booking.bookingId}`,
            html: `
                <h2 style="color: #059669;">🔔 New Booking Alert!</h2>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #065f46;">You have a new booking at Ekene Stays!</h3>
                    <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                    <p><strong>Guest Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
                    <p><strong>Room:</strong> ${booking.roomName}</p>
                    <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                    <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                    <p><strong>Guests:</strong> ${booking.guests}</p>
                    <p><strong>Total Amount:</strong> R${booking.totalPrice}</p>
                    ${booking.specialRequests ? `<p><strong>Guest Requests:</strong> ${booking.specialRequests}</p>` : ''}
                </div>
                <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <h4 style="color: #1e40af;">📊 Booking Summary</h4>
                    <p><strong>Nights:</strong> ${booking.nights || 'Not specified'}</p>
                    <p><strong>Revenue:</strong> R${booking.totalPrice}</p>
                    <p><strong>Status:</strong> Pending confirmation</p>
                </div>
                <p style="text-align: center; margin-top: 20px; color: #64748b;">
                    Please contact the guest to confirm availability and finalize arrangements.
                </p>
            `
        };

        console.log('📤 Sending client email to EKENE:', process.env.CLIENT_EMAIL);
        const clientResult = await transporter.sendMail(clientEmail);
        console.log('✅ Client email sent to EKENE:', clientResult.messageId);

        // 3. Send confirmation email to GUEST
        if (booking.email && booking.email.includes('@')) {
            const guestEmail = {
                from: `"Ekene Stays" <${process.env.GMAIL_USER}>`,
                to: booking.email,
                subject: `✅ Booking Confirmation - ${booking.bookingId}`,
                html: `
                    <h2 style="color: #059669;">✅ Booking Confirmed!</h2>
                    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #065f46;">Dear ${booking.name},</h3>
                        <p>Thank you for booking with Ekene Stays! Your reservation has been received.</p>
                        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                        <p><strong>Accommodation:</strong> ${booking.roomName}</p>
                        <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                        <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                        <p><strong>Guests:</strong> ${booking.guests}</p>
                        <p><strong>Total Amount:</strong> R${booking.totalPrice}</p>
                        ${booking.specialRequests ? `<p><strong>Your Requests:</strong> ${booking.specialRequests}</p>` : ''}
                    </div>
                    <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                        <h4 style="color: #1e40af;">📞 Next Steps</h4>
                        <p>The property owner will contact you within 24 hours to confirm your booking and provide check-in details.</p>
                        <p>If you have any questions, please contact:</p>
                        <p><strong>Email:</strong> ${process.env.CLIENT_EMAIL}</p>
                        <p><strong>Phone:</strong> ${process.env.CLIENT_PHONE}</p>
                    </div>
                    <p style="text-align: center; margin-top: 20px; color: #64748b;">
                        We look forward to hosting you at Ekene Stays!
                    </p>
                `
            };

            console.log('📤 Sending confirmation email to GUEST:', booking.email);
            const guestResult = await transporter.sendMail(guestEmail);
            console.log('✅ Guest confirmation sent:', guestResult.messageId);
        } else {
            console.log('⚠️  Skipping guest email - invalid email address');
        }

        console.log('📧 === ALL EMAILS SENT SUCCESSFULLY ===');
        console.log('✅ Sent to YOU (Owner):', process.env.GMAIL_USER);
        console.log('✅ Sent to CLIENT (Ekene):', process.env.CLIENT_EMAIL);
        console.log('✅ Sent to GUEST:', booking.email);
        
        return { 
            success: true, 
            message: 'Emails sent successfully to owner, client, and guest',
            details: {
                owner: process.env.GMAIL_USER,
                client: process.env.CLIENT_EMAIL,
                guest: booking.email
            }
        };

    } catch (error) {
        console.error('❌ EMAIL PROCESS FAILED:', error.message);
        return { success: false, error: error.message };
    }
};

const sendSMSNotification = async (booking) => {
    console.log('\n📱 SMS NOTIFICATIONS:');
    console.log('TO YOU: New booking received -', booking.name, '-', booking.roomName, '- R' + booking.totalPrice);
    console.log('TO CLIENT: New booking -', booking.bookingId, '- Contact:', booking.phoneNumber);
    if (booking.phoneNumber) {
        console.log('TO GUEST: Booking confirmed - ID:', booking.bookingId);
    }
    console.log('📱 === END SMS NOTIFICATIONS ===\n');
    
    return { success: true, message: 'SMS notifications logged above' };
};

const sendGuestConfirmation = async (booking) => {
    // Already handled in sendEmailNotification
    return { success: true, message: 'Guest confirmation handled in main email function' };
};

module.exports = {
    sendEmailNotification,
    sendSMSNotification,
    sendGuestConfirmation
};