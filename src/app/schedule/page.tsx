'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';

import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const scheduleFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  pickupDate: z.date({
    required_error: 'A pickup date is required.',
  }),
  timeSlot: z.string({
    required_error: 'Please select a time slot.',
  }),
  notes: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export default function SchedulePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      address: '',
      name: '',
      notes: '',
    }
  });

  async function onSubmit(data: ScheduleFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Pickup Scheduled!",
      description: `We'll see you on ${format(data.pickupDate, 'PPP')} between ${data.timeSlot}.`,
    });

    form.reset({ name: '', address: '', notes: '' });
  }
  
  const addressValue = form.watch('address');

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Schedule a Pickup</h1>
          <p className="text-muted-foreground">Arrange a convenient time for us to collect your donations.</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
            <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Pickup Details</CardTitle>
                    <CardDescription>Fill out the form below to schedule your donation pickup.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pickup Address</FormLabel>
                            <FormControl>
                            <Input placeholder="123 Main St, Anytown, USA" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="pickupDate"
                            render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Pickup Date</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                        )}
                                    >
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="timeSlot"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time Slot</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a time slot" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="9am - 12pm">9:00 AM - 12:00 PM</SelectItem>
                                    <SelectItem value="12pm - 3pm">12:00 PM - 3:00 PM</SelectItem>
                                    <SelectItem value="3pm - 6pm">3:00 PM - 6:00 PM</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes (optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., Leave on porch if not home. Large box of board games."
                                className="resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Any special instructions for our pickup team.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Schedule Pickup
                    </Button>
                </CardFooter>
                </form>
            </Form>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Pickup Location</CardTitle>
                    <CardDescription>Confirm the location on the map below.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col gap-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                         <Image
                            src="https://picsum.photos/800/450"
                            alt="Map of pickup location"
                            fill
                            data-ai-hint="map city"
                            className="object-cover"
                        />
                    </div>
                     <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <MapPin className="h-5 w-5 mt-1 shrink-0 text-primary" />
                        <div className="flex-grow">
                            <p className="font-semibold">Your Address</p>
                            <p className="text-sm text-muted-foreground min-h-10">
                                {addressValue || "Enter an address to see it here."}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
