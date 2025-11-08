import React from 'react';
import { Header } from '../Header/Header';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Header />
            <main>
                {children}
            </main>
        </div>
    );
};