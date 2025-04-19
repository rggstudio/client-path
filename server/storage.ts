import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  invoiceItems, type InvoiceItem, type InsertInvoiceItem,
  invoices, type Invoice, type InsertInvoice,
  payments, type Payment, type InsertPayment,
  contracts, type Contract, type InsertContract,
  proposals, type Proposal, type InsertProposal,
  meetings, type Meeting, type InsertMeeting,
  activities, type Activity, type InsertActivity
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Client methods
  getClients(userId: number): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;

  // Invoice Item methods
  getInvoiceItems(userId: number): Promise<InvoiceItem[]>;
  getInvoiceItem(id: number): Promise<InvoiceItem | undefined>;
  createInvoiceItem(item: InsertInvoiceItem): Promise<InvoiceItem>;
  updateInvoiceItem(id: number, item: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined>;
  deleteInvoiceItem(id: number): Promise<boolean>;

  // Invoice methods
  getInvoices(userId: number): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
  getLatestInvoices(userId: number, limit?: number): Promise<Invoice[]>;

  // Payment methods
  getPayments(userId: number): Promise<Payment[]>;
  getPaymentsByInvoice(invoiceId: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;

  // Contract methods
  getContracts(userId: number): Promise<Contract[]>;
  getContract(id: number): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
  getAvailableContracts(userId: number): Promise<Contract[]>;

  // Proposal methods
  getProposals(userId: number): Promise<Proposal[]>;
  getProposal(id: number): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;

  // Meeting methods
  getMeetings(userId: number): Promise<Meeting[]>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
  getUpcomingMeetings(userId: number, limit?: number): Promise<Meeting[]>;

  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(userId: number, limit?: number): Promise<Activity[]>;

  // Dashboard methods
  getDashboardStats(userId: number): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private invoiceItems: Map<number, InvoiceItem>;
  private invoices: Map<number, Invoice>;
  private payments: Map<number, Payment>;
  private contracts: Map<number, Contract>;
  private proposals: Map<number, Proposal>;
  private meetings: Map<number, Meeting>;
  private activities: Map<number, Activity>;
  
  currentUserId: number;
  currentClientId: number;
  currentInvoiceItemId: number;
  currentInvoiceId: number;
  currentPaymentId: number;
  currentContractId: number;
  currentProposalId: number;
  currentMeetingId: number;
  currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.invoiceItems = new Map();
    this.invoices = new Map();
    this.payments = new Map();
    this.contracts = new Map();
    this.proposals = new Map();
    this.meetings = new Map();
    this.activities = new Map();
    
    this.currentUserId = 1;
    this.currentClientId = 1;
    this.currentInvoiceItemId = 1;
    this.currentInvoiceId = 1;
    this.currentPaymentId = 1;
    this.currentContractId = 1;
    this.currentProposalId = 1;
    this.currentMeetingId = 1;
    this.currentActivityId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "demo",
      password: "password",
      email: "john@example.com",
      fullName: "John Smith",
      companyName: "Smith Consulting",
      phone: "555-123-4567"
    };
    this.createUser(demoUser);
    
    // Create demo clients
    const clients = [
      {
        userId: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "555-111-2222",
        companyName: "Johnson Design Studio",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        notes: "Website redesign project"
      },
      {
        userId: 1,
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "555-222-3333",
        companyName: "Chen Media",
        address: "456 Park Ave",
        city: "San Francisco",
        state: "CA",
        zipCode: "94107",
        country: "USA",
        notes: "Logo design project"
      },
      {
        userId: 1,
        name: "Emily Rodriguez",
        email: "emily@example.com",
        phone: "555-333-4444",
        companyName: "Rodriguez Marketing",
        address: "789 Market St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA",
        notes: "Social media campaign"
      }
    ];
    
    clients.forEach(client => this.createClient(client));
    
    // Create demo invoices
    const invoices = [
      {
        userId: 1,
        clientId: 1,
        invoiceNumber: "#INV-2023-42",
        issueDate: new Date("2023-05-01").toISOString(),
        dueDate: new Date("2023-05-12").toISOString(),
        status: "paid",
        subtotal: 2400,
        tax: 0,
        discount: 0,
        total: 2400,
        notes: "Thank you for your business!",
        terms: "Payment due within 14 days of issue date.",
        items: JSON.stringify([
          { description: "Website Design", quantity: 1, unitPrice: 2400 }
        ]),
      },
      {
        userId: 1,
        clientId: 2,
        invoiceNumber: "#INV-2023-41",
        issueDate: new Date("2023-05-03").toISOString(),
        dueDate: new Date("2023-05-18").toISOString(),
        status: "pending",
        subtotal: 850,
        tax: 0,
        discount: 0,
        total: 850,
        notes: "Thank you for your business!",
        terms: "Payment due within 14 days of issue date.",
        items: JSON.stringify([
          { description: "Logo Design", quantity: 1, unitPrice: 850 }
        ]),
      },
      {
        userId: 1,
        clientId: 3,
        invoiceNumber: "#INV-2023-40",
        issueDate: new Date("2023-04-20").toISOString(),
        dueDate: new Date("2023-05-05").toISOString(),
        status: "overdue",
        subtotal: 1250,
        tax: 0,
        discount: 0,
        total: 1250,
        notes: "Thank you for your business!",
        terms: "Payment due within 14 days of issue date.",
        items: JSON.stringify([
          { description: "Social Media Campaign", quantity: 1, unitPrice: 1250 }
        ]),
      }
    ];
    
    invoices.forEach(invoice => this.createInvoice(invoice));
    
    // Create demo payment
    const payment = {
      invoiceId: 1,
      amount: 2400,
      paymentDate: new Date("2023-05-10").toISOString(),
      paymentMethod: "credit_card",
      notes: "Payment received via credit card"
    };
    
    this.createPayment(payment);
    
    // Create demo contracts
    const contracts = [
      {
        userId: 1,
        clientId: 1,
        title: "Website Development Agreement",
        content: "This agreement is made between Smith Consulting and Johnson Design Studio for website development services...",
        status: "signed",
        sentDate: new Date("2023-04-15").toISOString(),
        signedDate: new Date("2023-04-20").toISOString(),
        expiryDate: new Date("2023-12-31").toISOString()
      },
      {
        userId: 1,
        clientId: 2,
        title: "Logo Design Services Agreement",
        content: "This agreement is made between Smith Consulting and Chen Media for logo design services...",
        status: "sent",
        sentDate: new Date("2023-05-01").toISOString(),
        signedDate: null,
        expiryDate: new Date("2023-06-01").toISOString()
      },
      {
        userId: 1,
        clientId: 3,
        title: "Marketing Services Agreement",
        content: "This agreement is made between Smith Consulting and Rodriguez Marketing for social media marketing services...",
        status: "draft",
        sentDate: null,
        signedDate: null,
        expiryDate: new Date("2023-06-15").toISOString()
      }
    ];
    
    contracts.forEach(contract => this.createContract(contract));
    
    // Create demo proposals
    const proposals = [
      {
        userId: 1,
        clientId: 1,
        title: "Website Redesign Proposal",
        content: "We propose a complete redesign of your company website to improve user experience and conversion rates...",
        invoiceId: 1,
        contractId: 1,
        status: "accepted",
        sentDate: new Date("2023-04-10").toISOString(),
        expiryDate: new Date("2023-05-10").toISOString(),
        acceptedDate: new Date("2023-04-15").toISOString(),
        declinedDate: null
      },
      {
        userId: 1,
        clientId: 2,
        title: "Logo Design Proposal",
        content: "We propose a modern logo design that reflects your brand identity and values...",
        invoiceId: 2,
        contractId: 2,
        status: "sent",
        sentDate: new Date("2023-05-01").toISOString(),
        expiryDate: new Date("2023-06-01").toISOString(),
        acceptedDate: null,
        declinedDate: null
      },
      {
        userId: 1,
        clientId: 3,
        title: "Social Media Marketing Proposal",
        content: "We propose a comprehensive social media marketing strategy to increase your online presence...",
        invoiceId: 3,
        contractId: null,
        status: "draft",
        sentDate: null,
        expiryDate: new Date("2023-06-15").toISOString(),
        acceptedDate: null,
        declinedDate: null
      }
    ];
    
    proposals.forEach(proposal => this.createProposal(proposal));
    
    // Create demo meetings
    const currentDate = new Date();
    const meetings = [
      {
        userId: 1,
        clientId: 1,
        title: "Discovery Call with Alex Thompson",
        description: "Initial meeting to discuss project requirements",
        startDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 14, 0).toISOString(),
        endDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 15, 0).toISOString(),
        location: null,
        meetingType: "zoom",
        meetingLink: "https://zoom.us/j/123456789",
        status: "scheduled"
      },
      {
        userId: 1,
        clientId: 2,
        title: "Project Review with Sarah's Team",
        description: "Review progress on the logo design project",
        startDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 10, 0).toISOString(),
        endDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2, 11, 30).toISOString(),
        location: null,
        meetingType: "google_meet",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "scheduled"
      },
      {
        userId: 1,
        clientId: 3,
        title: "Proposal Discussion with David Co.",
        description: "Discuss the proposal for social media marketing services",
        startDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3, 13, 0).toISOString(),
        endDateTime: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 3, 14, 0).toISOString(),
        location: "123 Business St, Suite 101",
        meetingType: "in_person",
        meetingLink: null,
        status: "scheduled"
      }
    ];
    
    meetings.forEach(meeting => this.createMeeting(meeting));
    
    // Create demo activities
    const activities = [
      {
        userId: 1,
        type: "invoice_paid",
        entityType: "invoice",
        entityId: 1,
        description: "Invoice #INV-2023-42 has been paid",
        createdAt: new Date("2023-05-10T14:30:00Z").toISOString()
      },
      {
        userId: 1,
        type: "contract_signed",
        entityType: "contract",
        entityId: 1,
        description: "Contract signed with Sarah Johnson",
        createdAt: new Date("2023-04-20T11:45:00Z").toISOString()
      },
      {
        userId: 1,
        type: "proposal_sent",
        entityType: "proposal",
        entityId: 2,
        description: "Proposal sent to Michael Chen",
        createdAt: new Date("2023-05-01T16:20:00Z").toISOString()
      },
      {
        userId: 1,
        type: "meeting_scheduled",
        entityType: "meeting",
        entityId: 1,
        description: "New meeting scheduled with Alex Thompson",
        createdAt: new Date("2023-05-14T09:15:00Z").toISOString()
      }
    ];
    
    activities.forEach(activity => this.createActivity(activity));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date().toISOString();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Client methods
  async getClients(userId: number): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(client => client.userId === userId);
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.currentClientId++;
    const now = new Date().toISOString();
    const client: Client = { ...insertClient, id, createdAt: now };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Invoice Item methods
  async getInvoiceItems(userId: number): Promise<InvoiceItem[]> {
    return Array.from(this.invoiceItems.values()).filter(item => item.userId === userId);
  }

  async getInvoiceItem(id: number): Promise<InvoiceItem | undefined> {
    return this.invoiceItems.get(id);
  }

  async createInvoiceItem(insertItem: InsertInvoiceItem): Promise<InvoiceItem> {
    const id = this.currentInvoiceItemId++;
    const now = new Date().toISOString();
    const item: InvoiceItem = { ...insertItem, id, createdAt: now };
    this.invoiceItems.set(id, item);
    return item;
  }

  async updateInvoiceItem(id: number, itemUpdate: Partial<InsertInvoiceItem>): Promise<InvoiceItem | undefined> {
    const item = this.invoiceItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...itemUpdate };
    this.invoiceItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInvoiceItem(id: number): Promise<boolean> {
    return this.invoiceItems.delete(id);
  }

  // Invoice methods
  async getInvoices(userId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.userId === userId);
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentInvoiceId++;
    const now = new Date().toISOString();
    const invoice: Invoice = { ...insertInvoice, id, createdAt: now };
    this.invoices.set(id, invoice);
    
    // Create activity
    await this.createActivity({
      userId: insertInvoice.userId,
      type: "invoice_created",
      entityType: "invoice",
      entityId: id,
      description: `Invoice ${insertInvoice.invoiceNumber} created`
    });
    
    return invoice;
  }

  async updateInvoice(id: number, invoiceUpdate: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updatedInvoice = { ...invoice, ...invoiceUpdate };
    this.invoices.set(id, updatedInvoice);
    
    // Create activity if status is changed
    if (invoiceUpdate.status && invoiceUpdate.status !== invoice.status) {
      await this.createActivity({
        userId: invoice.userId,
        type: `invoice_${invoiceUpdate.status.toLowerCase()}`,
        entityType: "invoice",
        entityId: id,
        description: `Invoice ${invoice.invoiceNumber} marked as ${invoiceUpdate.status}`
      });
    }
    
    return updatedInvoice;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  async getLatestInvoices(userId: number, limit: number = 3): Promise<Invoice[]> {
    const userInvoices = Array.from(this.invoices.values())
      .filter(invoice => invoice.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return userInvoices.slice(0, limit);
  }

  // Payment methods
  async getPayments(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => {
        const invoice = this.invoices.get(payment.invoiceId);
        return invoice && invoice.userId === userId;
      });
  }

  async getPaymentsByInvoice(invoiceId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(payment => payment.invoiceId === invoiceId);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const now = new Date().toISOString();
    const payment: Payment = { ...insertPayment, id, createdAt: now };
    this.payments.set(id, payment);
    
    // Update invoice status to paid
    const invoice = this.invoices.get(payment.invoiceId);
    if (invoice) {
      invoice.status = "paid";
      this.invoices.set(invoice.id, invoice);
      
      // Create activity
      await this.createActivity({
        userId: invoice.userId,
        type: "payment_received",
        entityType: "payment",
        entityId: id,
        description: `Payment received for invoice ${invoice.invoiceNumber}`
      });
    }
    
    return payment;
  }

  // Contract methods
  async getContracts(userId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(contract => contract.userId === userId);
  }

  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.currentContractId++;
    const now = new Date().toISOString();
    const contract: Contract = { ...insertContract, id, createdAt: now };
    this.contracts.set(id, contract);
    
    // Create activity
    await this.createActivity({
      userId: insertContract.userId,
      type: "contract_created",
      entityType: "contract",
      entityId: id,
      description: `Contract "${insertContract.title}" created`
    });
    
    return contract;
  }

  async updateContract(id: number, contractUpdate: Partial<InsertContract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;
    
    const updatedContract = { ...contract, ...contractUpdate };
    this.contracts.set(id, updatedContract);
    
    // Create activity if status is changed
    if (contractUpdate.status && contractUpdate.status !== contract.status) {
      const activityType = contractUpdate.status.toLowerCase() === 'signed' ? 'contract_signed' : `contract_${contractUpdate.status.toLowerCase()}`;
      await this.createActivity({
        userId: contract.userId,
        type: activityType,
        entityType: "contract",
        entityId: id,
        description: `Contract "${contract.title}" ${contractUpdate.status === 'signed' ? 'signed' : contractUpdate.status}`
      });
    }
    
    return updatedContract;
  }

  async deleteContract(id: number): Promise<boolean> {
    return this.contracts.delete(id);
  }

  async getAvailableContracts(userId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values())
      .filter(contract => contract.userId === userId && contract.status === 'draft');
  }

  // Proposal methods
  async getProposals(userId: number): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).filter(proposal => proposal.userId === userId);
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.currentProposalId++;
    const now = new Date().toISOString();
    const proposal: Proposal = { ...insertProposal, id, createdAt: now };
    this.proposals.set(id, proposal);
    
    // Create activity
    await this.createActivity({
      userId: insertProposal.userId,
      type: "proposal_created",
      entityType: "proposal",
      entityId: id,
      description: `Proposal "${insertProposal.title}" created`
    });
    
    return proposal;
  }

  async updateProposal(id: number, proposalUpdate: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    
    const updatedProposal = { ...proposal, ...proposalUpdate };
    this.proposals.set(id, updatedProposal);
    
    // Create activity if status is changed
    if (proposalUpdate.status && proposalUpdate.status !== proposal.status) {
      await this.createActivity({
        userId: proposal.userId,
        type: `proposal_${proposalUpdate.status.toLowerCase()}`,
        entityType: "proposal",
        entityId: id,
        description: `Proposal "${proposal.title}" ${proposalUpdate.status}`
      });
    }
    
    return updatedProposal;
  }

  async deleteProposal(id: number): Promise<boolean> {
    return this.proposals.delete(id);
  }

  // Meeting methods
  async getMeetings(userId: number): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).filter(meeting => meeting.userId === userId);
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.currentMeetingId++;
    const now = new Date().toISOString();
    const meeting: Meeting = { ...insertMeeting, id, createdAt: now };
    this.meetings.set(id, meeting);
    
    // Create activity
    await this.createActivity({
      userId: insertMeeting.userId,
      type: "meeting_scheduled",
      entityType: "meeting",
      entityId: id,
      description: `Meeting "${insertMeeting.title}" scheduled`
    });
    
    return meeting;
  }

  async updateMeeting(id: number, meetingUpdate: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const meeting = this.meetings.get(id);
    if (!meeting) return undefined;
    
    const updatedMeeting = { ...meeting, ...meetingUpdate };
    this.meetings.set(id, updatedMeeting);
    
    // Create activity if status is changed
    if (meetingUpdate.status && meetingUpdate.status !== meeting.status) {
      await this.createActivity({
        userId: meeting.userId,
        type: `meeting_${meetingUpdate.status.toLowerCase()}`,
        entityType: "meeting",
        entityId: id,
        description: `Meeting "${meeting.title}" ${meetingUpdate.status}`
      });
    }
    
    return updatedMeeting;
  }

  async deleteMeeting(id: number): Promise<boolean> {
    return this.meetings.delete(id);
  }

  async getUpcomingMeetings(userId: number, limit: number = 3): Promise<Meeting[]> {
    const now = new Date();
    return Array.from(this.meetings.values())
      .filter(meeting => {
        return meeting.userId === userId && 
          new Date(meeting.startDateTime) > now &&
          meeting.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
      .slice(0, limit);
  }

  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.userId === userId);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const now = new Date().toISOString();
    const activity: Activity = { ...insertActivity, id, createdAt: now };
    this.activities.set(id, activity);
    return activity;
  }

  async getRecentActivities(userId: number, limit: number = 4): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Dashboard methods
  async getDashboardStats(userId: number): Promise<any> {
    // Get all clients for this user
    const clients = await this.getClients(userId);
    const clientCount = clients.length;
    
    // Get all invoices for this user
    const invoices = await this.getInvoices(userId);
    
    // Calculate total revenue (from paid invoices)
    const totalRevenue = invoices
      .filter(invoice => invoice.status.toLowerCase() === 'paid')
      .reduce((sum, invoice) => sum + invoice.total, 0);
      
    // Count pending invoices
    const pendingInvoices = invoices
      .filter(invoice => ['pending', 'sent'].includes(invoice.status.toLowerCase()));
    
    const pendingInvoiceCount = pendingInvoices.length;
    
    // Calculate outstanding amount
    const outstandingAmount = pendingInvoices
      .reduce((sum, invoice) => sum + invoice.total, 0);
    
    // Get upcoming meetings
    const upcomingMeetings = await this.getUpcomingMeetings(userId);
    const meetingCount = upcomingMeetings.length;
    
    // Count meetings scheduled for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayMeetings = upcomingMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.startDateTime);
      return meetingDate >= today && meetingDate < tomorrow;
    }).length;
    
    return [
      {
        title: "Total Clients",
        value: clientCount,
        icon: "ri-user-line",
        iconBg: "",
        iconColor: "text-black",
        change: {
          value: "12% increase",
          isPositive: true
        }
      },
      {
        title: "Total Revenue",
        value: totalRevenue,
        icon: "ri-money-dollar-circle-line",
        iconBg: "",
        iconColor: "text-black",
        change: {
          value: "8% increase",
          isPositive: true
        }
      },
      {
        title: "Pending Invoices",
        value: pendingInvoiceCount,
        icon: "ri-file-list-line",
        iconBg: "",
        iconColor: "text-black",
        subtitle: `$${outstandingAmount} outstanding`
      },
      {
        title: "Scheduled Meetings",
        value: meetingCount,
        icon: "ri-calendar-2-line",
        iconBg: "",
        iconColor: "text-black",
        subtitle: `${todayMeetings} upcoming today`
      }
    ];
  }
}

export const storage = new MemStorage();
