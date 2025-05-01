import logo from './logo.svg';
import './App.css';
import './output.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";  
import LoginPage from './pages/LoginPage';
import {UserRoleProvider} from "./contexts/UserRoleContext";
import Rooms from "./pages/Rooms";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Tables from "./pages/Tables";

function App() {
    return (
        <div className="App">
            <UserRoleProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/rooms" element={<ProtectedRoute><Rooms/></ProtectedRoute>}/>
                        <Route path="/tables/:roomId" element={<ProtectedRoute><Tables/></ProtectedRoute>}/>
                    </Routes>
                </BrowserRouter>
            </UserRoleProvider>
        </div>
    );
}

export default App;
