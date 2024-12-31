'use client';

import React from 'react';
import { Canvas } from '@/components/core/Canvas';
import { Toolbar } from '@/components/core/Toolbar';

export default function BuilderPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 h-full border-r border-gray-200 flex-shrink-0">
        <Toolbar />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <Canvas />
      </div>
    </div>
  );
}
