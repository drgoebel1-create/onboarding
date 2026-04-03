import { MessageBar, MessageBarBody, MessageBarTitle, Button } from '@fluentui/react-components';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = 'Fehler', message, onRetry }: ErrorMessageProps) {
  return (
    <div style={{ padding: 24 }}>
      <MessageBar intent="error">
        <MessageBarBody>
          <MessageBarTitle>{title}</MessageBarTitle>
          {message}
        </MessageBarBody>
      </MessageBar>
      {onRetry && (
        <div style={{ marginTop: 12 }}>
          <Button appearance="primary" onClick={onRetry}>
            Erneut versuchen
          </Button>
        </div>
      )}
    </div>
  );
}
