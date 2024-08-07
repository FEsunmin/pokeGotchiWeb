import { MutableRefObject } from 'react';

export type Fruit = {
  index: number;
  name: string;
  radius: number;
  color: string;
};

export type FruitBody = Matter.Body & { index: number };

export type AddFruitParams = {
  engine: Matter.Engine;
  bodyRef: MutableRefObject<FruitBody | null>;
};

export type KeyDownParams = AddFruitParams & { isAbleRef: MutableRefObject<boolean> };
