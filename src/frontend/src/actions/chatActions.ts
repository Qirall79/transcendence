import { Fetcher } from "@/utils/Fetcher";



export const getConversations = async (id: string, resetUser?: any) => {
    try {
        const response = await Fetcher.get(`/api/conversations/${id}`, resetUser);
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}