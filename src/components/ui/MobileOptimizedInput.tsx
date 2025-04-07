
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

    // For all devices, maintain focus if requested
    useEffect(() => {
      if (maintainFocus && inputRef.current) {
        // Force initial focus
        inputRef.current.focus();
        
        const focusInterval = setInterval(() => {
          if (document.activeElement !== inputRef.current && inputRef.current && !inputRef.current.disabled) {
            inputRef.current.focus();
            
            // On mobile, sometimes just focusing isn't enough - a click may help
            if (isMobile) {
              inputRef.current.click();
            }
          }
        }, 150); // Check more frequently for better responsiveness
        
        return () => clearInterval(focusInterval);
      }
    }, [isMobile, maintainFocus]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Call original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
      
      // Refocus if maintainFocus is true and input is not disabled
      if (maintainFocus && inputRef.current && !inputRef.current.disabled) {
        // Immediate refocus to prevent keyboard from hiding
        requestAnimationFrame(() => {
          if (inputRef.current && !inputRef.current.disabled) {
            inputRef.current.focus();
            
            // On mobile, sometimes just focusing isn't enough - a click may help
            if (isMobile) {
              inputRef.current.click();
            }
          }
        });
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
        style={{
          ...((props as any).style || {}),
          fontSize: props.style?.fontSize || '16px',
        }}
        {...props}
      />
    );
  }
);

MobileOptimizedInput.displayName = "MobileOptimizedInput";

export { MobileOptimizedInput };
