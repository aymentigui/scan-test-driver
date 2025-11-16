import axios from 'axios';

const API_BASE_URL = 'https://dnk.aimen-blog.com/api';

// Créer une instance axios avec configuration par défaut
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Fonction pour rechercher un conducteur par matricule
export const searchDriverByMatricule = async (matricule) => {
    try {
        const response = await apiClient.get('/test', {
            params: { matricule: matricule.trim() }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;