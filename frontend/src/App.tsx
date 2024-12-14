import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes/index";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { NavigationSidebarDashboard } from "./components/navigation/navigation-sidebar-dashboard";

import NavigationTopDashboard from "./components/navigation/navigation-top-dashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          {routes.map((route, index) => {
            return route.isAuthenticated === true ? (
              <Route
                key={index}
                path={route.path}
                element={
                  <SidebarProvider>
                    <NavigationSidebarDashboard />
                    <SidebarInset className="flex w-full border bg-neutral-50">
                      <NavigationTopDashboard />
                      <div className="flex justify-center w-full ">
                        <div className="w-full mx-6  mt-12 max-w-[1400px]">
                          <route.component />
                        </div>
                      </div>
                    </SidebarInset>
                  </SidebarProvider>
                }
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                element={
                  <div>
                    {!route.isAdminPage ? <Header /> : ""}
                    <route.component />
                    {!route.isAdminPage ? <Footer /> : ""}
                  </div>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
