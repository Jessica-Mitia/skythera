import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchLocationProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export function SearchLocation({ onSearch, isLoading }: SearchLocationProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        variant="ghost"
        size="icon"
        className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
        disabled={isLoading || !query.trim()}
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
