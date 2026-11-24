import { createContext, useContext, useState } from 'react';
import db from '../data/db.json';

const esCorreoUTP = (correo) => {
  if (typeof correo !== 'string') return false;
  return /^U\d{8}+@utp\.edu\.pe$/i.test(correo.trim());
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = (correo, password) => {
    if (!esCorreoUTP(correo)) {
      return { ok: false, mensaje: 'El correo debe ser institucional (@utp.edu.pe).' };
    }

    const encontrado = db.usuarios.find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase().trim()
    );

    if (!encontrado || encontrado.password !== password) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }

    const { password: _, ...usuarioSinPassword } = encontrado;
    setUsuario(usuarioSinPassword);
    return { ok: true };
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
