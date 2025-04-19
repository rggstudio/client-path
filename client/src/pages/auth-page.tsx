import React, { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CheckIcon, Loader2, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const registerParam = params.get("register");
  const planParam = params.get("plan");
  const [activeTab, setActiveTab] = useState(registerParam === "true" ? "register" : "login");
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
    },
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onLogin = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome back to ClientPath!",
        });
        setLocation("/");
      },
    });
  };

  const onRegister = (values: RegisterValues) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: "Welcome to ClientPath!",
        });
        setLocation("/");
      },
    });
  };

  if (user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Left column (form) */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-md">
                <Zap size={24} />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to ClientPath</CardTitle>
            <CardDescription>
              {activeTab === "login"
                ? "Sign in to access your account"
                : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegister)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {planParam && (
                      <div className="bg-muted p-3 rounded-md flex items-start">
                        <div className="bg-primary/20 p-1 rounded-full mr-2 mt-0.5">
                          <CheckIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {planParam === "pro" || planParam === "pro-annual"
                              ? "Pro Plan Selected"
                              : "Lite Plan Selected"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {planParam === "pro"
                              ? "$19/month after trial"
                              : planParam === "pro-annual"
                              ? "$180/year after trial"
                              : "Free forever"}
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right column (hero) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-b from-primary to-primary-foreground">
        <div className="flex flex-col justify-center px-8 lg:px-16 text-primary-foreground">
          <h1 className="text-4xl font-bold mb-6">
            Turn client chaos into a smooth path forward
          </h1>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary-foreground/20 p-1 rounded-full mt-1">
                <CheckIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Streamlined Client Management</h3>
                <p className="opacity-90">
                  Keep all client information organized in one place
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-foreground/20 p-1 rounded-full mt-1">
                <CheckIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Professional Invoicing</h3>
                <p className="opacity-90">
                  Create and send customized invoices in minutes
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-foreground/20 p-1 rounded-full mt-1">
                <CheckIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Effortless Scheduling</h3>
                <p className="opacity-90">
                  Let clients book meetings directly on your calendar
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary-foreground/20 p-1 rounded-full mt-1">
                <CheckIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Secure Client Portal</h3>
                <p className="opacity-90">
                  Give clients their own branded space to access all documents
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="italic text-sm">
              "ClientPath has transformed how I manage my freelance business. I
              now spend 75% less time on administrative tasks and focus on what I
              do best."
            </p>
            <div className="mt-3 flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-sm mr-2">
                SJ
              </div>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-xs opacity-90">Graphic Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}