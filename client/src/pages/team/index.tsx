import React from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// No layout import needed as the App is already wrapped in a LayoutProvider

export default function TeamPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
            <p className="text-slate-500 mt-1">
              Invite your team members to collaborate on client projects
            </p>
          </div>
          <Button disabled>
            <i className="ri-user-add-line mr-2"></i>
            Add Team Member
          </Button>
        </div>

        <Card className="border-dashed border-2 bg-slate-50/80 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              <i className="ri-team-line mr-2 text-blue-500"></i>
              Team Collaboration Coming Soon
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
              Coming Soon
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <CardDescription className="text-base text-slate-600 mb-6">
              In a future release, you'll be able to invite team members to ClientPath to:
            </CardDescription>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <i className="ri-check-line"></i>
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-900">Collaborate on projects</h3>
                  <p className="text-sm text-slate-500">
                    Work together with your team on client projects, share documents and files
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <i className="ri-check-line"></i>
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-900">Manage shared clients</h3>
                  <p className="text-sm text-slate-500">
                    Give team members access to specific clients and projects
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <i className="ri-check-line"></i>
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-900">Role-based permissions</h3>
                  <p className="text-sm text-slate-500">
                    Set different permission levels for team members based on their roles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <i className="ri-check-line"></i>
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-900">Activity tracking</h3>
                  <p className="text-sm text-slate-500">
                    Track team member activities and changes to maintain accountability
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-md bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <i className="ri-information-line text-blue-500 text-lg mt-0.5"></i>
                <div>
                  <h3 className="text-base font-medium text-blue-700">Want early access?</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    We're working hard to bring team collaboration features to ClientPath. Sign up to be notified when this feature becomes available.
                  </p>
                  <Button variant="outline" className="mt-3 bg-white hover:bg-blue-50">
                    <i className="ri-mail-line mr-2"></i>
                    Get Early Access
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}