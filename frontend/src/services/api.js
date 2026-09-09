const API_BASE = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not on login/register page, trigger event or redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    const error = new Error(data.message || 'An unexpected error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getMe: () => request('/auth/me'),
    updateProfile: (data) =>
      request('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    changePassword: (data) =>
      request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Dashboard
  dashboard: {
    getSummary: () => request('/dashboard/summary'),
    getCharts: (year) => request(`/dashboard/charts${year ? `?year=${year}` : ''}`),
  },

  // Expenses
  expenses: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses${query ? `?${query}` : ''}`);
    },
    getSummary: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses/summary${query ? `?${query}` : ''}`);
    },
    create: (data) =>
      request('/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/expenses/${id}`, {
        method: 'DELETE',
      }),
  },

  // Income
  income: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/income${query ? `?${query}` : ''}`);
    },
    create: (data) =>
      request('/income', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/income/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/income/${id}`, {
        method: 'DELETE',
      }),
  },

  // Investments
  investments: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/investments${query ? `?${query}` : ''}`);
    },
    getPortfolioSummary: () => request('/investments/portfolio/summary'),
    getById: (id) => request(`/investments/${id}`),
    create: (data) =>
      request('/investments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/investments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      request(`/investments/${id}`, {
        method: 'DELETE',
      }),
    addTransaction: (investmentId, data) =>
      request(`/investments/${investmentId}/transactions`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    deleteTransaction: (investmentId, transactionId) =>
      request(`/investments/${investmentId}/transactions/${transactionId}`, {
        method: 'DELETE',
      }),
  },

  // Monthly Records
  monthly: {
    getAll: () => request('/monthly-records'),
    getDetail: (year, month) => request(`/monthly-records/${year}/${month}`),
  },

  // Seed / Demo Data
  seed: {
    loadDemoData: () =>
      request('/seed/demo-data', {
        method: 'POST',
      }),
    clearData: () =>
      request('/seed/clear-data', {
        method: 'POST',
      }),
  },
};
