import { useState, useRef, useEffect } from 'react';
import { Search, X, Menu, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, mockMechanics } from '@/data/mockData';
import { fadeInDown, slideInLeft, buttonPress, fadeIn, staggerContainer, staggerItem } from '@/lib/animations';

/**
 * Floating search bar with category filters and autocomplete
 * Enhanced with smooth animations and micro-interactions
 */
export const SearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  onCategorySelect,
  onMenuClick,
  onMechanicSelect
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter mechanics based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const results = mockMechanics.filter(mechanic => {
        // Prioritize matches from the beginning
        const nameMatch = mechanic.name.toLowerCase().startsWith(query);
        const partialMatch = mechanic.name.toLowerCase().includes(query);
        const locationMatch = mechanic.location.toLowerCase().includes(query);
        
        return nameMatch || partialMatch || locationMatch;
      }).sort((a, b) => {
        // Prioritize results that start with the query
        const aStarts = a.name.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bStarts = b.name.toLowerCase().startsWith(searchQuery.toLowerCase());
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      }).slice(0, 5); // Limit to 5 results
      
      setFilteredResults(results);
      setIsDropdownOpen(results.length > 0);
    } else {
      setFilteredResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle mechanic selection
  const handleSelectMechanic = (mechanic) => {
    setSearchQuery(mechanic.name);
    setIsDropdownOpen(false);
    if (onMechanicSelect) {
      onMechanicSelect(mechanic);
    }
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="font-bold text-primary">{text.substring(index, index + query.length)}</span>
        {text.substring(index + query.length)}
      </>
    );
  };
  return (
    <motion.div 
      className="absolute top-0 left-0 right-0 px-4 pt-safe pb-3 z-40 pointer-events-none"
      {...fadeInDown}
    >
      <div className="flex items-center gap-3 pointer-events-auto">
        <motion.div 
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onMenuClick}
            className="shadow-lg flex-shrink-0 hover:shadow-xl transition-all h-11 w-11 bg-white border-0"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </Button>
        </motion.div>

        <motion.div 
          ref={searchRef}
          className="bg-white rounded-2xl flex-1 shadow-lg hover:shadow-xl transition-all relative border-0"
          whileFocus={{ boxShadow: '0 8px 24px rgba(21, 93, 252, 0.15)' }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search mechanics or services"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim() && filteredResults.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              className="pl-12 pr-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all text-sm font-medium h-12 text-gray-700 placeholder:text-gray-400"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className="h-9 w-9 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && filteredResults.length > 0 && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-h-80 overflow-y-auto"
              >
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="py-2"
                >
                  {filteredResults.map((mechanic, index) => (
                    <motion.div
                      key={mechanic.id}
                      variants={staggerItem}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectMechanic(mechanic)}
                      className="px-4 py-3 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Search className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            {highlightMatch(mechanic.name, searchQuery)}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{mechanic.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span>{mechanic.rating}</span>
                            </div>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                              mechanic.available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {mechanic.available ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          <AnimatePresence>
            {isDropdownOpen && searchQuery.trim() && filteredResults.length === 0 && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-6 text-center">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
                  <p className="text-xs text-gray-500">Try searching for a different mechanic or service</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div 
        className="mt-3 overflow-x-auto scrollbar-hide pointer-events-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex gap-2.5 pb-1">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => onCategorySelect(category.id)}
                  variant={isSelected ? 'default' : 'secondary'}
                  size="sm"
                  className={`flex-shrink-0 transition-all text-xs font-semibold h-10 px-4 gap-2 rounded-full border-0 ${
                    isSelected 
                      ? 'shadow-lg bg-primary text-white' 
                      : 'shadow-md bg-white hover:shadow-lg hover:bg-gray-50'
                  }`}
                >
                  <motion.div
                    animate={isSelected ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </motion.div>
                  {category.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
