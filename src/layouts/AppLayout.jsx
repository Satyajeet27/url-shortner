import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container px-16">
        <Navbar />
        <Outlet />
      </main>
      <footer className="p-6 text-center bg-gray-800 mt-10 ">
        Made with 💖 by Satya
      </footer>
    </div>
  );
};

export default AppLayout;
