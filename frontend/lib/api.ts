import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ayuraksha_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redirect to login on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('ayuraksha_token');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// Auth
export const sendOtp = (phone_number: string) => api.post('/auth/send-otp', { phone_number });
export const verifyOtp = (phone_number: string, otp: string) => api.post('/auth/verify-otp', { phone_number, otp });

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data: any) => api.put('/profile', data);
export const addEmergencyContact = (data: any) => api.post('/profile/emergency-contacts', data);
export const deleteEmergencyContact = (id: string) => api.delete(`/profile/emergency-contacts/${id}`);

// Medications
export const getMedications = (active?: boolean) => api.get('/medications', { params: active !== undefined ? { active } : {} });
export const addMedication = (data: any) => api.post('/medications', data);
export const updateMedication = (id: string, data: any) => api.put(`/medications/${id}`, data);
export const deleteMedication = (id: string) => api.delete(`/medications/${id}`);

// Reports
export const getReports = () => api.get('/reports');
export const uploadReport = (formData: FormData) => api.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteReport = (id: string) => api.delete(`/reports/${id}`);

// Emergency/QR
export const getQrSettings = () => api.get('/qr');
export const updateQrSettings = (data: any) => api.put('/qr', data);
export const regenerateQrToken = () => api.post('/qr/regenerate');
export const getEmergencyData = (token: string) => api.get(`/emergency/${token}`);

// Alerts
export const getAlerts = () => api.get('/alerts');
export const markAlertRead = (id: string) => api.put(`/alerts/${id}/read`);
export const markAllAlertsRead = () => api.put('/alerts/read');
export const dismissAlert = (id: string) => api.delete(`/alerts/${id}`);

// Caretakers
export const getCaretakers = () => api.get('/caretakers');
export const inviteCaretaker = (data: any) => api.post('/caretakers/invite', data);
export const approveCaretaker = (id: string) => api.put(`/caretakers/${id}/approve`);
export const removeCaretaker = (id: string) => api.delete(`/caretakers/${id}`);

export default api;
