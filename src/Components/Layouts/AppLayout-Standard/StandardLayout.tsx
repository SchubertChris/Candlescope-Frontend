// ===========================
// STANDARD LAYOUT COMPONENT MIT BACKGROUND
// ===========================

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MainRouterSlot from './Main-Router-Slot';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';

const StandardLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <AnimatedBackground />
      <Navbar />
      <MainRouterSlot>
        <Outlet />
      </MainRouterSlot>
      <Footer />
    </div>
  );
};

export default StandardLayout;