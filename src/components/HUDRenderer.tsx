import React from 'react';
import { LayoutElement, HUDLayout } from '../types';

interface HUDRendererProps {
  layout: HUDLayout | null;
}

const HUDRenderer: React.FC<HUDRendererProps> = ({ layout }) => {
  if (!layout) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="hud-element p-8 text-center">
          <p className="hud-text text-lg">No layout received</p>
          <p className="hud-text text-sm opacity-70 mt-2">Waiting for MentraOS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {layout.elements.map((element) => (
        <HUDElement key={element.id} element={element} />
      ))}
    </div>
  );
};

interface HUDElementProps {
  element: LayoutElement;
}

const HUDElement: React.FC<HUDElementProps> = ({ element }) => {
  const { type, position, size, content, style } = element;
  
  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    ...style,
  };

  switch (type) {
    case 'text':
      return (
        <div
          style={elementStyle}
          className="hud-element flex items-center justify-center p-2"
        >
          <span className="hud-text">{content}</span>
        </div>
      );
    
    case 'image':
      return (
        <div
          style={elementStyle}
          className="hud-element overflow-hidden"
        >
          <img
            src={content}
            alt="HUD element"
            className="w-full h-full object-cover"
          />
        </div>
      );
    
    case 'button':
      return (
        <button
          style={elementStyle}
          className="hud-button"
          onClick={() => console.log('Button clicked:', element.id)}
        >
          {content}
        </button>
      );
    
    default:
      return null;
  }
};

export default HUDRenderer;