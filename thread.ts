class ModuleThread {

    private _worker: Worker = null;

    constructor(url: any) {
        if (typeof(url) === "string") {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = (function(): void {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let code: string = xhr.responseText;
                    let u: string = URL.createObjectURL(new Blob([code], {type: "text/javascript; charset=utf-8"}));
                    this._worker = new Worker(u);
                    // --- 是否有予绑定的事件 ---
                    if (this._onMessage) {
                        this._worker.onmessage = this._onMessage;
                        this._onMessage = null;
                    }
                    // --- 是否有予 post 的数据 ---
                    if (this._postMessages.length > 0) {
                        for (let v of this._postMessages) {
                            this._worker.postMessage(v);
                        }
                        this._postMessages = [];
                    }
                    // --- 是否要被销毁 ---
                    // --- 写在这里的意思是，需要按顺序执行完前面的再进行销毁 ---
                    if (this._terminate) {
                        this._terminate = false;
                        this._worker.terminate();
                        this._worker = null;
                    }
                    xhr = null;
                }
            }).bind(this);
            xhr.send(null);
        } else {
            let code: string = url.toString().match(/^[^{]+\{([\s\S]*)\}$/)[1];
            let u: string = URL.createObjectURL(new Blob([code], {type: "text/javascript; charset=utf-8"}));
            this._worker = new Worker(u);
        }

    }

    // --- 设置接收消息方法 ---
    private _onMessage: (ev: MessageEvent) => void = null;
    set onMessage(o: (ev: MessageEvent) => void) {
        if (this._worker) this._worker.onmessage = o;
        else this._onMessage = o;
    }
    // --- 无条件兼容 Worker 写法 ---
    set onmessage(o: (ev: MessageEvent) => void) {
        this.onMessage = o;
    }

    // --- 向线程里发消息 ---
    private _postMessages: any[] = [];
    public postMessage(msg: any): void {
        if (this._worker)
            this._worker.postMessage(msg);
        else
            this._postMessages.push(msg);
    }

    // --- 终止线程 ---
    private _terminate: boolean = false;
    public terminate(): void {
        if (this._worker) {
            this._worker.terminate();
            this._worker = null;
        } else
            this._terminate = true;
    }

}

