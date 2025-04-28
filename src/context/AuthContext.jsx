import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // ❌ Removed 'User'
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  user: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
