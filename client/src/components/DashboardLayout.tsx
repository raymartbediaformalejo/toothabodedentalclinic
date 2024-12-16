import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { NavigationSidebarDashboard } from "./navigation/navigation-sidebar-dashboard";
import NavigationTopDashboard from "./navigation/navigation-top-dashboard";

const DashboardLayout = () => {
  return (
    <>
      <SidebarProvider>
        <NavigationSidebarDashboard />
        <SidebarInset className="flex w-full border bg-neutral-50">
          <NavigationTopDashboard />
          <div className="flex justify-center w-full ">
            <div className="w-full mx-6  mt-12 max-w-[1400px]">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default DashboardLayout;
