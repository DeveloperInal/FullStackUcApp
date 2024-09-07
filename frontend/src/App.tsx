import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StartMenu from "./components/StartMenu";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/tg_id/:tg_id" element={<StartMenu />} />
            </Routes>
        </Router>
    );
}

export default App;
