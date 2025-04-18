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
import { Send, Download, Trash2, FileEdit, AlertCircle, PenTool } from "lucide-react";

interface Contract {
  id: number;
  title: string;
  content: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  sentDate: string | null;
  signedDate: string | null;
  expiryDate: string;
  status: string;
}

export default function ContractDetailsPage() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const contractId = params.id;

  // Fetch contract details
  const { data: contract, isLoading, error } = useQuery<Contract>({
    queryKey: [`/api/contracts/${contractId}`],
  });

  // Send contract mutation
  const sendContractMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/contracts/${contractId}/send`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contracts/${contractId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      
      toast({
        title: "Success",
        description: "Contract sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send contract",
        variant: "destructive",
      });
    },
  });

  // Mark as signed mutation
  const markAsSignedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/contracts/${contractId}/mark-signed`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contracts/${contractId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      
      toast({
        title: "Success",
        description: "Contract marked as signed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark contract as signed",
        variant: "destructive",
      });
    },
  });

  // Delete contract mutation
  const deleteContractMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/contracts/${contractId}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      
      toast({
        title: "Success",
        description: "Contract deleted successfully",
      });
      
      navigate("/contracts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contract",
        variant: "destructive",
      });
    },
  });

  // Get action buttons based on contract status
  const getActionButtons = () => {
    if (!contract) return null;
    
    switch (contract.status.toLowerCase()) {
      case 'draft':
        return (
          <>
            <Button 
              onClick={() => sendContractMutation.mutate()}
              disabled={sendContractMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {sendContractMutation.isPending ? "Sending..." : "Send Contract"}
            </Button>
            <Button variant="outline" asChild>
              <a href={`/contracts/edit/${contractId}`}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </a>
            </Button>
          </>
        );
      case 'sent':
        return (
          <>
            <Button 
              onClick={() => markAsSignedMutation.mutate()}
              disabled={markAsSignedMutation.isPending}
            >
              <PenTool className="mr-2 h-4 w-4" />
              {markAsSignedMutation.isPending ? "Processing..." : "Mark as Signed"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => sendContractMutation.mutate()}
              disabled={sendContractMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {sendContractMutation.isPending ? "Sending..." : "Resend"}
            </Button>
          </>
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

  if (error || !contract) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Contract Not Found"
          subtitle="The contract you're looking for doesn't exist or you don't have permission to view it."
          backLink="/contracts"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Contract Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">Please check the URL or go back to contracts</p>
            <Button className="mt-4" asChild>
              <a href="/contracts">Return to Contracts</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(contract.status);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title={contract.title}
        subtitle="View and manage contract details"
        backLink="/contracts"
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
                      This action cannot be undone. This will permanently delete the contract and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteContractMutation.mutate()}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {deleteContractMutation.isPending ? "Deleting..." : "Delete"}
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Contract Details</CardTitle>
              <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                {contract.status}
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
                  <p className="font-medium">{contract.clientName}</p>
                  <p className="text-sm text-slate-600">{contract.clientEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Sent Date</h3>
                  <p>{contract.sentDate ? formatDate(contract.sentDate) : "Not sent yet"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Signed Date</h3>
                  <p>{contract.signedDate ? formatDate(contract.signedDate) : "Not signed yet"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Expiry Date</h3>
                  <p>{formatDate(contract.expiryDate)}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="bg-slate-50 p-6 rounded-md border border-slate-200 min-h-[400px] font-mono text-sm whitespace-pre-line">
                {contract.content}
              </div>
              
              {contract.status.toLowerCase() === 'signed' && (
                <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <i className="ri-verified-badge-fill text-green-600 text-3xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-green-800">Digitally Signed</h3>
                      <p className="text-sm text-green-700">
                        This contract was digitally signed by {contract.clientName} on {formatDate(contract.signedDate || new Date().toISOString())}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium">{contract.status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Sent Date</p>
                  <p className="font-medium">
                    {contract.sentDate ? formatDate(contract.sentDate) : "Not sent yet"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Signed Date</p>
                  <p className="font-medium">
                    {contract.signedDate ? formatDate(contract.signedDate) : "Not signed yet"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Expiry Date</p>
                  <p className="font-medium">{formatDate(contract.expiryDate)}</p>
                </div>
              </div>
            </CardContent>
            {contract.status.toLowerCase() === 'draft' && (
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => sendContractMutation.mutate()}
                  disabled={sendContractMutation.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {sendContractMutation.isPending ? "Sending..." : "Send Contract"}
                </Button>
              </CardFooter>
            )}
            {contract.status.toLowerCase() === 'sent' && (
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => markAsSignedMutation.mutate()}
                  disabled={markAsSignedMutation.isPending}
                >
                  <PenTool className="mr-2 h-4 w-4" />
                  {markAsSignedMutation.isPending ? "Processing..." : "Mark as Signed"}
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
                  Share this contract with your client via a secure client portal link.
                </p>
                
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 text-sm break-all">
                  https://clientpath.com/portal/contracts/{contract.id}
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => {
                  navigator.clipboard.writeText(`https://clientpath.com/portal/contracts/${contract.id}`);
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
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <i className="ri-file-text-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contract created</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
                
                {contract.sentDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <i className="ri-mail-send-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contract sent</p>
                      <p className="text-xs text-slate-500">{formatDate(contract.sentDate)}</p>
                    </div>
                  </div>
                )}
                
                {contract.signedDate && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="ri-pen-nib-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contract signed</p>
                      <p className="text-xs text-slate-500">{formatDate(contract.signedDate)}</p>
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
