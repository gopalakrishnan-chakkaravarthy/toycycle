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
import { Textarea } from '@/components/ui/textarea';
import { Partner } from '@/db/schema';
import { useFormState } from 'react';
import { createPartner, updatePartner } from '../actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';


interface PartnerFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  partner: Partner | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function PartnerFormDialog({ isOpen, setIsOpen, partner }: PartnerFormDialogProps) {
  const { toast } = useToast();
  const action = partner ? updatePartner.bind(null, partner.id) : createPartner;
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
          <DialogTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
          <DialogDescription>
            {partner ? 'Update the details of the partner.' : 'Fill in the information for the new partner.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Partner Name</Label>
              <Input id="name" name="name" defaultValue={partner?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={partner?.description ?? ''} />
               {fieldErrors?.description && <p className="text-destructive text-sm">{fieldErrors.description[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" name="logoUrl" defaultValue={partner?.logoUrl ?? ''} placeholder="https://example.com/logo.png" />
               {fieldErrors?.logoUrl && <p className="text-destructive text-sm">{fieldErrors.logoUrl[0]}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="logoHint">Logo AI Hint</Label>
              <Input id="logoHint" name="logoHint" defaultValue={partner?.logoHint ?? ''} placeholder="e.g. 'charity logo'"/>
               {fieldErrors?.logoHint && <p className="text-destructive text-sm">{fieldErrors.logoHint[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{partner ? 'Save Changes' : 'Create Partner'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
