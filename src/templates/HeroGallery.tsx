'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const users = Array(5).fill({
  image: '/assets/images/head.jpeg',
  alt: 'User profile photo',
});

type FloatingPattern = {
  y: number[];
  x: number[];
};

// Different floating patterns for each image
const floatingPatterns: FloatingPattern[] = [
  {
    y: [0, -10, 0],
    x: [0, 5, 0],
  },
  {
    y: [0, 10, 0],
    x: [0, -5, 0],
  },
  {
    y: [-5, 5, -5],
    x: [5, -5, 5],
  },
  {
    y: [5, -5, 5],
    x: [-5, 5, -5],
  },
  {
    y: [0, -8, 0],
    x: [-3, 3, -3],
  },
];

export const HeroGallery = () => {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900 md:text-4xl">Meet the Faces Shaping the Future</h2>
        <div className="my-8 flex flex-wrap items-center justify-center gap-4">
          {users.map((user, index) => {
            const pattern = floatingPatterns[index % floatingPatterns.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: pattern?.y ?? 0,
                  x: pattern?.x ?? 0,
                }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  y: {
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  },
                  x: {
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  },
                }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="relative size-20 overflow-hidden rounded-lg shadow-lg md:size-24"
              >
                <Image
                  src={user.image}
                  alt={user.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                  data-testid={`hero-gallery-image-${index}`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
