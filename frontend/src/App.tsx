import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes/index";
import ProtectedRoutes from "./pages/Auth/ProtectedRoutes";
import UnprotectedRoutes from "./pages/Auth/UnprotectedRoutes";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import UnprotectedRoutes from "./pages/Auth/UnprotectedRoutes";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            return route.isAuthenticated === true ? (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoutes>
                    <div>
                      <route.component />
                    </div>
                  </ProtectedRoutes>
                }
              />
            ) : (
              <Route
                key={index}
                path={route.path}
                element={
                  <UnprotectedRoutes>
                    {!route.isAdminPage ? <Header /> : ""}
                    <route.component />
                    {!route.isAdminPage ? <Footer /> : ""}
                  </UnprotectedRoutes>
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
