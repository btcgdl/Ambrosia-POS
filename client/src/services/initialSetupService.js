import { apiClient } from "./apiClient";

export async function getInitialSetupStatus() {
  return await apiClient("/initial-setup", {
    method: "GET",
    silentAuth: true,
    skipRefresh: true,
  });
}

export async function submitInitialSetup(payload) {
  return await apiClient("/initial-setup", {
    method: "POST",
    body: payload,
    silentAuth: true,
    skipRefresh: true,
  });
}
