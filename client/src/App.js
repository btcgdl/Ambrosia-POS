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
import CreateOrder from "./pages/CreateOrder";
import EditOrder from "./pages/EditOrder";
import Orders from "./pages/Orders";
import Roles from "./pages/Roles";
import IngredientCategories from "./pages/IngredientCategories";
import Ingredients from "./pages/Ingredients";
import Suppliers from "./pages/Suppliers";
import Restocks from "./pages/Restocks";

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
                            <Route path="/new-order" element={<ProtectedRoute><CreateOrder/></ProtectedRoute>}/>
                            <Route path="/new-order/:tableId" element={<ProtectedRoute><CreateOrder/></ProtectedRoute>}/>
                            <Route path="/modify-order/:pedidoId" element={<ProtectedRoute><EditOrder/></ProtectedRoute>}/>
                            <Route path="/all-orders/" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
                            <Route path="/roles/" element={<ProtectedRoute><Roles/></ProtectedRoute>}/>
                            <Route path="/inventory/categories" element={<ProtectedRoute><IngredientCategories /></ProtectedRoute>} />
                            <Route path="/inventory/ingredients" element={<ProtectedRoute><Ingredients /></ProtectedRoute>} />
                            <Route path="/inventory/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                            <Route path="/inventory/restocks" element={<ProtectedRoute><Restocks /></ProtectedRoute>} />
                        </Routes>
                    </BrowserRouter>
                </UserRoleProvider>
            </MockSocketProvider>
        </div>
    );
}

export default App;
