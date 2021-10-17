import type { Entity, EntityMap } from './entity';

export type LionecsState<
	C extends ComponentBase,
	S extends ComponentState<C>
> = {
	components: {
		[K in ComponentKey<C>]: EntityMap<C, S, K>;
	};
};

export type ComponentBase = Record<string, string>;

export type ComponentContext<
	C extends ComponentBase,
	S extends ComponentState<C>
> = {
	component: C;
	componentState: S;
};

export type ComponentState<C extends ComponentBase> = Record<
	ComponentKey<C>,
	any
>;

export type ComponentKey<C extends ComponentBase> = keyof C;

export type LionecsExtras<
	X extends Record<string, unknown> = Record<never, never>
> = X;

export type ComponentStateType<
	C extends ComponentBase,
	S extends ComponentState<C>,
	T
> = T extends keyof S ? S[T] : never;

export type ComponentStateTypes<
	C extends ComponentBase,
	S extends ComponentState<C>,
	Tuple extends readonly [...any[]]
> = {
	[Index in keyof Tuple]: ComponentStateType<C, S, Tuple[Index]> | undefined;
} & { length: Tuple['length'] };

export enum StateUpdateType {
	set = 'set',
	del = 'del',
}

export type StateUpdate<
	C extends ComponentBase,
	S extends ComponentState<C>,
	K extends ComponentKey<C>
> =
	| {
			type: StateUpdateType.set;
			entity: Entity;
			component: K;
			oldComponentState: S[K] | undefined;
			newComponentState: S[K];
	  }
	| {
			type: StateUpdateType.del;
			entity: Entity;
			component: K;
	  };
