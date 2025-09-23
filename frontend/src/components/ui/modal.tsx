'use client';

import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-black/80 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
                <div className="text-white/80 mb-6">{children}</div>
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white/60 hover:text-white border border-white/20 rounded hover:bg-white/10">
                        {cancelText}
                    </button>
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
