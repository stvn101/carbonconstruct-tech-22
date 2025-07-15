
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const MaterialTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="font-semibold">Material</TableHead>
        <TableHead className="hidden sm:table-cell font-semibold">Category</TableHead>
        <TableHead className="font-semibold">Carbon Footprint</TableHead>
        <TableHead className="hidden md:table-cell font-semibold">Region</TableHead>
        <TableHead className="hidden lg:table-cell font-semibold">Recyclability</TableHead>
        <TableHead className="hidden xl:table-cell font-semibold">Tags</TableHead>
      </TableRow>
    </TableHeader>
  );
};
