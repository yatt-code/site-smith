export type ComponentType = 
  | 'container' 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'form' 
  | 'input'
  | 'custom';

export interface StyleObject {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  [key: string]: string | undefined;
}

export interface ComponentMetadata {
  author: string;
  version: string;
  dependencies: string[];
  description?: string;
  tags?: string[];
}

export interface Component {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  styles: StyleObject;
  children: Component[];
  parent: string | null;
  metadata: ComponentMetadata;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  grid: boolean;
  snap: boolean;
  breakpoint: Breakpoint;
}

export interface HistoryState {
  components: Component[];
  timestamp: number;
  description: string;
}

export interface BuilderState {
  components: Component[];
  selectedComponent: string | null;
  hoveredComponent: string | null;
  canvas: CanvasState;
  history: HistoryState[];
  historyIndex: number;
  isDragging: boolean;
}
