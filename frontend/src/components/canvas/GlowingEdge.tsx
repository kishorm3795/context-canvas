import React from 'react';
import { getBezierPath, type EdgeProps } from '@xyflow/react';

export const GlowingEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const attributionScore = data?.attribution_score !== undefined ? Number(data.attribution_score) : null;
  const weight = data?.weight !== undefined ? Number(data.weight) : 1.0;

  // Compute stroke color and glow based on attribution score and weight
  let strokeColor = '#38BDF8'; // default cyan
  let filterGlow = 'drop-shadow(0 0 3px rgba(56, 189, 248, 0.4))';
  let strokeWidth = 1.8;

  if (attributionScore !== null) {
    if (attributionScore > 0.75) {
      strokeColor = '#FF3366'; // crimson high attribution
      filterGlow = 'drop-shadow(0 0 8px rgba(255, 51, 102, 0.8))';
      strokeWidth = 2.5;
    } else if (attributionScore > 0.4) {
      strokeColor = '#FFB800'; // amber medium attribution
      filterGlow = 'drop-shadow(0 0 6px rgba(255, 184, 0, 0.6))';
      strokeWidth = 2.2;
    }
  }

  return (
    <>
      {/* Outer blurred glow path */}
      <path
        id={`${id}-glow`}
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 3}
        strokeOpacity={0.25}
        style={{ filter: 'blur(3px)' }}
      />

      {/* Main vector edge path */}
      <path
        id={id}
        className="react-flow__edge-path transition-all duration-300"
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{
          ...style,
          filter: filterGlow,
        }}
      />

      {/* Attribution score badge overlay */}
      {attributionScore !== null && (
        <foreignObject
          width={40}
          height={20}
          x={(sourceX + targetX) / 2 - 20}
          y={(sourceY + targetY) / 2 - 10}
          className="overflow-visible pointer-events-none"
        >
          <div className="flex items-center justify-center">
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border shadow-sm backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(8, 9, 13, 0.85)',
                borderColor: strokeColor,
                color: strokeColor,
              }}
            >
              {(attributionScore * 100).toFixed(0)}%
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
};

// Glowing edge SVG blur and color shift 1

// Glowing edge SVG blur and color shift 2
