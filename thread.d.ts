interface ModuleThread {

    onMessage: (o: (ev: MessageEvent) => void) => void;

    postMessage: (msg: any) => void;

    terminate: () => void;

}

