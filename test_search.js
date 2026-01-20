const API_URL = 'http://localhost:5000/api';
const SELLER_EMAIL = 'seller@example.com';
const SELLER_PASSWORD = 'password123';

const testSearch = async () => {
    try {
        // 1. Register/Login
        const uniqueParams = Date.now();
        const email = `seller_${uniqueParams}@example.com`;
        const password = 'password123';

        console.log(`1. Registering new seller: ${email}...`);
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Seller', email, password, role: 'seller' })
        });

        let token;
        if (registerRes.ok) {
            const data = await registerRes.json();
            token = data.token;
            console.log('Registered successfully.');
        } else {
            const errData = await registerRes.json();
            console.log('Register failed:', errData);
            console.log('Trying login...');
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await loginRes.json();
            token = data.token;
        }

        if (!token) throw new Error('Auth failed: No token returned');

        // 2. Create VERIFIED Product (High Score)
        console.log('2. Creating Verified Product...');
        const createRes1 = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: "Super Eco Test Product " + Date.now(),
                price: 50,
                description: "This is a highly sustainable, organic, plastic-free amazing product.",
                image: "http://example.com/img.jpg",
                category: "Eco",
                countInStock: 5,
                ecoCredentials: { materials: "Organic Cotton", productionMethod: "Handmade", certification: "Fair Trade" }
            })
        });
        const verifiedProduct = await createRes1.json();
        if (!createRes1.ok) {
            console.error('Create Verified Failed:', verifiedProduct);
            return;
        }
        console.log(`Created Verified: ${verifiedProduct.name} (Verified: ${verifiedProduct.isVerified})`);

        // 3. Create UNVERIFIED Product (Low Score)
        console.log('3. Creating Unverified Product...');
        const unverifiedProduct = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                name: "Plastic Waste Test Product " + Date.now(),
                price: 10,
                description: "Cheap plastic stuff.",
                image: "http://example.com/img.jpg",
                category: "Trash",
                countInStock: 100,
                ecoCredentials: { materials: "Plastic", productionMethod: "Factory", certification: "None" }
            })
        }).then(res => res.json());
        console.log(`Created Unverified: ${unverifiedProduct.name} (Verified: ${unverifiedProduct.isVerified})`);

        // 4. Test Search (Should find Verified)
        console.log('4. Searching for Verified Product...');
        const searchRes1 = await fetch(`${API_URL}/products?keyword=${encodeURIComponent(verifiedProduct.name)}`);
        const searchData1 = await searchRes1.json();
        const foundVerified = searchData1.products.find(p => p._id === verifiedProduct._id);

        if (foundVerified) console.log('PASS: Found Verified Product in search.');
        else console.error('FAIL: Did not find Verified Product in search.');

        // 5. Test Search (Should NOT find Unverified)
        console.log('5. Searching for Unverified Product...');
        const searchRes2 = await fetch(`${API_URL}/products?keyword=${encodeURIComponent(unverifiedProduct.name)}`);
        const searchData2 = await searchRes2.json();
        const foundUnverified = searchData2.products.find(p => p._id === unverifiedProduct._id);

        if (!foundUnverified) console.log('PASS: Unverified Product HIDDEN from search.');
        else console.error('FAIL: Unverified Product WAS FOUND in search (Should be hidden).');

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testSearch();
