export interface Component<N extends string, _T extends unknown> {
	__name: N;
}

export type ComponentMap = Record<string, Component<string, unknown>>;

export type ComponentKey<C extends ComponentMap> = keyof C;

export type ComponentType<C extends Component<string, unknown>> =
	C extends Component<infer N, infer T> ? { __name: N } & T : never;

export type ComponentName<C extends Component<string, unknown>> = C['__name'];
