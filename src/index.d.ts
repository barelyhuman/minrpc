export declare function createRPCHandler<T extends Record<string, any>>(methods: T): (req: any, res: any) => Promise<void>;
