import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { formatDate } from "@/lib/utils";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  status: string;
}

export default function ClientsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch clients
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const clientData = `${client.name} ${client.email} ${client.company || ""}`.toLowerCase();
    
    return searchTerms.every(term => clientData.includes(term));
  });

  // Status badge style mapping
  const getStatusBadge = (status: string) => {
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Clients"
        subtitle="Manage and view your client information."
        actions={[
          {
            component: (
              <Button onClick={() => setLocation("/clients/create")}>
                <i className="ri-user-add-line mr-2"></i>
                Add Client
              </Button>
            )
          }
        ]}
      />

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Your Clients</CardTitle>
              <CardDescription>
                A list of all your clients and their key information.
              </CardDescription>
            </div>
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<i className="ri-search-line text-muted-foreground"></i>}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-2">
                <i className="ri-loader-4-line animate-spin text-3xl text-primary"></i>
                <span className="text-muted-foreground">Loading clients...</span>
              </div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              {searchQuery ? (
                <>
                  <i className="ri-search-line text-4xl text-muted-foreground mb-2"></i>
                  <h3 className="text-lg font-medium">No clients found</h3>
                  <p className="text-muted-foreground max-w-md mt-1">
                    We couldn't find any clients matching your search. Try adjusting your search terms.
                  </p>
                </>
              ) : (
                <>
                  <i className="ri-user-line text-4xl text-muted-foreground mb-2"></i>
                  <h3 className="text-lg font-medium">No clients yet</h3>
                  <p className="text-muted-foreground max-w-md mt-1">
                    You haven't added any clients yet. Get started by adding your first client.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setLocation("/clients/create")}
                  >
                    <i className="ri-user-add-line mr-2"></i>
                    Add Client
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map(client => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.company || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {client.phone || "—"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/clients/${client.id}`)}
                          >
                            <i className="ri-eye-line mr-1"></i> View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/invoices/create?client=${client.id}`)}
                          >
                            <i className="ri-bill-line mr-1"></i> Invoice
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredClients.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <span>Showing {filteredClients.length} of {clients.length} clients</span>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLocation("/clients")}
                >
                  <i className="ri-close-line mr-1"></i>
                  Clear search
                </Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}