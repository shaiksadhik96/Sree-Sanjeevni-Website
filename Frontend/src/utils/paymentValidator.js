/**
 * Payment Validation Utility
 * Comprehensive validation functions for payment processing
 */

// Validate customer name
export const validateCustomerName = (customerName) => {
    if (!customerName || typeof customerName !== 'string') {
        return { valid: false, error: 'Customer name is required' };
    }
    if (customerName.trim().length < 2) {
        return { valid: false, error: 'Customer name must be at least 2 characters' };
    }
    if (customerName.length > 100) {
        return { valid: false, error: 'Customer name must not exceed 100 characters' };
    }
    return { valid: true };
};

// Validate payment amount
export const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
        return { valid: false, error: 'Please enter a valid amount' };
    }
    if (numAmount <= 0) {
        return { valid: false, error: 'Amount must be greater than 0' };
    }
    if (numAmount > 999999) {
        return { valid: false, error: 'Amount exceeds maximum limit of 999,999' };
    }
    return { valid: true, value: numAmount };
};

// Validate amount paid (should not exceed total amount)
export const validateAmountPaid = (amountPaid, totalAmount) => {
    const numPaid = parseFloat(amountPaid) || 0;
    const numTotal = parseFloat(totalAmount);
    
    if (numPaid < 0) {
        return { valid: false, error: 'Amount paid cannot be negative' };
    }
    if (numPaid > numTotal) {
        return { valid: false, error: `Amount paid (₹${numPaid}) cannot exceed total amount (₹${numTotal})` };
    }
    return { valid: true, value: numPaid };
};

// Validate payment method
export const validatePaymentMethod = (paymentMethod) => {
    const validMethods = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Cheque'];
    
    if (!paymentMethod || !validMethods.includes(paymentMethod)) {
        return { valid: false, error: 'Please select a valid payment method' };
    }
    return { valid: true };
};

// Validate payment date
export const validatePaymentDate = (paymentDate) => {
    if (!paymentDate) {
        return { valid: false, error: 'Payment date is required' };
    }
    
    const date = new Date(paymentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(date)) {
        return { valid: false, error: 'Invalid payment date format' };
    }
    if (date > today) {
        return { valid: false, error: 'Payment date cannot be in the future' };
    }
    return { valid: true };
};

// Validate payment status
export const validatePaymentStatus = (status, amountPaid, totalAmount) => {
    const validStatuses = ['Pending', 'Paid', 'Partially Paid', 'Cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
        return { valid: false, error: 'Invalid payment status' };
    }
    
    const numPaid = parseFloat(amountPaid) || 0;
    const numTotal = parseFloat(totalAmount);
    
    // Auto-determine status based on amounts
    if (numPaid === 0 && status !== 'Pending') {
        return { valid: false, error: 'Status should be Pending when nothing is paid' };
    }
    if (numPaid === numTotal && status !== 'Paid') {
        return { valid: false, error: 'Status should be Paid when full amount is paid' };
    }
    if (numPaid > 0 && numPaid < numTotal && status !== 'Partially Paid' && status !== 'Pending') {
        return { valid: false, error: 'Status should be Partially Paid when partial amount is paid' };
    }
    
    return { valid: true };
};

// Validate service type
export const validateServiceType = (serviceType) => {
    if (!serviceType || typeof serviceType !== 'string') {
        return { valid: false, error: 'Please select a service type' };
    }
    if (serviceType.length > 100) {
        return { valid: false, error: 'Service type must not exceed 100 characters' };
    }
    return { valid: true };
};

// Validate notes (optional field)
export const validateNotes = (notes) => {
    if (notes && notes.length > 500) {
        return { valid: false, error: 'Notes must not exceed 500 characters' };
    }
    return { valid: true };
};

// Validate customer ID existence
export const validateCustomerExists = (customerId, customers) => {
    if (!customerId) {
        return { valid: true }; // Optional - manual entry allowed
    }
    
    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        return { valid: false, error: 'Selected customer does not exist' };
    }
    return { valid: true, customer };
};

/**
 * Main comprehensive payment validation
 * Returns all validation errors at once
 */
export const validatePayment = (paymentData, customers = []) => {
    const errors = [];
    
    // Validate customer name
    const nameValidation = validateCustomerName(paymentData.customerName);
    if (!nameValidation.valid) errors.push(nameValidation.error);
    
    // Validate amount
    const amountValidation = validateAmount(paymentData.amount);
    if (!amountValidation.valid) {
        errors.push(amountValidation.error);
        return { valid: false, errors }; // Can't continue without valid amount
    }
    
    // Validate amount paid
    const amountPaidValidation = validateAmountPaid(paymentData.amountPaid, amountValidation.value);
    if (!amountPaidValidation.valid) errors.push(amountPaidValidation.error);
    
    // Validate payment method
    const methodValidation = validatePaymentMethod(paymentData.paymentMethod);
    if (!methodValidation.valid) errors.push(methodValidation.error);
    
    // Validate payment date
    const dateValidation = validatePaymentDate(paymentData.paymentDate);
    if (!dateValidation.valid) errors.push(dateValidation.error);
    
    // Validate payment status
    const statusValidation = validatePaymentStatus(
        paymentData.paymentStatus,
        amountPaidValidation.value,
        amountValidation.value
    );
    if (!statusValidation.valid) errors.push(statusValidation.error);
    
    // Validate service type
    const serviceValidation = validateServiceType(paymentData.serviceType);
    if (!serviceValidation.valid) errors.push(serviceValidation.error);
    
    // Validate notes
    const notesValidation = validateNotes(paymentData.notes);
    if (!notesValidation.valid) errors.push(notesValidation.error);
    
    // Validate customer exists (if provided)
    if (paymentData.customerId) {
        const customerValidation = validateCustomerExists(paymentData.customerId, customers);
        if (!customerValidation.valid) errors.push(customerValidation.error);
    }
    
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null
    };
};

// Auto-correct payment status based on amounts
export const getCorrectPaymentStatus = (amountPaid, totalAmount) => {
    const numPaid = parseFloat(amountPaid) || 0;
    const numTotal = parseFloat(totalAmount);
    
    if (numPaid === 0) return 'Pending';
    if (numPaid === numTotal) return 'Paid';
    if (numPaid > 0 && numPaid < numTotal) return 'Partially Paid';
    return 'Pending';
};

export default {
    validateCustomerName,
    validateAmount,
    validateAmountPaid,
    validatePaymentMethod,
    validatePaymentDate,
    validatePaymentStatus,
    validateServiceType,
    validateNotes,
    validateCustomerExists,
    validatePayment,
    getCorrectPaymentStatus
};
