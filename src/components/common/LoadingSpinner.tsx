import { Spinner } from '@fluentui/react-components';

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = 'Laden...' }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
      }}
    >
      <Spinner size="large" label={label} />
    </div>
  );
}
