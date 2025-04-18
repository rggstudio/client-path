import { User, Client, Invoice, Contract, Proposal, Meeting, Activity, Payment } from "@shared/schema";

// Mock user
export const mockUser: User = {
  id: 1,
  username: "demo",
  password: "password", // In a real app, this would be hashed
  email: "john@example.com",
  fullName: "John Smith",
  companyName: "Smith Consulting",
  phone: "555-123-4567",
  createdAt: new Date().toISOString()
};

// Mock clients
export const mockClients: Client[] = [
  {
    id: 1,
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
    notes: "Website redesign project",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
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
    notes: "Logo design project",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
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
    notes: "Social media campaign",
    createdAt: new Date().toISOString()
  }
];

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: 1,
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
    createdAt: new Date("2023-05-01").toISOString()
  },
  {
    id: 2,
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
    createdAt: new Date("2023-05-03").toISOString()
  },
  {
    id: 3,
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
    createdAt: new Date("2023-04-20").toISOString()
  }
];

// Mock payments
export const mockPayments: Payment[] = [
  {
    id: 1,
    invoiceId: 1,
    amount: 2400,
    paymentDate: new Date("2023-05-10").toISOString(),
    paymentMethod: "credit_card",
    notes: "Payment received via credit card",
    createdAt: new Date("2023-05-10").toISOString()
  }
];

// Mock contracts
export const mockContracts: Contract[] = [
  {
    id: 1,
    userId: 1,
    clientId: 1,
    title: "Website Development Agreement",
    content: "This agreement is made between Smith Consulting and Johnson Design Studio for website development services...",
    status: "signed",
    sentDate: new Date("2023-04-15").toISOString(),
    signedDate: new Date("2023-04-20").toISOString(),
    expiryDate: new Date("2023-12-31").toISOString(),
    createdAt: new Date("2023-04-15").toISOString()
  },
  {
    id: 2,
    userId: 1,
    clientId: 2,
    title: "Logo Design Services Agreement",
    content: "This agreement is made between Smith Consulting and Chen Media for logo design services...",
    status: "sent",
    sentDate: new Date("2023-05-01").toISOString(),
    signedDate: null,
    expiryDate: new Date("2023-06-01").toISOString(),
    createdAt: new Date("2023-05-01").toISOString()
  },
  {
    id: 3,
    userId: 1,
    clientId: 3,
    title: "Marketing Services Agreement",
    content: "This agreement is made between Smith Consulting and Rodriguez Marketing for social media marketing services...",
    status: "draft",
    sentDate: null,
    signedDate: null,
    expiryDate: new Date("2023-06-15").toISOString(),
    createdAt: new Date("2023-05-05").toISOString()
  }
];

// Mock proposals
export const mockProposals: Proposal[] = [
  {
    id: 1,
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
    declinedDate: null,
    createdAt: new Date("2023-04-10").toISOString()
  },
  {
    id: 2,
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
    declinedDate: null,
    createdAt: new Date("2023-05-01").toISOString()
  },
  {
    id: 3,
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
    declinedDate: null,
    createdAt: new Date("2023-05-05").toISOString()
  }
];

// Mock meetings
export const mockMeetings: Meeting[] = [
  {
    id: 1,
    userId: 1,
    clientId: 1,
    title: "Discovery Call with Alex Thompson",
    description: "Initial meeting to discuss project requirements",
    startDateTime: new Date("2023-05-15T14:00:00Z").toISOString(),
    endDateTime: new Date("2023-05-15T15:00:00Z").toISOString(),
    location: null,
    meetingType: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    status: "scheduled",
    createdAt: new Date("2023-05-10").toISOString()
  },
  {
    id: 2,
    userId: 1,
    clientId: 2,
    title: "Project Review with Sarah's Team",
    description: "Review progress on the logo design project",
    startDateTime: new Date("2023-05-16T10:00:00Z").toISOString(),
    endDateTime: new Date("2023-05-16T11:30:00Z").toISOString(),
    location: null,
    meetingType: "google_meet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    createdAt: new Date("2023-05-10").toISOString()
  },
  {
    id: 3,
    userId: 1,
    clientId: 3,
    title: "Proposal Discussion with David Co.",
    description: "Discuss the proposal for social media marketing services",
    startDateTime: new Date("2023-05-17T13:00:00Z").toISOString(),
    endDateTime: new Date("2023-05-17T14:00:00Z").toISOString(),
    location: "123 Business St, Suite 101",
    meetingType: "in_person",
    meetingLink: null,
    status: "scheduled",
    createdAt: new Date("2023-05-10").toISOString()
  }
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: 1,
    userId: 1,
    type: "invoice_paid",
    entityType: "invoice",
    entityId: 1,
    description: "Invoice #INV-2023-42 has been paid",
    createdAt: new Date("2023-05-10T14:30:00Z").toISOString()
  },
  {
    id: 2,
    userId: 1,
    type: "contract_signed",
    entityType: "contract",
    entityId: 1,
    description: "Contract signed with Sarah Johnson",
    createdAt: new Date("2023-04-20T11:45:00Z").toISOString()
  },
  {
    id: 3,
    userId: 1,
    type: "proposal_sent",
    entityType: "proposal",
    entityId: 2,
    description: "Proposal sent to Michael Chen",
    createdAt: new Date("2023-05-01T16:20:00Z").toISOString()
  },
  {
    id: 4,
    userId: 1,
    type: "meeting_scheduled",
    entityType: "meeting",
    entityId: 1,
    description: "New meeting scheduled with Alex Thompson",
    createdAt: new Date("2023-05-14T09:15:00Z").toISOString()
  }
];
