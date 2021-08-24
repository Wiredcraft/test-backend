"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
function default_1() {
    /**
    * Javascript未捕获的异常，沿着代码调用路径反向传递回event loop，会触发'uncaughtException'事件。
    * Node.js默认情况下会将这些异常堆栈打印到stderr 然后进程退出。
    * 为'uncaughtException'事件增加监听器会覆盖上述默认行为
    */
    process.on('uncaughtException', err => {
        logger_1.error.info('uncaughtException at:', err.message + '\n' + err.stack);
    });
    /**
     * 如果在事件循环的一次轮询中，一个Promise被rejected，并且此Promise没有绑定错误处理器，'unhandledRejection事件会被触发。
     * 当使用Promises进行编程时，异常会以"rejected promises"的形式封装。Rejections可以被promise.catch()捕获并处理，并且在Promise chain 中传播。
     * 'unhandledRejection事件在探测和跟踪promises被rejected，并且rejections未被处理的场景中是很有用的
     */
    process.on('unhandledRejection', (reason, p) => {
        logger_1.error.info('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    });
    /**
     * 如果有Promise被rejected，并且此Promise在Nodje.js事件循环的下次轮询及之后期间，被绑定了一个错误处理器[例如使用promise.catch()][])， 会触发'rejectionHandled'事件。
     */
    process.on('rejectionHandled', (reason, p) => {
        logger_1.error.info('Rejection Unhandled at: Promise ', p, ' reason: ', reason);
    });
    /** 任何时候Node.js发出进程告警，都会触发'warning'事件。 */
    process.on('warning', warning => {
        logger_1.error.info('warning on:', warning.name, warning.message, warning.stack);
    });
}
exports.default = default_1;
//# sourceMappingURL=errorListen.js.map