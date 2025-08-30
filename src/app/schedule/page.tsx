
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ScheduleForm } from './_components/schedule-form';
import { AccessoryType, Location, Partner, ToyCondition } from '@/db/schema';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

const mockToyConditions = [
    { id: 1, name: 'New' },
    { id: 2, name: 'Gently Used' },
    { id: 3, name: 'Play-worn' },
];

const mockAccessoryTypes = [
    { id: 1, name: 'Stroller' },
    { id: 2, name: 'Car Seat' },
    { id: 3, name: 'High Chair' },
];

const mockLocations = [
  { id: 1, name: "Northwood Community Center", address: "4500 Northwood Ave", hours: "" },
  { id: 2, name: "Southside Public Library", address: "876 Library Ln", hours: "" },
];

const mockPartners = [
  { id: 1, name: "Children's Joy Foundation", description: "", logoUrl: "", logoHint: "" },
  { id: 2, name: "Northwood School District", description: "", logoUrl: "", logoHint: "" },
];

async function getScheduleData() {
    if (!process.env.POSTGRES_URL) {
        return {
            toyConditions: mockToyConditions as ToyCondition[],
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[],
        };
    }
    try {
        const { db } = await import('@/db');
        const toyConditions = await db.query.toyConditions.findMany();
        const accessoryTypes = await db.query.accessoryTypes.findMany();
        const locations = await db.query.locations.findMany();
        const partners = await db.query.partners.findMany();

        return { 
            toyConditions: toyConditions.length > 0 ? toyConditions : mockToyConditions, 
            accessoryTypes: accessoryTypes.length > 0 ? accessoryTypes : mockAccessoryTypes,
            locations: locations.length > 0 ? locations : mockLocations,
            partners: partners.length > 0 ? partners: mockPartners
        };
    } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        return { 
            toyConditions: mockToyConditions as ToyCondition[], 
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[]
        };
    }
}


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
