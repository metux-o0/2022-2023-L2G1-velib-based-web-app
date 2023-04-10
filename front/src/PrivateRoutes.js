import React from 'react';
import { Outlet , Navigate } from 'react-router-dom';

function PrivateRoutes() {
    let authentificationToken = localStorage.getItem("token");
    
    return (
        authentificationToken ? <Outlet /> : <Navigate to="/error401" />
    )
}


export default PrivateRoutes;