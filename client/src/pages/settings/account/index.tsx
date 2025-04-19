import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { EmailSignature } from "@/components/settings/email-signature";

export default function AccountSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("my-account");
  
  // Mock user data
  const [user, setUser] = useState({
    name: "Raymond Goode Jr",
    company: "RGG Studio, LLC",
    email: "raymond@rggstudio.com",
    phone: "(240) 460-1556",
    website: "http://rggstudio.com",
    companyType: "Agency / Franchise",
    companyDescription: "I'm a Full-Stack Web Developer that loves helping people create their online presence.",
    address: {
      street: "11701 Fair Oaks Way",
      city: "Waldorf",
      state: "Maryland",
      zipCode: "20601",
      country: "United States",
    },
    timezone: "EDT/EST",
    currency: "USD",
    socialLinks: {
      blog: "",
      facebook: "",
      instagram: "rggstudio73",
      linkedin: "",
      pinterest: "",
      tiktok: "",
      dribbble: "",
      behance: "",
      shopmaster: "",
      other: ""
    },
    brandColor: "#DA1616",
    removeBranding: false
  });

  // Form submission handler (mock)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium">{user.company}</p>
              <p className="text-xs text-slate-500">{user.name}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              RG
            </div>
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 border-b w-full justify-start rounded-none p-0 h-auto">
            <TabsTrigger
              value="my-account"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:shadow-none py-3 px-6"
            >
              MY ACCOUNT
            </TabsTrigger>
            <TabsTrigger
              value="company"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 data-[state=active]:shadow-none py-3 px-6"
            >
              COMPANY
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-account" className="mt-0">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal contact details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            value={user.name}
                            onChange={(e) => setUser({...user, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={user.phone}
                            onChange={(e) => setUser({...user, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="mt-4">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" className="mt-4">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="company" className="mt-0">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Build Up Your Professional Presence</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input
                            id="company-name"
                            value={user.company}
                            onChange={(e) => setUser({...user, company: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company-email">Company Email</Label>
                          <Input
                            id="company-email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone-number">Phone Number</Label>
                          <Input
                            id="phone-number"
                            value={user.phone}
                            onChange={(e) => setUser({...user, phone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company-website">Company Website</Label>
                          <Input
                            id="company-website"
                            value={user.website}
                            onChange={(e) => setUser({...user, website: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company-type">Company Type</Label>
                          <Select 
                            defaultValue={user.companyType}
                            onValueChange={(value) => setUser({...user, companyType: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select company type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Agency / Franchise">Agency / Franchise</SelectItem>
                              <SelectItem value="Small Business">Small Business</SelectItem>
                              <SelectItem value="Freelancer">Freelancer</SelectItem>
                              <SelectItem value="Corporation">Corporation</SelectItem>
                              <SelectItem value="Non-profit">Non-profit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Brand Elements</CardTitle>
                  <CardDescription>Customize your brand appearance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Main Logo</h3>
                        <div className="flex items-start space-x-4">
                          <div className="border border-slate-200 bg-slate-50 rounded w-24 h-24 flex items-center justify-center">
                            <i className="ri-image-add-line text-slate-400 text-3xl"></i>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-slate-500">
                              Add frequently used images to use in client-facing files.
                            </p>
                            <Button variant="outline" size="sm">
                              <i className="ri-upload-line mr-2"></i>
                              Upload Logo
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Secondary Logo</h3>
                        <div className="flex items-start space-x-4">
                          <div className="border border-slate-200 bg-slate-50 rounded w-24 h-12 flex items-center justify-center">
                            <i className="ri-image-add-line text-slate-400 text-2xl"></i>
                          </div>
                          
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">
                              <i className="ri-upload-line mr-2"></i>
                              Upload Secondary Logo
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="font-medium mb-1">Brand Color</h3>
                        <p className="text-sm text-slate-500 mb-3">
                          Your brand color will be used in buttons in emails, your contact form, your client portal and much more.
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div 
                              className="h-8 w-8 rounded-full border border-slate-200" 
                              style={{ backgroundColor: user.brandColor }}
                            ></div>
                          </div>
                          <Input 
                            value={user.brandColor}
                            onChange={(e) => setUser({...user, brandColor: e.target.value})}
                            className="w-32"
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="font-medium mb-1">Additional Images</h3>
                        <p className="text-sm text-slate-500 mb-3">
                          Add frequently used images to use in client-facing files.
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="border border-slate-200 bg-slate-50 rounded w-20 h-20 flex items-center justify-center">
                            <i className="ri-image-add-line text-slate-400 text-xl"></i>
                          </div>
                          
                          <div className="border border-slate-200 bg-slate-50 rounded w-20 h-20 flex items-center justify-center">
                            <i className="ri-add-line text-slate-400 text-xl"></i>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-line mr-2"></i>
                          Add Images
                        </Button>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="font-medium mb-1">ClientPath Branding</h3>
                        <p className="text-sm text-slate-500 mb-3">
                          ClientPath's logo or badge will appear in your lead forms, smart files, scheduler, and client portal. Upgrade to a higher tier plan to remove.
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="remove-branding" className="cursor-pointer">
                            Remove ClientPath branding
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="remove-branding"
                              disabled
                              checked={user.removeBranding}
                              onCheckedChange={(checked) => setUser({...user, removeBranding: checked})}
                            />
                            <Button variant="outline" size="sm" className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-100">
                              UPGRADE
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">About Your Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="one-liner">One Line</Label>
                        <Input
                          id="one-liner"
                          placeholder="A brief tagline for your company"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company-description">Paragraph</Label>
                        <textarea
                          id="company-description"
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your company"
                          value={user.companyDescription}
                          onChange={(e) => setUser({...user, companyDescription: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Spread the Word</CardTitle>
                  <CardDescription>Add your go-to links to showcase the cool stuff you're working on and to drive brand awareness.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-red-100 text-red-600 rounded-md">
                          <i className="ri-article-line"></i>
                        </div>
                        <Label htmlFor="blog">Blog</Label>
                      </div>
                      <Input 
                        id="blog" 
                        value={user.socialLinks.blog}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, blog: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 text-blue-600 rounded-md">
                          <i className="ri-facebook-box-fill"></i>
                        </div>
                        <Label htmlFor="facebook">Facebook</Label>
                      </div>
                      <Input 
                        id="facebook"
                        value={user.socialLinks.facebook}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, facebook: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-purple-100 text-purple-600 rounded-md">
                          <i className="ri-instagram-fill"></i>
                        </div>
                        <Label htmlFor="instagram">Instagram</Label>
                      </div>
                      <Input 
                        id="instagram"
                        value={user.socialLinks.instagram}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, instagram: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-blue-100 text-blue-600 rounded-md">
                          <i className="ri-linkedin-box-fill"></i>
                        </div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                      </div>
                      <Input 
                        id="linkedin"
                        value={user.socialLinks.linkedin}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, linkedin: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-red-100 text-red-600 rounded-md">
                          <i className="ri-pinterest-fill"></i>
                        </div>
                        <Label htmlFor="pinterest">Pinterest</Label>
                      </div>
                      <Input 
                        id="pinterest" 
                        value={user.socialLinks.pinterest}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, pinterest: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 bg-black text-white rounded-md">
                          <i className="ri-tiktok-fill"></i>
                        </div>
                        <Label htmlFor="tiktok">TikTok</Label>
                      </div>
                      <Input 
                        id="tiktok"
                        value={user.socialLinks.tiktok}
                        onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, tiktok: e.target.value}})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">More Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street-address">Street Address</Label>
                      <Input 
                        id="street-address"
                        value={user.address.street}
                        onChange={(e) => setUser({...user, address: {...user.address, street: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        value={user.address.city}
                        onChange={(e) => setUser({...user, address: {...user.address, city: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip-code">Zip Code</Label>
                      <Input 
                        id="zip-code"
                        value={user.address.zipCode}
                        onChange={(e) => setUser({...user, address: {...user.address, zipCode: e.target.value}})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        defaultValue={user.address.country}
                        onValueChange={(value) => setUser({...user, address: {...user.address, country: value}})}
                      >
                        <SelectTrigger id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select 
                        defaultValue={user.address.state}
                        onValueChange={(value) => setUser({...user, address: {...user.address, state: value}})}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maryland">Maryland</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        defaultValue={user.currency}
                        onValueChange={(value) => setUser({...user, currency: value})}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        defaultValue={user.timezone}
                        onValueChange={(value) => setUser({...user, timezone: value})}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EDT/EST">EDT/EST (Eastern)</SelectItem>
                          <SelectItem value="CDT/CST">CDT/CST (Central)</SelectItem>
                          <SelectItem value="MDT/MST">MDT/MST (Mountain)</SelectItem>
                          <SelectItem value="PDT/PST">PDT/PST (Pacific)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}