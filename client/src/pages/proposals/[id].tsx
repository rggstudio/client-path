import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, getStatusColor } from "@/lib/utils";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Send, Download, Trash2, FileEdit, AlertCircle } from "lucide-react";

interface Proposal {
  id: number;
  title: string;
  content: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  sentDate: string | null;
  expiryDate: string;
  acceptedDate: string | null;
  declinedDate: string | null;
  status: string;
  hasInvoice: boolean;
  hasContract: boolean;
  invoiceId?: number;
  invoiceNumber?: string;
  contractId?: number;
  contractTitle?: string;
}

export default function ProposalDetailsPage() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const proposalId = params.id;

  // Fetch proposal details
  const { data: proposal, isLoading, error } = useQuery<Proposal>({
    queryKey: [`/api/proposals/${proposalId}`],
  });

  // Send proposal mutation
  const sendProposalMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/proposals/${proposalId}/send`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/proposals/${proposalId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      
      toast({
        title: "Success",
        description: "Proposal sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send proposal",
        variant: "destructive",
      });
    },
  });

  // Delete proposal mutation
  const deleteProposalMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/proposals/${proposalId}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      
      toast({
        title: "Success",
        description: "Proposal deleted successfully",
      });
      
      navigate("/proposals");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete proposal",
        variant: "destructive",
      });
    },
  });

  // Get action buttons based on proposal status
  const getActionButtons = () => {
    if (!proposal) return null;
    
    switch (proposal.status.toLowerCase()) {
      case 'draft':
        return (
          <>
            <Button 
              onClick={() => sendProposalMutation.mutate()}
              disabled={sendProposalMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {sendProposalMutation.isPending ? "Sending..." : "Send Proposal"}
            </Button>
            <Button variant="outline" asChild>
              <a href={`/proposals/edit/${proposalId}`}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </a>
            </Button>
          </>
        );
      case 'sent':
        return (
          <Button 
            variant="outline" 
            onClick={() => sendProposalMutation.mutate()}
            disabled={sendProposalMutation.isPending}
          >
            <Send className="mr-2 h-4 w-4" />
            {sendProposalMutation.isPending ? "Sending..." : "Resend"}
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-12 w-1/3 mb-2" />
        <Skeleton className="h-5 w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Proposal Not Found"
          subtitle="The proposal you're looking for doesn't exist or you don't have permission to view it."
          backLink="/proposals"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Proposal Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">Please check the URL or go back to proposals</p>
            <Button className="mt-4" asChild>
              <a href="/proposals">Return to Proposals</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(proposal.status);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title={proposal.title}
        subtitle="View and manage proposal details"
        backLink="/proposals"
        actions={[
          ...(getActionButtons() ? [
            {
              component: getActionButtons()
            }
          ] : []),
          {
            component: (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )
          },
          {
            component: (
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the proposal and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteProposalMutation.mutate()}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {deleteProposalMutation.isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="details">Proposal Details</TabsTrigger>
              {proposal.hasInvoice && <TabsTrigger value="invoice">Invoice</TabsTrigger>}
              {proposal.hasContract && <TabsTrigger value="contract">Contract</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">Proposal Information</CardTitle>
                  <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                    {proposal.status}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-sm text-slate-500 mb-1">From</h3>
                      <p className="font-medium">Your Company Name</p>
                      <p className="text-sm text-slate-600">your.email@example.com</p>
                      <p className="text-sm text-slate-600">Your Address</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-500 mb-1">Client</h3>
                      <p className="font-medium">{proposal.clientName}</p>
                      <p className="text-sm text-slate-600">{proposal.clientEmail}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-sm text-slate-500 mb-1">Created Date</h3>
                      <p>{proposal.sentDate ? formatDate(proposal.sentDate) : "Not sent yet"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-500 mb-1">Expiry Date</h3>
                      <p>{formatDate(proposal.expiryDate)}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-line">{proposal.content}</div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-wrap gap-3">
                    {proposal.hasInvoice && (
                      <div className="flex items-center px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md text-sm">
                        <i className="ri-file-list-3-line mr-1.5"></i>
                        <span>Invoice Attached</span>
                      </div>
                    )}
                    
                    {proposal.hasContract && (
                      <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm">
                        <i className="ri-file-text-line mr-1.5"></i>
                        <span>Contract Attached</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {proposal.hasInvoice && (
              <TabsContent value="invoice" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Invoice: {proposal.invoiceNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" asChild>
                        <a href={`/invoices/${proposal.invoiceId}`}>
                          View Full Invoice
                        </a>
                      </Button>
                    </div>
                    
                    <div className="bg-slate-50 p-4 text-center rounded-md">
                      <p className="text-slate-500">Invoice preview would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            
            {proposal.hasContract && (
              <TabsContent value="contract" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Contract: {proposal.contractTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" asChild>
                        <a href={`/contracts/${proposal.contractId}`}>
                          View Full Contract
                        </a>
                      </Button>
                    </div>
                    
                    <div className="bg-slate-50 p-4 text-center rounded-md">
                      <p className="text-slate-500">Contract preview would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Proposal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium">{proposal.status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Sent Date</p>
                  <p className="font-medium">
                    {proposal.sentDate ? formatDate(proposal.sentDate) : "Not sent yet"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Expiry Date</p>
                  <p className="font-medium">{formatDate(proposal.expiryDate)}</p>
                </div>
                
                {proposal.acceptedDate && (
                  <div>
                    <p className="text-sm text-slate-500">Accepted Date</p>
                    <p className="font-medium">{formatDate(proposal.acceptedDate)}</p>
                  </div>
                )}
                
                {proposal.declinedDate && (
                  <div>
                    <p className="text-sm text-slate-500">Declined Date</p>
                    <p className="font-medium">{formatDate(proposal.declinedDate)}</p>
                  </div>
                )}
              </div>
            </CardContent>
            {proposal.status.toLowerCase() === 'draft' && (
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => sendProposalMutation.mutate()}
                  disabled={sendProposalMutation.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sendProposalMutation.isPending ? "Sending..." : "Send Proposal"}
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Client Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Share this proposal with your client via a secure client portal link.
                </p>
                
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm break-all">
                  https://clientpath.com/portal/{proposal.id}
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(`https://clientpath.com/portal/${proposal.id}`);
                  toast({
                    title: "Link copied",
                    description: "Client portal link copied to clipboard",
                  });
                }}>
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                    <i className="ri-file-paper-2-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Proposal created</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
                
                {proposal.sentDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <i className="ri-mail-send-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proposal sent</p>
                      <p className="text-xs text-slate-500">{formatDate(proposal.sentDate)}</p>
                    </div>
                  </div>
                )}
                
                {proposal.acceptedDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proposal accepted</p>
                      <p className="text-xs text-slate-500">{formatDate(proposal.acceptedDate)}</p>
                    </div>
                  </div>
                )}
                
                {proposal.declinedDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <i className="ri-close-circle-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Proposal declined</p>
                      <p className="text-xs text-slate-500">{formatDate(proposal.declinedDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
