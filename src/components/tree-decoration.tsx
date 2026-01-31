// Import all tree sprite sheets (each has 3 trees)
import tree1 from "@/assets/largeTree.png";
import tree2 from "@/assets/largeTree2.png";
import tree3 from "@/assets/largeTree3.png";
import tree4 from "@/assets/mediumTree.png";
import tree5 from "@/assets/mediumTree2.png";
import tree6 from "@/assets/mediumTree3.png";
import tree7 from "@/assets/smallTree.png";
import tree8 from "@/assets/smallTree2.png";
import tree9 from "@/assets/smallTree3.png";

interface TreeSpriteSheet {
  image: string;
  treeWidth: number; // Width of ONE tree in the sheet
  treeHeight: number; // Height of ONE tree
  treesPerRow: number; // Always 3 for these sheets
}

// Configure each sprite sheet with correct aspect ratios (trees are taller than wide)
const treeSpriteSheets: TreeSpriteSheet[] = [
  { image: tree1, treeWidth: 64, treeHeight: 80, treesPerRow: 3 }, 
  { image: tree2, treeWidth: 64, treeHeight: 80, treesPerRow: 3 }, 
  { image: tree3, treeWidth: 32, treeHeight: 48, treesPerRow: 3 }, 
  { image: tree4, treeWidth: 32, treeHeight: 48, treesPerRow: 3 }, 
  { image: tree5, treeWidth: 32, treeHeight: 48, treesPerRow: 3 },
  { image: tree6, treeWidth: 32, treeHeight: 48, treesPerRow: 3 }, 
  { image: tree7, treeWidth: 32, treeHeight: 64, treesPerRow: 3 }, 
  { image: tree8, treeWidth: 32, treeHeight: 64, treesPerRow: 3 }, 
  { image: tree9, treeWidth: 32, treeHeight: 64, treesPerRow: 3 }, 
];

interface TreeDecorationProps {
  variant: number;
  scale?: number;
}

export function TreeDecoration({ variant, scale = 1 }: TreeDecorationProps) {
  // Determine which sprite sheet and which tree within that sheet
  const sheetIndex = Math.floor(variant / 3) % treeSpriteSheets.length;
  const treePosition = variant % 3; // 0, 1, or 2 (left, middle, right)
  
  const sheet = treeSpriteSheets[sheetIndex];
  const displayWidth = sheet.treeWidth * scale;
  const displayHeight = sheet.treeHeight * scale;

  return (
    <div
      className="pointer-events-none"
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        backgroundImage: `url(${sheet.image})`,
        backgroundPosition: `-${treePosition * displayWidth}px 0px`,
        backgroundSize: `${sheet.treesPerRow * displayWidth}px ${displayHeight}px`,
        imageRendering: 'pixelated',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
        overflow: 'hidden',
      }}
    />
  );
}