import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000' });

API.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jeevaloom_token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (data: { email: string; password: string; name: string }) => API.post('/auth/register', data);
export const login = (data: { email: string; password: string }) => API.post('/auth/login', data);
export const updateLanguage = (language: string) => API.put('/auth/language', { language });

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

export default API;
