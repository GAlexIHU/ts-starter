import { api } from "@repo/api/v1";
import { initQueryClient } from "@ts-rest/react-query";

const client = initQueryClient(api, {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseHeaders: {},
});

export const getClient = () => client;
