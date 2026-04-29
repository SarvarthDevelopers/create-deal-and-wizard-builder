import { Routes, Route } from 'react-router';
import { DealWizardBuilder } from './components/DealWizardBuilder';
import { DealsPage } from './components/deals/DealsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DealWizardBuilder />} />
      <Route path="/deals" element={<DealsPage />} />
    </Routes>
  );
}
