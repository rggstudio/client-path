import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, X, ChevronRight, Star, Zap, Wallet, Clock, Calendar, Users, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const [_, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-md">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-bold">ClientPath</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/auth")}
            >
              Log in
            </Button>
            <Button 
              size="sm" 
              onClick={() => setLocation("/auth?register=true")}
            >
              Start free trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Turn client chaos into a <span className="text-primary">smooth path</span> forward
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The all-in-one business management platform for freelancers and independent professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => setLocation("/auth?register=true")}
              >
                Start your 7-day free trial <ArrowRight size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See how it works
              </Button>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted-foreground/30 border-2 border-background flex items-center justify-center text-xs text-foreground">
                    {i}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Join 1,000+ freelancers</p>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                  <span className="text-xs ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border shadow-xl p-2 lg:p-4">
            <img 
              src="/dashboard-preview.jpg" 
              alt="ClientPath Dashboard" 
              className="rounded-md w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600' preserveAspectRatio='xMidYMid slice'%3E%3Crect fill='%23f8f9fa' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='24' fill='%23212529'%3EClientPath Dashboard%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to run your business</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for freelancers and service providers who want to look professional and stay organized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Wallet className="h-8 w-8 text-primary" />,
                title: "Invoicing & Payments",
                description: "Create professional invoices, track payments, and get paid faster with automatic reminders."
              },
              {
                icon: <Clock className="h-8 w-8 text-primary" />,
                title: "Time Tracking",
                description: "Track time spent on projects and automatically convert them to billable hours on invoices."
              },
              {
                icon: <Calendar className="h-8 w-8 text-primary" />,
                title: "Scheduling",
                description: "Allow clients to book meetings directly on your calendar based on your availability."
              },
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Contracts & Proposals",
                description: "Create legally-binding contracts and winning proposals with just a few clicks."
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Client Portal",
                description: "Give clients their own branded portal to access documents, make payments, and schedule meetings."
              },
              {
                icon: <Zap className="h-8 w-8 text-primary" />,
                title: "Automation",
                description: "Save time with automated workflows, payment reminders, and follow-ups."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ClientPath works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple workflow that keeps you focused on your clients, not paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Add your clients",
                description: "Import existing clients or add new ones. All their information is organized in one place."
              },
              {
                step: "2",
                title: "Create documents",
                description: "Generate professional invoices, contracts, and proposals using our templates."
              },
              {
                step: "3",
                title: "Get paid faster",
                description: "Clients can pay online instantly, and you'll receive automatic payment notifications."
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by freelancers worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what other professionals are saying about ClientPath.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "ClientPath helped me streamline my entire business. I now spend 75% less time on administrative tasks.",
                author: "Sarah J.",
                role: "Graphic Designer"
              },
              {
                quote: "My clients are impressed with how professional everything looks. The client portal is a game-changer.",
                author: "Mark T.",
                role: "Web Developer"
              },
              {
                quote: "I used to chase payments for weeks. Now I get paid on time, every time. Worth every penny!",
                author: "Elena R.",
                role: "Marketing Consultant"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. No complicated contracts. Cancel anytime.
            </p>
          </div>

          <Tabs defaultValue="monthly" className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="monthly" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Lite</h3>
                      <p className="text-3xl font-bold mt-2">$0</p>
                      <p className="text-muted-foreground">Free forever</p>
                    </div>

                    <ul className="space-y-3 my-6">
                      {[
                        "Up to 3 clients",
                        "Up to 3 invoices per month",
                        "Basic contract templates",
                        "Basic client portal (read-only)",
                        "1 scheduling link",
                        "ClientPath branding"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation("/auth?register=true&plan=lite")}
                      >
                        Get started free
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Pro</h3>
                      <p className="text-3xl font-bold mt-2">$19</p>
                      <p className="text-muted-foreground">per month</p>
                    </div>

                    <ul className="space-y-3 my-6">
                      {[
                        "Unlimited clients",
                        "Unlimited invoices & contracts",
                        "Smart fields and templates",
                        "Calendar sync (Google/Outlook)",
                        "Custom branding",
                        "Full-featured client portal",
                        "Payment plans and auto-reminders",
                        "Proposal builder",
                        "Priority support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button 
                        className="w-full"
                        onClick={() => setLocation("/auth?register=true&plan=pro")}
                      >
                        Start 7-day free trial
                      </Button>
                      <p className="text-xs text-center mt-2 text-muted-foreground">No credit card required</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="annually" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Lite</h3>
                      <p className="text-3xl font-bold mt-2">$0</p>
                      <p className="text-muted-foreground">Free forever</p>
                    </div>

                    <ul className="space-y-3 my-6">
                      {[
                        "Up to 3 clients",
                        "Up to 3 invoices per month",
                        "Basic contract templates",
                        "Basic client portal (read-only)",
                        "1 scheduling link",
                        "ClientPath branding"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setLocation("/auth?register=true&plan=lite")}
                      >
                        Get started free
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium">Pro</h3>
                      <div className="flex items-center mt-2">
                        <p className="text-3xl font-bold">$180</p>
                        <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Save $48
                        </div>
                      </div>
                      <p className="text-muted-foreground">per year ($15/month)</p>
                    </div>

                    <ul className="space-y-3 my-6">
                      {[
                        "Unlimited clients",
                        "Unlimited invoices & contracts",
                        "Smart fields and templates",
                        "Calendar sync (Google/Outlook)",
                        "Custom branding",
                        "Full-featured client portal",
                        "Payment plans and auto-reminders",
                        "Proposal builder",
                        "Priority support"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button 
                        className="w-full"
                        onClick={() => setLocation("/auth?register=true&plan=pro-annual")}
                      >
                        Start 7-day free trial
                      </Button>
                      <p className="text-xs text-center mt-2 text-muted-foreground">No credit card required</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Add-ons (Optional with Any Plan)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "E-signature",
                    price: "$2/month",
                    description: "Legally binding electronic signatures"
                  },
                  {
                    title: "Extra Users",
                    price: "$5/user/month",
                    description: "Add team members to your account"
                  },
                  {
                    title: "White-labeling",
                    price: "$99 one-time or $20/month",
                    description: "Remove all ClientPath branding"
                  }
                ].map((addon, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <h4 className="font-medium">{addon.title}</h4>
                    <p className="text-primary font-semibold">{addon.price}</p>
                    <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to streamline your business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of freelancers who've transformed their workflow with ClientPath.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2"
              onClick={() => setLocation("/auth?register=true")}
            >
              Start your free trial today <ChevronRight size={16} />
            </Button>
            <p className="mt-4 text-sm opacity-80">No credit card required. 7-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-md">
                  <Zap size={16} />
                </div>
                <h2 className="text-lg font-bold">ClientPath</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Turn client chaos into a smooth path forward.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground">Updates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Guides</a></li>
                <li><a href="#" className="hover:text-foreground">Webinars</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ClientPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}