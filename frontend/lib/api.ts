import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000' });

API.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jeevaloom_token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (data: { email?: string; password: string; name: string; phoneNumber?: string }) => API.post('/auth/register', data);
export const login = (data: { name: string }) => API.post('/auth/login', data);
export const updateLanguage = (language: string) => API.put('/auth/language', { language });

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data: any) => API.put('/profile', data);
export const addEmergencyContact = (data: any) => API.post('/profile/emergency-contacts', data);
export const deleteEmergencyContact = (id: string) => API.delete(`/profile/emergency-contacts/${id}`);

// Ayurveda Assessments
export const saveAyurvedaAssessment = (data: any) => API.post('/assessments/ayurveda', data);
export const getAyurvedaHistory = () => API.get('/assessments/ayurveda');
export const deleteAyurvedaRecord = (id: string) => API.delete(`/assessments/ayurveda/${id}`);

// Health Assessments
export const saveHealthAssessment = (data: any) => API.post('/assessments/health', data);
export const getHealthHistory = () => API.get('/assessments/health');
export const deleteHealthRecord = (id: string) => API.delete(`/assessments/health/${id}`);

// Prescriptions
export const uploadPrescription = (formData: FormData) =>
    API.post('/prescriptions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getPrescriptions = (type?: string) =>
    API.get('/prescriptions', { params: type ? { type } : {} });
export const deletePrescription = (id: string) => API.delete(`/prescriptions/${id}`);

// Medications
export const getMedications = (active?: boolean) =>
    API.get('/medications', { params: active !== undefined ? { active: String(active) } : {} });
export const addMedication = (data: any) => API.post('/medications', data);
export const updateMedication = (id: string, data: any) => API.put(`/medications/${id}`, data);
export const deleteMedication = (id: string) => API.delete(`/medications/${id}`);

// Medical Reports
export const getReports = () => API.get('/reports');
export const uploadReport = (formData: FormData) =>
    API.post('/reports/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteReport = (id: string) => API.delete(`/reports/${id}`);

// Alerts
export const getAlerts = () => API.get('/alerts');
export const markAlertRead = (id: string) => API.put(`/alerts/${id}/read`);
export const markAllAlertsRead = () => API.put('/alerts/read');
export const dismissAlert = (id: string) => API.delete(`/alerts/${id}`);

// Caretakers
export const getCaretakers = () => API.get('/caretakers');
export const getPatients = () => API.get('/caretakers/patients');
export const inviteCaretaker = (data: any) => API.post('/caretakers/invite', data);
export const approveCaretaker = (id: string) => API.put(`/caretakers/${id}/approve`);
export const removeCaretaker = (id: string) => API.delete(`/caretakers/${id}`);

// QR / Emergency Access
export const getQrSettings = () => API.get('/qr');
export const updateQrSettings = (data: any) => API.put('/qr', data);
export const regenerateQrToken = () => API.post('/qr/regenerate');

// Emergency (public)
export const getEmergencyData = (token: string) => API.get(`/emergency/${token}`);

export default API;
