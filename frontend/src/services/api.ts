import axios from 'axios';
import { parseCookies } from 'nookies';

const { 'nextAuth.token': token } = parseCookies();

export const api = axios.create({
    baseURL: 'http://localhost:3333'
});

if (token) {
    api.defaults.headers['authorization'] = `Bearer ${token}`;
}