import React, { useState, useEffect } from 'react';
import type { UserAdminDTO, UserCreateAdminDTO } from '../../../types/user';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveStaff: (userData: UserCreateAdminDTO) => Promise<void>;
    onUpdateRole?: (userId: number, newRole: string) => Promise<void>;
    initialData?: UserAdminDTO | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSaveStaff, onUpdateRole, initialData }) => {
    // Formulario de creación
    const [formData, setFormData] = useState<UserCreateAdminDTO>({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        role: 'Trainer'
    });

    // Estado para edición rápida de rol
    const [selectedRole, setSelectedRole] = useState<string>('User');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setSelectedRole(initialData.role);
        } else {
            setFormData({
                name: '',
                surname: '',
                email: '',
                phone: '',
                password: '',
                role: 'Trainer'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (initialData) {
                // Modo Edición: Actualizar únicamente el rol
                if (onUpdateRole) {
                    await onUpdateRole(initialData.id, selectedRole);
                }
            } else {
                // Modo Creación: Registrar nuevo Admin / Trainer
                await onSaveStaff(formData);
            }
            onClose();
        } catch (error) {
            console.error("Error saving user modal data:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Elimina todo lo que no sea un número
        const onlyNums = e.target.value.replace(/\D/g, '');
        // Limita la longitud máxima a 10 caracteres
        if (onlyNums.length <= 10) {
            setFormData({ ...formData, phone: onlyNums });
        }
    };

    return (
        <div 
            className="modal d-block" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content gq-card text-white border-0">
                    <div className="modal-header border-bottom border-secondary">
                        <h5 className="modal-title fw-bold">
                            {initialData ? `✏️ Edit Role: ${initialData.name}` : '➕ Create Staff User'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body d-flex flex-column gap-3">
                            {initialData ? (
                                /* ---------------- MODO EDICIÓN ---------------- */
                                <div>
                                    <label className="form-label small fw-semibold text-aqua">
                                        Account Role Privileges
                                    </label>
                                    <select
                                        className="form-select gq-input text-white"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        disabled={initialData.role === 'Admin'}
                                    >
                                        <option value="User">🛡️ User (Standard Athlete)</option>
                                        <option value="Trainer">🏋️‍♂️ Trainer (Routine Creator)</option>
                                        <option value="Admin">👑 Admin (Full Access)</option>
                                    </select>
                                    {initialData.role === 'Admin' && (
                                        <span className="text-warning small mt-1 d-block">
                                            ⚠️ Admin roles cannot be modified directly.
                                        </span>
                                    )}
                                </div>
                            ) : (
                                /* ---------------- MODO CREACIÓN ---------------- */
                                <>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold text-aqua">First Name</label>
                                            <input
                                                type="text"
                                                className="form-control gq-input text-white"
                                                placeholder="Alex"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-semibold text-aqua">Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control gq-input text-white"
                                                placeholder="Turner"
                                                value={formData.surname}
                                                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small fw-semibold text-aqua">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control gq-input text-white"
                                            placeholder="alex@gymquest.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label small fw-semibold text-aqua">
                                            Phone Number (10 digits)
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control gq-input text-white"
                                            placeholder="10 digit number (e.g. 3312345678)"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            pattern="[0-9]{10}"
                                            minLength={10}
                                            maxLength={10}
                                            title="Please enter exactly 10 digits"
                                            required
                                        />
                                        {formData.phone && formData.phone.length < 10 && (
                                            <span className="text-warning small mt-1 d-block">
                                                Phone number must be exactly 10 digits ({formData.phone.length}/10)
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="form-label small fw-semibold text-aqua">Password</label>
                                        <input
                                            type="password"
                                            className="form-control gq-input text-white"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            minLength={8}
                                            required
                                        />
                                        <span className="text-muted small mt-1 d-block" style={{ fontSize: '0.75rem' }}>
                                            🔒 Min. 8 characters (include numbers/special chars if required by security policy).
                                        </span>
                                    </div>
                                    <div>
                                        <label className="form-label small fw-semibold text-aqua">Staff Role</label>
                                        <select
                                            className="form-select gq-input text-white"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Trainer' })}
                                        >
                                            <option value="Trainer">🏋️‍♂️ Trainer (Routine Creator)</option>
                                            <option value="Admin">👑 Admin (Full Access)</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer border-top border-secondary">
                            <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-gq-purple" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Staff Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};