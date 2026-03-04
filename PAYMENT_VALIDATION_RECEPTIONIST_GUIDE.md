# Payment Validation - Quick Reference for Receptionists

## What Happens When You Add a Payment?

The system automatically **checks** everything before saving to prevent mistakes! Here's what gets validated:

---

## Before You Submit - Check These Fields ✓

### 1. Customer Name
```
✓ Must be filled
✓ At least 2 letters
✓ Less than 100 characters

Example: "Rajesh Kumar" ✓
         "R" ✗ (too short)
```

### 2. Total Amount
```
✓ Must be a number
✓ Must be greater than 0
✓ Maximum ₹999,999

Example: 5000 ✓
         0 ✗ (must be > 0)
         -500 ✗ (no negative)
         1000000 ✗ (too large)
```

### 3. Amount Paid (Optional)
```
✓ Cannot exceed Total Amount
✓ Can be 0 (for pending payments)

Example: If Total = 5000
         Amount Paid = 2000 ✓ (partial payment)
         Amount Paid = 5000 ✓ (full payment)
         Amount Paid = 6000 ✗ (exceeds total)
```

### 4. Payment Method
```
✓ Must select one:
  - Cash
  - Credit Card
  - Debit Card
  - UPI
  - Bank Transfer
  - Cheque
```

### 5. Payment Date
```
✓ Must be today or earlier
✓ Cannot be in future

Example: 
  2026-02-23 ✓ (today)
  2026-02-22 ✓ (yesterday)
  2026-12-31 ✗ (future date)
```

### 6. Service Type
```
✓ Must be filled
✓ Describe the service received

Example: "Abhyanga Massage" ✓
         "General Service" ✓
         "" ✗ (must not be empty)
```

---

## Smart Auto-Corrections ✨

The system is **smart** and fixes things automatically:

### Auto-Status Assignment
You don't need to guess - system sets status automatically:

```
If You Pay Nothing (₹0)        → Status = "Pending"
If You Pay Full Amount         → Status = "Paid"
If You Pay Partial Amount      → Status = "Partially Paid"
```

**You enter:**
- Amount = 5000
- Amount Paid = 5000
- Status = "Pending"

**System automatically corrects to:**
- Status = "Paid" ✓

### Auto-Discount Cap
If discount exceeds service cost, system caps it:

```
Service Cost = ₹1000
Discount Asked = ₹1500
Final Amount Shown = ₹0 (100% max discount)
System Shows Warning: "Discount adjusted..."
```

---

## Common Validation Messages You Might See ⚠️

When you submit, you might see these error messages:

| Error Message | What it means | How to fix |
|---|---|---|
| "Customer name is required" | You forgot to enter name | Type patient's name |
| "Please enter a valid amount" | Amount field is wrong | Enter only numbers |
| "Amount must be greater than 0" | You entered 0 or negative | Enter ₹1 or more |
| "Amount paid exceeds total amount" | Paid more than bill | Reduce Amount Paid |
| "Please select a valid payment method" | One of the 6 options not selected | Choose Cash/Card/etc |
| "Payment date cannot be in the future" | You picked tomorrow's date | Pick today or earlier |
| "Please select a service type" | Service field empty | Type service name |

---

## Step-by-Step Payment Entry

### ✨ Perfect Payment Workflow

**Step 1: Select or Enter Customer**
```
Customer Name: "Priya Singh" ✓
(Or select from dropdown if already in system)
```

**Step 2: Enter Bill Amount**
```
Total Amount: 2500 ✓
(The full amount patient owes)
```

**Step 3: Enter Payment Amount**
```
Amount Paid: 2500 ✓
(How much patient is paying now)
```

**Step 4: Select Payment Method**
```
Payment Method: "Cash" ✓
(How patient paid)
```

**Step 5: Confirm Today's Date**
```
Payment Date: [Today's Date] ✓
(System auto-fills - just confirm)
```

**Step 6: Specify Service**
```
Service Type: "Shirodhara Therapy" ✓
(What service was provided)
```

**Step 7: Add Notes (Optional)**
```
Notes: "Senior citizen, 15% discount applied" ✓
(Any special details)
```

