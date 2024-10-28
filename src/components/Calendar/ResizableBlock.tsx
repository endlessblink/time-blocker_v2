import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react';
import { TimeBlock } from '../../types';
import { useResizeHandles } from '../../hooks/useResizeHandles';
import { EditBlockModal } from './EditBlockModal';
import { DeleteConfirmation } from './DeleteConfirmation';

interface ResizableBlockProps {
  block: TimeBlock;
  onUpdate: (block: TimeBlock) => void;
  onDelete: (id: string) => void;
}

export const ResizableBlock: React.FC<ResizableBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { handleResizeStart, handleResizeEnd } = useResizeHandles(block, onUpdate, setIsResizing);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('blockId', block.id);
    e.dataTransfer.effectAllowed = 'move';
    
    const ghost = document.createElement('div');
    ghost.classList.add('bg-indigo-600', 'opacity-50', 'rounded-lg', 'p-2');
    ghost.style.width = '200px';
    ghost.style.height = '80px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 100, 40);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }, [block.id]);

  const getBlockStyle = () => {
    const top = (block.startTime.getHours() + block.startTime.getMinutes() / 60) * 80;
    const height = ((block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60 * 60)) * 80;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: block.color,
    };
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      setShowDeleteConfirm(true);
    }
    if (e.key === 'Escape') {
      setShowActions(false);
    }
  }, []);

  return (
    <>
      <div
        className={`absolute left-0 right-4 rounded-lg px-2 py-1 m-1 group touch-none ${
          isResizing ? 'cursor-ns-resize select-none' : 'cursor-move'
        } ${showActions ? 'ring-2 ring-white ring-opacity-50' : ''}`}
        style={getBlockStyle()}
        draggable={!isResizing}
        onDragStart={handleDragStart}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onTouchStart={() => setShowActions(true)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Resize handles */}
        <div
          className="absolute top-0 left-0 w-full h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/20"
          onMouseDown={(e) => handleResizeStart(e, 'start')}
          onTouchStart={(e) => handleResizeStart(e as any, 'start')}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 bg-white/20"
          onMouseDown={(e) => handleResizeStart(e, 'end')}
          onTouchStart={(e) => handleResizeStart(e as any, 'end')}
        />

        {/* Drag handle */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
          <GripVertical className="w-4 h-4 text-white/70" />
        </div>

        {/* Block content */}
        <div 
          className="pl-6 w-full h-full"
          onClick={() => setShowEditModal(true)}
        >
          <h3 className="font-medium text-white text-sm truncate">{block.title}</h3>
          <p className="text-white/90 text-xs">
            {format(block.startTime, 'h:mma')} - {format(block.endTime, 'h:mma')}
          </p>
          {block.description && (
            <p className="text-white/80 text-xs truncate mt-1">{block.description}</p>
          )}
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="absolute top-1 right-1 flex items-center space-x-1 bg-white/10 rounded-md p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
              className="p-1 hover:bg-white/20 rounded"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1 hover:bg-white/20 rounded"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
            <button className="p-1 hover:bg-white/20 rounded">
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditBlockModal
          block={block}
          onSave={onUpdate}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={() => {
            onDelete(block.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
};