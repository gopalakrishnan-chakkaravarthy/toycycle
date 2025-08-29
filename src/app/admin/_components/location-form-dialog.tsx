'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Location } from '@/db/schema';
import { useFormState } from 'react';
import { createLocation, updateLocation } from '../actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';


interface LocationFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  location: Location | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};

export function LocationFormDialog({ isOpen, setIsOpen, location }: LocationFormDialogProps) {
  const { toast } = useToast();
  const action = location ? updateLocation.bind(null, location.id) : createLocation;
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.message && !state.error) {
      toast({ title: 'Success', description: state.message });
      setIsOpen(false);
    }
    if (typeof state.error === 'string') {
        toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast, setIsOpen]);
  
  const fieldErrors = typeof state.error === 'object' ? state.error : {};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{location ? 'Edit Location' : 'Add New Location'}</DialogTitle>
          <DialogDescription>
            {location ? 'Update the details of the drop-off location.' : 'Fill in the information for the new location.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" name="name" defaultValue={location?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={location?.address ?? ''} />
              {fieldErrors?.address && <p className="text-destructive text-sm">{fieldErrors.address[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input id="hours" name="hours" defaultValue={location?.hours ?? ''} placeholder="e.g., Mon-Fri: 9am - 5pm" />
              {fieldErrors?.hours && <p className="text-destructive text-sm">{fieldErrors.hours[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{location ? 'Save Changes' : 'Create Location'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
