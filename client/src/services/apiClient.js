import {getLogger} from "../utils/loggerStore";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export async function apiClient(
    endpoint,
    {
      method = "GET",
      headers = {},
      body,
      credentials = "include",
    } = {}
) {

  const showLog = getLogger();
  if (showLog) showLog("loading", "Cargando...");

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) {
      const errorMsg = typeof data === "string" ? data : data?.data || "Error desconocido";
      if (showLog) showLog("error", errorMsg);
      throw new Error(errorMsg);
    }

    //if (showLog) showLog("success", "Operación exitosa");
    if (showLog) showLog("endLoading", "")
    return data;
  } catch (err) {
    if (showLog && err instanceof Error) showLog("error", err.message);
    throw err;
  }
}
