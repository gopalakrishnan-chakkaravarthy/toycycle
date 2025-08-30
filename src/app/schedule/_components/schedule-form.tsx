'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useActionState, useEffect, useState } from 'react';
import Image from 'next/image';
import { AccessoryType, Location, Partner, ToyCondition } from '@/db/schema';
import { schedulePickup } from '../actions';
import { useAuth } from '@/context/auth-context';

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
import { SubmitButton } from '@/app/admin/_components/submit-button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const scheduleFormSchema = z.object({
  pickupType: z.enum(['my-address', 'drop-off', 'partner']),
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  address: z.string().optional(),
  locationId: z.string().optional(),
  partnerId: z.string().optional(),
  pickupDate: z.date({
    required_error: 'A pickup date is required.',
  }),
  timeSlot: z.string({
    required_error: 'Please select a time slot.',
  }),
  toyConditionId: z.string({
    required_error: 'Please select a toy condition.',
  }),
  accessoryTypeId: z.string({
    required_error: 'Please select an accessory type.',
  }),
  notes: z.string().optional(),
}).refine(data => {
    if (data.pickupType === 'my-address') return !!data.address && data.address.length >= 10;
    return true;
}, {
    message: 'Please enter a valid address.',
    path: ['address'],
}).refine(data => {
    if (data.pickupType === 'drop-off') return !!data.locationId;
    return true;
}, {
    message: 'Please select a drop-off location.',
    path: ['locationId'],
}).refine(data => {
    if (data.pickupType === 'partner') return !!data.partnerId;
    return true;
}, {
    message: 'Please select a partner.',
    path: ['partnerId'],
});


type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
    toyConditions: ToyCondition[];
    accessoryTypes: AccessoryType[];
    locations: Location[];
    partners: Partner[];
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function ScheduleForm({ toyConditions, accessoryTypes, locations, partners }: ScheduleFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [state, formAction] = useActionState(schedulePickup, initialState);
  
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      pickupType: 'my-address',
      address: '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      notes: '',
    }
  });
  
  const pickupType = form.watch('pickupType');
  const locationId = form.watch('locationId');
  const partnerId = form.watch('partnerId');

  useEffect(() => {
    if (!state) return;
    if (state.message && !state.error) {
       const pickupDate = form.getValues('pickupDate');
       const timeSlot = form.getValues('timeSlot');
       toast({
        title: "Pickup Scheduled!",
        description: `We'll see you on ${format(pickupDate, 'PPP')} between ${timeSlot}.`,
      });
      form.reset({ name: user?.name ?? '', email: user?.email ?? '', address: '', notes: '', pickupType: 'my-address' });
    }
    if (typeof state.error === 'string') {
        toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast, form, user]);

  
  const addressValue = form.watch('address');
  const fieldErrors = typeof state.error === 'object' ? state.error : {};
  
  const getMapAddress = () => {
    if (pickupType === 'my-address') {
      return addressValue || "Enter an address to see it here.";
    }
    if (pickupType === 'drop-off' && locationId) {
      return locations.find(l => String(l.id) === locationId)?.address ?? 'Please select a location.';
    }
    if (pickupType === 'partner' && partnerId) {
       return `Pickup from ${partners.find(p => String(p.id) === partnerId)?.name ?? 'partner'}`;
    }
    return "Enter pickup details to see the location here.";
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
      <Form {...form}>
          <form action={formAction}>
          <CardHeader>
              <CardTitle>Pickup Details</CardTitle>
              <CardDescription>Fill out the form below to schedule your donation pickup.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="pickupType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Pickup Source</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="my-address" />
                        </FormControl>
                        <FormLabel className="font-normal">My Address</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="drop-off" />
                        </FormControl>
                        <FormLabel className="font-normal">Community Drop-off</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="partner" />
                        </FormControl>
                        <FormLabel className="font-normal">Partner Org</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="jane.doe@example.com" {...field} />
                        </FormControl>
                        {fieldErrors?.email && <p className="text-destructive text-sm">{fieldErrors.email[0]}</p>}
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              {pickupType === 'my-address' && (
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
              )}
              {pickupType === 'drop-off' && (
                 <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Drop-off Point</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map(loc => (
                              <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}
               {pickupType === 'partner' && (
                 <FormField
                    control={form.control}
                    name="partnerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner Organization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a partner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partners.map(p => (
                              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

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
                                    name="pickupDateBtn"
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
                              <SelectTrigger name="timeSlotBtn">
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
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="toyConditionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Toy Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger name="toyConditionIdBtn">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {toyConditions.map(condition => (
                                <SelectItem key={condition.id} value={String(condition.id)}>{condition.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="accessoryTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accessory Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger name="accessoryTypeIdBtn">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {accessoryTypes.map(type => (
                                <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div>
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
              <SubmitButton>Schedule Pickup</SubmitButton>
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
                      <p className="font-semibold">Pickup Location</p>
                      <p className="text-sm text-muted-foreground min-h-10">
                          {getMapAddress()}
                      </p>
                  </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
