import Mine from "./mine";
import {first} from "./level";
import $ from "jquery";

/**
 * 游戏类，负责与DOM交互
 */
export default class Game{


    constructor(el) {
        this.el = el
        this.mine = new Mine(this)
    }


    newGame(level){
        console.log('newGame',this)
        if (!level) {
            level = first
        }
        this.startTime = new Date()
        this.level = level
        this.tds = []
        this.el.innerHTML = ''
        //初始化dom
        const table = document.createElement('table')
        for(let i=0;i<level.rowCount;i++){
            this.tds[i] = []
            const tr = document.createElement('tr')
            for(let j=0;j<level.colCount;j++){
                const td = document.createElement('td')
                this.tds[i][j] = td
                td.onclick = () => {
                    this.mine.leftClick(i,j)
                }
                td.onmousedown = (ev) =>{
                    if(ev.button === 2){
                        //右键点击
                        this.mine.rightClick(i,j)
                    }
                }
                tr.appendChild(td)
            }
            table.appendChild(tr)
        }
        this.el.appendChild(table)
        this.mine.init(level)
    }

    getTime(){
        let time = new Date() - this.startTime
        time = Math.floor(time / 1000)
        if(time < 60){
            return time + '秒'
        }else if(time < 3600){
            const minute = Math.floor(time / 60)
            const second = time - minute * 60
            return `${minute}分${second}秒`
        }else{
            const hour = Math.floor(time / 3600)
            const minute = Math.floor(  (time - hour * 3600)  / 60 )
            const second = time - hour * 3600 - minute * 60
            return `${hour}小时${minute}分${second}秒`
        }
    }

    onWin(){
        $('#tip').text('你赢了！耗时：' + this.getTime())
    }

    onFail(){
        $('#tip').text('你输了！耗时：'+ this.getTime())
    }

    /**
     *
     * @param i
     * @param j
     * @return {HTMLElement}
     */
    getTdDom(i,j){
        return this.tds[i][j]
    }

    getMineDom(){
        return document.getElementById('mineNum')
    }
}
