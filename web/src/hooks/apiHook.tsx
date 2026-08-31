import { createContext, useContext, useMemo } from "react";

class ApiService {
  private baseUrl: string;

  constructor() {
    // Rimuove l'eventuale slash finale per evitare doppi slash nell'URL
    this.baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Gestisce sia endpoint che iniziano con '/' sia senza
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
      },
      credentials: 'include',
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const res = await response.json();
        errorMessage = res.message || res.error || errorMessage;
      } catch {
        // Fallback se il server non risponde con un JSON valido nell'errore
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  public async get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  public async post<T>(endpoint: string, body: unknown, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  public async postMultipart<T>(endpoint: string, body: FormData, headers?: HeadersInit): Promise<T> {
    // Nota: NON viene impostato 'Content-Type' per permettere a fetch di inserire il boundary multipart
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: body,
    });
  }

  public async delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

const apiService = new ApiService()

const ApiContext = createContext<ApiService>(apiService);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiService = useMemo(() => new ApiService(), []);

  return (
    <ApiContext.Provider value={apiService}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiEndpoint = (): ApiService => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApiEndpoint deve essere utilizzato all\'interno di un <ApiProvider>');
  }

  return context;
};