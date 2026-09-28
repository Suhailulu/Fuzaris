import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_ROLES = [
  { id: 'admin', title: 'Command Center', initialRoute: '/dashboard' },
  { id: 'dev1', title: 'Expedition Commander', initialRoute: '/expeditions' },
  { id: 'dev2', title: 'Logistics Officer', initialRoute: '/cargo' },
  { id: 'dev3', title: 'Asset Manager', initialRoute: '/inventory' },
  { id: 'dev4', title: 'Personnel Director', initialRoute: '/personnel' },
  { id: 'dev5', title: 'Emergency Response', initialRoute: '/emergency' },
];

const DEMO_USERS: any[] = [];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('polar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [organization, setOrganization] = useState(() => {
    const saved = localStorage.getItem('polar_org');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('polar_users_db');
    return saved ? JSON.parse(saved) : DEMO_USERS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('polar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('polar_user');
    }
  }, [user]);

  useEffect(() => {
    if (organization) {
      localStorage.setItem('polar_org', JSON.stringify(organization));
    } else {
      localStorage.removeItem('polar_org');
    }
  }, [organization]);

  useEffect(() => {
    localStorage.setItem('polar_users_db', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const role = DEFAULT_ROLES.find(r => r.id === foundUser.roleId) || DEFAULT_ROLES[0];
      setUser({ ...foundUser, title: role.title, initialRoute: role.initialRoute });
      setOrganization({ id: 'org-123', name: 'Polar Operations', code: 'POL' });
      return true;
    }
    return false;
  };

  const register = (name, email, password, roleId) => {
    if (users.find(u => u.email === email)) {
      return false; // Email exists
    }
    const newUser = { id: Date.now().toString(), name, email, password, roleId };
    setUsers([...users, newUser]);
    
    const role = DEFAULT_ROLES.find(r => r.id === roleId) || DEFAULT_ROLES[0];
    setUser({ ...newUser, title: role.title, initialRoute: role.initialRoute });
    setOrganization({ id: 'org-123', name: 'Polar Operations', code: 'POL' });
    return true;
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider value={{ user, organization, login, register, logout, ROLES: DEFAULT_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
