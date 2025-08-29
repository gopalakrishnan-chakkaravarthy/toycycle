'use client';
import { useState } from 'react';
import { ToyCondition } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ToyConditionFormDialog } from './toy-condition-form-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { deleteToyCondition } from '../actions';
import { useToast } from '@/hooks/use-toast';

export function ToyConditionList({ toyConditions }: { toyConditions: ToyCondition[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedToyCondition, setSelectedToyCondition] = useState<ToyCondition | null>(null);
  const { toast } = useToast();

  const handleEdit = (toyCondition: ToyCondition) => {
    setSelectedToyCondition(toyCondition);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedToyCondition(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = (toyCondition: ToyCondition) => {
    setSelectedToyCondition(toyCondition);
    setIsDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!selectedToyCondition) return;
    
    const result = await deleteToyCondition(selectedToyCondition.id);

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        setIsDeleteOpen(false);
        setSelectedToyCondition(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2" />
          Add Condition
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toyConditions.length > 0 ? (
              toyConditions.map((toyCondition) => (
                <TableRow key={toyCondition.id}>
                  <TableCell className="font-medium">{toyCondition.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(toyCondition)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(toyCondition)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center h-24">
                  No toy conditions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ToyConditionFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        toyCondition={selectedToyCondition}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={performDelete}
        title="Delete Toy Condition"
        description={`Are you sure you want to delete "${selectedToyCondition?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
