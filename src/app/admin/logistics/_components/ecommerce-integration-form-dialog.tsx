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
import { EcommerceIntegration } from '@/db/schema';
import { useActionState, useEffect } from 'react';
import { createEcommerceIntegration, updateEcommerceIntegration } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/app/admin/_components/submit-button';


interface EcommerceIntegrationFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  integration: EcommerceIntegration | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function EcommerceIntegrationFormDialog({ isOpen, setIsOpen, integration }: EcommerceIntegrationFormDialogProps) {
  const { toast } = useToast();
  const action = integration ? updateEcommerceIntegration.bind(null, integration.id) : createEcommerceIntegration;
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
          <DialogTitle>{integration ? 'Edit Integration' : 'Add New Integration'}</DialogTitle>
          <DialogDescription>
            {integration ? 'Update the details of the API integration.' : 'Fill in the information for the new integration.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform Name</Label>
              <Input id="platform" name="platform" defaultValue={integration?.platform ?? ''} placeholder="e.g., Flipkart" />
              {fieldErrors?.platform && <p className="text-destructive text-sm">{fieldErrors.platform[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input id="apiKey" name="apiKey" defaultValue={integration?.apiKey ?? ''} />
              {fieldErrors?.apiKey && <p className="text-destructive text-sm">{fieldErrors.apiKey[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret (optional)</Label>
              <Input id="apiSecret" name="apiSecret" defaultValue={integration?.apiSecret ?? ''} />
              {fieldErrors?.apiSecret && <p className="text-destructive text-sm">{fieldErrors.apiSecret[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{integration ? 'Save Changes' : 'Create Integration'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
