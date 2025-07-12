import { AuthProvider } from './Context/AuthContext/AuthContext.jsx';

import Layout from './components/layout/Layout.jsx'; 
import { Route } from 'react-router-dom';
import { Routes, Navigate } from 'react-router-dom';
import BrowseSkillsPage from './pages/BrowseSkills/BrowseSkill.jsx';
import MyProfilePage from './pages/MyProfilePage/MyProfilePage.jsx';
import PublicProfilePage from './pages/PublicProfilePage/PublicProfilepage.jsx';

const App = () => {

  return (
    <AuthProvider>     
      <Layout>
        <Routes>
          <Route path="/" element={<BrowseSkillsPage/>} />
          <Route path="/home" element={<BrowseSkillsPage />} />
          <Route path="/browse-skills" element={<BrowseSkillsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
