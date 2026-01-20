const https = require('https');

const data = JSON.stringify({
    name: 'Test Verify',
    email: 'testverify_prod@example.com',
    password: 'password123',
    role: 'consumer'
});

const options = {
    hostname: 'eco-backend-production-5336.up.railway.app',
    port: 443,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending REGISTER request to Production...');

const req = https.request(options, res => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
