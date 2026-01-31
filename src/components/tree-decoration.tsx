import tree1 from "@/assets/smallTree.png";
import tree2 from "@/assets/smallTree2.png";
import tree3 from "@/assets/smallTree3.png";

import tree4 from "@/assets/mediumTree.png";
import tree5 from "@/assets/mediumTree2.png";
import tree6 from "@/assets/mediumTree3.png";

import tree7 from "@/assets/largeTree.png";
import tree8 from "@/assets/largeTree2.png";
import tree9 from "@/assets/largeTree3.png";


const treeAssets = [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9];

interface TreeDecorationProps {
  variant: number;
  scale?: number;
}

export function TreeDecoration({ variant, scale = 1 }: TreeDecorationProps) {
  const treeImage = treeAssets[variant % treeAssets.length];

  return (
    <img
      src={treeImage}
      alt="Tree"
      className="pointer-events-none"
      style={{
        imageRendering: 'pixelated',
        transform: `scale(${scale})`,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
      }}
    />
  );
}
