import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CasesListPage } from './components/cases/CasesListPage';
import { NewCasePage } from './components/cases/NewCasePage';
import { CaseDetailPage } from './components/cases/CaseDetailPage';
import { FeedbackPage } from './components/feedback/FeedbackPage';
import { ProtocolPage } from './components/protocol/ProtocolPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesListPage />} />
          <Route path="/cases/new" element={<NewCasePage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/protocol" element={<ProtocolPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
