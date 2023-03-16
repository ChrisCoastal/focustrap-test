import type { ComponentProps, FC, PropsWithChildren } from 'react';
import { useEffect, useInsertionEffect, useRef } from 'react';
import { tabbable } from 'tabbable';

export interface FocusTrapProps extends PropsWithChildren<ComponentProps<'div'>> {
  isActive: boolean;
  trapFocus?: boolean;
  focusFromEnd?: boolean;
}

interface FocusableElement extends Element {
  focus?: (options?: { preventScroll?: boolean; focusVisible?: boolean }) => void;
}

export const FocusTrap: FC<FocusTrapProps> = ({
  isActive,
  trapFocus = true,
  focusFromEnd = false,
  children
}) => {
  const prevFocusedRef = useRef<FocusableElement | null>(null);
  const trapContainerRef = useRef<HTMLDivElement | null>(null);
  const focusableElementsRef = useRef<FocusableElement[]>([]);
  const autoFocusedChildRef = useRef<FocusableElement | null>(null);
  const firstFocusableRef = useRef<FocusableElement | null>(null);
  const lastFocusableRef = useRef<FocusableElement | null>(null);

  const isFocusableElement = (element: Element | null): element is FocusableElement => {
    const canFocus = typeof (element as FocusableElement)?.focus === 'function';
    return canFocus;
  };

  const focusIsInTrap = () => {
    const focus = focusableElementsRef.current.includes(document.activeElement as FocusableElement);
    return focus;
  };

  const isAutoFocusedChild = (element: FocusableElement) => {
    // check if a focusable child element has autoFocus prop passed
    const REACT_ELEMENT_PROPS = '__reactProps$';
    const props = Object.keys(element).find((key) => key.startsWith(REACT_ELEMENT_PROPS));
    // @ts-expect-error props is a defined key of element
    // autoFocus property is boolean on the element.props object
    const autoFocused = Boolean(props && element[props]?.autoFocus);
    return autoFocused;
  };

  const initFocusFrom = () => {
    const focusFrom = focusFromEnd ? lastFocusableRef.current : firstFocusableRef.current;

    // if autoFocus is passed to a child element, focus that element instead
    return autoFocusedChildRef.current || focusFrom;
  };

  // useInsertionEffect required get the currently focused element before any DOM mutation effecting
  // element focussed before the trap is mounted (ie: autoFocus prop being passed to a child element of the FocusTrap)
  useInsertionEffect(() => {
    // before moving focus into the trap save the currently focused element
    prevFocusedRef.current = isFocusableElement(document.activeElement)
      ? document.activeElement
      : null;

    return () => {
      // When the component unmounts, return focus to the previously focused element
      prevFocusedRef.current?.focus?.({ preventScroll: true });
    };
  }, [isActive]);

  useEffect(() => {
    // if children mutate while the trap is active, update the focusable elements
    const focusableElements = trapContainerRef.current
      ? tabbable(trapContainerRef.current).filter((element) => isFocusableElement(element))
      : [];
    console.log(focusableElements);
    focusableElementsRef.current = focusableElements;

    const autoFocusedChild = focusableElements.find((element) => isAutoFocusedChild(element));
    autoFocusedChildRef.current = autoFocusedChild || null;

    firstFocusableRef.current = focusableElements[0];
    lastFocusableRef.current = focusableElements[focusableElements.length - 1];
  }, [children]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !trapFocus) return;

      // Get the currently focused element
      const currentFocusedElement = document.activeElement;

      const focusTrapped = focusIsInTrap();
      if (trapFocus && !focusTrapped) console.error('Focus has escaped an active FocusTrap');

      if (event.shiftKey && currentFocusedElement === firstFocusableRef.current) {
        // If shift is pressed and the first focusable element is focused, focus the last focusable element
        event.preventDefault();
        lastFocusableRef.current?.focus?.();
      } else if (!event.shiftKey && currentFocusedElement === lastFocusableRef.current) {
        // If shift is not pressed and the last focusable element is focused, focus the first focusable element
        event.preventDefault();
        firstFocusableRef.current?.focus?.();
      }
    };

    // Move focus into the trap when it becomes active
    // this will occur regardless trapFocus value, as focus should move into the
    const focusElement = initFocusFrom();
    focusElement?.focus?.({ preventScroll: true });

    isActive && document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return <div ref={trapContainerRef}>{children}</div>;
};
