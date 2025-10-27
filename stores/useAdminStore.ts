import { create } from 'zustand';
import { adminService } from '@/lib/admin/adminService';
import { Group, Company, User, UserRole, AuditLog } from '@/types/entities';
import { UUID, Role } from '@/types/enums';

interface AdminState {
  // State
  groups: Group[];
  companies: Company[];
  users: User[];
  userRoles: UserRole[];
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string | null;

  // System Stats
  systemStats: {
    totalGroups: number;
    totalCompanies: number;
    totalUsers: number;
    activeUsers: number;
    totalInvestments: number;
    totalCashflows: number;
  } | null;

  // Actions - Groups
  loadGroups: () => Promise<void>;
  createGroup: (data: Omit<Group, 'id' | 'created_at'>) => Promise<Group>;
  updateGroup: (id: UUID, data: Partial<Group>) => Promise<void>;
  deleteGroup: (id: UUID) => Promise<void>;

  // Actions - Companies
  loadCompanies: (groupId?: UUID) => Promise<void>;
  createCompany: (data: Omit<Company, 'id' | 'created_at'>) => Promise<Company>;
  updateCompany: (id: UUID, data: Partial<Company>) => Promise<void>;
  deleteCompany: (id: UUID) => Promise<void>;

  // Actions - Users
  loadUsers: () => Promise<void>;
  createUser: (data: Omit<User, 'id' | 'created_at'>) => Promise<User>;
  updateUser: (id: UUID, data: Partial<User>) => Promise<void>;
  deleteUser: (id: UUID) => Promise<void>;
  resetUserPassword: (id: UUID, newPassword: string) => Promise<void>;

  // Actions - Roles
  loadUserRoles: (userId?: UUID) => Promise<void>;
  assignRole: (userId: UUID, role: Role, groupId: UUID, companyId?: UUID) => Promise<void>;
  revokeRole: (roleId: UUID) => Promise<void>;

  // Actions - Audit Logs
  loadAuditLogs: (filters?: any) => Promise<void>;

  // Actions - System Stats
  loadSystemStats: () => Promise<void>;

  // Helpers
  getGroupById: (id: UUID) => Group | undefined;
  getCompanyById: (id: UUID) => Company | undefined;
  getUserById: (id: UUID) => User | undefined;
  getCompaniesByGroup: (groupId: UUID) => Company[];
  getRolesByUser: (userId: UUID) => UserRole[];
}

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial State
  groups: [],
  companies: [],
  users: [],
  userRoles: [],
  auditLogs: [],
  isLoading: false,
  error: null,
  systemStats: null,

  // ========================
  // GROUP ACTIONS
  // ========================

  loadGroups: async () => {
    try {
      set({ isLoading: true, error: null });
      const groups = await adminService.getGroups();
      set({ groups, isLoading: false });
    } catch (error) {
      console.error('Failed to load groups:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Gruppen',
        isLoading: false,
      });
    }
  },

  createGroup: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const group = await adminService.createGroup(data);
      set((state) => ({
        groups: [...state.groups, group],
        isLoading: false,
      }));
      return group;
    } catch (error) {
      console.error('Failed to create group:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Erstellen der Gruppe',
        isLoading: false,
      });
      throw error;
    }
  },

  updateGroup: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await adminService.updateGroup(id, data);
      if (updated) {
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? updated : g)),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to update group:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren der Gruppe',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteGroup: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.deleteGroup(id);
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete group:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Löschen der Gruppe',
        isLoading: false,
      });
      throw error;
    }
  },

  // ========================
  // COMPANY ACTIONS
  // ========================

  loadCompanies: async (groupId) => {
    try {
      set({ isLoading: true, error: null });
      const companies = await adminService.getCompanies(groupId);
      set({ companies, isLoading: false });
    } catch (error) {
      console.error('Failed to load companies:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Unternehmen',
        isLoading: false,
      });
    }
  },

  createCompany: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const company = await adminService.createCompany(data);
      set((state) => ({
        companies: [...state.companies, company],
        isLoading: false,
      }));
      return company;
    } catch (error) {
      console.error('Failed to create company:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Erstellen des Unternehmens',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await adminService.updateCompany(id, data);
      if (updated) {
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? updated : c)),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to update company:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Unternehmens',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.deleteCompany(id);
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete company:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Löschen des Unternehmens',
        isLoading: false,
      });
      throw error;
    }
  },

  // ========================
  // USER ACTIONS
  // ========================

  loadUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const users = await adminService.getUsers();
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Failed to load users:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Benutzer',
        isLoading: false,
      });
    }
  },

  createUser: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const user = await adminService.createUser(data);
      set((state) => ({
        users: [...state.users, user],
        isLoading: false,
      }));
      return user;
    } catch (error) {
      console.error('Failed to create user:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Erstellen des Benutzers',
        isLoading: false,
      });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await adminService.updateUser(id, data);
      if (updated) {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? updated : u)),
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Benutzers',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Löschen des Benutzers',
        isLoading: false,
      });
      throw error;
    }
  },

  resetUserPassword: async (id, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.resetUserPassword(id, newPassword);
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to reset password:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Zurücksetzen des Passworts',
        isLoading: false,
      });
      throw error;
    }
  },

  // ========================
  // ROLE ACTIONS
  // ========================

  loadUserRoles: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const userRoles = userId
        ? await adminService.getUserRoles(userId)
        : await adminService.getAllUserRoles();
      set({ userRoles, isLoading: false });
    } catch (error) {
      console.error('Failed to load user roles:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Rollen',
        isLoading: false,
      });
    }
  },

  assignRole: async (userId, role, groupId, companyId) => {
    try {
      set({ isLoading: true, error: null });
      const userRole = await adminService.assignRole(userId, role, groupId, companyId);
      set((state) => ({
        userRoles: [...state.userRoles, userRole],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to assign role:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Zuweisen der Rolle',
        isLoading: false,
      });
      throw error;
    }
  },

  revokeRole: async (roleId) => {
    try {
      set({ isLoading: true, error: null });
      await adminService.revokeRole(roleId);
      set((state) => ({
        userRoles: state.userRoles.filter((r) => r.id !== roleId),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to revoke role:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Entziehen der Rolle',
        isLoading: false,
      });
      throw error;
    }
  },

  // ========================
  // AUDIT LOG ACTIONS
  // ========================

  loadAuditLogs: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const auditLogs = await adminService.getAuditLogs(filters);
      set({ auditLogs, isLoading: false });
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Audit-Logs',
        isLoading: false,
      });
    }
  },

  // ========================
  // SYSTEM STATS
  // ========================

  loadSystemStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const systemStats = await adminService.getSystemStats();
      set({ systemStats, isLoading: false });
    } catch (error) {
      console.error('Failed to load system stats:', error);
      set({
        error: error instanceof Error ? error.message : 'Fehler beim Laden der Systemstatistiken',
        isLoading: false,
      });
    }
  },

  // ========================
  // HELPERS
  // ========================

  getGroupById: (id) => {
    return get().groups.find((g) => g.id === id);
  },

  getCompanyById: (id) => {
    return get().companies.find((c) => c.id === id);
  },

  getUserById: (id) => {
    return get().users.find((u) => u.id === id);
  },

  getCompaniesByGroup: (groupId) => {
    return get().companies.filter((c) => c.group_id === groupId);
  },

  getRolesByUser: (userId) => {
    return get().userRoles.filter((r) => r.user_id === userId);
  },
}));
