import React, { useState, useEffect } from 'react';

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'User' | 'Trainer' | 'Admin';
    status: 'Active' | 'Inactive';
    createdAt: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: any) => void;
    initialData?: UserItem | null;
}

export const UserModal: React.FC<UserModalProps> = ({isOpen, onClose, onSave, initialData }) => {
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'User' as 'User' | 'Trainer' | 'Admin',
        status: 'Active' as 'Active' | 'Inactive',
    });

    useEffect(() => {
        if (initialData) {
        setFormData({
            name: initialData.name,
            email: initialData.email,
            role: initialData.role,
            status: initialData.status,
        });
        } else {
        setFormData({
            name: '',
            email: '',
            role: 'User',
            status: 'Active',
        });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(initialData ? { ...formData, id: initialData.id } : formData);
        onClose();
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
                {initialData ? '✏️ Edit Athlete / Role' : '➕ Create New User'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                {/* Name */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Full Name</label>
                    <input
                    type="text"
                    className="form-control gq-input text-white"
                    placeholder="e.g. Alex Turner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    />
                </div>

                {/* Email */}
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

                {/* Role Selection */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Account Role Privileges</label>
                    <select
                    className="form-select gq-input text-white"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    >
                    <option value="User">🛡️ User (Standard Athlete)</option>
                    <option value="Trainer">🏋️‍♂️ Trainer (Routine Creator)</option>
                    <option value="Admin">👑 Admin (Full Access)</option>
                    </select>
                </div>

                {/* Account Status */}
                <div>
                    <label className="form-label small fw-semibold text-aqua">Account Status</label>
                    <select
                    className="form-select gq-input text-white"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    </select>
                </div>
                </div>

                <div className="modal-footer border-top border-secondary">
                <button type="button" className="btn btn-outline-secondary text-white" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-gq-purple">
                    {initialData ? 'Save User Changes' : 'Create Account'}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};