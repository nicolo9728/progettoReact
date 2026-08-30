import { createContext, useContext, useMemo } from "react";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: "include"
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }


    if (response.status === 204) {
      return {} as T;
    }

    return await response.json() as T;
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
      headers,
      body: JSON.stringify(body),
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