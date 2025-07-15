
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MaterialGridSkeletonProps {
  isMobile?: boolean;
  count?: number;
}

const MaterialGridSkeleton: React.FC<MaterialGridSkeletonProps> = ({ 
  isMobile = false, 
  count = 12 
}) => {
  return (
    <div className={`grid gap-4 ${
      isMobile 
        ? "grid-cols-1" 
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardHeader className={isMobile ? "pb-3" : ""}>
            <Skeleton className={`h-4 w-3/4 ${isMobile ? "mb-2" : ""}`} />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className={isMobile ? "grid grid-cols-2 gap-3" : "space-y-2"}>
              <div>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {isMobile && (
              <Skeleton className="h-8 w-full mt-3" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MaterialGridSkeleton;
