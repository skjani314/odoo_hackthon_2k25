import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
export default Layout;  