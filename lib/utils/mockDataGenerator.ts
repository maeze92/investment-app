import { faker } from '@faker-js/faker/locale/de';
import {
  Group,
  Company,
  User,
  UserRole,
  Investment,
  Cashflow,
  InvestmentApproval,
  Notification,
  LocalDatabase,
} from '@/types/entities';
import {
  UUID,
  Role,
  FinancingType,
  InvestmentStatus,
  CashflowStatus,
  InvestmentCategory,
} from '@/types/enums';
import { generateUUID } from '@/lib/utils';
import { addMonths, addDays } from 'date-fns';

// Set seed for reproducible data
faker.seed(123);

export class MockDataGenerator {
  /**
   * Generate Groups
   */
  generateGroups(count: number = 2): Group[] {
    const groups: Group[] = [];

    for (let i = 0; i < count; i++) {
      groups.push({
        id: generateUUID(),
        name: `${faker.company.name()} Gruppe`,
        created_at: faker.date.past({ years: 3 }),
        settings: {
          fiscal_year_start: 1, // January
          currency: 'EUR',
          notification_settings: {
            email_enabled: true,
            in_app_enabled: true,
            payment_reminder_days: 7,
            monthly_report_deadline_day: 5,
          },
        },
      });
    }

    return groups;
  }

  /**
   * Generate Companies
   */
  generateCompanies(groupIds: UUID[], count: number = 5): Company[] {
    const companies: Company[] = [];
    const companyTypes = ['GmbH', 'AG', 'KG', 'SE'];

    for (let i = 0; i < count; i++) {
      const type = faker.helpers.arrayElement(companyTypes);
      companies.push({
        id: generateUUID(),
        group_id: faker.helpers.arrayElement(groupIds),
        name: `${faker.company.name()} ${type}`,
        company_code: faker.string.alphanumeric({ length: 4, casing: 'upper' }),
        is_active: faker.datatype.boolean({ probability: 0.9 }),
        created_at: faker.date.past({ years: 2 }),
      });
    }

    return companies;
  }

