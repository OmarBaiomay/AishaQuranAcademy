import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

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

    logIn: async (data) => {
        set({
            isLoggingIn: true
        })

        try {
            const res = await axiosInstance.post("/auth/login", data)
            toast.success("Logged In Successfully");
            set({authUser: res.data})
        } catch (error) {
            toast.error("Error In LogIn");
            console.log("Error In LogIn:", error);
        } finally{
            set({
                isLoggingIn: false
            })
        }
    },

    LogOut: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser: null})
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error("Error In LogOut");
            console.log("Error In LogOut:", error);
        }
    }

}));