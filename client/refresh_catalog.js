const API_URL = 'http://localhost:5000/api';

const refreshCatalog = async () => {
    try {
        console.log('--- 1. Authenticating as Admin ---');
        const email = `admin_scaler_${Date.now()}@test.com`;
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Scale Admin',
                email: email,
                password: 'password123',
                role: 'admin'
            })
        });

        const authData = await res.json();
        const token = authData.token;
        console.log('Auth Token obtained:', !!token);

        if (!token) {
            console.error("Auth failed", authData);
            return;
        }

        console.log('\n--- 2. Triggering SCALED Catalog Import ---');
        const importRes = await fetch(`${API_URL}/products/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const importData = await importRes.json();
        console.log('Import Status:', importRes.status);
        if (importRes.status === 201) {
            console.log(importData.message);
            console.log('Sample Product:', importData.products[0]);
            console.log('Total Imported:', importData.products.length);
        } else {
            console.error('Import Failed:', importData);
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
};

refreshCatalog();
