import React from 'react';


const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg.jpg')" }}>
            {children}
        </div>
    );
};

export default Layout;
