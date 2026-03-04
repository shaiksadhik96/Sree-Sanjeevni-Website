// Ayurvedic services with prices and details
export const AYURVEDIC_SERVICES = [
    { id: 1, name: 'Abhyanga Massage', duration: '60 min', price: 1200, description: 'Full-body herbal oil massage that improves circulation and calms the nervous system.' },
    { id: 2, name: 'Shirodhara Therapy', duration: '45 min', price: 1800, description: 'Warm oil poured over the forehead to relieve stress and enhance mental clarity.' },
    { id: 3, name: 'Panchakarma Detox', duration: '90 min', price: 2500, description: 'Comprehensive cleansing program to eliminate toxins and rejuvenate the body.' },
    { id: 4, name: 'Herbal Steam', duration: '30 min', price: 800, description: 'Steam therapy with medicinal herbs to open pores and eliminate toxins through skin.' },
    { id: 5, name: 'Nasya Therapy', duration: '30 min', price: 900, description: 'Nasal administration of herbal oils to clear sinuses and improve respiratory health.' },
    { id: 6, name: 'Kati Basti (Back Care)', duration: '50 min', price: 1400, description: 'Warm medicated oil pooled on lower back to relieve pain and stiffness.' },
    { id: 7, name: 'Swedana (Sweating Therapy)', duration: '40 min', price: 1100, description: 'Herbal steam therapy to eliminate toxins and improve circulation.' },
    { id: 8, name: 'Netra Tarpana (Eye Care)', duration: '35 min', price: 1000, description: 'Ghee treatment for eyes to improve vision and relieve eye strain.' },
];

// Herbal medications/treatments
export const HERBAL_MEDICATIONS = [
    'Ashwagandha Powder',
    'Brahmi Oil',
    'Triphala Churna',
    'Neem Extract',
    'Turmeric Paste',
    'Ginger-Lemon Tea',
    'Sesame Oil',
    'Coconut Oil',
    'Aloe Vera Gel',
    'Chyawanprash',
];

// Payment methods
export const PAYMENT_METHODS = [
    'Cash',
    'Debit Card',
    'Credit Card',
    'UPI (Google Pay / PhonePe)',
    'Bank Transfer',
];

// Discount types
export const DISCOUNT_TYPES = [
    { type: 'Senior Citizen (60+)', percentage: 15 },
    { type: 'First Visit', percentage: 10 },
    { type: 'Package (3+ Sessions)', percentage: 20 },
    { type: 'Weekend Special', percentage: 12 },
    { type: 'Loyalty Program', percentage: 8 },
    { type: 'Custom', percentage: 0 },
];

// Get service by name
export const getServiceByName = (name) => {
    return AYURVEDIC_SERVICES.find(service => service.name === name);
};

// Get service price
export const getServicePrice = (serviceName) => {
    const service = getServiceByName(serviceName);
    return service ? service.price : 0;
};

// Format currency
export const formatCurrency = (value) => {
    return `₹${(value || 0).toLocaleString('en-IN')}`;
};

// Calculate discounted price
export const calculateDiscount = (amount, discountPercentage) => {
    return amount * (discountPercentage / 100);
};

// Calculate final amount
export const calculateFinalAmount = (amount, discountPercentage) => {
    const discount = calculateDiscount(amount, discountPercentage);
    return Math.max(0, amount - discount);
};
