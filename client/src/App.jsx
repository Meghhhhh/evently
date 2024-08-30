import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Router>
      <div>
        <Routes>
          {isVisible ? (
            <Route
              path="/"
              element={<LandingPage setIsVisible={setIsVisible} />}
            />
          ) : (
            <Route path="/" element={<Home />} />
          )}

          <Route path="/auth" element={<NotFound />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/caterer" element={<NotFound />} />
          <Route path="/decorator" element={<NotFound />} />
          <Route path="/photographer" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