  /**
   * Generate Users
   */
  generateUsers(count: number = 20): User[] {
    const users: User[] = [];

    // Add demo users for each role
    const demoRoles: Array<{ email: string; name: string }> = [
      { email: 'admin@demo.de', name: 'System Administrator' },
      { email: 'vr@demo.de', name: 'Dr. Anna Schmidt (VR)' },
      { email: 'cfo@demo.de', name: 'Thomas Müller (CFO)' },
      { email: 'gf@demo.de', name: 'Sarah Weber (GF)' },
      { email: 'cm@demo.de', name: 'Michael Bauer (CM)' },
      { email: 'buchhaltung@demo.de', name: 'Lisa Fischer (Buchhaltung)' },
    ];

    demoRoles.forEach((demo) => {
      users.push({
        id: generateUUID(),
        email: demo.email,
        password_hash: 'demo', // Simple password for testing
        name: demo.name,
        avatar: faker.image.avatar(),
        created_at: faker.date.past({ years: 1 }),
        last_login: faker.date.recent({ days: 7 }),
      });
    });

    // Add random users
    for (let i = 0; i < count - demoRoles.length; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        id: generateUUID(),
        email: faker.internet.email({ firstName, lastName }),
        password_hash: faker.string.alphanumeric(32),
        name: `${firstName} ${lastName}`,
        avatar: faker.image.avatar(),
        created_at: faker.date.past({ years: 2 }),
        last_login: faker.date.recent({ days: 30 }),
      });
    }

    return users;
  }

  /**
   * Generate User Roles
   */
  generateUserRoles(users: User[], groups: Group[], companies: Company[]): UserRole[] {
    const userRoles: UserRole[] = [];
    const roles: Role[] = [
      'vr_approval',
      'vr_viewer',
      'cfo',
      'geschaeftsfuehrer',
      'cashflow_manager',
      'buchhaltung',
    ];

    // Assign demo users their specific roles
    const demoUserMap: Record<string, Role> = {
      'admin@demo.de': 'system_admin',
      'vr@demo.de': 'vr_approval',
      'cfo@demo.de': 'cfo',
      'gf@demo.de': 'geschaeftsfuehrer',
      'cm@demo.de': 'cashflow_manager',
      'buchhaltung@demo.de': 'buchhaltung',
    };

    users.forEach((user) => {
      const group = faker.helpers.arrayElement(groups);

      if (demoUserMap[user.email]) {
        // Assign specific role to demo user
        const role = demoUserMap[user.email];

        // System admin is group-level only
        if (role === 'system_admin') {
          userRoles.push({
            id: generateUUID(),
            user_id: user.id,
            company_id: undefined,
            group_id: group.id,
            role,
            assigned_at: faker.date.past({ years: 1 }),
            assigned_by: user.id, // Self-assigned for first admin
          });
        } else {
          const isCompanyLevel = ['geschaeftsfuehrer', 'cashflow_manager', 'buchhaltung'].includes(
            role
          );

          userRoles.push({
            id: generateUUID(),
            user_id: user.id,
            company_id: isCompanyLevel
              ? companies.find((c) => c.group_id === group.id)?.id
              : undefined,
            group_id: group.id,
            role,
            assigned_at: faker.date.past({ years: 1 }),
            assigned_by: users[0].id, // First user assigned everyone
          });
        }
      } else {
        // Random role for other users
        const role = faker.helpers.arrayElement(roles);
        const isCompanyLevel = ['geschaeftsfuehrer', 'cashflow_manager', 'buchhaltung'].includes(
          role
        );

        userRoles.push({
          id: generateUUID(),
          user_id: user.id,
          company_id: isCompanyLevel
            ? companies.find((c) => c.group_id === group.id)?.id
            : undefined,
          group_id: group.id,
          role,
          assigned_at: faker.date.past({ years: 1 }),
          assigned_by: users[0].id,
        });
      }
    });

    return userRoles;
  }

  /**
   * Generate Investments
   */
  generateInvestments(
    companyIds: UUID[],
    userIds: UUID[],
    count: number = 50
  ): Investment[] {
    const investments: Investment[] = [];
    const categories: InvestmentCategory[] = [
      'fahrzeuge',
      'it',
      'maschinen',
      'immobilien',
      'sonstige',
    ];
    const financingTypes: FinancingType[] = ['kauf', 'leasing', 'ratenzahlung', 'miete'];
    const statuses: InvestmentStatus[] = [
      'entwurf',
      'zur_genehmigung',
      'genehmigt',
      'abgelehnt',
      'aktiv',
    ];

    for (let i = 0; i < count; i++) {
      const category = faker.helpers.arrayElement(categories);
      const financingType = faker.helpers.arrayElement(financingTypes);
      const status = faker.helpers.arrayElement(statuses);
      const totalAmount = faker.number.int({ min: 5000, max: 500000 });
      const startDate = faker.date.between({
        from: new Date(2026, 0, 1),
        to: new Date(2026, 11, 31),
      });

      const investment: Investment = {
        id: generateUUID(),
        company_id: faker.helpers.arrayElement(companyIds),
        name: this.getInvestmentName(category),
        description: faker.lorem.sentence(),
        category,
        total_amount: totalAmount,
        financing_type: financingType,
        status,
        created_by: faker.helpers.arrayElement(userIds),
        created_at: faker.date.recent({ days: 90 }),
        submitted_at: status !== 'entwurf' ? faker.date.recent({ days: 60 }) : undefined,
        start_date: startDate,
        metadata: {
          vendor: faker.company.name(),
          contract_number: faker.string.alphanumeric(10),
          internal_reference: `INV-${faker.string.alphanumeric(6)}`,
        },
        payment_structure: this.generatePaymentStructure(financingType, totalAmount, startDate),
      };

      investments.push(investment);
    }

    return investments;
  }

  /**
   * Generate Investment Name based on category
   */
  private getInvestmentName(category: InvestmentCategory): string {
    const names: Record<InvestmentCategory, () => string> = {
      fahrzeuge: () => `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
      it: () =>
        faker.helpers.arrayElement([
          'Server Upgrade',
          'Laptop Flotte',
          'Cloud Migration',
          'ERP System',
          'CRM Software',
        ]),
      maschinen: () =>
        faker.helpers.arrayElement([
          'Produktionsmaschine',
          'CNC Fräse',
          'Industrieroboter',
          'Laserschneidanlage',
          'Verpackungsmaschine',
        ]),
      immobilien: () =>
        faker.helpers.arrayElement([
          'Bürogebäude Erweiterung',
          'Lagerhalle',
          'Produktionshalle',
          'Firmensitz',
        ]),
      sonstige: () =>
        faker.helpers.arrayElement([
          'Büroausstattung',
          'Sicherheitssystem',
          'Klimaanlage',
          'Photovoltaik',
        ]),
    };

    return names[category]();
  }

  /**
   * Generate Payment Structure based on financing type
   */
  private generatePaymentStructure(
    type: FinancingType,
    amount: number,
    startDate: Date
  ): Investment['payment_structure'] {
    switch (type) {
      case 'kauf':
        return {
          einmalzahlung: {
            date: startDate,
            amount,
          },
        };

      case 'ratenzahlung': {
        const anzahlung = Math.round(amount * 0.2);
        const remaining = amount - anzahlung;
        const numberOfRates = faker.helpers.arrayElement([12, 24, 36, 48]);
        const rateAmount = Math.round(remaining / numberOfRates);

        return {
          ratenzahlung: {
            anzahlung,
            anzahlung_date: startDate,
            number_of_rates: numberOfRates,
            rate_amount: rateAmount,
            rate_interval: 'monthly',
            first_rate_date: addMonths(startDate, 1),
          },
        };
      }

      case 'leasing': {
        const durationMonths = faker.helpers.arrayElement([24, 36, 48, 60]);
        const monthlyRate = Math.round(amount / durationMonths);
        const anzahlung = faker.datatype.boolean() ? Math.round(amount * 0.1) : undefined;

        return {
          leasing: {
            anzahlung,
            anzahlung_date: anzahlung ? startDate : undefined,
            monthly_rate: monthlyRate,
            duration_months: durationMonths,
            start_month: startDate,
            purchase_option: faker.datatype.boolean(),
            auto_confirm: true,
          },
        };
      }

      case 'miete':
        return {
          leasing: {
            monthly_rate: Math.round(amount / 12),
            duration_months: 12,
            start_month: startDate,
            purchase_option: false,
            auto_confirm: true,
          },
        };

      default:
        return {};
    }
  }

  /**
   * Generate Cashflows for investments
   */
  generateCashflows(investments: Investment[]): Cashflow[] {
    const cashflows: Cashflow[] = [];

    investments.forEach((investment) => {
      const generated = this.generateCashflowsForInvestment(investment);
      cashflows.push(...generated);
    });

    return cashflows;
  }

  /**
   * Generate Cashflows for a single investment
   */
  private generateCashflowsForInvestment(investment: Investment): Cashflow[] {
    const cashflows: Cashflow[] = [];
    const { payment_structure, financing_type, start_date } = investment;

    if (financing_type === 'kauf' && payment_structure.einmalzahlung) {
      const { date, amount, custom_due_date } = payment_structure.einmalzahlung;
      const dueDate = new Date(date);

      cashflows.push({
        id: generateUUID(),
        investment_id: investment.id,
        due_date: dueDate,
        custom_due_date: custom_due_date ? new Date(custom_due_date) : undefined,
        amount,
        type: 'einmalzahlung',
        month: dueDate.getMonth() + 1,
        year: dueDate.getFullYear(),
        status: this.getCashflowStatus(dueDate, investment.status),
        auto_confirmed: false,
      });
    }

    if (financing_type === 'ratenzahlung' && payment_structure.ratenzahlung) {
      const rp = payment_structure.ratenzahlung;

      // Anzahlung
      if (rp.anzahlung && rp.anzahlung_date) {
        const dueDate = new Date(rp.anzahlung_date);
        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          custom_due_date: rp.anzahlung_custom_due ? new Date(rp.anzahlung_custom_due) : undefined,
          amount: rp.anzahlung,
          type: 'anzahlung',
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: false,
        });
      }

      // Raten
      for (let i = 0; i < rp.number_of_rates; i++) {
        const dueDate = addMonths(new Date(rp.first_rate_date), i);
        const customDue = rp.rates_custom_due_dates?.[i];

        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          custom_due_date: customDue ? new Date(customDue) : undefined,
          amount: rp.rate_amount,
          type: 'rate',
          period_number: i + 1,
          total_periods: rp.number_of_rates,
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: false,
        });
      }

      // Schlussrate
      if (rp.schlussrate && rp.schlussrate_date) {
        const dueDate = new Date(rp.schlussrate_date);
        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          custom_due_date: rp.schlussrate_custom_due
            ? new Date(rp.schlussrate_custom_due)
            : undefined,
          amount: rp.schlussrate,
          type: 'schlussrate',
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: false,
        });
      }
    }

    if (
      (financing_type === 'leasing' || financing_type === 'miete') &&
      payment_structure.leasing
    ) {
      const lp = payment_structure.leasing;

      // Anzahlung
      if (lp.anzahlung && lp.anzahlung_date) {
        const dueDate = new Date(lp.anzahlung_date);
        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          amount: lp.anzahlung,
          type: 'anzahlung',
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: lp.auto_confirm,
        });
      }

      // Monatliche Raten
      for (let i = 0; i < lp.duration_months; i++) {
        const dueDate = addMonths(new Date(lp.start_month), i);

        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          amount: lp.monthly_rate,
          type: 'rate',
          period_number: i + 1,
          total_periods: lp.duration_months,
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: lp.auto_confirm,
        });
      }

      // Schlussrate
      if (lp.schlussrate) {
        const dueDate = addMonths(new Date(lp.start_month), lp.duration_months);
        cashflows.push({
          id: generateUUID(),
          investment_id: investment.id,
          due_date: dueDate,
          amount: lp.schlussrate,
          type: 'schlussrate',
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
          status: this.getCashflowStatus(dueDate, investment.status),
          auto_confirmed: lp.auto_confirm,
        });
      }
    }

    return cashflows;
  }

  /**
   * Determine cashflow status based on due date and investment status
   */
  private getCashflowStatus(dueDate: Date, investmentStatus: InvestmentStatus): CashflowStatus {
    const now = new Date();

    if (investmentStatus === 'entwurf' || investmentStatus === 'zur_genehmigung') {
      return 'geplant';
    }

    if (investmentStatus === 'abgelehnt' || investmentStatus === 'abgeschlossen') {
      return 'storniert';
    }

    if (dueDate > now) {
      return 'ausstehend';
    }

    // Past due dates are randomly confirmed or awaiting confirmation
    const rand = Math.random();
    if (rand > 0.7) return 'bestaetigt';
    if (rand > 0.4) return 'vorbestaetigt';
    return 'ausstehend';
  }

  /**
   * Seed complete database with realistic data
   */
  seedDatabase(): LocalDatabase {
    console.log('Generating mock data...');

    const groups = this.generateGroups(2);
    const companies = this.generateCompanies(
      groups.map((g) => g.id),
      6
    );
    const users = this.generateUsers(15);
    const userRoles = this.generateUserRoles(users, groups, companies);
    const investments = this.generateInvestments(
      companies.map((c) => c.id),
      users.map((u) => u.id),
      30
    );
    const cashflows = this.generateCashflows(investments);

    console.log(`Generated:
  - ${groups.length} groups
  - ${companies.length} companies
  - ${users.length} users
  - ${userRoles.length} user roles
  - ${investments.length} investments
  - ${cashflows.length} cashflows
    `);

    return {
      version: '1.0.0',
      lastUpdated: new Date(),
      currentUser: null,
      authToken: null,
      groups,
      companies,
      users,
      userRoles,
      investments,
      cashflows,
      investmentApprovals: [],
      notifications: [],
      auditLogs: [],
    };
  }
}

// Export singleton instance
export const mockDataGenerator = new MockDataGenerator();
