import tree1 from "figma:asset/787d76851edfac7fc523a69d4978aa53982ddd5f.png";
import tree2 from "figma:asset/c573dbcb3b2f983cd61fc756aade503ef6b63ae9.png";
import tree3 from "figma:asset/10150a358ddc8c928d77d85f94e60ea297706b08.png";
import tree4 from "figma:asset/8e351449c045f77bffa2eb5e300de8deb4ae7ef5.png";
import tree5 from "figma:asset/e25f1bcf6b6f4a4080a3cc4ce6cc25d809b7a20b.png";
import tree6 from "figma:asset/c227c7574511348e118e944ad6b53be64834b75e.png";
import tree7 from "figma:asset/e483947a8c5a8d4f272ee698e3d4941200dc93ea.png";
import tree8 from "figma:asset/707e6ce9bd45b088328b693948bc068dd7b82a73.png";
import tree9 from "figma:asset/cc15e8c344b5a3782426ecc29d31eb5c9c59744e.png";

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
