import './styles/index.css'
import Game from "./game";
import {disableRightMouse} from "./utils";
import $ from 'jquery'
import {first,second,third} from "./level";

disableRightMouse()

document.getElementById('app').innerHTML = `
<div id="mine">
        <div class="level">
            <button class="active" id="btn-level-0">初级</button>
            <button id="btn-level-1">中级</button>
            <button id="btn-level-2">高级</button>
            <button id="btn-level-custom">自定义</button>
            <button id="btn-restart">重新开始</button>
        </div>
        <div class="gameBox" id="gameBox">
        </div>
        <div class="info">
            剩余雷数：<span class="mineNum" id="mineNum"></span>
            <br>
            <span class="tips" id="tip"></span>
        </div>
</div>
<div class="modal movefade movemodal" id="movemodal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<i class="close">X</i>
							<h4>自定义难度</h4>
						</div>
						<div class="modal-body">
							<p>
								行数：<input type="text" value="9" id="customRowCount"/>
							</p>
							<p>
								列数：<input type="text" value="9" id="customColCount"/>
							</p>
							<p>
								地雷数量：<input type="text" value="10" id="customMineCount"/>
							</p>
						</div>
						<div class="modal-footer">
							<button class="addbtn_ok">确定</button>
							<button class="addbtn_no close" >取消</button>
						</div>
					</div>
				</div>
			</div>
`

const game = new Game(document.getElementById('gameBox'));
game.newGame()
$('#btn-level-0').click(() => {
    $('.level button').removeClass('active')
    $('#btn-level-0').addClass('active')
    game.newGame(first)
})

$('#btn-level-1').click(() => {
    $('.level button').removeClass('active')
    $('#btn-level-1').addClass('active')
    game.newGame(second)
})

$('#btn-level-2').click(() => {
    $('.level button').removeClass('active')
    $('#btn-level-2').addClass('active')
    game.newGame(third)
})

$('#btn-restart').click(() => {
    game.newGame(game.level)
})

$('#btn-level-custom').click(() => {
    $('#movemodal').show()
})

$(".close").click(() => {
    $('#movemodal').hide()
})

$('.addbtn_ok').click(() => {
    if(!/^\d+$/.test($('#customRowCount').val()) || !/^\d+$/.test($('#customColCount').val()) || !/^\d+$/.test($('#customMineCount').val())){
        alert('输入有误！')
        return;
    }
    const level = {
        rowCount: parseInt($('#customRowCount').val()),
        colCount:parseInt($('#customColCount').val()),
        mineCount:parseInt($('#customMineCount').val()),
        name: '自定义'
    }
    if(level.mineCount === 0){
        alert('输入有误，至少需留1个地雷')
        return
    }
    if(level.rowCount * level.colCount < parseInt(level.mineCount) + 10){
        alert('输入有误，至少需留10个空位')
        return
    }
    $('#movemodal').hide()
    $('.level button').removeClass('active')
    $('#btn-level-custom').addClass('active')
    game.newGame(level)
})
