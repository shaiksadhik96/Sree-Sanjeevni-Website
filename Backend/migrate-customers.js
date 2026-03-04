// Standalone migration script - No authentication required
// This script connects directly to MongoDB and adds patient IDs to all customers
// Run with: node migrate-customers.js

const mongoose = require('mongoose');

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/sreesanjeevni_Data';

// Customer Schema (matching your model)
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String },
  medicalHistory: { type: String },
  appointmentDate: { type: Date, required: true },
  status: { type: String, default: 'Active' },
  receptionistId: { type: String },
  patientId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema, 'customer_data');

// Generate sequential patient ID in format AA01, AA02, ..., AA99, AB01, etc.
const generateSequentialId = (index) => {
  // Calculate position: 0 = AA01, 1 = AA02, ..., 99 = AB01
  const totalPerLetterPair = 99; // AA01 to AA99
  const pairIndex = Math.floor(index / totalPerLetterPair);
  const numberInPair = (index % totalPerLetterPair) + 1;
  
  // Convert pairIndex to letters (0 = AA, 1 = AB, 25 = AZ, 26 = BA, etc.)
  const firstChar = String.fromCharCode(65 + Math.floor(pairIndex / 26)); // A-Z
  const secondChar = String.fromCharCode(65 + (pairIndex % 26)); // A-Z
  const number = numberInPair.toString().padStart(2, '0');
  
  return firstChar + secondChar + number;
};

// Main migration function
async function migratePatientIds() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully!\n');

    // Get total customer count
    const totalCustomers = await Customer.countDocuments();
    
    console.log(`Total customers in database: ${totalCustomers}`);
    console.log('Will assign sequential IDs: AA01, AA02, AA03, ...\n');

    let updated = 0;
    let failed = 0;
    
    console.log('Starting sequential migration (AA01, AA02, ...)\n');
    
    // First, clear all existing patient IDs to start fresh
    console.log('Clearing existing patient IDs...\n');
    await Customer.updateMany({}, { $unset: { patientId: 1 } });
    
    // Get all customers sorted by creation date
    const allCustomers = await Customer.find().sort({ createdAt: 1 });
    
    for (let i = 0; i < allCustomers.length; i++) {
      try {
        const patientId = generateSequentialId(i);
        allCustomers[i].patientId = patientId;
        await allCustomers[i].save();
        console.log(`  ${allCustomers[i].name.padEnd(25)} -> Patient ID: ${patientId}`);
        updated++;
      } catch (error) {
        console.error(`  ERROR ${allCustomers[i].name.padEnd(25)} -> Error: ${error.message}`);
        failed++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE!');
    console.log('='.repeat(60));
    console.log(`Successfully updated: ${updated} customers`);
    console.log(`Failed: ${failed} customers`);
    console.log(`Total processed: ${totalCustomers} customers`);
    console.log('='.repeat(60));
    
    // Show all customers with their IDs
    console.log('\nAll Customers with Patient IDs:\n');
    const finalCustomerList = await Customer.find().sort({ createdAt: 1 });
    finalCustomerList.forEach((customer, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${customer.name.padEnd(25)} → ID: ${customer.patientId || 'NOT SET'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('\nMigration failed with error:');
    console.error(error.message);
    console.error('\nMake sure:');
    console.error('1. MongoDB is running on localhost:27017');
    console.error('2. The database name is "clinic"');
    console.error('3. The collection name is "customer_data"');
    process.exit(1);
  }
}

// Run the migration
console.log('Sree Sanjeevni Ayurvedic Clinic');
console.log('Patient ID Migration Tool');
console.log('='.repeat(60) + '\n');

migratePatientIds();
