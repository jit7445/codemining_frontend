'use client';
import React from 'react';
import DarkModeSwitch from './DarkModeSwitch';

import {SidebarTrigger } from "@/components/ui/sidebar"

const Navbar = () => {
  return (
    <div className="flex flex-row  z-40 opacity-100 justify-between items-center w-full h-16 shadow-md">
      <div className="flex flex-row  justify-between items-center gap-4 w-full border-2 p-2  border-slate-100 rounded-lg">
        <div className='flex flex-row justify-center items-center'>
        <SidebarTrigger  className='txt-xl'/>
        <h1>CodeMining</h1>
        </div>
        <ul className="flex flex-row gap-4">
          <ul className="flex items-center">
          <DarkModeSwitch/>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
