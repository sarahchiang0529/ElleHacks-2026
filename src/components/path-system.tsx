import dirtTile from "figma:asset/bba80209ade146a307fcb8c0bf17f6de599a8234.png";
import dirtEdge from "figma:asset/cd69ca7d49374937559ac57f0d5aa4f82660f09a.png";
import fenceVertical from "figma:asset/cda31866133efe49672105467d6866c75f817c8a.png";
import fenceHorizontal from "figma:asset/7c6f9bf4827003f88246ebfdb8735c8b61691d5f.png";
import fenceCorner from "figma:asset/8d44bb26c197d8b817aea62f91a7a796cacc1745.png";

interface PathTile {
  x: number;
  y: number;
  type: 'dirt' | 'edge';
  rotation?: number;
}

interface FencePiece {
  x: number;
  y: number;
  type: 'vertical' | 'horizontal' | 'corner';
  rotation?: number;
}

interface PathSystemProps {
  paths: PathTile[];
  fences?: FencePiece[];
}

export function PathSystem({ paths, fences = [] }: PathSystemProps) {
  return (
    <>
      {/* Dirt path tiles */}
      {paths.map((tile, index) => (
        <div
          key={`path-${index}`}
          className="absolute"
          style={{
            left: tile.x,
            top: tile.y,
            transform: tile.rotation ? `rotate(${tile.rotation}deg)` : undefined,
          }}
        >
          <img
            src={tile.type === 'dirt' ? dirtTile : dirtEdge}
            alt="Path"
            className="w-auto h-auto"
            style={{
              imageRendering: 'pixelated',
              width: '32px',
              height: '32px',
            }}
          />
        </div>
      ))}

      {/* Fence decorations */}
      {fences.map((fence, index) => {
        let fenceImage = fenceVertical;
        if (fence.type === 'horizontal') fenceImage = fenceHorizontal;
        if (fence.type === 'corner') fenceImage = fenceCorner;

        return (
          <div
            key={`fence-${index}`}
            className="absolute"
            style={{
              left: fence.x,
              top: fence.y,
              transform: fence.rotation ? `rotate(${fence.rotation}deg)` : undefined,
              zIndex: 3,
            }}
          >
            <img
              src={fenceImage}
              alt="Fence"
              className="w-auto h-auto"
              style={{
                imageRendering: 'pixelated',
                width: '32px',
                height: '32px',
              }}
            />
          </div>
        );
      })}
    </>
  );
}

// Helper function to create a horizontal path
export function createHorizontalPath(startX: number, startY: number, length: number): PathTile[] {
  const tiles: PathTile[] = [];
  for (let i = 0; i < length; i++) {
    tiles.push({
      x: startX + i * 32,
      y: startY,
      type: 'dirt',
    });
  }
  return tiles;
}

// Helper function to create a vertical path
export function createVerticalPath(startX: number, startY: number, length: number): PathTile[] {
  const tiles: PathTile[] = [];
  for (let i = 0; i < length; i++) {
    tiles.push({
      x: startX,
      y: startY + i * 32,
      type: 'dirt',
    });
  }
  return tiles;
}
