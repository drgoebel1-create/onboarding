import { NavDrawer, NavDrawerBody, NavItem } from '@fluentui/react-components';
import {
  Home24Regular,
  People24Regular,
  ChatBubblesQuestion24Regular,
  ClipboardTextLtr24Regular,
} from '@fluentui/react-icons';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { value: '/', icon: <Home24Regular />, label: 'Dashboard' },
  { value: '/cases', icon: <People24Regular />, label: 'Cases' },
  { value: '/feedback', icon: <ChatBubblesQuestion24Regular />, label: 'Feedback' },
  { value: '/protocol', icon: <ClipboardTextLtr24Regular />, label: 'Protokoll' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedValue = navItems.find(
    (item) =>
      item.value === location.pathname ||
      (item.value !== '/' && location.pathname.startsWith(item.value)),
  )?.value ?? '/';

  return (
    <NavDrawer
      open
      type="inline"
      selectedValue={selectedValue}
      style={{ width: 220, flexShrink: 0 }}
    >
      <NavDrawerBody>
        {navItems.map((item) => (
          <NavItem
            key={item.value}
            icon={item.icon}
            value={item.value}
            onClick={() => navigate(item.value)}
          >
            {item.label}
          </NavItem>
        ))}
      </NavDrawerBody>
    </NavDrawer>
  );
}
