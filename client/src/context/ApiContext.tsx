"use client";
import React, { createContext, useContext } from "react";
import axios from "axios";

import type { AxiosInstance } from "axios";

const ApiContext = createContext<AxiosInstance | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const api = axios.create({
    baseURL: "http://18.116.43.163/api", // Your Flask server URL
  });

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);
