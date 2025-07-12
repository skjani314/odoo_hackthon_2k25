const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition duration-150 ease-in-out">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;