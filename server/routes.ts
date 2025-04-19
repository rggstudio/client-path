import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { setupAuth } from "./auth";
import { 
  insertClientSchema,
  insertInvoiceSchema,
  insertContractSchema,
  insertProposalSchema,
  insertMeetingSchema,
  insertPaymentSchema,
  insertActivitySchema
} from "@shared/schema";

// Helper function to parse and validate request body with Zod
function validateBody<T>(schema: z.ZodType<T>, req: Request, res: Response): T | null {
  try {
    return schema.parse(req.body);
  } catch (error) {
    res.status(400).json({ 
      message: "Invalid request body",
      errors: error instanceof z.ZodError ? error.errors : undefined
    });
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Default user ID for demo purposes
  const DEFAULT_USER_ID = 1;

  // Ensure default user exists
  try {
    await storage.ensureDefaultUser();
    console.log("Default user ready");
  } catch (error) {
    console.error("Failed to create default user:", error);
  }

  // Set up authentication
  setupAuth(app);
  
  // Set up HTTP server
  const httpServer = createServer(app);

  // API routes
  // ==================================================================================

  // Dashboard routes
  // ---------------------------------------------------------------------------------
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(DEFAULT_USER_ID);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Clients routes
  // ---------------------------------------------------------------------------------
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients(DEFAULT_USER_ID);
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const client = await storage.getClient(clientId);
      
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    const data = validateBody(insertClientSchema, req, res);
    if (!data) return;
    
    try {
      // The userId field is omitted from the schema and added here
      const client = await storage.createClient({
        ...data,
        userId: DEFAULT_USER_ID
      });
      
      await storage.createActivity({
        userId: DEFAULT_USER_ID,
        type: "client_added",
        entityType: "client",
        entityId: client.id,
        description: `Client "${client.name}" added`
      });
      
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    const data = validateBody(insertClientSchema.partial(), req, res);
    if (!data) return;
    
    try {
      const clientId = parseInt(req.params.id);
      const updatedClient = await storage.updateClient(clientId, data);
      
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const result = await storage.deleteClient(clientId);
      
      if (!result) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete client" });
    }
  });

  // Invoices routes
  // ---------------------------------------------------------------------------------
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices(DEFAULT_USER_ID);
      
      // Enrich invoices with client name
      const enrichedInvoices = await Promise.all(invoices.map(async (invoice) => {
        const client = await storage.getClient(invoice.clientId);
        return {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientName: client?.name || "Unknown Client",
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          total: invoice.total,
          status: invoice.status
        };
      }));
      
      res.json(enrichedInvoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/latest", async (req, res) => {
    try {
      const latestInvoices = await storage.getLatestInvoices(DEFAULT_USER_ID);
      
      // Enrich invoices with client name and project name
      const enrichedInvoices = await Promise.all(latestInvoices.map(async (invoice) => {
        const client = await storage.getClient(invoice.clientId);
        const items = JSON.parse(invoice.items);
        const projectName = items.length > 0 ? items[0].description : "Unknown Project";
        
        return {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          clientName: client?.name || "Unknown Client",
          projectName,
          amount: invoice.total,
          status: invoice.status,
          dueDate: invoice.dueDate
        };
      }));
      
      res.json(enrichedInvoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const client = await storage.getClient(invoice.clientId);
      const payments = await storage.getPaymentsByInvoice(invoiceId);
      
      const enrichedInvoice = {
        ...invoice,
        clientName: client?.name || "Unknown Client",
        clientEmail: client?.email || "",
        clientCompanyName: client?.companyName,
        clientAddress: client?.address,
        items: JSON.parse(invoice.items),
        payments: payments
      };
      
      res.json(enrichedInvoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    const formData = req.body;
    
    // Convert form values
    const parsedFormData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      items: JSON.stringify(formData.items)
    };
    
    const data = validateBody(insertInvoiceSchema, parsedFormData, res);
    if (!data) return;
    
    try {
      const invoice = await storage.createInvoice({
        ...data,
        userId: DEFAULT_USER_ID
      });
      
      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.post("/api/invoices/:id/send", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      const updatedInvoice = await storage.updateInvoice(invoiceId, { status: "sent" });
      
      res.json(updatedInvoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to send invoice" });
    }
  });

  app.post("/api/invoices/:id/mark-paid", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const invoice = await storage.getInvoice(invoiceId);
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Create payment record
      const payment = await storage.createPayment({
        invoiceId,
        amount: invoice.total,
        paymentDate: new Date().toISOString(),
        paymentMethod: "manual",
        notes: "Manually marked as paid"
      });
      
      // Update invoice status
      const updatedInvoice = await storage.updateInvoice(invoiceId, { status: "paid" });
      
      res.json({ invoice: updatedInvoice, payment });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark invoice as paid" });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceId = parseInt(req.params.id);
      const result = await storage.deleteInvoice(invoiceId);
      
      if (!result) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // Contracts routes
  // ---------------------------------------------------------------------------------
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts(DEFAULT_USER_ID);
      
      // Enrich contracts with client name
      const enrichedContracts = await Promise.all(contracts.map(async (contract) => {
        const client = await storage.getClient(contract.clientId);
        return {
          id: contract.id,
          title: contract.title,
          clientName: client?.name || "Unknown Client",
          sentDate: contract.sentDate,
          signedDate: contract.signedDate,
          expiryDate: contract.expiryDate,
          status: contract.status
        };
      }));
      
      res.json(enrichedContracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/available", async (req, res) => {
    try {
      const contracts = await storage.getAvailableContracts(DEFAULT_USER_ID);
      
      const formattedContracts = contracts.map(contract => ({
        id: contract.id,
        title: contract.title
      }));
      
      res.json(formattedContracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const client = await storage.getClient(contract.clientId);
      
      const enrichedContract = {
        ...contract,
        clientName: client?.name || "Unknown Client",
        clientEmail: client?.email || ""
      };
      
      res.json(enrichedContract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    const formData = req.body;
    
    // Convert form values
    const parsedFormData = {
      ...formData,
      clientId: parseInt(formData.clientId)
    };
    
    const data = validateBody(insertContractSchema, parsedFormData, res);
    if (!data) return;
    
    try {
      const contract = await storage.createContract({
        ...data,
        userId: DEFAULT_USER_ID,
        status: "draft"
      });
      
      res.status(201).json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to create contract" });
    }
  });

  app.post("/api/contracts/:id/send", async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const updatedContract = await storage.updateContract(contractId, { 
        status: "sent",
        sentDate: new Date().toISOString()
      });
      
      res.json(updatedContract);
    } catch (error) {
      res.status(500).json({ message: "Failed to send contract" });
    }
  });

  app.post("/api/contracts/:id/mark-signed", async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const contract = await storage.getContract(contractId);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const updatedContract = await storage.updateContract(contractId, { 
        status: "signed",
        signedDate: new Date().toISOString()
      });
      
      res.json(updatedContract);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark contract as signed" });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const result = await storage.deleteContract(contractId);
      
      if (!result) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Proposals routes
  // ---------------------------------------------------------------------------------
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getProposals(DEFAULT_USER_ID);
      
      // Enrich proposals with client name and attachment info
      const enrichedProposals = await Promise.all(proposals.map(async (proposal) => {
        const client = await storage.getClient(proposal.clientId);
        return {
          id: proposal.id,
          title: proposal.title,
          clientName: client?.name || "Unknown Client",
          sentDate: proposal.sentDate,
          expiryDate: proposal.expiryDate,
          status: proposal.status,
          hasInvoice: proposal.invoiceId !== null,
          hasContract: proposal.contractId !== null
        };
      }));
      
      res.json(enrichedProposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const client = await storage.getClient(proposal.clientId);
      
      let invoiceNumber = null;
      let contractTitle = null;
      
      if (proposal.invoiceId) {
        const invoice = await storage.getInvoice(proposal.invoiceId);
        if (invoice) {
          invoiceNumber = invoice.invoiceNumber;
        }
      }
      
      if (proposal.contractId) {
        const contract = await storage.getContract(proposal.contractId);
        if (contract) {
          contractTitle = contract.title;
        }
      }
      
      const enrichedProposal = {
        ...proposal,
        clientName: client?.name || "Unknown Client",
        clientEmail: client?.email || "",
        hasInvoice: proposal.invoiceId !== null,
        hasContract: proposal.contractId !== null,
        invoiceNumber,
        contractTitle
      };
      
      res.json(enrichedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    const formData = req.body;
    
    // Convert form values
    const parsedFormData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      invoiceId: formData.invoiceId ? parseInt(formData.invoiceId) : null,
      contractId: formData.contractId ? parseInt(formData.contractId) : null
    };
    
    const data = validateBody(insertProposalSchema, parsedFormData, res);
    if (!data) return;
    
    try {
      const proposal = await storage.createProposal({
        ...data,
        userId: DEFAULT_USER_ID,
        status: "draft",
        sentDate: null,
        acceptedDate: null,
        declinedDate: null
      });
      
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  app.post("/api/proposals/:id/send", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const proposal = await storage.getProposal(proposalId);
      
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      const updatedProposal = await storage.updateProposal(proposalId, { 
        status: "sent",
        sentDate: new Date().toISOString()
      });
      
      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to send proposal" });
    }
  });

  app.delete("/api/proposals/:id", async (req, res) => {
    try {
      const proposalId = parseInt(req.params.id);
      const result = await storage.deleteProposal(proposalId);
      
      if (!result) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });

  // Meetings/Scheduling routes
  // ---------------------------------------------------------------------------------
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings(DEFAULT_USER_ID);
      
      // Enrich meetings with client name
      const enrichedMeetings = await Promise.all(meetings.map(async (meeting) => {
        let clientName = "No Client";
        
        if (meeting.clientId) {
          const client = await storage.getClient(meeting.clientId);
          if (client) {
            clientName = client.name;
          }
        }
        
        return {
          ...meeting,
          clientName
        };
      }));
      
      res.json(enrichedMeetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.get("/api/meetings/upcoming", async (req, res) => {
    try {
      const upcomingMeetings = await storage.getUpcomingMeetings(DEFAULT_USER_ID);
      
      // Format meeting data for the frontend
      const formattedMeetings = await Promise.all(upcomingMeetings.map(async (meeting) => {
        let clientName = "No Client";
        
        if (meeting.clientId) {
          const client = await storage.getClient(meeting.clientId);
          if (client) {
            clientName = client.name;
          }
        }
        
        const startDate = new Date(meeting.startDateTime);
        const endDate = new Date(meeting.endDateTime);
        
        return {
          id: meeting.id,
          title: meeting.title,
          date: startDate.toISOString().split('T')[0],
          startTime: startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          endTime: endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          meetingType: meeting.meetingType === 'in_person' ? 'In Person' : 
                        meeting.meetingType === 'zoom' ? 'Zoom Meeting' : 
                        meeting.meetingType === 'google_meet' ? 'Google Meet' : 
                        meeting.meetingType === 'microsoft_teams' ? 'Microsoft Teams' : 
                        'Phone Call',
          meetingLink: meeting.meetingLink
        };
      }));
      
      res.json(formattedMeetings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming meetings" });
    }
  });

  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const meetingId = parseInt(req.params.id);
      const meeting = await storage.getMeeting(meetingId);
      
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      
      let clientName = "No Client";
      
      if (meeting.clientId) {
        const client = await storage.getClient(meeting.clientId);
        if (client) {
          clientName = client.name;
        }
      }
      
      const enrichedMeeting = {
        ...meeting,
        clientName
      };
      
      res.json(enrichedMeeting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meeting" });
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const formData = req.body;
      
      // Convert form data
      const parsedData = {
        clientId: parseInt(formData.clientId),
        title: formData.title,
        description: formData.description || "",
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        meetingType: formData.meetingType,
        location: formData.location || null,
        meetingLink: formData.meetingLink || null,
        status: "scheduled"
      };
      
      const data = validateBody(insertMeetingSchema, parsedData, res);
      if (!data) return;
      
      const meeting = await storage.createMeeting({
        ...data,
        userId: DEFAULT_USER_ID
      });
      
      res.status(201).json(meeting);
    } catch (error) {
      res.status(500).json({ message: "Failed to create meeting" });
    }
  });

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      const meetingId = parseInt(req.params.id);
      const result = await storage.deleteMeeting(meetingId);
      
      if (!result) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete meeting" });
    }
  });

  // Payments routes
  // ---------------------------------------------------------------------------------
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPayments(DEFAULT_USER_ID);
      
      if (!payments || payments.length === 0) {
        return res.json([]);
      }
      
      // Enrich payments with invoice and client info
      const enrichedPayments = await Promise.all(payments.map(async (payment) => {
        let clientName = "Unknown Client";
        let invoiceNumber = "Unknown Invoice";
        
        try {
          const invoice = await storage.getInvoice(payment.invoiceId);
          if (invoice) {
            invoiceNumber = invoice.invoiceNumber;
            const client = await storage.getClient(invoice.clientId);
            if (client) {
              clientName = client.name;
            }
          }
        } catch (err) {
          console.error("Error enriching payment:", err);
        }
        
        return {
          id: payment.id,
          invoiceId: payment.invoiceId,
          invoiceNumber,
          clientName,
          amount: payment.amount,
          paymentDate: payment.paymentDate,
          paymentMethod: payment.paymentMethod
        };
      }));
      
      res.json(enrichedPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    const data = validateBody(insertPaymentSchema, req.body, res);
    if (!data) return;
    
    try {
      const payment = await storage.createPayment(data);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // Activities routes
  // ---------------------------------------------------------------------------------
  app.get("/api/activities/recent", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities(DEFAULT_USER_ID);
      
      // Format activities for the frontend
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        details: getActivityDetails(activity),
        timestamp: activity.createdAt
      }));
      
      res.json(formattedActivities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  // Helper function to get activity details
  function getActivityDetails(activity: any): string {
    switch (activity.type) {
      case 'invoice_paid':
        return "Payment received";
      case 'invoice_sent':
        return "Invoice sent to client";
      case 'contract_signed':
        return "Contract has been signed";
      case 'proposal_sent':
        return "Proposal sent to client";
      case 'meeting_scheduled':
        return "New meeting has been scheduled";
      default:
        return "";
    }
  }

  return httpServer;
}
