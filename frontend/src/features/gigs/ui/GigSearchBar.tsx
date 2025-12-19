import { useState } from 'react';
import type { GigFilters } from '@/entities/gig';
import { Input, Button } from '@/shared/ui';

interface GigSearchBarProps {
  onSearch: (filters: GigFilters) => void;
}

export function GigSearchBar({ onSearch }: GigSearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: GigFilters = {
      query: query || undefined,
      category: category || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined
    };
    
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            type="text"
            placeholder="Search gigs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        
        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        
        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      
      <div className="mt-4">
        <Button type="submit" className="w-full md:w-auto">
          Search
        </Button>
      </div>
    </form>
  );
}
