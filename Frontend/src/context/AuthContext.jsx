import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContextObject";
import {
  clearAuthTokens,
  getApiErrorMessage,
  getStoredTokens,
  saveAuthTokens,
} from "../services/apiClient";
import { authService } from "../services/authService";

function isStudent(user) {
  return user?.role?.toLowerCase() === "student";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => {
    const tokens = getStoredTokens();
    return Boolean(tokens.accessToken || tokens.refreshToken);
  });
  const [sessionError, setSessionError] = useState("");

  const signInWithResponse = useCallback((result, rememberMe) => {
    if (!result?.tokens?.accessToken || !result?.tokens?.refreshToken) {
      throw new Error("The server returned an invalid authentication response.");
    }
    if (!isStudent(result.user)) {
      clearAuthTokens();
      throw new Error("Only student accounts can access this application.");
    }
    saveAuthTokens(result.tokens, rememberMe);
    setUser(result.user);
    setSessionError("");
    return result.user;
  }, []);

  const login = useCallback(async (credentials, rememberMe) => {
    const result = await authService.login(credentials);
    return signInWithResponse(result, rememberMe);
  }, [signInWithResponse]);

  const register = useCallback(async (details) => {
    const result = await authService.register(details);
    return signInWithResponse(result, true);
  }, [signInWithResponse]);

  const logout = useCallback(async (revokeServer = true) => {
    try {
      if (revokeServer && getStoredTokens().accessToken) {
        await authService.logout();
      }
    } finally {
      clearAuthTokens();
      setUser(null);
      setSessionError("");
    }
  }, []);

  const loadSession = useCallback(async () => {
    if (!getStoredTokens().accessToken && !getStoredTokens().refreshToken) {
      setUser(null);
      setSessionError("");
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      if (!isStudent(currentUser)) {
        clearAuthTokens();
        setUser(null);
        setSessionError("Only student accounts can access this application.");
        return;
      }
      setUser(currentUser);
      setSessionError("");
    } catch (error) {
      setUser(null);
      setSessionError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    await loadSession();
  }, [loadSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setSessionError("Your session has expired. Please sign in again.");
    };
    window.addEventListener("disha:unauthorized", handleUnauthorized);
    Promise.resolve().then(loadSession);
    return () => {
      window.removeEventListener("disha:unauthorized", handleUnauthorized);
    };
  }, [loadSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      sessionError,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isLoading, sessionError, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
