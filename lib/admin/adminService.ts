import { dataAdapter } from '@/lib/storage/DataAdapter';
import { storageService } from '@/lib/storage/LocalStorageService';
import { generateUUID } from '@/lib/utils';
import {
  Group,
  Company,
  User,
  UserRole,
  AuditLog,
} from '@/types/entities';
import { UUID, Role } from '@/types/enums';

/**
 * Admin Service - High-level operations for system administration
 */
export class AdminService {
  // ========================
  // GROUP MANAGEMENT
  // ========================

  async createGroup(data: Omit<Group, 'id' | 'created_at'>): Promise<Group> {
    const group: Group = {
      id: generateUUID(),
      ...data,
      created_at: new Date(),
    };

    await dataAdapter.create<Group>('groups', group);

    // Log audit
    await this.logAudit('create_group', 'group', group.id, null, group);

    return group;
  }

  async updateGroup(id: UUID, data: Partial<Group>): Promise<Group | null> {
    const oldGroup = await dataAdapter.read<Group>('groups', id);
    const updatedGroup = await dataAdapter.update<Group>('groups', id, data);

    if (updatedGroup) {
      await this.logAudit('update_group', 'group', id, oldGroup, updatedGroup);
    }

    return updatedGroup;
  }

  async deleteGroup(id: UUID): Promise<boolean> {
    // Check if group has companies
    const companies = await dataAdapter.query<Company>('companies', {
      where: [{ field: 'group_id', operator: '=', value: id }],
    });

    if (companies.length > 0) {
      throw new Error('Gruppe kann nicht gelöscht werden, da noch Unternehmen zugeordnet sind.');
    }

    const group = await dataAdapter.read<Group>('groups', id);
    const deleted = await dataAdapter.delete('groups', id);

    if (deleted && group) {
      await this.logAudit('delete_group', 'group', id, group, null);
    }

    return deleted;
  }

  async getGroups(): Promise<Group[]> {
    return await dataAdapter.query<Group>('groups');
  }

  async getGroup(id: UUID): Promise<Group | null> {
    return await dataAdapter.read<Group>('groups', id);
  }

  // ========================
  // COMPANY MANAGEMENT
  // ========================

  async createCompany(data: Omit<Company, 'id' | 'created_at'>): Promise<Company> {
    // Check if company code is unique
    const existing = await dataAdapter.query<Company>('companies', {
      where: [{ field: 'company_code', operator: '=', value: data.company_code }],
    });

    if (existing.length > 0) {
      throw new Error('Company Code ist bereits vergeben.');
    }

    const company: Company = {
      id: generateUUID(),
      ...data,
      created_at: new Date(),
    };

    await dataAdapter.create<Company>('companies', company);

    await this.logAudit('create_company', 'company', company.id, null, company);

    return company;
  }

  async updateCompany(id: UUID, data: Partial<Company>): Promise<Company | null> {
    // If company_code is being changed, check uniqueness
    if (data.company_code) {
      const existing = await dataAdapter.query<Company>('companies', {
        where: [{ field: 'company_code', operator: '=', value: data.company_code }],
      });

      if (existing.length > 0 && existing[0].id !== id) {
        throw new Error('Company Code ist bereits vergeben.');
      }
    }

    const oldCompany = await dataAdapter.read<Company>('companies', id);
    const updatedCompany = await dataAdapter.update<Company>('companies', id, data);

    if (updatedCompany) {
      await this.logAudit('update_company', 'company', id, oldCompany, updatedCompany);
    }

    return updatedCompany;
  }

  async deleteCompany(id: UUID): Promise<boolean> {
    // Check if company has investments
    const investments = await dataAdapter.query('investments', {
      where: [{ field: 'company_id', operator: '=', value: id }],
    });

    if (investments.length > 0) {
      throw new Error('Unternehmen kann nicht gelöscht werden, da noch Investitionen vorhanden sind.');
    }

    const company = await dataAdapter.read<Company>('companies', id);
    const deleted = await dataAdapter.delete('companies', id);

    if (deleted && company) {
      await this.logAudit('delete_company', 'company', id, company, null);
    }

    return deleted;
  }

