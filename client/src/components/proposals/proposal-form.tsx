import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form schema
const proposalFormSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  expiryDate: z.date(),
  invoiceId: z.string().optional(),
  contractId: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

interface Client {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
}

interface Contract {
  id: number;
  title: string;
}

export function ProposalForm() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch data
  const { data: clients, isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices/available'],
  });
  
  const { data: contracts, isLoading: isLoadingContracts } = useQuery<Contract[]>({
    queryKey: ['/api/contracts/available'],
  });

  // Initialize form with default values
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: "",
      content: "",
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  });

  // Handle form submission
  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalFormValues) => {
      const res = await apiRequest("POST", "/api/proposals", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      
      toast({
        title: "Success",
        description: "Proposal created successfully",
      });
      
      navigate("/proposals");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProposalFormValues) => {
    createProposalMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Proposal Details</TabsTrigger>
            <TabsTrigger value="invoice">Add Invoice</TabsTrigger>
            <TabsTrigger value="contract">Add Contract</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingClients}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Website Design Project Proposal" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <DatePicker 
                          selected={field.value} 
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        The proposal will expire after this date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proposal Content</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proposal Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe your proposal in detail..."
                          rows={10}
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Include all relevant information, such as project scope, deliverables, timeline, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attach Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Invoice</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingInvoices}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an invoice to attach (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {invoices?.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id.toString()}>
                              {invoice.invoiceNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Attaching an invoice allows clients to pay directly from the proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Back to Details
                </Button>
                <Button type="button" onClick={() => setActiveTab("contract")}>
                  Continue to Contract
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contract" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Attach Contract</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="contractId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Contract</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingContracts}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a contract to attach (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {contracts?.map((contract) => (
                            <SelectItem key={contract.id} value={contract.id.toString()}>
                              {contract.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Attaching a contract allows clients to sign directly from the proposal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("invoice")}>
                  Back to Invoice
                </Button>
                <Button type="submit" disabled={createProposalMutation.isPending}>
                  {createProposalMutation.isPending ? "Creating..." : "Create Proposal"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
