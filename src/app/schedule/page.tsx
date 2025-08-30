
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ScheduleForm } from './_components/schedule-form';
import { AccessoryType, Location, Partner, ToyCondition } from '@/db/schema';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { getScheduleData } from './actions';


export default function SchedulePage() {
  const [data, setData] = useState<{
    toyConditions: ToyCondition[];
    accessoryTypes: AccessoryType[];
    locations: Location[];
    partners: Partner[];
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
        const scheduleData = await getScheduleData();
        setData(scheduleData);
    }
    loadData();
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
        setIsModalOpen(true);
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Schedule a Pickup</h1>
          <p className="text-muted-foreground">Select a date from the calendar to schedule your donation pickup.</p>
        </header>

        <Card>
            <CardContent className="p-2 md:p-4 flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md"
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
            </CardContent>
        </Card>

        {data && (
            <ScheduleForm 
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
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
