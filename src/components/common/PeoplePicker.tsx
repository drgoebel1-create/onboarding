import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Input,
  Persona,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import { searchUsers, type GraphUser } from '../../api/peopleApi';

interface PeoplePickerProps {
  value: string;
  onChange: (upn: string, displayName: string) => void;
  placeholder?: string;
}

export function PeoplePicker({ value, onChange, placeholder = 'Zuständige/r suchen...' }: PeoplePickerProps) {
  const [options, setOptions] = useState<GraphUser[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((_: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
    setInputValue(data.value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (data.value.length < 2) {
      setOptions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const users = await searchUsers(data.value);
        setOptions(users);
      } catch {
        setOptions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSelect = useCallback(
    (user: GraphUser) => {
      setInputValue(user.displayName);
      setShowDropdown(false);
      setOptions([]);
      onChange(user.userPrincipalName, user.displayName);
    },
    [onChange],
  );

  return (
    <div ref={containerRef} style={{ flex: 1, position: 'relative' }}>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        size="small"
        style={{ width: '100%' }}
      />

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: tokens.colorNeutralBackground1,
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            borderRadius: 4,
            boxShadow: tokens.shadow8,
            maxHeight: 240,
            overflowY: 'auto',
            marginTop: 2,
          }}
        >
          {isSearching ? (
            <div style={{ padding: 12, textAlign: 'center' }}>
              <Spinner size="tiny" label="Suche..." />
            </div>
          ) : options.length === 0 ? (
            <div style={{ padding: 12, color: tokens.colorNeutralForeground3, fontSize: 13 }}>
              Keine Ergebnisse
            </div>
          ) : (
            options.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelect(user)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = tokens.colorNeutralBackground1Hover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                <Persona
                  name={user.displayName}
                  secondaryText={user.mail ?? user.userPrincipalName}
                  size="small"
                  avatar={{ color: 'colorful' }}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
