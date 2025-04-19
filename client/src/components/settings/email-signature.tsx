import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface User {
  name: string;
  title?: string;
  company: string;
  email: string;
  phone: string;
  website?: string;
}

interface EmailSignatureProps {
  user: User;
}

export function EmailSignature({ user }: EmailSignatureProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Email Signature</CardTitle>
        <p className="text-sm text-slate-500">
          Your personalized signature will appear on all communication and email templates.
        </p>
      </CardHeader>
      <CardContent>
        <div className="bg-white border border-slate-200 rounded-md p-4 mb-4">
          <div className="flex gap-4 items-start">
            <div className="min-w-[64px] w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center overflow-hidden">
              <i className="ri-user-3-line text-3xl text-slate-400"></i>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900">{user.name} {user.title && `- ${user.title}`}</h3>
              <p className="text-sm text-slate-700 mb-1">{user.company}</p>
              <div className="flex items-center gap-1 text-xs text-primary-600">
                <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
                <span>•</span>
                <a href={`tel:${user.phone}`} className="hover:underline">{user.phone}</a>
              </div>
              {user.website && (
                <a 
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-primary-600 hover:underline"
                >
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Click to upload a new profile photo
          </p>
          <Button variant="outline" size="sm">
            <i className="ri-upload-2-line mr-2"></i>
            Change Photo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}