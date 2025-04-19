import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const reminderFormSchema = z.object({
  beforeDueEnabled: z.boolean(),
  beforeDueDays: z.string(),
  onDueEnabled: z.boolean(),
  afterDueEnabled: z.boolean(),
  afterDueDays: z.string(),
  secondAfterDueEnabled: z.boolean(),
  secondAfterDueDays: z.string(),
  automaticReminders: z.boolean(),
  reminderTemplate: z.string().min(10, {
    message: "Template must be at least 10 characters.",
  }),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export default function PaymentRemindersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Default form values
  const defaultValues: ReminderFormValues = {
    beforeDueEnabled: true,
    beforeDueDays: "3",
    onDueEnabled: true,
    afterDueEnabled: true,
    afterDueDays: "3",
    secondAfterDueEnabled: false,
    secondAfterDueDays: "7",
    automaticReminders: true,
    reminderTemplate: `Dear {client_name},

We hope this message finds you well. This is a friendly reminder about invoice {invoice_number} for {invoice_amount}, which is {due_status}.

You can view and pay the invoice using the link below:
{invoice_link}

If you have any questions or need assistance, please don't hesitate to contact us.

Thank you for your business!

Best regards,
{company_name}`,
  };

  // Form definition
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues,
  });

  // Submit handler
  const onSubmit = (values: ReminderFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Settings saved",
        description: "Your payment reminder settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <PageHeader
        title="Payment Reminders"
        subtitle="Configure automatic payment reminder settings."
        actions={[
          {
            component: (
              <Button 
                variant="outline"
                onClick={() => navigate("/payments")}
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Back to Payments
              </Button>
            )
          }
        ]}
      />

      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Reminder Schedule</CardTitle>
                <CardDescription>
                  Configure when reminders are sent to clients about their invoices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="automaticReminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Automatic Reminders</FormLabel>
                        <FormDescription>
                          Enable automatic email reminders for invoices
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Reminder Timing</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="beforeDueEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>Before Due Date</FormLabel>
                              <FormDescription>
                                Send a reminder before the invoice is due
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("beforeDueEnabled") && (
                        <FormField
                          control={form.control}
                          name="beforeDueDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Days Before Due Date</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select days" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 day</SelectItem>
                                  <SelectItem value="2">2 days</SelectItem>
                                  <SelectItem value="3">3 days</SelectItem>
                                  <SelectItem value="5">5 days</SelectItem>
                                  <SelectItem value="7">7 days</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="onDueEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>On Due Date</FormLabel>
                              <FormDescription>
                                Send a reminder on the invoice due date
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="afterDueEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>After Due Date (First Reminder)</FormLabel>
                              <FormDescription>
                                Send a reminder after the invoice is overdue
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("afterDueEnabled") && (
                        <FormField
                          control={form.control}
                          name="afterDueDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Days After Due Date</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select days" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 day</SelectItem>
                                  <SelectItem value="2">2 days</SelectItem>
                                  <SelectItem value="3">3 days</SelectItem>
                                  <SelectItem value="5">5 days</SelectItem>
                                  <SelectItem value="7">7 days</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="secondAfterDueEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel>After Due Date (Second Reminder)</FormLabel>
                              <FormDescription>
                                Send a second reminder if the invoice remains unpaid
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("secondAfterDueEnabled") && (
                        <FormField
                          control={form.control}
                          name="secondAfterDueDays"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Days After Due Date</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select days" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="7">7 days</SelectItem>
                                  <SelectItem value="14">14 days</SelectItem>
                                  <SelectItem value="21">21 days</SelectItem>
                                  <SelectItem value="30">30 days</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reminder Template</CardTitle>
                <CardDescription>
                  Customize the email message sent to clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Available Variables</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-white">{"{client_name}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{invoice_number}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{invoice_amount}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{due_date}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{due_status}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{invoice_link}"}</Badge>
                      <Badge variant="outline" className="bg-white">{"{company_name}"}</Badge>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="reminderTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Template</FormLabel>
                        <FormControl>
                          <Textarea className="h-56 font-mono" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use the variables above to personalize your message
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Saving...
                    </>
                  ) : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}