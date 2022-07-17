import $ from 'jquery'
import {fade} from "./utils";


const classNames = ['zero','one','two','three','four','five','six','seven','eight']

export default class Mine {


    constructor(game) {
        this.game = game
    }


    init(level) {
        const {rowCount, colCount, mineCount} = level
        this.visitFlag = false
        this.level = level

        this.state = [];
        this.visited = [];
        this.flagMineCount = 0;
        this.inGame = true
        //初始化数组状态
        for (let i = 0; i < rowCount; i++) {
            this.state[i] = [];
            this.visited[i] = [];
            for (let j = 0; j < colCount; j++) {
                this.state[i][j] = 0;
                this.visited[i][j] = false;
            }
        }

        //生成地雷
        let count = 0;
        do {
            const r1 = Math.floor(rowCount * Math.random());
            const r2 = Math.floor(colCount * Math.random());
            if (this.state[r1][r2] === 0) {
                count++;
                this.state[r1][r2] = -1;
            }
        } while (count < mineCount);
        const dom = this.game.getMineDom()
        $(dom).text(count)
        $('#tip').text('左键扫雷，右键插旗，再次点击右键拔旗')
    }

    each(callback){
        let count = 0;
        for(let i = 0 ; i < this.level.rowCount ;i++) {
            for (let j = 0; j < this.level.colCount; j++) {
                if(callback(i,j)){
                    count++;
                }
            }
        }
        return count
    }

    /**
     * 左键点击一个位置
     * @param u 行数
     * @param v 列数
     */
    leftClick(u,v){
        if(!this.inGame){
            return;
        }
        if(this.visited[u][v]){
            return;
        }
        if(!this.visitFlag){
            //第一次点击，保证不会踩到雷，第一次如果点到雷，把雷与随机一个不是雷的元素交换
            if(this.isMine(u,v)){
                let r1,r2;
                do{
                    r1 = Math.floor(this.level.rowCount * Math.random());
                    r2 = Math.floor(this.level.colCount * Math.random());
                }while (this.isMine(r1,r2))
                this.state[u][v] = 0;
                this.state[r1][r2] = -1;
                console.log(`wrap mine (${u},${v}) to (${r1},${r2})`)
            }
        }
        this.visitFlag = true
        if(this.isMine(u,v)){
            //踩到地雷了，游戏结束
            this.inGame = false
            this.each((i,j) => {
                //显示所有的雷
                if(this.isMine(i,j)){
                    const td = this.game.getTdDom(i,j)
                    $(td).addClass('mine')
                    fade(td)
                }
            })
            this.game.onFail()
            return;
        }
        this.visited[u][v] = true;
        const number = this.calcNumber(u,v)
        if(number === 0){
            //周边没有雷，消除这一格，并且对周边格子进行递归调用
            const td = this.game.getTdDom(u,v)
            $(td).addClass('zero')
            this.callAround(u,v,(i,j) => {
                this.leftClick(i,j)
            })
        }else{
            const td = this.game.getTdDom(u,v)
            $(td).addClass(classNames[number]).text(number)
        }
    }

    rightClick(u,v){
        if(!this.inGame){
            return;
        }
        if(this.visited[u][v]){
            return;
        }
        const td = this.game.getTdDom(u,v)
        const $td = $(td)
        if($td.hasClass('flag')){
            //取消旗子标记
            $td.removeClass('flag')
            this.flagMineCount--;
        }else{
            //增加旗子标记
            $td.addClass('flag')
            this.flagMineCount++;
        }
        $('#mineNum').text(this.level.mineCount - this.flagMineCount)
        this.checkWin()
    }

    inRange(u,v){
        return u >= 0 && u < this.level.rowCount && v >= 0 && v < this.level.colCount;
    }

    isMine(u,v){
        return this.state[u][v] === -1
    }

    callAround(u,v,callback){
        for(let i=-1;i<=1;i++){
            for(let j=-1;j<=1;j++){
                if(this.inRange(u+i,v+j)){
                    callback(u+i,v+j)
                }
            }
        }
    }

    /**
     * 计算一个位置的数字，也就是一个位置周边有几个雷
     * @private
     */
    calcNumber(u,v){
        let count = 0
        this.callAround(u,v,(i,j) => {
            if(this.inRange(i,j) && this.isMine(i,j)){
                count++
            }
        })
        return count
    }

    /**
     * 检查是否胜利
     */
    checkWin(){
        if (!this.inGame)
            return;
        if (this.flagMineCount > this.level.mineCount) {
            return;
        }
        const rightCount = this.each((i,j) => {
            const td = this.game.getTdDom(i,j)
            return $(td).hasClass('flag') && this.isMine(i,j)
        })
        if(rightCount === this.level.mineCount){
            this.inGame = false
            this.game.onWin()
        }
    }
}
