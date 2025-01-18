import type { ReactNode } from 'react';
import React from 'react';

const mockMotion = {
  div: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
  button: ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
    <button className={className} onClick={onClick} type="button">{children}</button>
  ),
};

const mockAnimatePresence = ({ children }: { children: ReactNode }) => children;

module.exports = {
  motion: mockMotion,
  AnimatePresence: mockAnimatePresence,
};
