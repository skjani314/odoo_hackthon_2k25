import { AuthProvider } from './Context/AuthContext/AuthContext.jsx';
import Login from "../src/Auth/Login.jsx"
import VerifyEmail from "../src/Auth/EmailVerify.jsx"
import ResetPassword from "../src/Auth/ResetPassword.jsx"
import{ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import AdminPage from './pages/adminpage/AdminPage.jsx';
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
            <ToastContainer/>
        <Routes>
          <Route path="/" element={<BrowseSkillsPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/emailverify' element={<VerifyEmail />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path="/home" element={<BrowseSkillsPage />} />
          <Route path="/browse-skills" element={<BrowseSkillsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
