import { create } from 'zustand';
import { BuilderState, Component, HistoryState } from '../types/builder';

const initialCanvasState = {
  width: 1200,
  height: 800,
  zoom: 1,
  grid: true,
  snap: true,
  breakpoint: 'desktop' as const,
};

const initialState: BuilderState = {
  components: [],
  selectedComponent: null,
  hoveredComponent: null,
  canvas: initialCanvasState,
  history: [],
  historyIndex: -1,
  isDragging: false,
};

export const useBuilderStore = create<BuilderState & {
  // Component Actions
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, parentId: string | null, index: number) => void;
  
  // Selection Actions
  selectComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;
  
  // Canvas Actions
  updateCanvas: (updates: Partial<typeof initialCanvasState>) => void;
  
  // History Actions
  pushHistory: (description: string) => void;
  undo: () => void;
  redo: () => void;
  
  // Drag Actions
  setIsDragging: (isDragging: boolean) => void;
}>((set, get) => ({
  ...initialState,

  // Component Actions
  addComponent: (component) => {
    set((state) => {
      const newComponents = [...state.components, component];
      return { components: newComponents };
    });
    get().pushHistory('Add component');
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      ),
    }));
    get().pushHistory('Update component');
  },

  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
    }));
    get().pushHistory('Remove component');
  },

  moveComponent: (id, parentId, index) => {
    set((state) => {
      const components = [...state.components];
      const component = components.find((c) => c.id === id);
      if (!component) return state;

      // Remove from old position
      const oldIndex = components.findIndex((c) => c.id === id);
      components.splice(oldIndex, 1);

      // Add to new position
      component.parent = parentId;
      components.splice(index, 0, component);

      return { components };
    });
    get().pushHistory('Move component');
  },

  // Selection Actions
  selectComponent: (id) => set({ selectedComponent: id }),
  setHoveredComponent: (id) => set({ hoveredComponent: id }),

  // Canvas Actions
  updateCanvas: (updates) =>
    set((state) => ({
      canvas: { ...state.canvas, ...updates },
    })),

  // History Actions
  pushHistory: (description) =>
    set((state) => {
      const newHistory: HistoryState = {
        components: JSON.parse(JSON.stringify(state.components)),
        timestamp: Date.now(),
        description,
      };

      const newHistoryStates = [
        ...state.history.slice(0, state.historyIndex + 1),
        newHistory,
      ];

      return {
        history: newHistoryStates,
        historyIndex: newHistoryStates.length - 1,
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        components: JSON.parse(
          JSON.stringify(state.history[newIndex].components)
        ),
        historyIndex: newIndex,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        components: JSON.parse(
          JSON.stringify(state.history[newIndex].components)
        ),
        historyIndex: newIndex,
      };
    }),

  // Drag Actions
  setIsDragging: (isDragging) => set({ isDragging }),
}));