**Step 8: Click "Create Payment"**
```
✓ Form auto-validates
✓ All checks pass
✓ Payment saved!
✓ Receipt generated
```

---

## ✅ Valid Payment Example

```
Customer Name:    "Rajesh Kumar"
Total Amount:     5000
Amount Paid:      5000
Payment Method:   Cash
Payment Date:     2026-02-23
Service Type:     Abhyanga Massage
Notes:            Regular customer discount
Status:           Paid (auto-set)

✓ ALL CHECKS PASS ✓
Payment saved successfully!
Receipt: #HK84JX0A
```

---

## ❌ Invalid Payment Example

```
Customer Name:    "" ← EMPTY (❌ Error 1)
Total Amount:     -500 ← NEGATIVE (❌ Error 2)
Amount Paid:      6000 ← EXCEEDS TOTAL (❌ Error 3)
Payment Method:   "Credit" ← INVALID (❌ Error 4)
Payment Date:     2026-12-31 ← FUTURE (❌ Error 5)
Service Type:     "" ← EMPTY (❌ Error 6)

System shows ALL errors:
❌ Validation Errors:
   - Customer name is required
   - Amount must be greater than 0
   - Amount paid cannot exceed total amount
   - Please select a valid payment method
   - Payment date cannot be in the future
   - Please select a service type

Fix these and try again!
```

---

## Pro Tips for Accurate Entries 🎯

1. **Use Patient Dropdown**
   - Click customer dropdown to see existing patients
   - Select from list if patient exists
   - Less typing = fewer errors

2. **Copy Service Names**
   - Use standard service names for consistency
   - Helps with reports and tracking
   - Examples: "Abhyanga Massage", "Kati Basti", "Panchakarma"

3. **Add Helpful Notes**
   - "Senior discount", "Referral bonus", "First-time patient"
   - Helps admin understand the payment
   - No limit on what you write

4. **Verify Before Submitting**
   - Read the form once more
   - Check numbers are sensible
   - Then click submit

5. **If You Make a Mistake**
   - Admin can view and edit payments
   - Click the payment record to edit details
   - System re-validates when you update

---

## Payment Status Explained

After payment is saved, you'll see a status:

```
🟢 Paid
   = Full amount received
   = Bill is settled
   = Patient can schedule next appointment

🟡 Partially Paid  
   = Some amount received
   = Balance still due
   = Follow up needed

🔵 Pending
   = No payment received yet
   = Bill not started
   = First reminder should be sent
```

---

## Discounts & Special Offers

When you're entering payment, you might need to apply discounts:

### How Discounts Work

```
Service Cost:     ₹1000
Discount:         ₹200 (senior citizen)
Final Amount:     ₹800 (what patient pays)
Amount Paid:      ₹800

Status: "Paid" ✓
```

### Discount Limits

```
Maximum Discount = Service Cost

Service Cost: ₹1000
Max Discount: ₹1000 (100%)
Min Final Bill: ₹0 (free)

Can't charge negative! System will prevent it.
```

---

## Receipt Printed After Payment

When payment is saved, patient gets receipt with:
```
✓ Clinic name & address
✓ Patient name
✓ Service type & cost
✓ Discount applied
✓ Final amount paid
✓ Payment date & method
✓ Status (Paid/Pending/Partially Paid)
✓ Receipt number (for tracking)
✓ Clinic seal & signature
```

---

## Questions? Ask Your Manager

If you see an error message you don't understand:
1. **Read the error message**
2. **Check this guide**
3. **Correct the field**
4. **If still stuck, ask manager**

---

## Summary ⭐

### System Will Check:
✓ Customer name entered
✓ Amount is a valid number > 0
✓ Amount paid ≤ total amount
✓ Payment method selected
✓ Payment date is not future
✓ Service type entered
✓ All amounts make sense

### System Will Help:
✓ Auto-set payment status
✓ Auto-cap unrealistic discounts
✓ Auto-fill today's date
✓ Show multiple errors at once
✓ Generate receipt automatically

**Just enter accurate details and the system handles the rest!** 🎉
