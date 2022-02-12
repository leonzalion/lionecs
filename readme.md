# LionECS

## Installation

Install LionECS from npm using your favourite package manager (I recommend [pnpm](https://pnpm.io/)):

```bash
pnpm add lionecs
```

## Usage

components.ts

```typescript
import type { Entity } from 'lionecs';
import { defComponent, defsToComponents } from 'lionecs';

export const Component = defsToComponents({
  name: defComponent<string>().name('name'),
  health: defComponent<number>().name('health'),
  inventory: defComponent<{ primary: Entity | null; secondary: Entity | null }>().name(
    'inventory'
  ),
  inventoryItem: defComponent<true>().name('inventoryItem'),
  damage: defComponent<number>().name('damage'),
});

// Avoids specifying `typeof Component` at every "type site" (the type equivalent of a call site)
export type Component = typeof Component;
```

entities.ts

```typescript
import { Component } from './components.js';
import { useDefineEntities } from 'lionecs';

const defineEntities = useDefineEntities<typeof Component>();

const entities = defineEntities({
  player: [Component.health, Component.inventory, Component.name],
  enemy: [Component.health, Component.damage],
  weapon: [Component.inventoryItem, Component.name, Component.damage],
});

export type PlayerEntity = typeof entities.player;
export type EnemyEntity = typeof entities.enemy;
export type WeaponEntity = typeof entities.weapon;
```

index.ts

```typescript
import { createLionecs } from 'lionecs';
import * as Component from './component.js';
import type { TypedEntity } from 'lionecs';

const ecs = createLionecs({ components: Component });
const p = ecs.useProxy();

// TypeScript IntelliSense works here!
const sword = ecs.entity<WeaponEntity>({
  damage: 10,
  inventoryItem: true,
  name: 'MySword',
});

const enemy = ecs.entity<EnemyEntity>({
  damage: 5,
  health: 50,
});

const player = ecs.entity<PlayerEntity>({
  health: 100,
  inventory: {
    primary: sword,
    secondary: null,
  },
  name: 'Leon',
});

function attack({
  attacker,
  defender,
}: {
  attacker: TypedEntity<Component['damage']>;
  defender: TypedEntity<Component['health']>;
}) {
  // TypeScript IntelliSense also works here!
  p(defender).health -= p(attacker).damage;
}

attack({ attacker: enemy, defender: player });

// Equivalent to ecs.get(player, Component.health)
console.log(p(player).health); // Outputs: 95

attack({ attacker: sword, defender: enemy });

console.log(p(enemy).health); // Outputs: 40

function swapInventoryItems(entity: TypedEntity<Component['inventory']>) {
  const inventory = p(entity).inventory;
  [inventory.primary, inventory.secondary] = [inventory.secondary, inventory.primary];
}

swapInventoryItems(player);

console.log(p(player).inventory.primary); // Outputs: null
console.log(p(player).inventory.secondary === sword); // Outputs: true
```
