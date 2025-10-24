
import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-white mt-auto py-4">
            <div className="container mx-auto px-4 text-center text-slate-500">
                <p>&copy; {currentYear} ATS Resume Scanner. All rights reserved.</p>
            </div>
        </footer>
    );
};
