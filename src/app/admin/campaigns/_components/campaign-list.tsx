'use client';
import { useState } from 'react';
import { Campaign } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CampaignFormDialog } from './campaign-form-dialog';
import { DeleteConfirmationDialog } from '@/app/admin/_components/delete-confirmation-dialog';
import { deleteCampaign } from '../../actions';
import { useToast } from '@/hooks/use-toast';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { toast } = useToast();

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCampaign(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!selectedCampaign) return;
    
    const result = await deleteCampaign(selectedCampaign.id);

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        setIsDeleteOpen(false);
        setSelectedCampaign(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2" />
          Add Campaign
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => {
                const endDate = new Date(campaign.endDate);
                const isExpired = isPast(endDate);
                return (
                    <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                           <span>{format(endDate, 'PPP')}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={isExpired ? 'outline' : 'default'}>
                            {isExpired ? 'Ended' : 'Active'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(campaign)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
            })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No campaigns found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CampaignFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        campaign={selectedCampaign}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={performDelete}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${selectedCampaign?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
