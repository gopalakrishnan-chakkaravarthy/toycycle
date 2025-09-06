'use client';
import { useState } from 'react';
import { EcommerceIntegration } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, KeyRound } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EcommerceIntegrationFormDialog } from './ecommerce-integration-form-dialog';
import { DeleteConfirmationDialog } from '@/app/admin/_components/delete-confirmation-dialog';
import { deleteEcommerceIntegration } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function EcommerceIntegrationList({ integrations }: { integrations: EcommerceIntegration[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<EcommerceIntegration | null>(null);
  const { toast } = useToast();

  const handleEdit = (integration: EcommerceIntegration) => {
    setSelectedIntegration(integration);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedIntegration(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = (integration: EcommerceIntegration) => {
    setSelectedIntegration(integration);
    setIsDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!selectedIntegration) return;
    
    const result = await deleteEcommerceIntegration(selectedIntegration.id);

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        setIsDeleteOpen(false);
        setSelectedIntegration(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.length > 0 ? (
              integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">{integration.platform}</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">••••••••{integration.apiKey.slice(-4)}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                      <Badge variant={integration.isActive ? 'default' : 'outline'}>
                        {integration.isActive ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleEdit(integration)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(integration)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No integrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EcommerceIntegrationFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        integration={selectedIntegration}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={performDelete}
        title="Delete Integration"
        description={`Are you sure you want to delete the "${selectedIntegration?.platform}" integration? This action cannot be undone.`}
      />
    </div>
  );
}
