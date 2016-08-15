var ModuleThread = (function () {
    function ModuleThread(url) {
        this._worker = null;
        this._onMessage = null;
        this._postMessages = [];
        this._terminate = false;
        if (typeof (url) === "string") {
            var xhr_1 = new XMLHttpRequest();
            xhr_1.open("GET", url, true);
            xhr_1.onreadystatechange = (function () {
                if (xhr_1.readyState === 4 && xhr_1.status === 200) {
                    var code = xhr_1.responseText;
                    var u = URL.createObjectURL(new Blob([code], { type: "text/javascript; charset=utf-8" }));
                    this._worker = new Worker(u);
                    if (this._onMessage) {
                        this._worker.onmessage = this._onMessage;
                        this._onMessage = null;
                    }
                    if (this._postMessages.length > 0) {
                        for (var _i = 0, _a = this._postMessages; _i < _a.length; _i++) {
                            var v = _a[_i];
                            this._worker.postMessage(v);
                        }
                        this._postMessages = [];
                    }
                    if (this._terminate) {
                        this._terminate = false;
                        this._worker.terminate();
                        this._worker = null;
                    }
                    xhr_1 = null;
                }
            }).bind(this);
            xhr_1.send(null);
        }
        else {
            var code = url.toString().match(/^[^{]+\{([\s\S]*)\}$/)[1];
            var u = URL.createObjectURL(new Blob([code], { type: "text/javascript; charset=utf-8" }));
            this._worker = new Worker(u);
        }
    }
    Object.defineProperty(ModuleThread.prototype, "onMessage", {
        set: function (o) {
            if (this._worker)
                this._worker.onmessage = o;
            else
                this._onMessage = o;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ModuleThread.prototype, "onmessage", {
        set: function (o) {
            this.onMessage = o;
        },
        enumerable: true,
        configurable: true
    });
    ModuleThread.prototype.postMessage = function (msg) {
        if (this._worker)
            this._worker.postMessage(msg);
        else
            this._postMessages.push(msg);
    };
    ModuleThread.prototype.terminate = function () {
        if (this._worker) {
            this._worker.terminate();
            this._worker = null;
        }
        else
            this._terminate = true;
    };
    return ModuleThread;
}());
//# sourceMappingURL=thread.js.map