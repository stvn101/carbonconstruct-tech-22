import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HelpModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ type, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type.toUpperCase()} Help</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Help content for {type} will be available soon.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};