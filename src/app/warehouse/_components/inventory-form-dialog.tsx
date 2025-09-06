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
import { Inventory, ToyCondition, inventoryStatusEnum, Partner } from '@/db/schema';
import { useActionState, useEffect, useState } from 'react';
import { createInventoryItem, updateInventoryItem } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/app/admin/_components/submit-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface InventoryFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  item: Inventory | null;
  conditions: ToyCondition[];
  partners: Partner[];
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};


export function InventoryFormDialog({ isOpen, setIsOpen, item, conditions, partners }: InventoryFormDialogProps) {
  const { toast } = useToast();
  const action = item ? updateInventoryItem.bind(null, item.id) : createInventoryItem;
  const [state, formAction] = useActionState(action, initialState);
  const [status, setStatus] = useState(item?.status ?? 'received');

  useEffect(() => {
    setStatus(item?.status ?? 'received');
  }, [item]);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the details of the toy.' : 'Fill in the information for the new toy.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Toy Name</Label>
              <Input id="name" name="name" defaultValue={item?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={item?.description ?? ''} />
               {fieldErrors?.description && <p className="text-destructive text-sm">{fieldErrors.description[0]}</p>}
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="conditionId">Condition</Label>
                    <Select name="conditionId" defaultValue={item?.conditionId ? String(item.conditionId) : undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            {conditions.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {fieldErrors?.conditionId && <p className="text-destructive text-sm">{fieldErrors.conditionId[0]}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                     <Select name="status" defaultValue={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {inventoryStatusEnum.enumValues.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {fieldErrors?.status && <p className="text-destructive text-sm">{fieldErrors.status[0]}</p>}
                </div>
            </div>
            {status === 'redistributed' && (
                 <div className="space-y-2">
                    <Label htmlFor="redistributedToPartnerId">Redistribute To Partner</Label>
                    <Select name="redistributedToPartnerId" defaultValue={item?.redistributedToPartnerId ? String(item.redistributedToPartnerId) : undefined}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a partner" />
                        </SelectTrigger>
                        <SelectContent>
                            {partners.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {fieldErrors?.redistributedToPartnerId && <p className="text-destructive text-sm">{fieldErrors.redistributedToPartnerId[0]}</p>}
                </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" defaultValue={item?.imageUrl ?? ''} placeholder="https://picsum.photos/200" />
               {fieldErrors?.imageUrl && <p className="text-destructive text-sm">{fieldErrors.imageUrl[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageHint">Image AI Hint</Label>
              <Input id="imageHint" name="imageHint" defaultValue={item?.imageHint ?? ''} placeholder="e.g. 'robot toy'" />
               {fieldErrors?.imageHint && <p className="text-destructive text-sm">{fieldErrors.imageHint[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{item ? 'Save Changes' : 'Create Item'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
