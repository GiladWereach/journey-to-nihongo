
import React, { forwardRef, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizedInputProps extends React.ComponentProps<typeof Input> {
  maintainFocus?: boolean;
}

const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ className, maintainFocus = false, onBlur, ...props }, ref) => {
    const isMobile = useIsMobile();
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      // Pass ref to both the forwarded ref and our local ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      inputRef.current = node;
    };

    // For mobile devices, maintain focus if requested
    useEffect(() => {
      if (isMobile && maintainFocus && inputRef.current) {
        const focusInterval = setInterval(() => {
          if (document.activeElement !== inputRef.current && inputRef.current) {
            inputRef.current.focus();
          }
        }, 500);
        
        return () => clearInterval(focusInterval);
      }
    }, [isMobile, maintainFocus]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Call original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
      
      // On mobile, refocus if maintainFocus is true
      if (isMobile && maintainFocus && inputRef.current) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }
    };

    return (
      <Input
        ref={combinedRef}
        className={className}
        onBlur={handleBlur}
        autoFocus={maintainFocus}
        // Mobile-specific optimizations
        inputMode={isMobile ? "text" : undefined}
        // Prevent zoom on focus in iOS (16px is the threshold)
        style={isMobile ? { fontSize: '16px' } : undefined}
        {...props}
      />
    );
  }
);

MobileOptimizedInput.displayName = "MobileOptimizedInput";

export { MobileOptimizedInput };
