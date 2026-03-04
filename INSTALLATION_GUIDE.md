# Installation Guide for New Enhancements

## What Was Added? ✨

Three major enhancements have been implemented:

1. **API Security & Error Handling** 🔒
2. **Email Notification System** 📧
3. **Analytics Dashboard** 📊

---

## Required Packages Installation

Run this command in the **Backend** folder:

```bash
cd Backend
npm install helmet express-mongo-sanitize express-rate-limit nodemailer
```

### Package Details:
- `helmet` - Security headers protection
- `express-mongo-sanitize` - Prevents NoSQL injection attacks
- `express-rate-limit` - Rate limiting to prevent spam/brute force
- `nodemailer` - Email sending service

---

## 1. Security Setup ✅ (Already Working)

The following security features are now active:

### ✓ Helmet Security Headers
Protects against:
- Cross-site scripting (XSS)
- Clickjacking
- MIME type sniffing

### ✓ NoSQL Injection Protection
Sanitizes user input to prevent MongoDB injection attacks

### ✓ Rate Limiting
- Max 100 requests per 15 minutes per IP
- Prevents brute force attacks
- Auto-blocks excessive requests

### ✓ Request Logging
All API requests are logged with timestamp and method

### ✓ Global Error Handler
Catches all errors and returns proper JSON responses

---

## 2. Email Notification Setup 📧

### Step 1: Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Go back to Security
5. Scroll to "Signing in to Google" section
6. Click **App passwords**
7. Select **Mail** and **Other (Custom name)** → Type "Sree Sanjeevni"
8. Click **Generate**
9. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `Backend/.env` and update:

```env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop          # (16 chars, no spaces)
ADMIN_EMAIL=admin@sreesanjeevni.com      # Where admin notifications go
```

### Step 3: Test Email Service

The email service will send:
- ✉️ **Booking confirmation** when receptionist creates appointment
- 💰 **Payment receipt** when payment is recorded
- ⏰ **Appointment reminder** 1 day before appointment
- 🔔 **Admin notification** for new bookings

To test, create a new booking and check the patient's email!

---

## 3. Analytics API Endpoints 📊

New analytics routes are available at `/api/analytics/`:

### Available Endpoints:

| Endpoint | Description | Usage |
|----------|-------------|-------|
| `GET /api/analytics/revenue` | Revenue statistics | Total revenue, paid amounts, pending payments |
| `GET /api/analytics/bookings-stats` | Booking statistics | Total bookings, today's bookings, by status |
| `GET /api/analytics/patient-growth` | Patient growth over time | Monthly new patients |
| `GET /api/analytics/top-services` | Most popular services | Service rankings by bookings |
| `GET /api/analytics/daily-stats` | Today's overview | Today's bookings, payments, revenue |
| `GET /api/analytics/payment-methods` | Payment method distribution | Cash, Card, UPI, etc. |
| `GET /api/analytics/discounts` | Discount analytics | Approved, pending, denied discounts |
| `GET /api/analytics/patient-demographics` | Age & gender distribution | Patient demographics |
| `GET /api/analytics/dashboard` | Comprehensive dashboard data | All stats combined |

### Example API Call:

```javascript
// Get revenue statistics
fetch('http://localhost:5000/api/analytics/revenue', {
  headers: {
    'Authorization': `Bearer ${yourJWTToken}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example Response:

```json
{
  "totalRevenue": 125000,
  "totalPaid": 120000,
  "totalPayments": 45,
  "pendingPayments": 3,
  "partialPayments": 2
}
```

---

## 4. How to Use Email Notifications

### In Booking Controller:

```javascript
const emailService = require('../utils/emailService');

// After creating booking
const booking = await newBooking.save();

// Send confirmation email
if (customer.email) {
  await emailService.sendBookingConfirmation(customer.email, {
    customerName: booking.patientName,
    appointmentDate: booking.appointmentDate,
    timeSlot: booking.timeSlot,
    serviceType: booking.serviceType,
    notes: booking.notes || ''
  });
}
```

