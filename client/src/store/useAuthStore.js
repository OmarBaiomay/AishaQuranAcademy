import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { requestFCMToken } from "../utils/firebaseUtils.js";

export const userAuthStore = create((set) => ({
  authUser: null,
  isAdmin: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // ✅ FIXED: Ensure Token is Sent in Headers
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({
        authUser: res.data,
        isAdmin: res.data.role === "Administrator",
      });
    } catch (error) {
      console.error("Error In CheckAuth:", error);
      set({
        authUser: null,
        isAdmin: false,
      });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success("Account Created Successfully");
      set({ authUser: res.data });
    } catch (error) {
      toast.error("Error In SignUp");
      console.log("Error In SignUp:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logIn: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("Logged In Successfully");

      // ✅ FIXED: Check if the FCM token exists before sending request
      const fcmToken = await requestFCMToken();
      if (fcmToken) {
        try {
          const existingTokensRes = await axiosInstance.get(`/user/${res.data._id}`);
          const existingTokens = existingTokensRes.data.fcmTokens.map((t) => t.token);

          if (!existingTokens.includes(fcmToken)) {
            await axiosInstance.post(`/user/${res.data._id}/fcm-tokens`, {
              device: "Web",
              token: fcmToken,
            });
          }
        } catch (error) {
          console.error("Error adding FCM token:", error);
        }
      }

      set({ authUser: res.data });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      toast.error("Error In LogIn");
      console.log("Error In LogIn:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  LogOut: async () => {
    try {
      const { authUser } = userAuthStore.getState();

      if (authUser) {
        const fcmToken = await requestFCMToken();
        
        // ✅ FIXED: Remove FCM token only if it exists
        if (fcmToken) {
          try {
            await axiosInstance.delete(`/user/${authUser._id}/fcm-tokens/${fcmToken}`);
          } catch (error) {
            console.warn("Error removing FCM token:", error);
          }
        }
      }

      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error("Error In LogOut");
      console.log("Error In LogOut:", error);
    }
  },
}));