  async getCompanies(groupId?: UUID): Promise<Company[]> {
    if (groupId) {
      return await dataAdapter.query<Company>('companies', {
        where: [{ field: 'group_id', operator: '=', value: groupId }],
      });
    }
    return await dataAdapter.query<Company>('companies');
  }

  async getCompany(id: UUID): Promise<Company | null> {
    return await dataAdapter.read<Company>('companies', id);
  }

  // ========================
  // USER MANAGEMENT
  // ========================

  async createUser(data: Omit<User, 'id' | 'created_at'>): Promise<User> {
    // Check if email is unique
    const existing = await dataAdapter.query<User>('users', {
      where: [{ field: 'email', operator: '=', value: data.email }],
    });

    if (existing.length > 0) {
      throw new Error('E-Mail-Adresse ist bereits vergeben.');
    }

    const user: User = {
      id: generateUUID(),
      ...data,
      created_at: new Date(),
    };

    await dataAdapter.create<User>('users', user);

    await this.logAudit('create_user', 'user', user.id, null, user);

    return user;
  }

  async updateUser(id: UUID, data: Partial<User>): Promise<User | null> {
    // If email is being changed, check uniqueness
    if (data.email) {
      const existing = await dataAdapter.query<User>('users', {
        where: [{ field: 'email', operator: '=', value: data.email }],
      });

      if (existing.length > 0 && existing[0].id !== id) {
        throw new Error('E-Mail-Adresse ist bereits vergeben.');
      }
    }

    const oldUser = await dataAdapter.read<User>('users', id);
    const updatedUser = await dataAdapter.update<User>('users', id, data);

    if (updatedUser) {
      await this.logAudit('update_user', 'user', id, oldUser, updatedUser);
    }

    return updatedUser;
  }

  async deleteUser(id: UUID): Promise<boolean> {
    // Check if this is the last admin
    const adminRoles = await dataAdapter.query<UserRole>('userRoles', {
      where: [{ field: 'role', operator: '=', value: 'system_admin' }],
    });

    const userAdminRoles = adminRoles.filter((r) => r.user_id === id);

    if (userAdminRoles.length > 0 && adminRoles.length === userAdminRoles.length) {
      throw new Error('Der letzte Administrator kann nicht gelöscht werden.');
    }

    // Delete user roles first
    const userRoles = await dataAdapter.query<UserRole>('userRoles', {
      where: [{ field: 'user_id', operator: '=', value: id }],
    });

    for (const role of userRoles) {
      await dataAdapter.delete('userRoles', role.id);
    }

    const user = await dataAdapter.read<User>('users', id);
    const deleted = await dataAdapter.delete('users', id);

    if (deleted && user) {
      await this.logAudit('delete_user', 'user', id, user, null);
    }

    return deleted;
  }

  async getUsers(): Promise<User[]> {
    return await dataAdapter.query<User>('users');
  }

  async getUser(id: UUID): Promise<User | null> {
    return await dataAdapter.read<User>('users', id);
  }

  async resetUserPassword(id: UUID, newPassword: string): Promise<boolean> {
    const updated = await this.updateUser(id, { password_hash: newPassword });

    if (updated) {
      await this.logAudit('reset_password', 'user', id, null, { password_reset: true });
      return true;
    }

    return false;
  }

  // ========================
  // ROLE MANAGEMENT
  // ========================

