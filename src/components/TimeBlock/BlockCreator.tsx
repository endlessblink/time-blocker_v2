import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useTimeBlock } from '../../context/TimeBlockContext';
import { TimeBlock } from '../../types';

export const BlockCreator: React.FC = () => {
  const { dispatch } = useTimeBlock();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '09:00',
    duration: 60,
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    if (formData.duration < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const now = new Date();
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const start = new Date(now.setHours(hours, minutes, 0, 0));
    const end = new Date(start.getTime() + formData.duration * 60000);

    const newBlock: TimeBlock = {
      id: crypto.randomUUID(),
      title: formData.title,
      startTime: start,
      endTime: end,
      category: '1',
      color: '#4f46e5',
      status: 'pending',
      priority: 'medium',
      description: formData.description,
    };

    dispatch({ type: 'ADD_BLOCK', payload: newBlock });
    
    // Reset form and close modal
    setFormData({
      title: '',
      startTime: '09:00',
      duration: 60,
      description: '',
    });
    setIsOpen(false);
  }, [dispatch, formData]);

  const handleCancel = useCallback(() => {
    setFormData({
      title: '',
      startTime: '09:00',
      duration: 60,
      description: '',
    });
    setErrors({});
    setIsOpen(false);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full lg:w-auto justify-center lg:justify-start"
      >
        <Plus className="h-5 w-5" />
        Create Block
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={handleCancel}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-card w-full max-w-md rounded-lg border border-border shadow-lg animate-in fade-in-0 zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <h2 className="text-lg font-semibold text-foreground">Create New Time Block</h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      errors.title ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        errors.startTime ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-destructive">{errors.startTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Duration (min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="15"
                      step="15"
                      className={`mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        errors.duration ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-destructive">{errors.duration}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}