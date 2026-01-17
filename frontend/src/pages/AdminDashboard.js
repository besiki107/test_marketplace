import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../api/items';
import { Package, Grid, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    categories: 0,
    newestItem: null
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await itemsAPI.getAll();
      const items = response.data;
      const categories = [...new Set(items.map(item => item.category))];
      const newest = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      setStats({
        totalItems: items.length,
        categories: categories.length,
        newestItem: newest
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <div className="p-6 md:p-8" data-testid="admin-dashboard-page">
      <h1 className="font-mono text-3xl font-bold tracking-tight uppercase mb-8" data-testid="dashboard-title">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-border bg-card p-6" data-testid="stat-total-items">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
            <span className="font-mono text-3xl font-bold">{stats.totalItems}</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total Items</p>
        </div>

        <div className="border border-border bg-card p-6" data-testid="stat-categories">
          <div className="flex items-center justify-between mb-4">
            <Grid className="h-8 w-8 text-muted-foreground" />
            <span className="font-mono text-3xl font-bold">{stats.categories}</span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categories</p>
        </div>

        <div className="border border-border bg-card p-6" data-testid="stat-newest">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {stats.newestItem ? new Date(stats.newestItem.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Latest Addition</p>
        </div>
      </div>

      <div className="border border-border bg-card p-6">
        <h2 className="font-mono text-xl font-bold tracking-tight uppercase mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/items"
            className="font-mono text-sm uppercase tracking-wider border border-border px-6 py-3 hover:border-primary transition-colors text-center"
            data-testid="manage-items-link"
          >
            Manage Items
          </Link>
          <Link
            to="/admin/items/new"
            className="font-mono text-sm uppercase tracking-wider bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors text-center"
            data-testid="add-item-link"
          >
            Add New Item
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;