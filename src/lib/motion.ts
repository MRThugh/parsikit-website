/**
 * ParsiKit Purposeful Motion System
 * Powered by Motion for React
 * Built with full prefers-reduced-motion support
 */

import { type Variants } from 'motion/react';

export const MOTION_TRANSITIONS = {
  instant: { duration: 0.01 },
  fast: { duration: 0.15, ease: 'easeOut' as const },
  normal: { duration: 0.25, ease: 'easeOut' as const },
  gentle: { duration: 0.35, ease: 'easeOut' as const },
  spring: { type: 'spring' as const, stiffness: 350, damping: 30 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: MOTION_TRANSITIONS.normal,
  },
  exit: {
    opacity: 0,
    transition: MOTION_TRANSITIONS.fast,
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION_TRANSITIONS.normal,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: MOTION_TRANSITIONS.fast,
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export const modalPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: MOTION_TRANSITIONS.gentle,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: MOTION_TRANSITIONS.fast,
  },
};

export const tabIndicatorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: MOTION_TRANSITIONS.spring,
  },
};
