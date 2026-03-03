/**
 * 🎬 Animation Library
 * Reusable Framer Motion animation variants for consistent, performant animations
 */

// === TIMING PRESETS ===
export const timing = {
  // Quick feedback for buttons and small UI elements
  instant: { duration: 0.15 },

  // Standard interactions
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },

  // Page transitions
  pageTransition: { duration: 0.4 },

  // Spring physics for natural feel
  spring: {
    type: "spring",
    damping: 25,
    stiffness: 300,
  },
  smoothSpring: {
    type: "spring",
    damping: 30,
    stiffness: 400,
  },
  bouncySpring: {
    type: "spring",
    damping: 15,
    stiffness: 200,
  },
};

// === EASING CURVES ===
export const easing = {
  easeOut: [0.16, 1, 0.3, 1], // Standard ease-out
  easeInOut: [0.4, 0, 0.2, 1], // Material Design standard
  sharp: [0.4, 0, 0.6, 1], // Emphasized
  smooth: [0.25, 0.1, 0.25, 1], // Smooth transitions
};

// === FADE ANIMATIONS ===
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

// === SLIDE ANIMATIONS ===
export const slideUp = {
  initial: { y: "100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "100%", opacity: 0 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

export const slideDown = {
  initial: { y: "-100%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-100%", opacity: 0 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

export const slideInLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
  transition: { ...timing.fast, ease: easing.easeOut },
};

export const slideInRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
  transition: { ...timing.fast, ease: easing.easeOut },
};

// === SCALE ANIMATIONS ===
export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: timing.spring,
};

export const scaleInCenter = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  transition: timing.smoothSpring,
};

// === BACKDROP OVERLAY ===
export const backdropFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { ...timing.fast, ease: easing.easeInOut },
};

// === STAGGER ANIMATIONS ===
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...timing.normal, ease: easing.easeOut },
  },
};

// === BUTTON INTERACTIONS ===
export const buttonTap = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.02 },
  transition: timing.instant,
};

export const buttonPress = {
  whileTap: { scale: 0.95, y: 1 },
  transition: timing.instant,
};

export const iconHover = {
  whileHover: { scale: 1.1, rotate: 5 },
  whileTap: { scale: 0.9, rotate: -5 },
  transition: timing.spring,
};

// === PULSE ANIMATION ===
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

// === SHIMMER LOADING ===
export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// === CARD HOVER ===
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: timing.fast,
  },
  tap: {
    scale: 0.98,
    transition: timing.instant,
  },
};

// === MODAL ANIMATIONS ===
export const modalContainer = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { scale: 0.95, y: 20, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.95, y: 20, opacity: 0 },
  transition: { ...timing.normal, ease: easing.easeOut },
};

// === BOTTOM SHEET ANIMATIONS ===
export const bottomSheetDrag = {
  drag: "y",
  dragConstraints: { top: 0, bottom: 0 },
  dragElastic: { top: 0, bottom: 0.2 },
  dragMomentum: false,
  transition: timing.smoothSpring,
};

// === PAGE TRANSITIONS ===
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { ...timing.pageTransition, ease: easing.easeInOut },
};

// === NOTIFICATION ANIMATIONS ===
export const notificationSlide = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
  transition: timing.spring,
};

// === LOADING DOTS ===
export const loadingDot = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

// === SKELETON LOADING ===
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easing.easeInOut,
    },
  },
};

// === SUCCESS CHECKMARK ===
export const successCheckmark = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: easing.easeOut },
  },
};

// === RIPPLE EFFECT ===
export const ripple = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2.5,
    opacity: 0,
    transition: { duration: 0.6, ease: easing.easeOut },
  },
};
