import { IStorage } from './storage';
import { 
  User, InsertUser, 
  Client, InsertClient, 
  InvoiceItem, InsertInvoiceItem, 
  Invoice, InsertInvoice, 
  Payment, InsertPayment, 
  Contract, InsertContract, 
  Proposal, InsertProposal, 
  Meeting, InsertMeeting, 
  Activity, InsertActivity 
} from '@shared/schema';
import { db } from './db';
import { 
  users, clients, invoiceItems, invoices, payments, 
  contracts, proposals, meetings, activities 
} from '@shared/schema';
import { eq, desc, and, gte, isNull, sql } from 'drizzle-orm';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { pool } from './db';

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    const PostgresSessionStore = connectPgSimple(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Client methods
  async getClients(userId: number): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.userId, userId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients)
      .set(client)
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.count > 0;
  }

  // Invoice Item methods
  async getInvoiceItems(userId: number): Promise<InvoiceItem[]> {
    return await db.select().from(invoiceItems).where(eq(invoiceItems.userId, userId));
  }

  async getInvoiceItem(id: number): Promise<InvoiceItem | undefined> {
    const result = await db.select().from(invoiceItems).where(eq(invoiceItems.id, id));
    return result[0];
  }

  async createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem> {
    const result = await db.insert(invoiceItems).values(item).returning();
    return result[0];
  }

  async updateInvoiceItem(id: number, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined> {
    const result = await db.update(invoiceItems)
      .set(item)
      .where(eq(invoiceItems.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoiceItem(id: number): Promise<boolean> {
    const result = await db.delete(invoiceItems).where(eq(invoiceItems.id, id));
    return result.count > 0;
  }

  // Invoice methods
  async getInvoices(userId: number): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.userId, userId));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const result = await db.update(invoices)
      .set(invoice)
      .where(eq(invoices.id, id))
      .returning();
    return result[0];
  }

  async deleteInvoice(id: number): Promise<boolean> {
    const result = await db.delete(invoices).where(eq(invoices.id, id));
    return result.count > 0;
  }

  async getLatestInvoices(userId: number, limit: number = 3): Promise<Invoice[]> {
    return await db.select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt))
      .limit(limit);
  }

  // Payment methods
  async getPayments(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getPaymentsByInvoice(invoiceId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  // Contract methods
  async getContracts(userId: number): Promise<Contract[]> {
    return await db.select().from(contracts).where(eq(contracts.userId, userId));
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const result = await db.select().from(contracts).where(eq(contracts.id, id));
    return result[0];
  }

  async createContract(contract: InsertContract): Promise<Contract> {
    const result = await db.insert(contracts).values(contract).returning();
    return result[0];
  }

  async updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined> {
    const result = await db.update(contracts)
      .set(contract)
      .where(eq(contracts.id, id))
      .returning();
    return result[0];
  }

  async deleteContract(id: number): Promise<boolean> {
    const result = await db.delete(contracts).where(eq(contracts.id, id));
    return result.count > 0;
  }

  async getAvailableContracts(userId: number): Promise<Contract[]> {
    return await db.select()
      .from(contracts)
      .where(
        and(
          eq(contracts.userId, userId),
          eq(contracts.status, 'draft')
        )
      );
  }

  // Proposal methods
  async getProposals(userId: number): Promise<Proposal[]> {
    return await db.select().from(proposals).where(eq(proposals.userId, userId));
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    const result = await db.select().from(proposals).where(eq(proposals.id, id));
    return result[0];
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const result = await db.insert(proposals).values(proposal).returning();
    return result[0];
  }

  async updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const result = await db.update(proposals)
      .set(proposal)
      .where(eq(proposals.id, id))
      .returning();
    return result[0];
  }

  async deleteProposal(id: number): Promise<boolean> {
    const result = await db.delete(proposals).where(eq(proposals.id, id));
    return result.count > 0;
  }

  // Meeting methods
  async getMeetings(userId: number): Promise<Meeting[]> {
    return await db.select().from(meetings).where(eq(meetings.userId, userId));
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    const result = await db.select().from(meetings).where(eq(meetings.id, id));
    return result[0];
  }

  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const result = await db.insert(meetings).values(meeting).returning();
    return result[0];
  }

  async updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const result = await db.update(meetings)
      .set(meeting)
      .where(eq(meetings.id, id))
      .returning();
    return result[0];
  }

  async deleteMeeting(id: number): Promise<boolean> {
    const result = await db.delete(meetings).where(eq(meetings.id, id));
    return result.count > 0;
  }

  async getUpcomingMeetings(userId: number, limit: number = 3): Promise<Meeting[]> {
    const now = new Date();
    return await db.select()
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, userId),
          gte(meetings.startDateTime, now)
        )
      )
      .orderBy(meetings.startDateTime)
      .limit(limit);
  }

  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.userId, userId));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }

  async getRecentActivities(userId: number, limit: number = 4): Promise<Activity[]> {
    return await db.select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  // Dashboard methods
  async getDashboardStats(userId: number): Promise<any> {
    // Count total clients
    const [clientsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(eq(clients.userId, userId));

    // Calculate total revenue
    const [revenue] = await db
      .select({ sum: sql<number>`sum(amount)` })
      .from(payments)
      .where(eq(payments.userId, userId));

    // Count pending invoices
    const [pendingInvoices] = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          eq(invoices.status, 'pending')
        )
      );

    // Count upcoming meetings
    const now = new Date();
    const [upcomingMeetings] = await db
      .select({ count: sql<number>`count(*)` })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, userId),
          gte(meetings.startDateTime, now)
        )
      );

    // Calculate the change percentages (this would normally compare with previous period)
    // For now, we'll use static mock values
    const clientsChange = { value: "+12%", isPositive: true };
    const revenueChange = { value: "+8%", isPositive: true };
    const invoicesChange = { value: "-5%", isPositive: false };
    const meetingsChange = { value: "+15%", isPositive: true };

    return [
      {
        title: "Total Clients",
        value: clientsCount.count || 0,
        icon: "user-line",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        change: clientsChange,
      },
      {
        title: "Total Revenue",
        value: `$${(revenue.sum || 0).toLocaleString()}`,
        icon: "money-dollar-circle-line",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        change: revenueChange,
      },
      {
        title: "Pending Invoices",
        value: pendingInvoices.count || 0,
        icon: "file-list-3-line",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        change: invoicesChange,
      },
      {
        title: "Upcoming Meetings",
        value: upcomingMeetings.count || 0,
        icon: "calendar-event-line",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        change: meetingsChange,
      },
    ];
  }
}