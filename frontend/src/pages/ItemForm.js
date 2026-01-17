import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsAPI } from '../api/items';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const categories = ['Engine', 'Brakes', 'Lighting', 'Wheels', 'Exhaust', 'Electrical', 'Suspension', 'Body', 'Interior'];

const ItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: '',
    condition: 'new',
    quantity: '1',
    tags: '',
    location: '',
    lat: '',
    lng: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getById(id);
      const item = response.data;
      setFormData({
        title: item.title,
        price: item.price.toString(),
        category: item.category,
        description: item.description,
        image: item.image,
        condition: item.condition,
        quantity: item.quantity.toString(),
        tags: item.tags?.join(', ') || '',
        location: item.location || '',
        lat: item.coordinates?.lat?.toString() || '',
        lng: item.coordinates?.lng?.toString() || ''
      });
    } catch (err) {
      toast.error('Failed to load item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Must be a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }

    const itemData = {
      title: formData.title,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: formData.image,
      condition: formData.condition,
      quantity: parseInt(formData.quantity),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      location: formData.location,
      coordinates: (formData.lat && formData.lng) ? {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      } : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      setLoading(true);
      if (isEdit) {
        await itemsAPI.update(id, itemData);
        toast.success('Item updated successfully');
      } else {
        await itemsAPI.create(itemData);
        toast.success('Item created successfully');
      }
      navigate('/admin/items');
    } catch (err) {
      toast.error(isEdit ? 'Failed to update item' : 'Failed to create item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl" data-testid="item-form-page">
      <h1 className="font-mono text-3xl font-bold tracking-tight uppercase mb-8" data-testid="form-title">
        {isEdit ? 'Edit Item' : 'Create New Item'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title" className="font-mono text-xs uppercase tracking-wider">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            data-testid="title-input"
          />
          {errors.title && <p className="text-destructive text-sm mt-1" data-testid="title-error">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price" className="font-mono text-xs uppercase tracking-wider">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              data-testid="price-input"
            />
            {errors.price && <p className="text-destructive text-sm mt-1" data-testid="price-error">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="category" className="font-mono text-xs uppercase tracking-wider">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger data-testid="category-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-destructive text-sm mt-1" data-testid="category-error">{errors.category}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            data-testid="description-input"
          />
          {errors.description && <p className="text-destructive text-sm mt-1" data-testid="description-error">{errors.description}</p>}
        </div>

        <div>
          <Label htmlFor="image" className="font-mono text-xs uppercase tracking-wider">Image URL *</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
            data-testid="image-input"
          />
          {errors.image && <p className="text-destructive text-sm mt-1" data-testid="image-error">{errors.image}</p>}
          {formData.image && !errors.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover border border-border" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="condition" className="font-mono text-xs uppercase tracking-wider">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
              <SelectTrigger data-testid="condition-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity" className="font-mono text-xs uppercase tracking-wider">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              data-testid="quantity-input"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tags" className="font-mono text-xs uppercase tracking-wider">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="performance, brakes, racing"
            data-testid="tags-input"
          />
        </div>

        <div>
          <Label htmlFor="location" className="font-mono text-xs uppercase tracking-wider">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, State"
            data-testid="location-input"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading} data-testid="submit-button">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isEdit ? 'Update Item' : 'Create Item'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/items')} data-testid="cancel-button">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;