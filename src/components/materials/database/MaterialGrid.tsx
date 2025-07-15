
import React from "react";
import { motion } from "framer-motion";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import MaterialCard from "./MaterialCard";
import MobileMaterialCard from "../mobile/MobileMaterialCard";
import MaterialGridSkeleton from "./MaterialGridSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface MaterialGridProps {
  materials: ExtendedMaterialData[];
  loading?: boolean;
  onMaterialSelect?: (material: ExtendedMaterialData) => void;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ 
  materials, 
  loading = false,
  onMaterialSelect 
}) => {
  const { isMobile } = useIsMobile();

  if (loading) {
    return <MaterialGridSkeleton isMobile={isMobile} />;
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No materials found matching your criteria</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${
      isMobile 
        ? "grid-cols-1" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }`}>
      {materials.map((material, index) => (
        <motion.div
          key={material.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {isMobile ? (
            <MobileMaterialCard 
              material={material} 
              onSelect={onMaterialSelect}
            />
          ) : (
            <MaterialCard 
              material={material} 
              onSelect={onMaterialSelect}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default MaterialGrid;
