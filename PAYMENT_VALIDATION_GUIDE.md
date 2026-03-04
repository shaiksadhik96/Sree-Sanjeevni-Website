# Payment & Billing Validation Guide
## Sree Sanjeevni Ayurvedic Clinic - Payment Processing System

---

## Overview
This document outlines all the validations implemented in the payment and billing system to ensure data integrity, prevent errors, and maintain accurate financial records.

---

## 1. PAYMENT VALIDATION (PaymentContext & PaymentsPage)

### 1.1 Customer Name Validation
**What it checks:**
- Customer name must exist
- Must be at least 2 characters long
- Cannot exceed 100 characters
- Should be meaningful text

**Why it matters:**
- Prevents vague or invalid customer entries
- Ensures billing records can be properly tracked
- Makes payment receipts clear and professional

**Error Messages:**
```
❌ "Customer name is required"
❌ "Customer name must be at least 2 characters"
❌ "Customer name must not exceed 100 characters"
```

---

### 1.2 Payment Amount Validation
**What it checks:**
- Amount must be a valid number
- Amount must be greater than 0
- Amount cannot exceed ₹999,999
- No negative values allowed

**Why it matters:**
- Prevents accidental zero or negative payments
- Protects against unrealistic payment amounts
- Ensures financial accuracy

**Error Messages:**
```
❌ "Please enter a valid amount"
❌ "Amount must be greater than 0"
❌ "Amount exceeds maximum limit of 999,999"
```

---

### 1.3 Amount Paid Validation
**What it checks:**
- Amount paid must be valid number or 0
- Amount paid cannot exceed total amount due
- Amount paid cannot be negative

**Why it matters:**
- Ensures partial payments are realistic
- Prevents overpayment recording
- Maintains accurate payment tracking

**Example:**
```
If Total Amount = ₹5,000
Then Amount Paid can be: 0, 500, 1000, 2500, 5000 ✓
But NOT: 5001, 10000, -100 ✗
```

**Error Message:**
```
❌ "Amount paid (₹5100) cannot exceed total amount (₹5000)"
```

---

### 1.4 Payment Method Validation
**What it checks:**
- Payment method must be selected
- Must be from approved list: Cash, Credit Card, Debit Card, UPI, Bank Transfer, Cheque

**Why it matters:**
- Records payment method for audit trail
- Helps with accounting and reconciliation
- Required for admin reporting

**Error Message:**
```
❌ "Please select a valid payment method"
```

---

### 1.5 Payment Date Validation
**What it checks:**
- Date must be provided
- Date format must be valid
- Date cannot be in the future

**Why it matters:**
- Prevents backdating fraudulent payments
- Maintains chronological record
- Supports accurate financial reporting

**Error Messages:**
```
❌ "Payment date is required"
❌ "Invalid payment date format"
❌ "Payment date cannot be in the future"
```

---

### 1.6 Payment Status Validation
**What it checks:**
- Status must be one of: Pending, Paid, Partially Paid, Cancelled
- Status should match the amounts:
  - **Pending** → Amount Paid = 0
  - **Partially Paid** → 0 < Amount Paid < Total Amount
  - **Paid** → Amount Paid = Total Amount

**Why it matters:**
- Prevents status/amount mismatches
- Ensures accurate payment tracking
- **Auto-correction**: System automatically sets correct status based on amounts

**Example:**
```
User enters: Amount = 5000, Amount Paid = 5000, Status = "Pending"
System corrects to: Status = "Paid" ✓
```

---

### 1.7 Service Type Validation
**What it checks:**
- Service type must be selected/entered
- Must not exceed 100 characters
- Should be meaningful text

**Why it matters:**
- Links payment to specific service
- Helps with service-wise revenue tracking
- Required for pharmacy/billing integration

---

### 1.8 Customer Existence Check
**What it checks:**
- If customer ID is provided, customer must exist in system
- Validates against customer database

**Why it matters:**
- Prevents payment records for non-existent patients
- Maintains referential integrity
- Enables proper customer linking

---

## 2. BILLING VALIDATION (BillingPage & PaymentReceipt)

