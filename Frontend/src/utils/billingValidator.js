/**
 * Billing Validation Utility
 * Comprehensive validation functions for billing calculations
 */

// Validate service cost
export const validateServiceCost = (serviceCost) => {
    const numCost = parseFloat(serviceCost);
    
    if (isNaN(numCost)) {
        return { valid: false, error: 'Service cost must be a valid number' };
    }
    if (numCost < 0) {
        return { valid: false, error: 'Service cost cannot be negative' };
    }
    if (numCost > 999999) {
        return { valid: false, error: 'Service cost exceeds maximum limit' };
    }
    return { valid: true, value: numCost };
};

// Validate discount amount
export const validateDiscountAmount = (discount, serviceCost) => {
    const numDiscount = parseFloat(discount) || 0;
    const numCost = parseFloat(serviceCost);
    
    if (isNaN(numDiscount)) {
        return { valid: false, error: 'Discount must be a valid number' };
    }
    if (numDiscount < 0) {
        return { valid: false, error: 'Discount cannot be negative' };
    }
    // CRITICAL VALIDATION: Discount cannot exceed service cost
    if (numDiscount > numCost) {
        return { 
            valid: false, 
            error: `Discount (₹${numDiscount}) cannot exceed service cost (₹${numCost})`,
            adjusted: true,
            adjustedValue: numCost // Auto-adjust to service cost
        };
    }
    return { valid: true, value: numDiscount };
};

// Validate discount percentage
export const validateDiscountPercentage = (percentage, serviceCost) => {
    const numPercent = parseFloat(percentage);
    
    if (isNaN(numPercent)) {
        return { valid: false, error: 'Discount percentage must be a valid number' };
    }
    if (numPercent < 0 || numPercent > 100) {
        return { valid: false, error: 'Discount percentage must be between 0 and 100' };
    }
    
    const discountAmount = (parseFloat(serviceCost) * numPercent) / 100;
    return { valid: true, value: numPercent, discountAmount };
};

// Calculate final amount with validation
export const calculateFinalAmount = (serviceCost, discount) => {
    const cost = parseFloat(serviceCost) || 0;
    let disc = parseFloat(discount) || 0;
    let warnings = [];
    
    // VALIDATION: Maximum possible discount is service cost
    if (disc > cost) {
        warnings.push(`Discount adjusted from ₹${disc} to ₹${cost}`);
        disc = cost;
    }
    
    const finalAmount = Math.max(0, cost - disc);
    
    return {
        serviceCost: cost,
        discount: disc,
        finalAmount: finalAmount,
        discountPercent: cost > 0 ? ((disc / cost) * 100).toFixed(2) : 0,
        warnings
    };
};

// Validate complete billing record
export const validateBillingRecord = (billingRecord) => {
    const errors = [];
    const warnings = [];
    
    // Validate service cost
    const costValidation = validateServiceCost(billingRecord.serviceCost);
    if (!costValidation.valid) {
        errors.push(costValidation.error);
        return { valid: false, errors, warnings };
    }
    
    // Validate discount
    const discountValidation = validateDiscountAmount(billingRecord.discount, costValidation.value);
    if (!discountValidation.valid) {
        if (discountValidation.adjusted) {
            warnings.push(discountValidation.error);
            billingRecord.discount = discountValidation.adjustedValue;
        } else {
            errors.push(discountValidation.error);
        }
    }
    
    // Calculate final amount with validation
    const calculation = calculateFinalAmount(costValidation.value, billingRecord.discount);
    
    // Check if final amount is reasonable
    if (calculation.finalAmount < 0) {
        errors.push('Final billing amount cannot be negative');
    }
    if (calculation.finalAmount === 0 && costValidation.value > 0) {
        warnings.push('Final billing amount is zero - 100% discount applied');
    }
    
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
        warnings: warnings.length > 0 ? warnings : null,
        calculation
    };
};

// Validate patient billing eligibility
export const validatePatientBillingEligibility = (patient, booking) => {
    const errors = [];
    const warnings = [];
    
    // Check if patient exists
    if (!patient || !patient.id) {
        errors.push('Patient information is missing');
        return { eligible: false, errors, warnings };
    }
    
    // Check if booking exists and is approved
    if (!booking || booking.status !== 'approved') {
        errors.push('Booking must be approved before billing');
        return { eligible: false, errors, warnings };
    }
    
    // Check if service cost exists
    if (!patient.serviceCost || parseFloat(patient.serviceCost) <= 0) {
        warnings.push('Patient has no service cost assigned - please update patient details');
    }
    
    // Check for duplicate billing
    if (booking.billed === true) {
        warnings.push('This booking may have already been billed');
    }
    
    return {
        eligible: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
        warnings: warnings.length > 0 ? warnings : null
    };
};

// Format billing amount with validation
export const formatBillingAmount = (amount) => {
    const num = parseFloat(amount);
    
    if (isNaN(num)) {
        return { valid: false, error: 'Invalid amount', display: '-' };
    }
    
    return {
        valid: true,
        value: num,
        display: `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        displayShort: `₹${num.toLocaleString('en-IN')}`
    };
};

export default {
    validateServiceCost,
    validateDiscountAmount,
    validateDiscountPercentage,
    calculateFinalAmount,
    validateBillingRecord,
    validatePatientBillingEligibility,
    formatBillingAmount
};
