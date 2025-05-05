import logo from './logo.svg';
import './App.css';
import './output.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";  
import LoginPage from './pages/LoginPage';
import {UserRoleProvider} from "./contexts/UserRoleContext";
import Rooms from "./pages/Rooms";
import Saucers from "./pages/Saucers";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Tables from "./pages/Tables";
import {MockSocketProvider} from "./contexts/MockSocketContext";
import Spaces from "./pages/Spaces";
import Users from "./pages/Users";

function App() {
    return (
        <div className="App">

            <MockSocketProvider>
                <UserRoleProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<LoginPage/>}/>
                            <Route path="/rooms" element={<ProtectedRoute><Rooms/></ProtectedRoute>}/>
                            <Route path="/tables/:roomId" element={<ProtectedRoute><Tables/></ProtectedRoute>}/>
                            <Route path="/saucers" element={<ProtectedRoute><Saucers/></ProtectedRoute>}/>
                            <Route path="/spaces" element={<ProtectedRoute><Spaces/></ProtectedRoute>}/>
                            <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>}/>
                        </Routes>
                    </BrowserRouter>
                </UserRoleProvider>
            </MockSocketProvider>
        </div>
    );
}

export default App;
