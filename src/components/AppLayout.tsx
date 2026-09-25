import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function AppLayout() {
  return (
    <div className="flex h-full min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64 min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-slate-50/80 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
