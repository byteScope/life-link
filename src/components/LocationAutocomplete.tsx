import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { cn } from './ui/utils';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    district?: string;
    state?: string;
    postcode?: string;
  };
}

export interface LocationData {
  displayName: string;
  shortName: string;
  lat: number;
  lon: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  showCurrentLocation?: boolean;
}

export default function LocationAutocomplete({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter area, city or location",
  className = "",
  showCurrentLocation = true,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Format location name for Bangladesh (Area, City format)
  const formatLocationName = (suggestion: LocationSuggestion): string => {
    const addr = suggestion.address || {};
    const parts: string[] = [];

    // Priority: suburb/neighbourhood > city/town > district
    if (addr.suburb || addr.neighbourhood) {
      parts.push(addr.suburb || addr.neighbourhood || '');
    }
    if (addr.city || addr.town) {
      parts.push(addr.city || addr.town || '');
    } else if (addr.district) {
      parts.push(addr.district);
    }

    // If we have parts, join them; otherwise use first part of display_name
    if (parts.length > 0) {
      return parts.filter(Boolean).join(', ');
    }

    // Fallback: use first 2 parts of display_name
    const nameParts = suggestion.display_name.split(',').slice(0, 2);
    return nameParts.join(', ').trim();
  };

  // Get short name (just area/suburb)
  const getShortName = (suggestion: LocationSuggestion): string => {
    const addr = suggestion.address || {};
    return addr.suburb || addr.neighbourhood || addr.city || addr.town || suggestion.display_name.split(',')[0];
  };

  // Debounced search function - focused on Bangladesh
  const searchLocation = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Using OpenStreetMap Nominatim API - restricted to Bangladesh
      // Adding "Bangladesh" to query and country code restriction
      const searchQuery = `${query}, Bangladesh`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=bd&limit=8&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LifeLink-App/1.0' // Required by Nominatim
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'LifeLink-App/1.0'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            const locationName = formatLocationName(data);
            const shortName = getShortName(data);
            
            onChange(locationName);
            
            if (onLocationSelect) {
              onLocationSelect({
                displayName: locationName,
                shortName: shortName,
                lat: latitude,
                lon: longitude,
              });
            }
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          // Still set coordinates even if reverse geocoding fails
          onChange(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          if (onLocationSelect) {
            onLocationSelect({
              displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              shortName: 'Current Location',
              lat: latitude,
              lon: longitude,
            });
          }
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter it manually.');
        setIsGettingLocation(false);
      }
    );
  };

  // Debounce the search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim().length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        searchLocation(value);
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    const locationName = formatLocationName(suggestion);
    const shortName = getShortName(suggestion);
    
    onChange(locationName);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.blur();

    // Pass location data with coordinates
    if (onLocationSelect) {
      onLocationSelect({
        displayName: locationName,
        shortName: shortName,
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin z-10" />
          )}
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className={cn('pl-10', className)}
          />
        </div>
        {showCurrentLocation && (
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="rounded-xl flex-shrink-0 px-4"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Current
              </>
            )}
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lon}-${index}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? 'bg-gray-50' : ''
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {formatLocationName(suggestion)}
                  </p>
                  {suggestion.address?.district && (
                    <p className="text-xs text-gray-500">
                      {suggestion.address.district}
                      {suggestion.address.state && `, ${suggestion.address.state}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

