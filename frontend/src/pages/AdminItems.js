import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { itemsAPI } from '../api/items';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (search) {
      const searchLower = search.toLowerCase();
      setFilteredItems(
        items.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower)
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [search, items]);

  const fetchItems = async () => {
    try {
      const response = await itemsAPI.getAll();
      setItems(response.data);
    } catch (err) {
      toast.error('Failed to load items');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await itemsAPI.delete(deleteItem.id);
      setItems(items.filter(item => item.id !== deleteItem.id));
      toast.success('Item deleted successfully');
      setDeleteItem(null);
    } catch (err) {
      toast.error('Failed to delete item');
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8" data-testid="admin-items-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-mono text-3xl font-bold tracking-tight uppercase" data-testid="manage-items-title">
          Manage Items
        </h1>
        <Button onClick={() => navigate('/admin/items/new')} data-testid="create-item-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="admin-search-input"
          />
        </div>
      </div>

      <div className="border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest">Image</th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest">Title</th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest">Category</th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest">Price</th>
                <th className="text-left p-4 font-mono text-xs uppercase tracking-widest">Stock</th>
                <th className="text-right p-4 font-mono text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-muted-foreground font-mono" data-testid="no-items">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-secondary/50" data-testid={`admin-item-row-${item.id}`}>
                    <td className="p-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="p-4 font-sans">{item.title}</td>
                    <td className="p-4 font-mono text-xs uppercase">{item.category}</td>
                    <td className="p-4 font-mono">${item.price}</td>
                    <td className="p-4 font-mono">{item.quantity}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/items/${item.id}/edit`)}
                          data-testid={`edit-button-${item.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteItem(item)}
                          data-testid={`delete-button-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono uppercase">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="font-sans">
              Are you sure you want to delete "{deleteItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono uppercase text-xs" data-testid="cancel-delete-button">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="font-mono uppercase text-xs" data-testid="confirm-delete-button">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminItems;