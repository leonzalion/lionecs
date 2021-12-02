import type {
	Component,
	ComponentKey,
	ComponentMap,
	KeyOfComponent,
	TypeOfComponent,
} from './component';

export type Entity = string;

export type EntityMap<
	M extends ComponentMap,
	K extends ComponentKey<M>
> = Record<Entity, Readonly<TypeOfComponent<M[K]>>>;

export type TypedEntity<
	R extends ComponentKey<ComponentMap>,
	O extends ComponentKey<ComponentMap> | '__empty' = '__empty'
> = Entity & {
	__required: {
		[K in R]: true;
	};
	__optional: {
		[K in O]: true;
	};
};

export type DefineTypedEntity<
	R extends Component<string, unknown>,
	O extends Component<string, unknown> = Component<'__empty', never>
> = TypedEntity<KeyOfComponent<R>, KeyOfComponent<O>>;

export type EntityComponent<
	M extends ComponentMap,
	E extends Entity
> = E extends TypedEntity<infer R, infer O> ? R | O : ComponentKey<M>;

export type CreateEntityComponentsProp<
	M extends ComponentMap,
	E extends Entity
> = E extends TypedEntity<infer Req, infer Opt>
	? Opt extends ComponentKey<M>
		? {
				[K in keyof TypedEntity<Req, Opt>['__required']]: TypeOfComponent<M[K]>;
		  } & {
				[K in keyof TypedEntity<Req, Opt>['__optional']]?: TypeOfComponent<M[K]>;
		  }
		: { [K in keyof TypedEntity<Req, Opt>['__required']]: TypeOfComponent<M[K]> }
	: { [K in ComponentKey<M>]?: TypeOfComponent<M[K]> };

export type CreateEntityProps<M extends ComponentMap, E extends Entity> = {
	components: CreateEntityComponentsProp<M, E>;
};
