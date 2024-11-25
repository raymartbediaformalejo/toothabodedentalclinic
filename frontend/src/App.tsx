import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import routes from "./routes/index";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
                  <div>
                    <route.component />
                  </div>
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
