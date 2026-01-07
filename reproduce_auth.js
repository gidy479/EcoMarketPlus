const API_URL = 'http://localhost:5000/api/auth';

const login = async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return { status: res.status, data };
};

const register = async (name, email, password, role) => {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    return { status: res.status, data };
};

const getProfile = async (token) => {
    const res = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return { status: res.status, data };
};

const googleLogin = async () => {
    // Testing the backend endpoint that the frontend calls for Google Login
    const mockPayload = {
        email: "mock_google_user@gmail.com",
        name: "Google User (Mock)",
        googleId: "mock-google-id-123",
        avatar: "https://via.placeholder.com/150"
    };
    const res = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockPayload)
    });
    const data = await res.json();
    return { status: res.status, data };
};

const testAuth = async () => {
    try {
        console.log('--- Testing Register ---');
        const uniqueEmail = `test_${Date.now()}@example.com`;
        const reg = await register('Test User', uniqueEmail, 'password123', 'consumer');
        console.log('Register Status:', reg.status);
        if (reg.status !== 201) console.error('Reg Error:', reg.data);

        if (reg.status === 201) {
            const token = reg.data.token;
            console.log('\n--- Testing Login ---');
            const log = await login(uniqueEmail, 'password123');
            console.log('Login Status:', log.status);

            console.log('\n--- Testing Profile ---');
            const prof = await getProfile(token);
            console.log('Profile Status:', prof.status);
            console.log('Profile Email Match:', prof.data.email === uniqueEmail);
        }

        console.log('\n--- Testing Google Login Endpoint ---');
        const gLog = await googleLogin();
        console.log('Google Login Status:', gLog.status);
        if (gLog.status === 200 || gLog.status === 201) {
            console.log('Google Login Success (Token received):', !!gLog.data.token);
        } else {
            console.error('Google Login Failed:', gLog.data);
        }

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testAuth();
