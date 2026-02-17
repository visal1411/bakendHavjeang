import { useState, useRef } from "react";

/**
 * 📱 useBottomSheet Hook
 *
 * Manages bottom sheet drag interactions with touch and mouse support.
 * Implements swipe-to-expand/collapse gesture with 80px threshold.
 *
 * @returns {Object} Bottom sheet state and handlers
 * @property {string} bottomSheetState - 'collapsed' | 'expanded'
 * @property {React.RefObject} bottomSheetRef - Ref to attach to bottom sheet element
 * @property {Object} handlers - Event handlers for drag interactions
 * @property {Function} handlers.onMouseDown - Mouse down handler
 * @property {Function} handlers.onMouseMove - Mouse move handler
 * @property {Function} handlers.onMouseUp - Mouse up handler
 * @property {Function} handlers.onTouchStart - Touch start handler
 * @property {Function} handlers.onTouchMove - Touch move handler
 * @property {Function} handlers.onTouchEnd - Touch end handler
 * @property {Function} toggleBottomSheet - Toggle between collapsed/expanded
 * @property {Function} getBottomSheetHeight - Get height based on state
 *
 * @example
 * const { bottomSheetRef, handlers, bottomSheetState } = useBottomSheet();
 * <div ref={bottomSheetRef} {...handlers}>Content</div>
 */
export const useBottomSheet = () => {
  const [bottomSheetState, setBottomSheetState] = useState("collapsed");
  const bottomSheetRef = useRef(null);
  const dragStartY = useRef(0);

  const handleDragStart = (e) => {
    const touch = e.type.includes("touch") ? e.touches[0] : e;
    dragStartY.current = touch.clientY;
  };

  const handleDragMove = (e) => {
    if (dragStartY.current === 0) return;

    const touch = e.type.includes("touch") ? e.touches[0] : e;
    const deltaY = dragStartY.current - touch.clientY;

    if (deltaY > 80 && bottomSheetState === "collapsed") {
      setBottomSheetState("expanded");
      dragStartY.current = 0;
    } else if (deltaY < -80 && bottomSheetState === "expanded") {
      setBottomSheetState("collapsed");
      dragStartY.current = 0;
    }
  };

  const handleDragEnd = () => {
    dragStartY.current = 0;
  };

  const toggleBottomSheet = () => {
    setBottomSheetState((prev) =>
      prev === "collapsed" ? "expanded" : "collapsed"
    );
  };

  const getBottomSheetHeight = () => {
    return bottomSheetState === "expanded" ? "80%" : "140px";
  };

  return {
    bottomSheetState,
    bottomSheetRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    toggleBottomSheet,
    getBottomSheetHeight,
  };
};
