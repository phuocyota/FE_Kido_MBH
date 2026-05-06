import api from "./api";

export const faceApi = {
    // 🔐 LOGIN FACE
    login: async (descriptor: number[]) => {
        const res = await api.post(`/face/login`, {
            descriptor,
        });
        return res.data;
    },

    // 📸 REGISTER FACE (cần token)
    register: async (descriptor: number[], name: string) => {
        const res = await api.post(`/face/register`, {
            descriptor,
            name
        });
        return res.data;
    },
};