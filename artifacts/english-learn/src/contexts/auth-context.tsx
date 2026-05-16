import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from "@workspace/api-client-react";
import type { AuthUser } from "@workspace/api-client-react";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    try {
      const u = await apiLogin({ username: username.trim(), password: password.trim() });
      setUser(u);
    } catch (e: any) {
      const msg = e?.data?.error ?? e?.message ?? "فشل تسجيل الدخول";
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (username: string, password: string) => {
    setError(null);
    try {
      const u = await apiRegister({ username: username.trim(), password: password.trim() });
      setUser(u);
    } catch (e: any) {
      const msg = e?.data?.error ?? e?.message ?? "فشل إنشاء الحساب";
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
