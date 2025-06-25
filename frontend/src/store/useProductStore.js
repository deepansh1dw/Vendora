import {create} from "zustand";
import axios from "axios";

import toast from "react-hot-toast";

const BASE_URL = 'http://localhost:3000';
export const useProductStore = create((set , get) => ({
     products: [],
     loading: false,
     error: null,

     fetchProducts: async () => {
        set({loading: true});
        try {
           const response = await axios.get(`${BASE_URL}/api/products`);
           set({ products: Array.isArray(response.data) ? response.data : response.data.data || [], error: null }); 
        } catch (err) {
            if(err.status == 429) set({error: "Too many requests, please try again later."});
            else set({error: "Failed to fetch products, please try again later."});
        } finally{
            set({loading: false});
        }
     },

     deleteProduct: async (id) => {
        set({loading: true});
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set((state) => ({
                products: state.products.filter((product) => product.id !== id),
                error: null
            }));
            toast.success("Product deleted successfully.");
        } catch (err) {
            console.log("error in deleting product", err);
            toast.error("Failed to delete product, please try again later.");
        } finally {
            set({loading: false});
        }
     }
}))
