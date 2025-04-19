import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Link } from "wouter";
import { CreditCard, ChevronsUpDown, Settings, PlusCircle } from "lucide-react";

interface Payment {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("received");

  // Fetch payments
  const { data: payments, isLoading, error } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Payments"
        subtitle="Manage payments and transactions."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received">Received Payments</TabsTrigger>
          <TabsTrigger value="due">Due Payments</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Payment History</CardTitle>
              <CardDescription>
                View all payments received from your clients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-5 w-20 ml-auto" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-6 text-red-500">
                  Failed to load payments
                </div>
              ) : payments && payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50">
                      <div>
                        <h3 className="font-medium">
                          {payment.clientName} - {payment.invoiceNumber}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-slate-500">
                          <span>{formatDate(payment.paymentDate)}</span>
                          <span className="mx-2">•</span>
                          <span>{payment.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
                        <Badge className="bg-green-100 text-green-800">Received</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Payments Received Yet</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
                    You haven't received any payments yet. Create an invoice to get started.
                  </p>
                  <Button asChild>
                    <Link href="/invoices/create">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium">Payment Analytics</CardTitle>
                <Button variant="outline" size="sm">
                  <ChevronsUpDown className="h-4 w-4 mr-2" />
                  This Month
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-md">
                  <p className="text-sm text-slate-500 mb-1">Total Received</p>
                  <p className="text-2xl font-bold text-slate-900">$8,245.00</p>
                  <p className="text-xs text-green-600 mt-1">
                    <span className="flex items-center">
                      <i className="ri-arrow-up-line mr-1"></i>
                      12% from last month
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-md">
                  <p className="text-sm text-slate-500 mb-1">Average Payment</p>
                  <p className="text-2xl font-bold text-slate-900">$1,372.50</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-md">
                  <p className="text-sm text-slate-500 mb-1">Payment Count</p>
                  <p className="text-2xl font-bold text-slate-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="due" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Pending Payments</CardTitle>
              <CardDescription>
                View and track payments that are due or overdue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50">
                  <div>
                    <h3 className="font-medium">
                      Michael Chen - #INV-2023-41
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-slate-500">
                      <span>Due: {formatDate("2023-05-18")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">{formatCurrency(850)}</p>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md hover:bg-slate-50">
                  <div>
                    <h3 className="font-medium">
                      Emily Rodriguez - #INV-2023-40
                    </h3>
                    <div className="flex items-center mt-1 text-sm text-slate-500">
                      <span>Due: {formatDate("2023-05-05")}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">{formatCurrency(1250)}</p>
                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/invoices">
                  View All Invoices
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Payment Reminders</CardTitle>
              <CardDescription>
                Set up automated reminders for upcoming and overdue payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Before Due Date</h4>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reminder sent 3 days before the invoice due date.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">On Due Date</h4>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reminder sent on the invoice due date.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">After Due Date</h4>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reminder sent 3 days after the invoice due date if unpaid.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/settings/payment-reminders">
                  Manage Reminders
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Payment Settings</CardTitle>
              <CardDescription>
                Configure your payment methods and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <Settings className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Payment Gateways</h3>
                      <p className="text-sm text-slate-600">
                        Configure your payment processing methods
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-md border border-slate-200">
                      <div className="flex items-center gap-3">
                        <i className="ri-bank-card-line text-2xl text-slate-600"></i>
                        <div>
                          <h4 className="font-medium">Credit Card Payments</h4>
                          <p className="text-xs text-slate-500">Accept Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-md border border-slate-200">
                      <div className="flex items-center gap-3">
                        <i className="ri-paypal-line text-2xl text-slate-600"></i>
                        <div>
                          <h4 className="font-medium">PayPal</h4>
                          <p className="text-xs text-slate-500">Accept PayPal payments</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-md border border-slate-200">
                      <div className="flex items-center gap-3">
                        <i className="ri-bank-line text-2xl text-slate-600"></i>
                        <div>
                          <h4 className="font-medium">ACH/Bank Transfers</h4>
                          <p className="text-xs text-slate-500">Accept direct bank transfers</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
                  <h3 className="font-medium text-lg mb-4">Payment Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Default Currency</span>
                      <span className="text-sm font-medium">USD ($)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Default Payment Terms</span>
                      <span className="text-sm font-medium">Net 30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Allow Partial Payments</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Automatic Payment Receipts</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => window.open("https://dashboard.stripe.com/connect/accounts", "_blank")}
              >
                <i className="ri-link-m mr-2"></i>
                Connect Payment Gateways
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