### 2.1 Service Cost Validation
**What it checks:**
- Service cost must be valid number
- Cannot be negative
- Cannot exceed ₹999,999
- Should be > 0 for actual services

**Why it matters:**
- Prevents invalid billing amounts
- Ensures accurate revenue calculation
- Maintains financial integrity

---

### 2.2 Discount Validation (CRITICAL)
**What it checks:**
- Discount must be valid number
- Discount cannot be negative
- **Discount CANNOT exceed service cost** ⚠️

**Why it matters:**
- Prevents negative final amounts
- Protects company from accounting errors
- Ensures final billing is always non-negative

**Real Example:**
```
Service Cost = ₹1,000
Requested Discount = ₹1,500 ❌ INVALID
System Adjusts To = ₹1,000 (100% discount max)
Result = Final Amount: ₹0
```

---

### 2.3 Final Amount Calculation
**What it checks:**
- Final Amount = Service Cost - Discount
- Final Amount can never be negative
- Minimum value is 0 (free service)

**Formula:**
```
Final Amount = Math.max(0, Service Cost - Valid Discount)
```

**Examples:**
```
Service: ₹5000, Discount: ₹1000 → Final: ₹4000 ✓
Service: ₹5000, Discount: ₹5000 → Final: ₹0 ✓
Service: ₹5000, Discount: ₹6000 → Final: ₹0 ✓ (auto-adjusted)
```

---

### 2.4 Discount Percentage Validation
**What it checks:**
- Percentage must be 0-100
- Percentage-based discount calculation
- Converts percentage to actual discount amount

**Examples:**
```
Service: ₹1000, Discount: 10% → ₹100 off → Final: ₹900
Service: ₹1000, Discount: 50% → ₹500 off → Final: ₹500
Service: ₹1000, Discount: 150% → INVALID ❌
```

---

### 2.5 Patient Billing Eligibility
**What it checks:**
- Patient must exist in system
- Booking must be approved (not pending/rejected)
- Patient must have service cost assigned
- No duplicate billing for same booking

**Why it matters:**
- Prevents billing unapproved services
- Ensures complete patient information
- Prevents double-billing

---

## 3. PAYMENT RECEIPT VALIDATION (PaymentReceipt)

### 3.1 Receipt Data Validation
**What it checks:**
- Payment details are present
- Customer information is valid
- Amounts match (no calculation errors)
- Receipt ID is unique

**Display:**
```
✓ Receipt Number: Auto-generated from Payment ID
✓ Date: Payment date (validated non-future)
✓ Amount: Total payment amount
✓ Status: Current payment status badge
```

---

## 4. AUTO-CORRECTION FEATURES

### Smart Status Assignment
The system automatically corrects payment status based on amounts:

```
If Amount Paid = 0 → Set Status = "Pending"
If Amount Paid = Total Amount → Set Status = "Paid"
If 0 < Amount Paid < Total → Set Status = "Partially Paid"
```

### Discount Capping
If discount exceeds service cost, system automatically:
1. Caps discount at service cost
2. Sets final amount to 0
3. Displays warning to user
4. Shows in billing records

---

## 5. VALIDATION WORKFLOW (Step-by-Step)

### Payment Processing Flow:
```
1. User enters payment details
   ↓
2. System validates each field:
   - Customer name ✓
   - Amount ✓
   - Payment method ✓
   - Payment date ✓
   - Service type ✓
   ↓
3. System cross-validates relationships:
   - Amount Paid ≤ Total Amount ✓
   - Status matches amounts ✓
   - Customer exists ✓
   ↓
4. If all valid:
   - Auto-correct status ✓
   - Create payment record ✓
   - Generate receipt ✓
   - Show success message
   ↓
5. If invalid:
   - Display all errors at once
   - Highlight problematic fields
   - Suggest corrections
```

---

## 6. ERROR HANDLING STRATEGY

### Single vs Multiple Errors
- **First Error**: Validation stops, shows specific error
- **Follow-up**: User corrects and resubmits
- **ALL Fields**: Comprehensive validation happens

### Example Error Display:
```
❌ Validation Errors:
   - Amount must be greater than 0
   - Payment method must be selected
   - Payment date cannot be in the future
```

