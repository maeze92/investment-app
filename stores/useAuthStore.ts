import { create } from 'zustand';
import { User, UserRole } from '@/types/entities';
import { Role, UUID, Permission } from '@/types/enums';
import { dataAdapter } from '@/lib/storage/DataAdapter';
import { storageService } from '@/lib/storage/LocalStorageService';
import { hasPermission, isAdminRole } from '@/lib/admin/permissions';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  userRoles: UserRole[];
  selectedRole: UserRole | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  selectRole: (roleId: UUID) => void;
  initialize: () => Promise<void>;
  checkAuth: () => Promise<boolean>;

  // Helpers
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  canAccessCompany: (companyId: UUID) => boolean;
  getCurrentCompanyId: () => UUID | null;
  getGroupId: () => UUID | null;
  hasPermission: (permission: Permission) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial State
  user: null,
  token: null,
  userRoles: [],
  selectedRole: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize - Load user from storage
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Initialize storage service
      await storageService.initialize();

      // Get current user from database
      const db = storageService.getDatabase();
      const user = db.currentUser;
      const token = db.authToken;

      if (user && token) {
        // Load user roles
        const userRoles = db.userRoles.filter((ur) => ur.user_id === user.id);

        set({
          user,
          token,
          userRoles,
          selectedRole: userRoles[0] || null,
          isInitialized: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          userRoles: [],
          selectedRole: null,
          isInitialized: true,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({
        error: 'Failed to initialize authentication',
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Attempt login
      const { user, token } = await dataAdapter.login(email, password);

      // Load user roles
      const db = storageService.getDatabase();
      const userRoles = db.userRoles.filter((ur) => ur.user_id === user.id);

      if (userRoles.length === 0) {
        throw new Error('Keine Rollen zugewiesen. Bitte kontaktieren Sie den Administrator.');
      }

      set({
        user,
        token,
        userRoles,
        selectedRole: userRoles[0],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Login failed:', error);

      // Map error messages to user-friendly German messages
      let errorMessage = 'Anmeldung fehlgeschlagen';

      if (error instanceof Error) {
        if (error.message === 'NO_DATA_FOUND') {
          errorMessage = 'Keine Benutzerdaten gefunden. Bitte generieren Sie zuerst Mock-Daten.';
        } else if (error.message === 'INVALID_CREDENTIALS') {
          errorMessage = 'Ungültige E-Mail oder Passwort.';
        } else if (error.message.includes('No users found')) {
          errorMessage = 'Keine Benutzerdaten gefunden. Bitte generieren Sie zuerst Mock-Daten.';
        } else {
          errorMessage = error.message;
        }
      }

      set({
        user: null,
        token: null,
        userRoles: [],
        selectedRole: null,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      set({ isLoading: true, error: null });

      await dataAdapter.logout();

      set({
        user: null,
        token: null,
        userRoles: [],
        selectedRole: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  },

  // Select Role (for multi-role users)
  selectRole: (roleId: UUID) => {
    const { userRoles } = get();
    const role = userRoles.find((r) => r.id === roleId);

    if (role) {
      set({ selectedRole: role });
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    const { user, token, isInitialized } = get();

    if (!isInitialized) {
      await get().initialize();
      return !!get().user && !!get().token;
    }

    return !!user && !!token;
  },

  // Check if user has specific role
  hasRole: (role: Role) => {
    const { userRoles } = get();
    return userRoles.some((ur) => ur.role === role);
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles: Role[]) => {
    const { userRoles } = get();
    return userRoles.some((ur) => roles.includes(ur.role));
  },

  // Check if user can access a specific company
  canAccessCompany: (companyId: UUID) => {
    const { selectedRole, userRoles } = get();

    // Group-level roles can access all companies
    const hasGroupRole = userRoles.some((ur) => !ur.company_id);
    if (hasGroupRole) return true;

    // Company-level roles can only access their company
    if (selectedRole?.company_id === companyId) return true;

    return false;
  },

  // Get current company ID (if company-level role)
  getCurrentCompanyId: () => {
    const { selectedRole } = get();
    return selectedRole?.company_id || null;
  },

  // Get group ID
  getGroupId: () => {
    const { selectedRole } = get();
    return selectedRole?.group_id || null;
  },

  // Check if user has a specific permission
  hasPermission: (permission: Permission) => {
    const { userRoles } = get();
    const roles = userRoles.map((ur) => ur.role);
    return hasPermission(roles, permission);
  },

  // Check if user is an admin
  isAdmin: () => {
    const { userRoles } = get();
    return userRoles.some((ur) => isAdminRole(ur.role));
  },
}));
