import { Routes, Route } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';

import Catalog from '../pages/Catalog';
import AyudaVecinal from '../pages/AyudaVecinal';
import Emergencias from '../pages/Emergencias';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Publicar from '../pages/Publicar';
import Perfil from '../pages/Perfil';

function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Catalog />} />
                <Route path="/ayuda-vecinal" element={<AyudaVecinal />} />
                <Route path="/emergencias" element={<Emergencias />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/publicar" element={<Publicar />} />
                <Route path="/perfil" element={<Perfil />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;