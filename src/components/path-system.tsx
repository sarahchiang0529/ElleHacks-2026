import dirtTile from "@/assets/dirt.png";
import dirtEdge from "@/assets/dirtDeco.png";
import fenceVertical from "@/assets/fence3.png";
import fenceHorizontal from "@/assets/fence.png";
import fenceCorner from "@/assets/fence2.png";


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
