const API_BASE_URL = 'https://ekene-stays.onrender.com/api';

// Test backend connection on page load
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/test`);
        const data = await response.json();
        console.log('✅ Backend connected:', data.message);
        
        // Show success indicator
        showBackendStatus('✅ Backend connected', 'success');
        
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showBackendStatus('❌ Backend server not running', 'error');
    }
}

// Show backend status to user
function showBackendStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
    `;
    statusDiv.innerHTML = message;
    document.body.appendChild(statusDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(statusDiv)) {
            document.body.removeChild(statusDiv);
        }
    }, 5000);
}

// Calculate price function with updated discounts and extra guest fees
function calculatePrice(roomType) {
    const checkinId = `checkin-${roomType}`;
    const checkoutId = `checkout-${roomType}`;
    const guestsId = `guests-${roomType}`;
    const totalId = `total-${roomType}`;
    
    const checkin = new Date(document.getElementById(checkinId).value);
    const checkout = new Date(document.getElementById(checkoutId).value);
    const guests = parseInt(document.getElementById(guestsId).value);
    
    if (!checkin || !checkout || checkin >= checkout) {
        alert('Please select valid check-in and check-out dates.');
        return;
    }
    
    // Calculate number of nights
    const timeDiff = checkout.getTime() - checkin.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Base prices in ZAR
    let basePrice;
    if (roomType === 'deluxe') {
        basePrice = 400;
    } else {
        basePrice = 300;
    }
    
    // Extra guest fees (for 3+ guests)
    let extraGuestFee = 0;
    if (guests >= 3) {
        extraGuestFee = (guests - 2) * 100; // R100 per extra guest
    }
    
    // Apply discounts for longer stays
    let totalPrice;
    let discount = 0;
    
    if (nights >= 7) {
        if (roomType === 'deluxe') {
            discount = 0.05; // 5% discount for Deluxe (changed from 10%)
        } else {
            discount = 0.10; // 10% discount for Executive (changed from 15%)
        }
        totalPrice = (basePrice * nights + extraGuestFee) * (1 - discount);
    } else {
        totalPrice = basePrice * nights + extraGuestFee;
    }
    
    // Display total price with breakdown
    const totalElement = document.getElementById(totalId);
    const baseAmount = basePrice * nights;
    const discountAmount = discount > 0 ? baseAmount * discount : 0;
    
    let priceBreakdown = `
        <div style="text-align: left; font-size: 14px; margin-bottom: 10px;">
            <div>Base price (${nights} nights): R${baseAmount.toFixed(2)}</div>
    `;
    
    if (extraGuestFee > 0) {
        priceBreakdown += `<div>Extra guest fee (${guests - 2} guests): R${extraGuestFee.toFixed(2)}</div>`;
    }
    
    if (discount > 0) {
        priceBreakdown += `<div>Discount (${(discount * 100)}%): -R${discountAmount.toFixed(2)}</div>`;
    }
    
    priceBreakdown += `</div>`;
    
    if (discount > 0) {
        totalElement.innerHTML = `
            ${priceBreakdown}
            <strong>Total: <span style="text-decoration: line-through; color: #999;">R${(baseAmount + extraGuestFee).toFixed(2)}</span> 
            <span style="color: var(--accent);">R${totalPrice.toFixed(2)}</span></strong>
            <br><small>You saved R${discountAmount.toFixed(2)}!</small>
        `;
    } else {
        totalElement.innerHTML = `
            ${priceBreakdown}
            <strong>Total: R${totalPrice.toFixed(2)}</strong>
        `;
    }
    totalElement.style.display = 'block';
}

