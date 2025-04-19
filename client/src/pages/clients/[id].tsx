import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Client interface
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

// Client form schema
const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.string(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params.id;
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we should be in edit mode based on URL query param
  const shouldEdit = new URLSearchParams(location.split('?')[1]).get('edit') === 'true';
  const [isEditing, setIsEditing] = useState(shouldEdit);

  // Fetch client details
  const { 
    data: client,
    isLoading,
    isError,
    error
  } = useQuery<Client>({
    queryKey: ['/api/clients', clientId],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      return response.json();
    }
  });

  // Initialize form
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      companyName: client?.companyName || "",
      website: client?.website || "",
      address: client?.address || "",
      city: client?.city || "",
      state: client?.state || "",
      zipCode: client?.zipCode || "",
      country: client?.country || "",
      notes: client?.notes || "",
      status: client?.status || "active",
    },
  });

  // Reset form when client data changes or editing mode changes
  useEffect(() => {
    if (client && !isEditing) {
      form.reset({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        companyName: client.companyName || "",
        website: client.website || "",
        address: client.address || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        country: client.country || "",
        notes: client.notes || "",
        status: client.status,
      });
    }
  }, [client, isEditing, form]);

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await apiRequest('PUT', `/api/clients/${clientId}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientId] });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: "Client updated",
        description: "Client information has been updated successfully.",
      });
      setIsEditing(false);
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not update client. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating client:", error);
      setIsSubmitting(false);
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/clients/${clientId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: "Client deleted",
        description: "Client has been deleted successfully.",
      });
      setLocation("/clients");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Could not delete client. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting client:", error);
    },
  });

  // Submit handler
  const onSubmit = (values: ClientFormValues) => {
    setIsSubmitting(true);
    updateClientMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <i className="ri-loader-4-line animate-spin text-3xl text-primary"></i>
            <span className="text-muted-foreground">Loading client details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !client) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-2"></i>
          <h3 className="text-lg font-medium">Error Loading Client</h3>
          <p className="text-muted-foreground max-w-md mt-1">
            {error instanceof Error ? error.message : "Client not found or could not be loaded."}
          </p>
          <Button 
            className="mt-4"
            onClick={() => setLocation("/clients")}
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  // Get status badge style
  const getStatusBadge = (status: string | undefined | null) => {
    if (!status) {
      return <Badge variant="outline">Unknown</Badge>;
    }
    
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "lead":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Lead</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format address for display
  const formatAddress = () => {
    if (!client) return "No address provided";
    
    const addressParts = [
      client.address,
      client.city,
      client.state,
      client.zipCode,
      client.country
    ].filter(Boolean);
    
    return addressParts.length > 0 ? addressParts.join(", ") : "No address provided";
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title={client.name}
        subtitle={client.companyName || "Individual Client"}
        actions={[
          {
            component: (
              <Button 
                variant="outline"
                onClick={() => setLocation("/clients")}
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Back to Clients
              </Button>
            )
          },
          {
            component: isEditing ? (
              <Button 
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset({
                    name: client.name,
                    email: client.email,
                    phone: client.phone || "",
                    companyName: client.companyName || "",
                    website: client.website || "",
                    address: client.address || "",
                    city: client.city || "",
                    state: client.state || "",
                    zipCode: client.zipCode || "",
                    country: client.country || "",
                    notes: client.notes || "",
                    status: client.status,
                  });
                }}
              >
                Cancel
              </Button>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
              >
                <i className="ri-edit-line mr-2"></i>
                Edit Client
              </Button>
            )
          }
        ]}
      />

      <Tabs defaultValue="details" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Client Details</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Client Information</CardTitle>
                <CardDescription>
                  Update client details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Company Name" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="lead">Lead</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address fields */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="USA" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Additional notes about this client" 
                              {...field} 
                              value={field.value || ""}
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Saving...
                          </>
                        ) : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Client Details Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {getStatusBadge(client.status)}
                    <span className="text-sm text-muted-foreground ml-4">Client since:</span>
                    <span className="text-sm">{formatDate(client.createdAt)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <i className="ri-mail-line text-muted-foreground"></i>
                          <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                            {client.email}
                          </a>
                        </div>
                        {client.phone && (
                          <div className="flex items-center gap-2">
                            <i className="ri-phone-line text-muted-foreground"></i>
                            <a href={`tel:${client.phone}`} className="hover:underline">
                              {client.phone}
                            </a>
                          </div>
                        )}
                        {client.website && (
                          <div className="flex items-center gap-2">
                            <i className="ri-global-line text-muted-foreground"></i>
                            <a 
                              href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {client.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                      <p className="mt-3">
                        {formatAddress()}
                      </p>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-8">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="whitespace-pre-wrap">{client.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation(`/invoices/create?client=${client.id}`)}
                  >
                    <i className="ri-bill-line mr-2"></i>
                    Create Invoice
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <i className="ri-delete-bin-line mr-2"></i>
                        Delete Client
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the client
                          and all associated data from your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteClientMutation.mutate()}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLocation(`/invoices/create?client=${client.id}`)}
                  >
                    <i className="ri-bill-line mr-2"></i>
                    Create Invoice
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLocation(`/proposals/create?client=${client.id}`)}
                  >
                    <i className="ri-file-list-3-line mr-2"></i>
                    Create Proposal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLocation(`/contracts/create?client=${client.id}`)}
                  >
                    <i className="ri-file-text-line mr-2"></i>
                    Create Contract
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLocation(`/scheduling/create?client=${client.id}`)}
                  >
                    <i className="ri-calendar-line mr-2"></i>
                    Schedule Meeting
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setLocation(`/client-portal?client=${client.id}`)}
                  >
                    <i className="ri-user-settings-line mr-2"></i>
                    View Client Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Client Activity</CardTitle>
              <CardDescription>
                Recent interactions and transactions with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <i className="ri-calendar-line text-4xl text-muted-foreground mb-2"></i>
                <h3 className="text-lg font-medium">No recent activity</h3>
                <p className="text-muted-foreground max-w-md mt-1">
                  This section will show invoices, proposals, contracts, and other interactions with this client.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                All invoices created for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <i className="ri-bill-line text-4xl text-muted-foreground mb-2"></i>
                <h3 className="text-lg font-medium">No invoices yet</h3>
                <p className="text-muted-foreground max-w-md mt-1">
                  You haven't created any invoices for this client yet.
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setLocation(`/invoices/create?client=${client.id}`)}
                >
                  <i className="ri-add-line mr-2"></i>
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Proposals, contracts, and other documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <i className="ri-file-text-line text-4xl text-muted-foreground mb-2"></i>
                <h3 className="text-lg font-medium">No documents yet</h3>
                <p className="text-muted-foreground max-w-md mt-1">
                  You haven't created any documents for this client yet.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation(`/proposals/create?client=${client.id}`)}
                  >
                    <i className="ri-file-list-3-line mr-2"></i>
                    Create Proposal
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation(`/contracts/create?client=${client.id}`)}
                  >
                    <i className="ri-file-text-line mr-2"></i>
                    Create Contract
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}