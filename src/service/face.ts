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
    register: async (
        data: {
            name: string;
            descriptors: number[][];
        }
    ) => {

        const res = await api.post(
            `/face/register`,
            data,
        );

        return res.data;
    },
};