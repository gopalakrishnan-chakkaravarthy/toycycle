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
import { ToyCondition } from '@/db/schema';
import { useActionState, useEffect } from 'react';
import { createToyCondition, updateToyCondition } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';


interface ToyConditionFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toyCondition: ToyCondition | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function ToyConditionFormDialog({ isOpen, setIsOpen, toyCondition }: ToyConditionFormDialogProps) {
  const { toast } = useToast();
  const action = toyCondition ? updateToyCondition.bind(null, toyCondition.id) : createToyCondition;
  const [state, formAction] = useActionState(action, initialState);

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
          <DialogTitle>{toyCondition ? 'Edit Toy Condition' : 'Add New Toy Condition'}</DialogTitle>
          <DialogDescription>
            {toyCondition ? 'Update the name of the toy condition.' : 'Fill in the information for the new toy condition.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Condition Name</Label>
              <Input id="name" name="name" defaultValue={toyCondition?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{toyCondition ? 'Save Changes' : 'Create Condition'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
