import { } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/business/Layout';
import HomePage from './pages/HomePage';
import LotteryDetailPage from './pages/LotteryDetailPage';
import GlobalStatsPage from './pages/GlobalStatsPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lottery/detail" element={<LotteryDetailPage />} />
          <Route path="/global-stats" element={<GlobalStatsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;