import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onCitySelect, 
  placeholder = "Search for a city..." 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const cities = await searchCities(query);
          setSuggestions(cities);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch city suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onCitySelect(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city: string) => {
    onCitySelect(city);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            data-testid="search-input"
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-xl border border-white/30 shadow-lg z-10">
          {suggestions.map((city, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="w-full px-4 py-3 text-left text-gray-800 hover:bg-white/50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              data-testid={`suggestion-${index}`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};