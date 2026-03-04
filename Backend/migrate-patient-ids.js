// Simple script to trigger patient ID migration
// Usage: node migrate-patient-ids.js <your-jwt-token>

const axios = require('axios');

const token = process.argv[2];

if (!token) {
    console.error('Please provide your JWT token as an argument');
    console.log('Usage: node migrate-patient-ids.js <your-jwt-token>');
    console.log('\nYou can get your token by:');
    console.log('1. Login to the application');
    console.log('2. Open browser console (F12)');
    console.log('3. Run: localStorage.getItem("token")');
    process.exit(1);
}

async function migratePatientIds() {
    try {
        console.log('Starting patient ID migration...\n');
        
        const response = await axios.post(
            'http://localhost:5000/api/customers/migrate-ids',
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        console.log('Migration completed successfully!\n');
        console.log(`Results:`);
        console.log(`   - Total customers processed: ${response.data.total}`);
        console.log(`   - Successfully updated: ${response.data.updated}`);
        console.log(`   - Failed: ${response.data.failed}`);
        console.log('\nAll existing customers now have patient IDs!');
        
    } catch (error) {
        console.error('Migration failed:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${error.response.data.message || 'Unknown error'}`);
        } else {
            console.error(`   ${error.message}`);
        }
        process.exit(1);
    }
}

migratePatientIds();
