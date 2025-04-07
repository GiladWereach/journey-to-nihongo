
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
        // Force initial focus
        inputRef.current.focus();
        
        const focusInterval = setInterval(() => {
          if (document.activeElement !== inputRef.current && inputRef.current && !inputRef.current.disabled) {
            inputRef.current.focus();
            
            // On iOS, sometimes just focusing isn't enough - a click may help
            if (isMobile) {
              inputRef.current.click();
            }
          }
        }, 300); // Check frequently for better responsiveness
        
        return () => clearInterval(focusInterval);
      }
    }, [isMobile, maintainFocus]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Call original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
      
      // On mobile, refocus if maintainFocus is true and input is not disabled
      if (isMobile && maintainFocus && inputRef.current && !inputRef.current.disabled) {
        setTimeout(() => {
          if (inputRef.current && !inputRef.current.disabled) {
            inputRef.current.focus();
            
            // On iOS, sometimes just focusing isn't enough - a click may help
            if (isMobile) {
              inputRef.current.click();
            }
          }
        }, 10); // Reduced from 50ms to make it more immediate
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
