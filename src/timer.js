/**
 * 计时器，用于记录时间过去了多少秒
 */
export default class Timer{
    constructor(callback) {
        this.run = false
        this.time = 0
        this.callback = callback
    }

    start(){
        this.stop();
        this.clear();
        this.run = true;
        this.uid = window.setInterval( () => {
            this.time++;
            if (typeof this.callback === 'function') {
                this.callback(this.time);
            }
        }, 1000);
    }
    clear(){
        this.time = 0;
        if (typeof this.callback === "function") {
            this.callback(0);
        }
    }

    getTime(){
        return this.time
    }

    isRunning(){
        return this.run
    }

    stop(){
        this.run = false;
        if (this.uid) {
            window.clearInterval(this.uid);
            this.uid = null;
        }
    }
}
