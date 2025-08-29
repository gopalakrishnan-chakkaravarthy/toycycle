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
import { AccessoryType } from '@/db/schema';
import { useActionState, useEffect } from 'react';
import { createAccessoryType, updateAccessoryType } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';


interface AccessoryTypeFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  accessoryType: AccessoryType | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function AccessoryTypeFormDialog({ isOpen, setIsOpen, accessoryType }: AccessoryTypeFormDialogProps) {
  const { toast } = useToast();
  const action = accessoryType ? updateAccessoryType.bind(null, accessoryType.id) : createAccessoryType;
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
          <DialogTitle>{accessoryType ? 'Edit Accessory Type' : 'Add New Accessory Type'}</DialogTitle>
          <DialogDescription>
            {accessoryType ? 'Update the name of the accessory type.' : 'Fill in the information for the new accessory type.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Accessory Type Name</Label>
              <Input id="name" name="name" defaultValue={accessoryType?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{accessoryType ? 'Save Changes' : 'Create Type'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
