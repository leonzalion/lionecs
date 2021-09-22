import { EntityStateListener } from "~/types/context";
import { Entity } from "~/types/entity";
import { Lionecs } from "~/types/lionecs";
import { ComponentBase, ComponentState } from "~/types/state";

export function addEntityStateListener<
  C extends ComponentBase,
  S extends ComponentState<C>,
  E extends Entity,
  R extends Record<string, unknown> | undefined = undefined
>(
  this: Lionecs<C, S>,
  {
    entity,
    listener,
    extras,
  }: {
    entity: E;
    listener: EntityStateListener<E, C, S, R>;
    extras?: R;
  }
) {
  if (!this.entityListenerContexts.has(entity)) {
    this.entityListenerContexts.set(entity, []);
  }

  this.entityListenerContexts.get(entity)!.push({
    listener: listener as any,
    extras,
  });
}

export function createEntityStateListenerManager<
  C extends ComponentBase,
  S extends ComponentState<C>,
  E extends Entity,
  R extends Record<string, unknown> | undefined = undefined
>(this: Lionecs<C, S>, listener: EntityStateListener<E, C, S, R>) {
  const listeners = new Map<Entity, EntityStateListener<E, C, S, R>>();

  const registerEntityStateListener = (entity: E, extras?: R) => {
    if (!listeners.has(entity)) {
      this.addEntityStateListener({ entity, listener, extras });
      listeners.set(entity, listener);
    }
  };

  const deleteEntityStateListener = (entity: E) => {
    this.removeEntityStateListener({ entity, listener });
    listeners.delete(entity);
  };

  return { registerEntityStateListener, deleteEntityStateListener };
}

export function removeEntityStateListener<
  C extends ComponentBase,
  S extends ComponentState<C>,
  E extends Entity,
  R extends Record<string, unknown> | undefined = undefined
>(
  this: Lionecs<C, S>,
  {
    entity,
    listener,
  }: {
    entity: Entity;
    listener: EntityStateListener<E, C, S, R>;
  }
) {
  const index =
    this.entityListenerContexts
      .get(entity)
      ?.findIndex((e) => e.listener === listener) ?? -1;

  if (index !== -1) {
    this.entityListenerContexts.get(entity)!.splice(index, 1);
  }
}
