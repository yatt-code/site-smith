import React, { useMemo } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Component } from '@/types/builder';
import { useBuilderStore } from '@/store/useBuilderStore';

interface ComponentRendererProps {
  component: Component;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
}) => {
  const { selectedComponent, hoveredComponent, selectComponent, setHoveredComponent, isDragging } =
    useBuilderStore();

  const { attributes, listeners, setNodeRef: setDraggableRef, transform } =
    useDraggable({
      id: component.id,
    });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: component.id,
  });

  const style: React.CSSProperties = useMemo(() => ({
    ...component.styles,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    position: 'relative',
    cursor: isDragging ? 'grabbing' : 'grab',
    // Only apply transition when not dragging
    transition: isDragging ? 'none' : 'box-shadow 0.2s ease-in-out',
    willChange: isDragging ? 'transform' : 'auto',
  }), [component.styles, transform, isDragging]);

  const isSelected = selectedComponent === component.id;
  const isHovered = hoveredComponent === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const setRefs = (element: HTMLElement | null) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };

  // Memoize the component content to prevent unnecessary re-renders
  const componentContent = useMemo(() => {
    switch (component.type) {
      case 'text':
        return (
          <p {...component.props} className="m-0">
            {component.props.text}
          </p>
        );
      case 'image':
        return <img {...component.props} alt={component.props.alt || ''} />;
      case 'button':
        return (
          <button {...component.props} className="focus:outline-none">
            {component.props.text}
          </button>
        );
      case 'container':
        return (
          <div {...component.props}>
            {component.children.map((child) => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
          </div>
        );
      case 'form':
        return (
          <form {...component.props} className="space-y-4">
            {component.children.map((child) => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
          </form>
        );
      case 'input':
        return (
          <input {...component.props} className="focus:outline-none w-full" />
        );
      default:
        return null;
    }
  }, [component]);

  return (
    <div
      ref={setRefs}
      {...attributes}
      {...listeners}
      style={style}
      className={`relative group ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-opacity-100'
          : isHovered && !isDragging
          ? 'ring-2 ring-gray-400 ring-opacity-50'
          : ''
      }`}
      onClick={handleClick}
      onMouseEnter={() => !isDragging && setHoveredComponent(component.id)}
      onMouseLeave={() => !isDragging && setHoveredComponent(null)}
    >
      {componentContent}
      
      {/* Only show overlay when not dragging */}
      {!isDragging && (isSelected || isHovered) && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t-md opacity-90 pointer-events-none">
          {component.type}
        </div>
      )}
      
      {/* Only show resize handles when selected and not dragging */}
      {isSelected && !isDragging && (
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 border-dashed" />
      )}
    </div>
  );
};
