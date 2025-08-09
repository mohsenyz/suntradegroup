import { useCallback, useEffect, useRef } from 'react';
import { useUIStore } from '../stores/ui';

interface UseAutoSaveOptions {
  onSave: (data: any) => Promise<void>;
  data: any;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({
  onSave,
  data,
  delay = 2000, // 2 seconds
  enabled = true,
}: UseAutoSaveOptions) => {
  const { setSaveStatus, setLastSaved } = useUIStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;
    
    try {
      isSavingRef.current = true;
      setSaveStatus('saving');
      
      await onSave(data);
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Clear saved status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error', error instanceof Error ? error.message : 'خطا در ذخیره');
      
      // Clear error status after 5 seconds
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      isSavingRef.current = false;
    }
  }, [onSave, data, enabled, setSaveStatus, setLastSaved]);

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentData === previousDataRef.current) {
      return;
    }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      save();
      previousDataRef.current = currentData;
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
    previousDataRef.current = JSON.stringify(data);
  }, [save, data]);

  return { saveNow };
};