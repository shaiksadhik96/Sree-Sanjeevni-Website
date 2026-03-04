const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send Booking Confirmation
exports.sendBookingConfirmation = async (customerEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '🌿 Booking Confirmation - Sree Sanjeevni Ayurvedic Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f8f4;">
          <div style="background: linear-gradient(135deg, #7eab76 0%, #5f8f5a 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Sree Sanjeevni</h1>
            <p style="color: #e6efe2; margin: 5px 0;">Ayurvedic Wellness Center</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4b7347; border-bottom: 2px solid #7eab76; padding-bottom: 10px;">Your Appointment is Confirmed!</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Patient Name:</strong> ${bookingDetails.customerName}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Appointment Date:</strong> ${new Date(bookingDetails.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Time Slot:</strong> ${bookingDetails.timeSlot}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Service:</strong> ${bookingDetails.serviceType}</p>
              ${bookingDetails.notes ? `<p style="margin: 10px 0;"><strong style="color: #4b7347;">Notes:</strong> ${bookingDetails.notes}</p>` : ''}
            </div>
            
            <div style="background: #e6efe2; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #385737; font-size: 14px;">
                <strong>Important:</strong> Please arrive 10 minutes before your scheduled time. 
                If you need to reschedule, please contact us at least 24 hours in advance.
              </p>
            </div>
            
            <p style="margin-top: 20px; color: #666;">Thank you for choosing Sree Sanjeevni. We look forward to serving you!</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Sree Sanjeevni Ayurvedic Clinic</p>
            <p>Contact: +91-XXXX-XXXXXX | Email: info@sreesanjeevni.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Booking confirmation sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send booking confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send Payment Receipt
exports.sendPaymentReceipt = async (customerEmail, paymentDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '💰 Payment Receipt - Sree Sanjeevni Ayurvedic Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f8f4;">
          <div style="background: linear-gradient(135deg, #7eab76 0%, #5f8f5a 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Sree Sanjeevni</h1>
            <p style="color: #e6efe2; margin: 5px 0;">Ayurvedic Wellness Center</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4b7347; border-bottom: 2px solid #7eab76; padding-bottom: 10px;">Payment Receipt</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Patient Name:</strong> ${paymentDetails.customerName}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Receipt ID:</strong> #${paymentDetails.receiptId}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Payment Date:</strong> ${new Date(paymentDetails.paymentDate).toLocaleDateString('en-IN')}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Service:</strong> ${paymentDetails.serviceType || 'General Service'}</p>
            </div>
            
            <div style="background: #e6efe2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #385737;">Total Amount:</td>
                  <td style="padding: 10px 0; text-align: right; color: #385737; font-weight: bold;">₹${paymentDetails.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #385737;">Amount Paid:</td>
                  <td style="padding: 10px 0; text-align: right; color: #385737; font-weight: bold;">₹${paymentDetails.amountPaid.toLocaleString()}</td>
                </tr>
                <tr style="border-top: 2px solid #7eab76;">
                  <td style="padding: 10px 0; color: #4b7347; font-weight: bold;">Payment Method:</td>
                  <td style="padding: 10px 0; text-align: right; color: #4b7347; font-weight: bold;">${paymentDetails.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4b7347; font-weight: bold;">Status:</td>
                  <td style="padding: 10px 0; text-align: right;">
                    <span style="background: #10B981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                      ${paymentDetails.paymentStatus}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              This is an automatically generated receipt. Please keep it for your records.
            </p>
            
            <p style="margin-top: 20px; color: #666;">Thank you for your payment!</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Sree Sanjeevni Ayurvedic Clinic</p>
            <p>Contact: +91-XXXX-XXXXXX | Email: info@sreesanjeevni.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Payment receipt sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send payment receipt:', error);
    return { success: false, error: error.message };
  }
};

// Send Appointment Reminder (1 day before)
exports.sendAppointmentReminder = async (customerEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '⏰ Appointment Reminder - Tomorrow at Sree Sanjeevni',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f8f4;">
          <div style="background: linear-gradient(135deg, #7eab76 0%, #5f8f5a 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">Sree Sanjeevni</h1>
            <p style="color: #e6efe2; margin: 5px 0;">Ayurvedic Wellness Center</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4b7347; border-bottom: 2px solid #7eab76; padding-bottom: 10px;">Reminder: Your Appointment Tomorrow</h2>
            
            <div style="background: #fff8dc; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">Don't forget your appointment tomorrow!</p>
            </div>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Patient Name:</strong> ${bookingDetails.customerName}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Date:</strong> ${new Date(bookingDetails.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Time:</strong> ${bookingDetails.timeSlot}</p>
              <p style="margin: 10px 0;"><strong style="color: #4b7347;">Service:</strong> ${bookingDetails.serviceType}</p>
            </div>
            
            <div style="background: #e6efe2; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #385737; font-size: 14px;">
                <strong>Preparation Tips:</strong><br>
                • Arrive 10 minutes early<br>
                • Wear comfortable clothing<br>
                • Avoid heavy meals 2 hours before treatment<br>
                • Bring any previous medical records if applicable
              </p>
            </div>
            
            <p style="margin-top: 20px; color: #666;">We look forward to seeing you tomorrow!</p>
            
            <p style="margin-top: 15px; color: #999; font-size: 12px;">
              Need to reschedule? Please contact us at least 24 hours in advance.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Sree Sanjeevni Ayurvedic Clinic</p>
            <p>Contact: +91-XXXX-XXXXXX | Email: info@sreesanjeevni.com</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Appointment reminder sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send appointment reminder:', error);
    return { success: false, error: error.message };
  }
};

// Send Admin Notification for New Booking
exports.sendAdminNotification = async (bookingDetails) => {
  try {
    if (!process.env.ADMIN_EMAIL) {
      console.log('[EMAIL] Admin email not configured, skipping notification');
      return { success: false, error: 'Admin email not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🔔 New Booking Received - Sree Sanjeevni',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4b7347;">New Booking Alert</h2>
          <p><strong>Patient:</strong> ${bookingDetails.customerName}</p>
          <p><strong>Date:</strong> ${new Date(bookingDetails.appointmentDate).toLocaleDateString('en-IN')}</p>
          <p><strong>Time:</strong> ${bookingDetails.timeSlot}</p>
          <p><strong>Service:</strong> ${bookingDetails.serviceType}</p>
          <p><strong>Status:</strong> ${bookingDetails.status}</p>
          <p style="margin-top: 20px;">Please review and approve this booking in the admin dashboard.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Admin notification sent`);
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send admin notification:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation: exports.sendBookingConfirmation,
  sendPaymentReceipt: exports.sendPaymentReceipt,
  sendAppointmentReminder: exports.sendAppointmentReminder,
  sendAdminNotification: exports.sendAdminNotification
};
