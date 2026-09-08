import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    }

    export const ModalNuevoEmprendedor: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rubro: '',
        telefono: '',
        // Agrega los campos que tenías en el registro original
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        // AQUÍ MUEVES LA LÓGICA DE TU BÓTON DE REGISTRO ORIGINAL
        // Ejemplo: await api.post('/emprendedores', formData);
        
        onSuccess(); // Recarga la lista de emprendedores
        onClose();   // Cierra el modal
        } catch (error) {
        console.error('Error al registrar emprendedor:', error);
        }
    };

    return (
        <div className="modal show d-block tab-index-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Registrar Nuevo Emprendedor</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="modal-body">
                <div className="row g-3">
                    <div className="col-md-6">
                    <label className="form-label">Nombre Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                    />
                    </div>
                    <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    </div>
                    {/* Agrega el resto de los inputs correspondientes a tu formulario original */}
                </div>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                Guardar Emprendedor
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    );
};