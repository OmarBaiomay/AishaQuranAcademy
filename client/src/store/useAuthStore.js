import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const userAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({
                authUser: res.data
            })
            
        } catch (error) {
            console.log("Error In CheckAuth:", error);
            set({
                authUser: null
            })
        } finally{
            set({
                isCheckingAuth: false
            })
        }
    },

    signUp: async (data) => {
        
        set({
            isSigningUp: true
        })

        try {
            const res = await axiosInstance.post("/auth/signup", data)
            toast.success("Account Created Successfully");
            set({authUser: res.data})

        } catch (error) {
            toast.error("Error In SignUp");
            console.log("Error In SignUp:", error);
        } finally{
            set({
                isSigningUp: false
            })
        }
    },

}));