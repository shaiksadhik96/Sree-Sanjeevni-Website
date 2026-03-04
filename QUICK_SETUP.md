# Quick Setup - Run These Commands

## Step 1: Install Required Packages

Open terminal in `Backend` folder and run:

```bash
npm install helmet express-mongo-sanitize express-rate-limit nodemailer
```

## Step 2: Setup Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Click **App passwords**
4. Select **Mail** → **Other** → Type "Sree Sanjeevni"
5. Click **Generate**
6. Copy the 16-character password

## Step 3: Update .env File

Edit `Backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=admin@sreesanjeevni.com
```

## Step 4: Restart Server

```bash
npm start
```

## Step 5: Test

Create a booking and check the patient's email inbox!

---

## What You Got:

✅ **Security**: Rate limiting + Input sanitization + Error handling
✅ **Emails**: Booking confirmations + Payment receipts + Reminders
✅ **Analytics**: 9 new endpoints for dashboards and reports

---

## Need More Help?

Read the full guide: `INSTALLATION_GUIDE.md`
