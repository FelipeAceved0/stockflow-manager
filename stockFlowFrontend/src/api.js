import axios from 'axios';

// La URL apunta al puerto donde está ejecutándose tu API en .NET
const API = axios.create({
  baseURL: 'http://localhost:5048/api',
});

export const getProducts = () => API.get('/products');
export const createProduct = (product) => API.post('/products', product);
export const updateProduct = (id, product) => API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export default API;
export const getLowStockProducts = () => API.get('/products/low-stock');
export const createMovement = (movement) => API.post('/movements', movement);
export const getMovements = () => API.get('/movements');
