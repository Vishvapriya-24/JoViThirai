import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL:API_URL
});

export const getProfile = (userId)=>{
    return API.get(`/profile/${userId}`);
}

export const updateProfile = (userId,formData)=>{
    const token = localStorage.getItem('token');
    return API.put(`/profile/${userId}`,formData,{
        headers:{
            "Content-Type":"multipart/form-data",
            Authorization:`Bearer ${token}`,
        },
    });
}