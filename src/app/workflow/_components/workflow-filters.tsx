
'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, FilterX } from 'lucide-react';
import type { Partner, Location } from '@/db/schema';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface WorkflowFiltersProps {
  partners: Partner[];
  locations: Location[];
}

export function WorkflowFilters({ partners, locations }: WorkflowFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get('date') ? parseISO(searchParams.get('date')!) : undefined
  );
  const [partnerId, setPartnerId] = useState(searchParams.get('partnerId') ?? '');
  const [locationId, setLocationId] = useState(searchParams.get('locationId') ?? '');


  const handleFilterChange = (key: string, value: string | undefined) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    // When a specific filter is chosen, remove the others to avoid confusion
    if (key === 'date' && value) {
        current.delete('partnerId');
        current.delete('locationId');
        setPartnerId('');
        setLocationId('');
    }
    if (key === 'partnerId' && value) {
        current.delete('date');
        current.delete('locationId');
        setDate(undefined);
        setLocationId('');
    }
    if (key === 'locationId' && value) {
        current.delete('date');
        current.delete('partnerId');
        setDate(undefined);
        setPartnerId('');
    }


    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${pathname}${query}`);
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    handleFilterChange('date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined);
  }

  const handlePartnerSelect = (id: string) => {
    setPartnerId(id);
    handleFilterChange('partnerId', id);
  }

  const handleLocationSelect = (id: string) => {
    setLocationId(id);
    handleFilterChange('locationId', id);
  }

  const clearFilters = () => {
    setDate(undefined);
    setPartnerId('');
    setLocationId('');
    router.push(pathname);
  };
  
  const hasActiveFilters = !!date || !!partnerId || !!locationId;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="grid gap-2">
        <Label>By Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

       <div className="grid gap-2">
         <Label>By Partner</Label>
         <Select onValueChange={handlePartnerSelect} value={partnerId}>
            <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a partner" />
            </SelectTrigger>
            <SelectContent>
                {partners.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>
      
       <div className="grid gap-2">
         <Label>By Drop-off Location</Label>
         <Select onValueChange={handleLocationSelect} value={locationId}>
            <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
                {locations.map(l => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>
      
      {hasActiveFilters && (
         <Button variant="ghost" onClick={clearFilters}>
            <FilterX className="mr-2" />
            Clear Filters
        </Button>
      )}
    </div>
  );
}
