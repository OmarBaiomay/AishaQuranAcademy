import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { requestFCMToken } from "../utils/firebaseUtils.js";

export const userAuthStore = create((set)=>({
    authUser: null,
    isAdmin: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({
                authUser: res.data,
                isAdmin: res.data.role === "Administrator",
            })
            
        } catch (error) {
            if (error.code === "ERR_BAD_REQUEST"){
                set({
                    authUser: null,
                    isAdmin: false,
                })
            }else{
                console.log("Error In CheckAuth:", error);
                set({
                    authUser: null,
                    isAdmin: false,
                })
            }
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
            isLoggingIn: true,
        });

        try {
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Logged In Successfully");

            // Fetch the FCM token after successful login
            const fcmToken = await requestFCMToken();
            console.log(fcmToken)
            if (fcmToken) {
                // Add the FCM token to the user
                await axiosInstance.post(`/user/${res.data._id}/fcm-tokens`, {
                    device: "Web",
                    token: fcmToken,
                });
            }

            set({ authUser: res.data });
        } catch (error) {
            toast.error("Error In LogIn");
            console.log("Error In LogIn:", error);
        } finally {
            set({
                isLoggingIn: false,
            });
        }
    },

    LogOut: async () => {
        try {
            const { authUser } = userAuthStore.getState();

            // Remove the FCM token before logging out
            if (authUser) {
                const fcmToken = await requestFCMToken();
                if (fcmToken) {
                    await axiosInstance.delete(
                        `/user/${authUser._id}/fcm-tokens/${fcmToken}`
                    );
                }
            }

            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error("Error In LogOut");
            console.log("Error In LogOut:", error);
        }
    },

}));