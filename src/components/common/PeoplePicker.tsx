import { useState, useCallback, useRef } from 'react';
import {
  Combobox,
  Option,
  Persona,
  tokens,
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
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleInput = useCallback((_: unknown, data: { value: string }) => {
    setInputValue(data.value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (data.value.length < 2) {
      setOptions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
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

  const handleOptionSelect = useCallback(
    (_: unknown, data: { optionValue?: string; optionText?: string }) => {
      const selectedUser = options.find((u) => u.userPrincipalName === data.optionValue);
      if (selectedUser) {
        setInputValue(selectedUser.displayName);
        onChange(selectedUser.userPrincipalName, selectedUser.displayName);
      }
    },
    [options, onChange],
  );

  return (
    <Combobox
      value={inputValue}
      onInput={handleInput}
      onOptionSelect={handleOptionSelect}
      placeholder={placeholder}
      freeform
      size="small"
      style={{ flex: 1 }}
    >
      {isSearching ? (
        <Option key="__searching" value="" disabled text="">
          <span style={{ color: tokens.colorNeutralForeground3, fontSize: 13 }}>
            Suche...
          </span>
        </Option>
      ) : options.length === 0 && inputValue.length >= 2 ? (
        <Option key="__empty" value="" disabled text="">
          <span style={{ color: tokens.colorNeutralForeground3, fontSize: 13 }}>
            Keine Ergebnisse
          </span>
        </Option>
      ) : (
        options.map((user) => (
          <Option
            key={user.id}
            value={user.userPrincipalName}
            text={user.displayName}
          >
            <Persona
              name={user.displayName}
              secondaryText={user.mail ?? user.userPrincipalName}
              size="small"
              avatar={{ color: 'colorful' }}
            />
          </Option>
        ))
      )}
    </Combobox>
  );
}
