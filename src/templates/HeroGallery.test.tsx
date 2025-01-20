import { render, screen } from '@testing-library/react';

import { HeroGallery } from './HeroGallery';

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}));

describe('HeroGallery', () => {
  it('renders all 5 user images', () => {
    render(<HeroGallery />);

    const images = screen.getAllByTestId(/hero-gallery-image-\d/);

    expect(images).toHaveLength(5);
  });

  it('renders images with correct attributes', () => {
    render(<HeroGallery />);

    const firstImage = screen.getByTestId('hero-gallery-image-0');

    expect(firstImage).toHaveAttribute('alt', 'User profile photo');
    expect(firstImage).toHaveAttribute('src');
  });
});
