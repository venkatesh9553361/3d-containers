'use client';
// pages/ContainerPage.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import Draggable from 'react-draggable';

const ContainerPage = () => {
  // Define your container size (250x250) and item sizes dynamically here
  const containerWidth = 250;
  const containerHeight = 150;

  // Function to generate random items with random sizes
  const generateRandomItems = () => {
    const numItems = 10; // You can adjust the number of items
    const minSize = 30; // Minimum item size
    const maxSize = [10, 20, 30, 25, 44, 77, 88, 99, 12, 23]; // Maximum item size

    const items = [];

    for (let i = 0; i < numItems; i++) {
      const width =
        Math.floor(Math.random() * (maxSize[i] - minSize + 1)) + minSize;
      const height =
        Math.floor(Math.random() * (maxSize[i] - minSize + 1)) + minSize;
      const x = Math.floor(Math.random() * (containerWidth - width));
      const y = Math.floor(Math.random() * (containerHeight - height));

      items.push({ width, height, x, y });
    }

    return items;
  };
  // Generate a list of random items with different sizes
  const items = generateRandomItems();

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 1000] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Container
          size={[containerWidth, containerHeight, 10]}
          items={items}
          depth={350}
        />
      </Canvas>
    </div>
  );
};

const Container = ({ size, items, depth }) => {
  const containerRef = useRef();
  const [isDragging, setDragging] = useState(false);
  useFrame(({ mouse }) => {
    if (isDragging) return; // Skip rotation when dragging
    // Rotate the container based on mouse position
    containerRef.current.rotation.x = (mouse.y * Math.PI) / 4;
    containerRef.current.rotation.y = (mouse.x * Math.PI) / 4;
  });

  const handleDrag = () => {
    setDragging(true);
  };

  const handleDragStop = () => {
    setDragging(false);
  };
  return (
    <Draggable
      bounds="parent"
      onStart={handleDrag}
      onStop={handleDragStop}
      axis="both"
    >
      <group ref={containerRef}>
        <mesh position={[size[0] / 2, size[1] / 2, depth / 2]}>
          <boxGeometry args={[size[0], size[1], depth]} />
          <meshBasicMaterial color={0xf0f0f0} wireframe />
        </mesh>
        {items.map((item, index) => {
          // Check if item is within container bounds
          const itemX = Math.max(Math.min(item.x, size[0] - item.width), 0);
          const itemY = Math.max(Math.min(item.y, size[1] - item.height), 0);

          return (
            <mesh
              key={index}
              position={[itemX, itemY, depth / 2]}
              scale={[item.width, item.height, depth]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={0x00ff00} />
            </mesh>
          );
        })}
      </group>
    </Draggable>
  );
};

export default ContainerPage;
