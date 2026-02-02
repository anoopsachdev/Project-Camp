import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/current-user");
        return res.data.data;
      } catch (err) {
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post("/auth/login", credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["currentUser"]);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
