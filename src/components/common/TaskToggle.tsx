import { Switch, Label } from '@fluentui/react-components';
import { useCallback } from 'react';
import { PeoplePicker } from './PeoplePicker';

interface TaskToggleProps {
  label: string;
  checked: boolean;
  responsibleUser: string;
  onToggle: (checked: boolean, user: string) => void;
}

export function TaskToggle({ label, checked, responsibleUser, onToggle }: TaskToggleProps) {
  const handleToggle = useCallback(
    (_: unknown, data: { checked: boolean }) => {
      onToggle(data.checked, responsibleUser);
    },
    [onToggle, responsibleUser],
  );

  const handlePersonChange = useCallback(
    (upn: string) => {
      onToggle(checked, upn);
    },
    [onToggle, checked],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Switch checked={checked} onChange={handleToggle} />
      <Label style={{ minWidth: 140, fontWeight: checked ? 600 : 400 }}>
        {label}
      </Label>
      <PeoplePicker
        value={responsibleUser}
        onChange={handlePersonChange}
      />
    </div>
  );
}