  async assignRole(
    userId: UUID,
    role: Role,
    groupId: UUID,
    companyId?: UUID,
    assignedBy?: UUID
  ): Promise<UserRole> {
    // Check if role already exists
    const existing = await dataAdapter.query<UserRole>('userRoles', {
      where: [
        { field: 'user_id', operator: '=', value: userId },
        { field: 'role', operator: '=', value: role },
        { field: 'group_id', operator: '=', value: groupId },
      ],
    });

    const existingWithCompany = existing.filter((r) => r.company_id === companyId);

    if (existingWithCompany.length > 0) {
      throw new Error('Diese Rolle ist dem Benutzer bereits zugewiesen.');
    }

    const userRole: UserRole = {
      id: generateUUID(),
      user_id: userId,
      company_id: companyId,
      group_id: groupId,
      role,
      assigned_at: new Date(),
      assigned_by: assignedBy || userId,
    };

    await dataAdapter.create<UserRole>('userRoles', userRole);

    await this.logAudit('assign_role', 'user_role', userRole.id, null, userRole);

    return userRole;
  }

  async revokeRole(roleId: UUID): Promise<boolean> {
    const role = await dataAdapter.read<UserRole>('userRoles', roleId);

    if (!role) {
      return false;
    }

    // Check if this is the last admin role
    if (role.role === 'system_admin') {
      const adminRoles = await dataAdapter.query<UserRole>('userRoles', {
        where: [{ field: 'role', operator: '=', value: 'system_admin' }],
      });

      if (adminRoles.length === 1) {
        throw new Error('Die letzte Administrator-Rolle kann nicht entzogen werden.');
      }
    }

    const deleted = await dataAdapter.delete('userRoles', roleId);

    if (deleted && role) {
      await this.logAudit('revoke_role', 'user_role', roleId, role, null);
    }

    return deleted;
  }

  async getUserRoles(userId: UUID): Promise<UserRole[]> {
    return await dataAdapter.query<UserRole>('userRoles', {
      where: [{ field: 'user_id', operator: '=', value: userId }],
    });
  }

  async getAllUserRoles(): Promise<UserRole[]> {
    return await dataAdapter.query<UserRole>('userRoles');
  }

  // ========================
  // AUDIT LOGS
  // ========================

  async getAuditLogs(filters?: {
    userId?: UUID;
    entityType?: string;
    entityId?: UUID;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<AuditLog[]> {
    const where: any[] = [];

    if (filters?.userId) {
      where.push({ field: 'user_id', operator: '=', value: filters.userId });
    }

    if (filters?.entityType) {
      where.push({ field: 'entity_type', operator: '=', value: filters.entityType });
    }

    if (filters?.entityId) {
      where.push({ field: 'entity_id', operator: '=', value: filters.entityId });
    }

    if (filters?.action) {
      where.push({ field: 'action', operator: '=', value: filters.action });
    }

    return await dataAdapter.query<AuditLog>('auditLogs', {
      where: where.length > 0 ? where : undefined,
      orderBy: { field: 'created_at', direction: 'desc' },
      limit: filters?.limit,
    });
  }

  private async logAudit(
    action: string,
    entityType: string,
    entityId: UUID,
    oldValues: any,
    newValues: any
  ): Promise<void> {
    const currentUser = await dataAdapter.getCurrentUser();

    if (!currentUser) {
      return;
    }

    const auditLog: AuditLog = {
      id: generateUUID(),
      user_id: currentUser.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      created_at: new Date(),
    };

    await dataAdapter.create<AuditLog>('auditLogs', auditLog);
  }

  // ========================
  // SYSTEM STATISTICS
  // ========================

  async getSystemStats(): Promise<{
    totalGroups: number;
    totalCompanies: number;
    totalUsers: number;
    activeUsers: number;
    totalInvestments: number;
    totalCashflows: number;
  }> {
    const db = storageService.getDatabase();

    const activeUsers = db.users.filter((u) => {
      const daysSinceLogin = u.last_login
        ? (new Date().getTime() - new Date(u.last_login).getTime()) / (1000 * 60 * 60 * 24)
        : 999;
      return daysSinceLogin <= 30;
    }).length;

    return {
      totalGroups: db.groups.length,
      totalCompanies: db.companies.length,
      totalUsers: db.users.length,
      activeUsers,
      totalInvestments: db.investments.length,
      totalCashflows: db.cashflows.length,
    };
  }
}

// Export singleton instance
export const adminService = new AdminService();
