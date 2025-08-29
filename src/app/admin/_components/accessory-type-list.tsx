'use client';
import { useState } from 'react';
import { AccessoryType } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AccessoryTypeFormDialog } from './accessory-type-form-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { deleteAccessoryType } from '../actions';
import { useToast } from '@/hooks/use-toast';

export function AccessoryTypeList({ accessoryTypes }: { accessoryTypes: AccessoryType[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAccessoryType, setSelectedAccessoryType] = useState<AccessoryType | null>(null);
  const { toast } = useToast();

  const handleEdit = (accessoryType: AccessoryType) => {
    setSelectedAccessoryType(accessoryType);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAccessoryType(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = (accessoryType: AccessoryType) => {
    setSelectedAccessoryType(accessoryType);
    setIsDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!selectedAccessoryType) return;
    
    const result = await deleteAccessoryType(selectedAccessoryType.id);

    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        setIsDeleteOpen(false);
        setSelectedAccessoryType(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2" />
          Add Type
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
            {accessoryTypes.length > 0 ? (
              accessoryTypes.map((accessoryType) => (
                <TableRow key={accessoryType.id}>
                  <TableCell className="font-medium">{accessoryType.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(accessoryType)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(accessoryType)} className="text-destructive">
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
                  No accessory types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AccessoryTypeFormDialog
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        accessoryType={selectedAccessoryType}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={performDelete}
        title="Delete Accessory Type"
        description={`Are you sure you want to delete "${selectedAccessoryType?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
