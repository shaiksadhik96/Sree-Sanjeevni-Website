// Check all customers and their patient IDs
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/sreesanjeevni_Data';

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

async function checkCustomers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!\n');

    const customers = await Customer.find().sort({ createdAt: 1 });
    
    console.log('CUSTOMER DATABASE STATUS');
    console.log('='.repeat(70));
    console.log(`Total Customers: ${customers.length}\n`);
    
    customers.forEach((customer, index) => {
      console.log(`${(index + 1).toString().padStart(2)}. ${customer.name.padEnd(30)} | Patient ID: ${customer.patientId || 'MISSING'} | Phone: ${customer.phone}`);
    });
    
    const withoutId = customers.filter(c => !c.patientId);
    const withId = customers.filter(c => c.patientId);
    
    console.log('\n' + '='.repeat(70));
    console.log(`Customers WITH Patient ID: ${withId.length}`);
    console.log(`Customers WITHOUT Patient ID: ${withoutId.length}`);
    console.log('='.repeat(70));
    
    if (withoutId.length > 0) {
      console.log('\nCustomers missing Patient IDs:');
      withoutId.forEach(c => console.log(`   - ${c.name} (${c.phone})`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkCustomers();
