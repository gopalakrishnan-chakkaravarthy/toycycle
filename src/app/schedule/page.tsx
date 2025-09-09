
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ScheduleForm } from './_components/schedule-form';
import { AccessoryType, Location, Partner, ToyCondition } from '@/db/schema';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { getScheduleData, getScheduledDays, getPickupsForDate, DetailedPickup } from './actions';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PickupList } from './_components/pickup-list';
import { useAuth } from '@/context/auth-context';


export default function SchedulePage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    toyConditions: ToyCondition[];
    accessoryTypes: AccessoryType[];
    locations: Location[];
    partners: Partner[];
  } | null>(null);

  const [scheduledDays, setScheduledDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [pickups, setPickups] = useState<DetailedPickup[]>([]);
  const [isPending, startTransition] = useTransition();


  const loadPickups = useCallback((date: Date | undefined) => {
    if (!date) return;
    startTransition(async () => {
      const fetchedPickups = await getPickupsForDate(date, user);
      setPickups(fetchedPickups);
    });
  }, [user]);

  useEffect(() => {
    async function loadData() {
        const [scheduleData, scheduledDaysData] = await Promise.all([
          getScheduleData(),
          getScheduledDays()
        ]);
        setData(scheduleData);
        setScheduledDays(scheduledDaysData);
    }
    loadData();
    loadPickups(selectedDate);
  }, [loadPickups, selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
        loadPickups(date);
    }
  }

  const handleFormSuccess = (newPickupDate: Date) => {
    setScheduledDays(prev => [...prev, newPickupDate]);
    loadPickups(newPickupDate);
    setIsModalOpen(false);
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Schedule a Pickup</h1>
          <p className="text-muted-foreground">Select a date from the calendar to view or schedule donation pickups.</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-1">
                <CardContent className="p-2 md:p-4 flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md"
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                        modifiers={{ scheduled: scheduledDays }}
                        modifiersClassNames={{
                            scheduled: 'font-bold text-primary',
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle>Pickups for {selectedDate ? format(selectedDate, 'PPP') : 'N/A'}</CardTitle>
                             <CardDescription>
                                {isPending ? 'Loading pickups...' : `${pickups.length} pickup(s) scheduled for this date.`}
                            </CardDescription>
                        </div>
                         <Button size="sm" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Pickup
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isPending ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <PickupList pickups={pickups} />
                    )}
                </CardContent>
            </Card>
        </div>


        {data && (
            <ScheduleForm 
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              onSuccess={handleFormSuccess}
              selectedDate={selectedDate}
              toyConditions={data.toyConditions} 
              accessoryTypes={data.accessoryTypes}
              locations={data.locations}
              partners={data.partners}
            />
        )}
      </div>
    </AppLayout>
  );
}
