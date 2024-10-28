import React, { useState, useCallback } from 'react';
import { TimeBlock } from '../../types';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface EditBlockModalProps {
  block: TimeBlock;
  onSave: (block: TimeBlock) => void;
  onClose: () => void;
}

export const EditBlockModal: React.FC<EditBlockModalProps> = ({ block, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: block.title,
    startTime: format(block.startTime, 'HH:mm'),
    duration: Math.round((block.endTime.getTime() - block.startTime.getTime()) / (1000 * 60)),
    description: block.description || '',
    status: block.status,
    priority: block.priority,
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const start = new Date(block.startTime);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + formData.duration * 60000);

    onSave({
      ...block,
      title: formData.title,
      startTime: start,
      endTime: end,
      description: formData.description,
      status: formData.status as TimeBlock['status'],
      priority: formData.priority as TimeBlock['priority'],
    });
    
    onClose();
  }, [block, formData, onSave, onClose]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div 
        className="bg-card w-full max-w-md mt-16 lg:mt-8 rounded-lg border border-border shadow-lg animate-in fade-in-0 zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Edit Time Block</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min="15"
                step="15"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TimeBlock['status'] }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TimeBlock['priority'] }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};