import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

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
import { Send, Download, Trash2, FileEdit, AlertCircle } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientCompanyName?: string;
  clientAddress?: string;
  issueDate: string;
  dueDate: string;
  status: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  items: InvoiceItem[];
}

export default function InvoiceDetailsPage() {
  const params = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const invoiceId = params.id;

  // Fetch invoice details
  const { data: invoice, isLoading, error } = useQuery<Invoice>({
    queryKey: [`/api/invoices/${invoiceId}`],
  });

  // Send invoice mutation
  const sendInvoiceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/invoices/${invoiceId}/send`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/invoices/${invoiceId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      
      toast({
        title: "Success",
        description: "Invoice sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invoice",
        variant: "destructive",
      });
    },
  });

  // Mark as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/invoices/${invoiceId}/mark-paid`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/invoices/${invoiceId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      
      toast({
        title: "Success",
        description: "Invoice marked as paid",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark invoice as paid",
        variant: "destructive",
      });
    },
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/invoices/${invoiceId}`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      
      navigate("/invoices");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  // Get action buttons based on invoice status
  const getActionButtons = () => {
    if (!invoice) return null;
    
    switch (invoice.status.toLowerCase()) {
      case 'draft':
        return (
          <>
            <Button 
              onClick={() => sendInvoiceMutation.mutate()}
              disabled={sendInvoiceMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {sendInvoiceMutation.isPending ? "Sending..." : "Send Invoice"}
            </Button>
            <Button variant="outline" asChild>
              <a href={`/invoices/edit/${invoiceId}`}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </a>
            </Button>
          </>
        );
      case 'sent':
      case 'overdue':
        return (
          <>
            <Button 
              onClick={() => markAsPaidMutation.mutate()}
              disabled={markAsPaidMutation.isPending}
            >
              {markAsPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
            </Button>
            <Button variant="outline" asChild>
              <a href="#" onClick={(e) => { e.preventDefault(); sendInvoiceMutation.mutate(); }}>
                <Send className="mr-2 h-4 w-4" />
                Resend
              </a>
            </Button>
          </>
        );
      case 'paid':
        return (
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Send Receipt
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

  if (error || !invoice) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <PageHeader
          title="Invoice Not Found"
          subtitle="The invoice you're looking for doesn't exist or you don't have permission to view it."
          backLink="/invoices"
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Invoice Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">Please check the URL or go back to invoices</p>
            <Button className="mt-4" asChild>
              <a href="/invoices">Return to Invoices</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(invoice.status);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title={`Invoice ${invoice.invoiceNumber}`}
        subtitle={`View and manage invoice details`}
        backLink="/invoices"
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
                      This action cannot be undone. This will permanently delete the invoice and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteInvoiceMutation.mutate()}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {deleteInvoiceMutation.isPending ? "Deleting..." : "Delete"}
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
              <CardTitle className="text-lg font-medium">Invoice Details</CardTitle>
              <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                {invoice.status}
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
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Bill To</h3>
                  <p className="font-medium">{invoice.clientName}</p>
                  <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
                  {invoice.clientCompanyName && <p className="text-sm text-slate-600">{invoice.clientCompanyName}</p>}
                  {invoice.clientAddress && <p className="text-sm text-slate-600">{invoice.clientAddress}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Invoice Number</h3>
                  <p>{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Issue Date</h3>
                  <p>{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-slate-500 mb-1">Due Date</h3>
                  <p>{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-sm py-2">Description</th>
                      <th className="text-right font-medium text-sm py-2">Quantity</th>
                      <th className="text-right font-medium text-sm py-2">Unit Price</th>
                      <th className="text-right font-medium text-sm py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 pr-4">{item.description}</td>
                        <td className="py-3 text-right">{item.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-3 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 md:w-1/2 ml-auto">
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                
                {invoice.tax && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Tax:</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
                
                {invoice.discount && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Discount:</span>
                    <span>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                
                <Separator className="my-2" />
                
                <div className="flex justify-between py-1 font-medium">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
              
              {(invoice.notes || invoice.terms) && (
                <>
                  <Separator className="my-6" />
                  
                  {invoice.notes && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Notes</h3>
                      <p className="text-sm text-slate-600">{invoice.notes}</p>
                    </div>
                  )}
                  
                  {invoice.terms && (
                    <div>
                      <h3 className="font-medium mb-2">Terms & Conditions</h3>
                      <p className="text-sm text-slate-600">{invoice.terms}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="font-medium">{invoice.status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Amount Due</p>
                  <p className="font-medium text-xl">{formatCurrency(invoice.total)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500">Due Date</p>
                  <p className="font-medium">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              {invoice.status.toLowerCase() === 'paid' ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 w-full">
                  <p className="text-green-800 text-sm font-medium">
                    Payment received on {formatDate(new Date().toISOString())}
                  </p>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => markAsPaidMutation.mutate()}
                  disabled={markAsPaidMutation.isPending || invoice.status.toLowerCase() === 'draft'}
                >
                  {markAsPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice created</p>
                    <p className="text-xs text-slate-500">{formatDate(invoice.issueDate)}</p>
                  </div>
                </div>
                
                {invoice.status.toLowerCase() !== 'draft' && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <i className="ri-mail-send-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Invoice sent</p>
                      <p className="text-xs text-slate-500">{formatDate(new Date().toISOString())}</p>
                    </div>
                  </div>
                )}
                
                {invoice.status.toLowerCase() === 'paid' && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="ri-checkbox-circle-line"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-slate-500">{formatDate(new Date().toISOString())}</p>
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