### In Payment Controller:

```javascript
const emailService = require('../utils/emailService');

// After payment is saved
const payment = await newPayment.save();

// Send receipt email
if (customer.email) {
  await emailService.sendPaymentReceipt(customer.email, {
    customerName: payment.customerName,
    receiptId: payment._id.toString().slice(-8).toUpperCase(),
    paymentDate: payment.paymentDate,
    amount: payment.amount,
    amountPaid: payment.amountPaid,
    paymentMethod: payment.paymentMethod,
    paymentStatus: payment.paymentStatus,
    serviceType: payment.serviceType
  });
}
```

---

## 5. Security Features Explained

### Rate Limiting in Action:

```
Request 1-100: ✓ Allowed
Request 101: ❌ Blocked with "Too many requests, please try again later"
After 15 minutes: Counter resets
```

### NoSQL Injection Prevention:

**Before (Vulnerable):**
```json
{
  "phone": { "$gt": "" }  // Would return all users
}
```

**After (Protected):**
```json
{
  "phone": "[object Object]"  // Sanitized to safe string
}
```

### Error Handler Example:

**Before:**
```
Error: Customer not found
[Stack trace exposed to user]
```

**After:**
```json
{
  "error": "Customer not found"
}
```

---

## 6. Testing Everything

### Test Security:
```bash
# Server should start with security middleware
npm start
# Look for: "Server is running on port 5000"
```

### Test Analytics:
```bash
# Make sure authentication token is valid
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Email (Manual):
1. Update `.env` with real Gmail credentials
2. Create a new booking in the app
3. Check the patient's email inbox
4. Should receive booking confirmation email

---

## 7. Troubleshooting

### Email Not Sending?

**Check:**
1. `.env` has correct `EMAIL_USER` and `EMAIL_PASSWORD`
2. App password generated correctly (16 characters, no spaces)
3. 2-Step Verification enabled on Google account
4. Email address exists in customer record
5. Check backend console for `[EMAIL]` logs

**Common Error:**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:** Generate new app password from Google account

### Analytics Not Working?

**Check:**
1. JWT token is valid
2. User is authenticated
3. Models (Payment, Booking, Customer) have data
4. MongoDB connection is active

### Rate Limit Too Strict?

Edit `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // Increase from 100 to 200
  message: 'Too many requests, please try again later.'
});
```

---

## 8. File Structure

```
Backend/
├── server.js                    ← Updated with security middleware
├── .env                         ← Updated with email config
├── .env.example                 ← Template for reference
├── routes/
│   └── analytics.js             ← NEW: Analytics endpoints
└── utils/
    └── emailService.js          ← NEW: Email notification service
```

---

## 9. What's Protected?

✓ All `/api/*` routes have rate limiting
✓ All user input is sanitized
✓ All analytics routes require authentication
✓ All errors are caught and handled gracefully
✓ All requests are logged for debugging

---

## 10. Next Steps

### Optional Enhancements:
- Add email field to Customer model
- Create frontend analytics dashboard page
- Add cron job for automated appointment reminders
- Implement SMS notifications (Twilio)
- Add PDF receipt generation

### Recommended:
1. Test email with real Gmail account
2. Verify analytics endpoints with Postman
3. Monitor request logs for suspicious activity
4. Set up backup email service (SendGrid/AWS SES)

---

## Summary

✅ **Security**: Rate limiting, input sanitization, error handling
✅ **Emails**: Booking confirmations, payment receipts, reminders
✅ **Analytics**: 9 endpoints for revenue, bookings, patients, discounts

**Installation:**
```bash
npm install helmet express-mongo-sanitize express-rate-limit nodemailer
```

**Configuration:**
Update `.env` with Gmail app password

**Testing:**
Create booking → Check email → Test analytics endpoints

---

Need help? Check the console logs for `[EMAIL]` and `[ANALYTICS]` messages! 🚀
