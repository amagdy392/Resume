
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-center">
                 <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <i className="fas fa-file-alt text-white text-2xl"></i>
                    </div>
                    <span className="text-2xl font-bold text-slate-800">ATS Resume Scanner</span>
                </div>
            </div>
        </header>
    );
};
