import { tokens } from '@fluentui/react-components';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
            background: tokens.colorNeutralBackground2,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