// Book room function - UPDATED FOR BACKEND
async function bookRoom(roomType) {
    const roomName = roomType === 'deluxe' ? 'Deluxe Room' : 'Executive Suite';
    const nameId = `name-${roomType}`;
    const emailId = `email-${roomType}`;
    const phoneId = `phone-${roomType}`;
    const checkinId = `checkin-${roomType}`;
    const checkoutId = `checkout-${roomType}`;
    const guestsId = `guests-${roomType}`;
    const specialId = `special-${roomType}`;
    const confirmationId = `confirmation-${roomType}`;
    
    const name = document.getElementById(nameId).value;
    const email = document.getElementById(emailId).value;
    const phone = document.getElementById(phoneId).value;
    const checkin = document.getElementById(checkinId).value;
    const checkout = document.getElementById(checkoutId).value;
    const guests = document.getElementById(guestsId).value;
    const specialRequests = document.getElementById(specialId).value;
    
    if (!name || !email || !phone || !checkin || !checkout) {
        alert('Please fill in all required fields before booking.');
        return;
    }
    
    // Calculate number of nights and price
    const timeDiff = new Date(checkout).getTime() - new Date(checkin).getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let basePrice, totalPrice, discount = 0, extraGuestFee = 0;
    if (roomType === 'deluxe') {
        basePrice = 400;
    } else {
        basePrice = 300;
    }
    
    // Calculate extra guest fees
    const numGuests = parseInt(guests);
    if (numGuests >= 3) {
        extraGuestFee = (numGuests - 2) * 100; // R100 per extra guest
    }
    
    // Apply discounts
    if (nights >= 7) {
        discount = roomType === 'deluxe' ? 0.05 : 0.10; // Updated discounts
        totalPrice = (basePrice * nights + extraGuestFee) * (1 - discount);
    } else {
        totalPrice = basePrice * nights + extraGuestFee;
    }
    
    // Create booking object
    const booking = {
        roomType: roomType,
        roomName: roomName,
        name: name,
        email: email,
        phoneNumber: phone, // Changed from 'phone' to 'phoneNumber' to match backend
        checkIn: checkin,   // Changed from 'checkin' to 'checkIn' to match backend
        checkOut: checkout, // Changed from 'checkout' to 'checkOut' to match backend
        guests: parseInt(guests),
        specialRequests: specialRequests,
        totalPrice: totalPrice,
        nights: nights
    };
    
    try {
        // Show loading state
        const bookBtn = document.querySelector(`#${confirmationId}`).previousElementSibling;
        const originalText = bookBtn.innerHTML;
        bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        bookBtn.disabled = true;
        
        // Save booking to backend
        const savedBooking = await saveBookingToDatabase(booking);
        
        // Display confirmation message
        const confirmationElement = document.getElementById(confirmationId);
        confirmationElement.innerHTML = `
            <h3>✅ Booking Confirmed!</h3>
            <p>Thank you for booking our ${roomName}!</p>
            <p><strong>Booking ID:</strong> ${savedBooking.bookingId}</p>
            <p><strong>Check-in:</strong> ${checkin}</p>
            <p><strong>Check-out:</strong> ${checkout}</p>
            <p><strong>Guests:</strong> ${guests}</p>
            <p><strong>Total:</strong> R${totalPrice.toFixed(2)}</p>
            <p>We will contact you shortly to confirm your reservation.</p>
        `;
        confirmationElement.style.display = 'block';
        
        // Reset form
        document.getElementById(nameId).value = '';
        document.getElementById(emailId).value = '';
        document.getElementById(phoneId).value = '';
        document.getElementById(checkinId).value = '';
        document.getElementById(checkoutId).value = '';
        document.getElementById(guestsId).value = '2';
        document.getElementById(specialId).value = '';
        document.getElementById(`total-${roomType}`).style.display = 'none';
        
        // Scroll to confirmation message
        confirmationElement.scrollIntoView({ behavior: 'smooth' });
        
        // Update admin panel
        await updateAdminPanel();
        
    } catch (error) {
        console.error('Booking failed:', error);
        alert('Sorry, there was an error processing your booking. Please try again.');
    } finally {
        // Reset button state
        const bookBtn = document.querySelector(`#${confirmationId}`).previousElementSibling;
        bookBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Book Now';
        bookBtn.disabled = false;
    }
}

// Save booking to backend
async function saveBookingToDatabase(booking) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking)
    });
    
    if (!response.ok) {
        throw new Error('Failed to save booking');
    }
    
    const result = await response.json();
    return result.data;
}

// Update admin panel with bookings from backend
async function updateAdminPanel() {
    const bookingsList = document.getElementById('bookings-list');
    const noBookings = document.getElementById('no-bookings');
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }
        
        const result = await response.json();
        const bookings = result.data || [];
        
        if (bookings.length === 0) {
            noBookings.style.display = 'block';
            bookingsList.innerHTML = '<p id="no-bookings">No bookings yet. New bookings will appear here.</p>';
            return;
        }
        
        noBookings.style.display = 'none';
        
        // Sort bookings by creation date (newest first)
        bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        let html = '';
        bookings.forEach(booking => {
            const statusClass = booking.status === 'confirmed' ? 'confirm-btn' : 
                              booking.status === 'cancelled' ? 'cancel-btn' : '';
            
            html += `
                <div class="booking-item">
                    <div class="booking-info">
                        <h4>${booking.roomName} - ${booking.name}</h4>
                        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                        <p><strong>Dates:</strong> ${booking.checkIn} to ${booking.checkOut} (${booking.nights} nights)</p>
                        <p><strong>Contact:</strong> ${booking.email} | ${booking.phoneNumber}</p>
                        <p><strong>Guests:</strong> ${booking.guests} | <strong>Total:</strong> R${booking.totalPrice.toFixed(2)}</p>
                        <p><strong>Status:</strong> <span class="${statusClass}">${booking.status}</span></p>
                        <p><strong>Booked:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
                        ${booking.specialRequests ? `<p><strong>Special Requests:</strong> ${booking.specialRequests}</p>` : ''}
                    </div>
                    <div class="booking-actions">
                        <button class="action-btn confirm-btn" onclick="updateBookingStatus('${booking._id}', 'confirmed')">Confirm</button>
                        <button class="action-btn cancel-btn" onclick="updateBookingStatus('${booking._id}', 'cancelled')">Cancel</button>
                        <button class="action-btn" onclick="deleteBooking('${booking._id}')" style="background: #95a5a6; color: white;">Delete</button>
                    </div>
                </div>
            `;
        });
        
        bookingsList.innerHTML = html;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsList.innerHTML = '<p>Error loading bookings. Please try refreshing the page.</p>';
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update booking status');
        }
        
        await updateAdminPanel();
        showVisualNotification(`Booking status updated to ${status}`);
        
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Failed to update booking status. Please try again.');
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete booking');
        }
        
        await updateAdminPanel();
        showVisualNotification('Booking deleted successfully');
        
    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
    }
}

// Show visual notification
function showVisualNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-bell" style="font-size: 1.2rem;"></i>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    testBackendConnection();
    updateAdminPanel();
    
    // Set minimum dates for check-in
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin-deluxe').min = today;
    document.getElementById('checkin-executive').min = today;
});