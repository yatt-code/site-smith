import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Component, ComponentType } from '@/types/builder';

const componentTemplates: Record<ComponentType, Omit<Component, 'id'>> = {
  container: {
    type: 'container',
    props: {},
    styles: {
      width: '100%',
      minHeight: '100px',
      padding: '1rem',
      backgroundColor: '#ffffff',
      border: '1px dashed #e5e7eb',
      borderRadius: '4px',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  text: {
    type: 'text',
    props: {
      text: 'New Text Block',
    },
    styles: {
      color: '#000000',
      fontSize: '16px',
      padding: '0.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '4px',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  button: {
    type: 'button',
    props: {
      text: 'Click Me',
    },
    styles: {
      padding: '0.5rem 1rem',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      border: 'none',
      fontWeight: '500',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  image: {
    type: 'image',
    props: {
      src: 'https://via.placeholder.com/150',
      alt: 'Placeholder image',
    },
    styles: {
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '4px',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  form: {
    type: 'form',
    props: {},
    styles: {
      width: '100%',
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.25rem',
      backgroundColor: '#ffffff',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  input: {
    type: 'input',
    props: {
      placeholder: 'Enter text...',
      type: 'text',
    },
    styles: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.25rem',
      backgroundColor: '#ffffff',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
  custom: {
    type: 'custom',
    props: {},
    styles: {
      padding: '1rem',
      border: '1px dashed #e5e7eb',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
    },
    children: [],
    parent: null,
    metadata: {
      author: 'system',
      version: '1.0.0',
      dependencies: [],
    },
  },
};

export const Toolbar: React.FC = () => {
  const { addComponent } = useBuilderStore();

  const handleAddComponent = (type: ComponentType) => {
    console.log('Adding component:', type);
    const template = componentTemplates[type];
    const component: Component = {
      ...template,
      id: `${type}-${Date.now()}`,
    };
    addComponent(component);
  };

  return (
    <div className="h-full p-4 border-r border-gray-200 bg-white overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Components</h2>
      <div className="space-y-2">
        {(Object.keys(componentTemplates) as ComponentType[]).map((type) => (
          <button
            key={type}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors duration-200 flex items-center space-x-2"
            onClick={() => handleAddComponent(type)}
          >
            <span className="text-lg text-gray-500">
              {type === 'container' && '⬚'}
              {type === 'text' && 'T'}
              {type === 'button' && '⚲'}
              {type === 'image' && '🖼'}
              {type === 'form' && '📝'}
              {type === 'input' && '⌨'}
              {type === 'custom' && '✱'}
            </span>
            <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
