import { useState, useEffect } from "react";
import { getUser } from "../services/auth";
import type { UserData } from "../types/user";
import "../css/ProfileSettings.css";

type SettingSection = "account" | "password" | "language";

export default function ProfileSettings() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<SettingSection>("account");

    const [newPassword, setNewPassword] = useState("");
    const [language, setLanguage] = useState<"es" | "en">("es");

    useEffect(() => {
        loadUserData();
    }, [])

    const loadUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            // we get the information from the user Service
            const userData = await getUser();
            setUser(userData);
        } catch (err: any) { // if an error gets catched
            setError(err?.message || "Error connecting to the server");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = () => {
        // call service to update password?
        console.log("Updating password to:", newPassword);
        setNewPassword("");
    };

    const handleLanguageChange = (lang: "es" | "en") => {
        setLanguage(lang);
        // aquí podrías persistir la preferencia, ej: updateLanguage(lang)
        console.log("Language set to:", lang);
    };

    return (
        <div className="profilesettings-page">

            <div className="settings-container">
                {/* --- LEFT SECTION: Avatar, options --- */}
                <aside className="sidebar">
                    <div className="avatar-wrapper">
                        {/* default avatar*/}
                        <div className="avatar-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>

                    <nav className="sidebar-menu">
                        <button
                            className={`menu-btn ${activeSection === "account" ? "active" : ""}`}
                            onClick={() => setActiveSection("account")}
                        >
                            Account Details
                        </button>
                        <button
                            className={`menu-btn ${activeSection === "password" ? "active" : ""}`}
                            onClick={() => setActiveSection("password")}
                        >
                            Change Password
                        </button>
                        <button
                            className={`menu-btn ${activeSection === "language" ? "active" : ""}`}
                            onClick={() => setActiveSection("language")}
                        >
                            Choose Language
                        </button>
                    </nav>
                </aside>

                {/* --- RIGHT SECTION: DETAILS FORM --- */}
                <main className="content">
                    {activeSection === "account" && (
                        <>
                            <h1 className="content-title">Account settings</h1>
                            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
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

                                <div className="form-group">
                                    <label htmlFor="firstName">First name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="Enter first name"
                                        value={user?.detail?.name || ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Enter last name"
                                        value={user?.detail?.surname || ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="Enter phone number"
                                        value={user?.phone || ''}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight">Weight</label>
                                    <input
                                        type="text"
                                        id="weight"
                                        placeholder="Enter weight (e.g. 70kg)"
                                        value={user?.stadistic?.weight || ''}
                                    />
                                </div>

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
                        </>
                    )}

                    {activeSection === "password" && (
                        <>
                            <h1 className="content-title">Change Password</h1>
                            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
                                <div className="form-group">
                                    <label htmlFor="newPassword">New password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="update-btn">Update</button>
                            </form>
                        </>
                    )}

                    {activeSection === "language" && (
                        <>
                            <h1 className="content-title">Choose Language</h1>
                            <div className="language-options">
                                <button
                                    className={`lang-btn ${language === "es" ? "active" : ""}`}
                                    onClick={() => handleLanguageChange("es")}
                                >
                                    Español
                                </button>
                                <button
                                    className={`lang-btn ${language === "en" ? "active" : ""}`}
                                    onClick={() => handleLanguageChange("en")}
                                >
                                    English
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}