/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                email: data.email,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
                name: data.name
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', "We glad we have you in our society!\nRedirecting you to the main page in a second...");
            window.setTimeout(() => {
                location.assign('/')
            }, 1500);
        }

        console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};


export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if (res.data.status === 'success') {
            showAlert('success', "Your're now logged in successfully!\nRedirecting you to the main page in a second...");
            window.setTimeout(() => {
                location.assign('/')
            }, 1500);
        }

        console.log(res);
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if (res.data.status = 'success') location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error while logging out! Try again.')
    }
}