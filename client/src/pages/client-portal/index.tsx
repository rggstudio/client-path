import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { User, Settings, FileText, Mail, Copy } from "lucide-react";

export default function ClientPortalPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [portalUrl, setPortalUrl] = useState("https://clientpath.com/portal/your-company");
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(portalUrl);
    toast({
      title: "Copied!",
      description: "Portal URL copied to clipboard",
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Client Portal"
        subtitle="Manage your client portal and customize client experience."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Your Client Portal</CardTitle>
              <CardDescription>
                Share a secure portal with your clients to view and manage their documents and payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  className="flex-1"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                />
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button asChild>
                  <a href={portalUrl} target="_blank" rel="noopener noreferrer">
                    Preview Portal
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                    <User className="h-4 w-4" />
                  </div>
                  <CardTitle>Client Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Manage client access to your portal and customize what they can view.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/client-portal/access">Manage Access</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <CardTitle>Shared Documents</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  View and manage all documents you've shared with your clients.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/client-portal/documents">View Documents</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <CardTitle>Communication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Set up automated notifications and customize email templates.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/client-portal/communication">Manage Communication</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Branding & Customization</CardTitle>
              <CardDescription>
                Customize the look and feel of your client portal to match your brand.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-6">
                This feature is coming soon. You'll be able to customize colors, logos, and more.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <Settings className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Customization Coming Soon</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  We're working on adding full customization options for your client portal. Stay tuned for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Shared Documents</CardTitle>
              <CardDescription>
                Manage all the documents you've shared with your clients through the portal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-8 text-center">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Documents Shared Yet</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
                  You haven't shared any documents with your clients through the portal yet.
                </p>
                <Button onClick={() => {
                  document.getElementById('fileUpload')?.click();
                  toast({
                    title: "Document sharing",
                    description: "Select a document to share with your client."
                  });
                }}>
                  <input 
                    type="file" 
                    id="fileUpload" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        toast({
                          title: "Document uploaded",
                          description: `${e.target.files[0].name} has been shared with your client.`
                        });
                      }
                    }}
                  />
                  Share a Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">Portal Settings</CardTitle>
              <CardDescription>
                Configure general settings for your client portal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-6">
                Manage settings and permissions for your client portal.
              </p>
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Client Portal Access</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Enable client portal</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Require login for access</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Allow client to download documents</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-md p-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Document Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Show invoice history</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Show contract history</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Show proposal history</span>
                      <span className="text-sm font-medium text-green-600">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => toast({
                  title: "Settings saved",
                  description: "Your client portal settings have been updated successfully.",
                })}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
