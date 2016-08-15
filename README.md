# ModuleThread
在网页上直接创建多线程进行复杂的操作。

## 和 Worker 有什么区别？
0.1 版正式发布！
完全兼容 Worker 方法的同时，支持：
* 可以支持跨域的 JS 文件执行
* 可以直接运行函数或匿名函数

## 使用范例

```typescript
let mt: ModuleThread = new ModuleThread("http://xxx/aa.js");
mt.onMessage = function(e: MessageEvent): void {
    alert("接收到消息：" + e.data);
};
```
http://xxx/ 如果是跨域的话需要设置 Access-Control-Allow-Origin，如果是原来的 Worker 即使设置也无法跨域。

也可以直接创建匿名函数来执行：

```typescript
let mt: ModuleThread = new ModuleThread(function(): void {
    onmessage = function(e: MessageEvent): void {
        postMessage("好的：" + e.data);
    };
});
mt.postMessage("测试");
mt.onMessage = function(e: MessageEvent): void {
    alert("接收到消息：【" + e.data + "】");
};
```

网页执行大规模计算也不用担心了！

## 如何杀死线程

很简单：

```typescript
mt.terminate();
```

## 浏览器兼容
我们仅兼容现代浏览器，因为只有现代浏览器才有 Worker。

## 库依赖
本类使用 TypeScript 开发，可用于 TypeScript 和 JavaScript，不依赖任何 JS 库。

## 关于
本组件由迈云网络开发开源，欢迎各位PR。
http://www.maiyun.net