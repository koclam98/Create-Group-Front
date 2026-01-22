import React from 'react';
import '../../styles/common.css';

interface AlertModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export default function AlertModal({ isOpen, title, message, onClose }: AlertModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-header">{title}</h2>
                <div className="modal-body mb-2">
                    <p>{message}</p>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="button-primary">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
