const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const TOKEN = process.env.REACT_APP_TOKEN_HASH;
export async function apiClient(endpoint, { method = 'GET', headers = {}, body } = {}) {

    if (TOKEN) {
        const token = btoa(`:${TOKEN}`);
        headers['Authorization'] = `Basic ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get('content-type');

    if (!res.ok) {
        const error = contentType?.includes('application/json')
            ? await res.json()
            : await res.text();
        console.log(error.data)
        throw new Error(error.data);
    }

    return contentType?.includes('application/json') ? res.json() : res.text();
}