---

## 7. DATA INTEGRITY CHECKS

### Referential Integrity
```
Payment → Customer: Customer must exist
Payment → Service: Service type must be valid
Billing → Booking: Booking must be approved
Billing → Customer: Customer info must complete
```

### Consistency Checks
```
Payment Amount + Other Discounts ≤ Service Cost
Total Paid ≥ 0 and ≤ Bill Amount
No duplicate payments for same booking
```

---

## 8. AUDIT TRAIL ELEMENTS

Each payment record includes:
- ✓ Valid customer name
- ✓ Valid amount (verified range)
- ✓ Valid payment method
- ✓ Valid payment date (not future)
- ✓ Correct status (auto-assigned)
- ✓ Payment notes
- ✓ Timestamp of creation

---

## 9. TESTING VALIDATIONS

### Test Cases for Payment:

**Valid Payment:**
```javascript
{
  customerName: "Rajesh Kumar",
  amount: "5000",
  amountPaid: "5000",
  paymentMethod: "Cash",
  paymentStatus: "Paid",
  paymentDate: "2026-02-23",
  serviceType: "Abhyanga Massage",
  notes: "Regular customer"
}
// Expected Result: ✓ SUCCESS
```

**Invalid Payment (multiple errors):**
```javascript
{
  customerName: "",                 // ❌ INVALID (required)
  amount: "-500",                   // ❌ INVALID (negative)
  amountPaid: "6000",               // ❌ INVALID (exceeds amount)
  paymentMethod: "Bitcoin",         // ❌ INVALID (not in list)
  paymentDate: "2026-12-31",        // ❌ INVALID (future date)
  serviceType: "",                  // ❌ INVALID (required)
}
// Expected Result: ✗ Multiple errors shown
```

---

## 10. RECEPTIONIST TIPS

### When Recording Payment:
1. **Always enter valid customer name** - helps with follow-up
2. **Select payment method carefully** - needed for accounting
3. **Use today's date** - future dates are rejected
4. **Check amount paid ≤ total amount** - system will warn if exceeded
5. **Add descriptive service type** - helps with revenue tracking
6. **Include notes for special cases** - aids admin review

### Common Issues & Solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| "Amount exceeds maximum" | Entered 1000000+ | Enter valid amount |
| "Amount paid exceeds total" | Partial payment > total | Reduce amount paid |
| "Date in future" | Selected tomorrow's date | Use today's date |
| "Invalid amount" | Left empty or text | Enter valid number |
| "Customer not found" | Selected non-existent patient | Pick from list or check spelling |

---

## 11. VALIDATION UTILITIES (For Developers)

### Available Functions:

**paymentValidator.js**
```javascript
validateCustomerName()
validateAmount()
validateAmountPaid()
validatePaymentMethod()
validatePaymentDate()
validatePaymentStatus()
validateServiceType()
validatePayment() // Comprehensive check
getCorrectPaymentStatus() // Auto-correct
```

**billingValidator.js**
```javascript
validateServiceCost()
validateDiscountAmount()
validateDiscountPercentage()
calculateFinalAmount()
validateBillingRecord()
validatePatientBillingEligibility()
formatBillingAmount()
```

---

## 12. FUTURE ENHANCEMENTS

Potential validations to add:
- [ ] Duplicate payment detection (same patient, same amount, same date)
- [ ] Payment reconciliation with receipts
- [ ] GST/Tax calculation validation
- [ ] Bank transfer verification
- [ ] Email confirmation for large payments
- [ ] Daily payment limits per receptionist
- [ ] Automated payment reminders for pending bills

---

## Summary

**Payment Validation ensures:**
✓ Data accuracy and completeness
✓ No financial errors
✓ Proper audit trail
✓ Referential integrity
✓ Professional accounting records
✓ Customer satisfaction through accurate receipts

**Billing Validation ensures:**
✓ Correct final amounts
✓ Realistic discounts
✓ No negative billing
✓ Service-wise revenue tracking
✓ Clear financial reports

**Auto-Correction ensures:**
✓ User friendliness
✓ Automatic error fixes
✓ Smooth payment processing
✓ Reduced manual corrections
