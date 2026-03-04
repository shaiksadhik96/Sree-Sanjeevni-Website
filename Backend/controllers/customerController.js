const Customer = require('../models/Customer');

// Generate sequential patient ID in format AA01, AA02, ..., AA99, AB01, etc.
const generatePatientId = async () => {
  // Get the latest customer with a patientId
  const lastCustomer = await Customer.findOne({ patientId: { $exists: true, $ne: null } })
    .sort({ patientId: -1 })
    .limit(1);
  
  if (!lastCustomer || !lastCustomer.patientId) {
    // Start with AA01 if no existing IDs
    return 'AA01';
  }
  
  // Parse the last ID (e.g., "AA01" -> letters: "AA", number: 1)
  const lastId = lastCustomer.patientId;
  const letters = lastId.substring(0, 2);
  const number = parseInt(lastId.substring(2));
  
  // Increment the number
  if (number < 99) {
    const newNumber = (number + 1).toString().padStart(2, '0');
    return letters + newNumber;
  } else {
    // If we reached 99, increment the letters (AA -> AB -> AC ... -> ZZ)
    const firstChar = letters.charCodeAt(0);
    const secondChar = letters.charCodeAt(1);
    
    if (secondChar < 90) { // Z is 90
      // Increment second letter
      return String.fromCharCode(firstChar) + String.fromCharCode(secondChar + 1) + '01';
    } else if (firstChar < 90) {
      // Increment first letter, reset second to A
      return String.fromCharCode(firstChar + 1) + 'A01';
    } else {
      // Reached ZZ99, wrap to AA01 (or throw error)
      return 'AA01';
    }
  }
};

const getAllCustomers = async (req, res) => {
  try {
    console.log(`[GET CUSTOMERS] Request from ${req.user.role} ${req.user.id}`);
    const customers = await Customer.find().sort({ createdAt: -1 });
    console.log(`[GET CUSTOMERS] ✓ Retrieved ${customers.length} customers`);
    res.json(customers);
  } catch (err) {
    console.error('[GET CUSTOMERS] ✗ Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

const addCustomer = async (req, res) => {
  const customerData = req.body;
  console.log(`[ADD CUSTOMER] Request received from ${req.user.role} ${req.user.id}`);
  console.log(`[ADD CUSTOMER] Customer data:`, JSON.stringify(customerData, null, 2));
  
  try {
    // Validate required fields
    if (!customerData.name || !customerData.phone || !customerData.age || !customerData.gender || !customerData.appointmentDate) {
      console.error('[ADD CUSTOMER] Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: name, phone, age, gender, and appointmentDate are required' });
    }

    if (!['Male', 'Female'].includes(customerData.gender)) {
      console.error('[ADD CUSTOMER] Invalid gender value');
      return res.status(400).json({ message: 'Invalid gender. Allowed values are Male or Female.' });
    }

    // Generate unique patient ID
    const patientId = await generatePatientId();
    console.log(`[ADD CUSTOMER] Generated patient ID: ${patientId}`);

    const newCustomer = new Customer({
      ...customerData,
      patientId,
      receptionistId: req.user.role === 'receptionist' ? req.user.id : null
    });
    
    console.log('[ADD CUSTOMER] Attempting to save customer...');
    const savedCustomer = await newCustomer.save();
    console.log(`[ADD CUSTOMER] ✓ Customer saved successfully with ID: ${savedCustomer._id}, Patient ID: ${savedCustomer.patientId}`);
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error(`[ADD CUSTOMER] ✗ Error saving customer:`, err.message);
    console.error('[ADD CUSTOMER] Error details:', err);
    res.status(400).json({ message: err.message, details: err.errors });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const migratePatientIds = async (req, res) => {
  try {
    console.log('[MIGRATE PATIENT IDS] Starting migration...');
    
    // Find all customers without a patientId
    const customersWithoutId = await Customer.find({ 
      $or: [
        { patientId: null },
        { patientId: { $exists: false } }
      ]
    });
    
    console.log(`[MIGRATE PATIENT IDS] Found ${customersWithoutId.length} customers without patient IDs`);
    
    let updated = 0;
    let failed = 0;
    
    for (const customer of customersWithoutId) {
      try {
        const patientId = await generatePatientId();
        customer.patientId = patientId;
        await customer.save();
        console.log(`[MIGRATE PATIENT IDS] ✓ Generated ID ${patientId} for customer ${customer.name}`);
        updated++;
      } catch (error) {
        console.error(`[MIGRATE PATIENT IDS] ✗ Failed for customer ${customer.name}:`, error.message);
        failed++;
      }
    }
    
    console.log(`[MIGRATE PATIENT IDS] Migration complete: ${updated} updated, ${failed} failed`);
    res.json({ 
      message: 'Migration complete', 
      updated,
      failed,
      total: customersWithoutId.length
    });
  } catch (err) {
    console.error('[MIGRATE PATIENT IDS] ✗ Migration error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  migratePatientIds
};
