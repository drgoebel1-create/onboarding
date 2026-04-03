import { Switch, Input, Label } from '@fluentui/react-components';
import { useState, useCallback } from 'react';

interface TaskToggleProps {
  label: string;
  checked: boolean;
  responsibleUser: string;
  onToggle: (checked: boolean, user: string) => void;
}

export function TaskToggle({ label, checked, responsibleUser, onToggle }: TaskToggleProps) {
  const [user, setUser] = useState(responsibleUser);

  const handleToggle = useCallback(
    (_: unknown, data: { checked: boolean }) => {
      onToggle(data.checked, user);
    },
    [onToggle, user],
  );

  const handleUserBlur = useCallback(() => {
    if (user !== responsibleUser) {
      onToggle(checked, user);
    }
  }, [user, responsibleUser, checked, onToggle]);

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
      <Input
        placeholder="Zuständige/r (E-Mail)"
        value={user}
        onChange={(_, data) => setUser(data.value)}
        onBlur={handleUserBlur}
        style={{ flex: 1 }}
        size="small"
      />
    </div>
  );
}
