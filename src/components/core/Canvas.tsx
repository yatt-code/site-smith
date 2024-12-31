import React, { useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { useBuilderStore } from '@/store/useBuilderStore';
import { ComponentRenderer } from './ComponentRenderer';

interface CanvasProps {
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const {
    components,
    canvas,
    isDragging,
    setIsDragging,
    moveComponent,
    selectComponent,
  } = useBuilderStore();

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    selectComponent(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      moveComponent(
        active.id as string,
        over.id as string,
        components.length
      );
    }
  };

  // Memoize the canvas style to prevent unnecessary recalculations
  const canvasStyle = useMemo(() => ({
    width: canvas.width,
    height: canvas.height,
    transform: `scale(${canvas.zoom})`,
    transformOrigin: '0 0',
  }), [canvas.width, canvas.height, canvas.zoom]);

  return (
    <div className="w-full h-full overflow-hidden bg-gray-50">
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div
          className={`relative w-full h-full overflow-auto ${className || ''}`}
          style={canvasStyle}
        >
          <div
            className={`relative w-full h-full min-h-screen ${
              canvas.grid ? 'bg-grid' : ''
            } ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
          >
            {components.map((component) => (
              <ComponentRenderer 
                key={component.id} 
                component={component}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
};
