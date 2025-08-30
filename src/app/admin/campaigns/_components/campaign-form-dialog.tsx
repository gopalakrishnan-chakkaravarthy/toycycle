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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Campaign } from '@/db/schema';
import { useActionState, useEffect, useState } from 'react';
import { createCampaign, updateCampaign } from '../../actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/app/admin/_components/submit-button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CampaignFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  campaign: Campaign | null;
}

const initialState = {
  message: '',
  error: undefined as string | Record<string, string[] | undefined> | undefined,
};

export function CampaignFormDialog({ isOpen, setIsOpen, campaign }: CampaignFormDialogProps) {
  const { toast } = useToast();
  const action = campaign ? updateCampaign.bind(null, campaign.id) : createCampaign;
  const [state, formAction] = useActionState(action, initialState);
  const [endDate, setEndDate] = useState<Date | undefined>(campaign?.endDate ? new Date(campaign.endDate) : undefined);

  useEffect(() => {
    if (campaign?.endDate) {
      setEndDate(new Date(campaign.endDate));
    } else {
      setEndDate(undefined);
    }
  }, [campaign]);

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
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Add New Campaign'}</DialogTitle>
          <DialogDescription>
            {campaign ? 'Update the details of the campaign.' : 'Fill in the information for the new campaign.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input id="name" name="name" defaultValue={campaign?.name ?? ''} />
              {fieldErrors?.name && <p className="text-destructive text-sm">{fieldErrors.name[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={campaign?.description ?? ''} />
               {fieldErrors?.description && <p className="text-destructive text-sm">{fieldErrors.description[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <input type="hidden" name="endDate" value={endDate?.toISOString() ?? ''} />
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                            'w-full justify-start text-left font-normal',
                            !endDate && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {fieldErrors?.endDate && <p className="text-destructive text-sm">{fieldErrors.endDate[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton>{campaign ? 'Save Changes' : 'Create Campaign'}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
