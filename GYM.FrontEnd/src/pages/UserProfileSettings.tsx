import { useState, useEffect } from "react";
import { getUser } from "../services/auth";
import type { UserData } from "../types/user";
import "../css/ProfileSettings.css";
import Navbar from "../components/NavBar";

export default function ProfileSettings(){
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
    }, [])

    const loadUserData = async () => {
        setLoading(true);
        setError(null);
        try{
            // we get the information from the user Service
            const userData = await getUser();
            setUser(userData);
        } catch (err: any){ // if an error gets catched
            setError(err?.message || "Error connecting to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profilesettings-page">
            <Navbar onLogout={() => console.log('Clossing session...')} />

            <div className="settings-container">
                {/* --- SECCIÓN IZQUIERDA: AVATAR Y MENÚ --- */}
                <aside className="sidebar">
                    <div className="avatar-wrapper">
                        {/* Placeholder de avatar por defecto */}
                        <div className="avatar-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    </div>

                    <nav className="sidebar-menu">
                        <button className="menu-btn active">Account Details</button>
                        <button className="menu-btn">Change Password</button>
                        <button className="menu-btn">Logout</button>
                    </nav>
                </aside>

                {/* --- SECCIÓN DERECHA: FORMULARIO DE DETALLES --- */}
                <main className="content">
                    <h1 className="content-title">Account settings</h1>

                    <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                        {/* EMAIL ADDRESS */}
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Enter email address"
                                value={user?.email || ''} 
                                readOnly 
                            />
                        </div>

                        {/* FIRST NAME */}
                        <div className="form-group">
                            <label htmlFor="firstName">First name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                placeholder="Enter first name"
                                value={user?.detail?.name || ''} 
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="form-group">
                            <label htmlFor="lastName">Last name</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                placeholder="Enter last name"
                                value={user?.detail?.surname || ''} 
                            />
                        </div>

                        {/* PHONE NUMBER */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                placeholder="Enter phone number"
                                value={user?.phone || ''}
                            />
                        </div>

                        {/* WEIGHT */}
                        <div className="form-group">
                            <label htmlFor="weight">Weight</label>
                            <input 
                                type="text" 
                                id="weight" 
                                placeholder="Enter weight (e.g. 70kg)"
                                value={user?.stadistic?.weight || ''}
                            />
                        </div>

                        {/* HEIGHT */}
                        <div className="form-group">
                            <label htmlFor="height">Height</label>
                            <input 
                                type="text" 
                                id="height" 
                                placeholder="Enter height (e.g. 175cm)"
                                value={user?.stadistic?.height || ''}
                            />
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}