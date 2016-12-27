//function getEleByClass (className) {
//	return document.querySelector("."+className);
//}
//全局盒子,100% width 100% height
//=======================全局对象==========================
var flappyBird = document.querySelector(".flappyBird");
//开始游戏页面
var start = document.querySelector(".start");
//
var prompt = document.querySelector(".prompt");

var gameOver = document.querySelector(".gameOver");

var bird = document.querySelector(".bird");

var pipe = document.querySelector(".pipe");

var score = document.querySelector(".score");

var floor = document.querySelector(".floor");

var restart = document.querySelector(".go_restart")

var count = 0; //计分

var endScore = document.getElementById("end_score");

var endMedal = document.getElementById("end_medal");

var bestScore = document.getElementById("best_score");

var  scoreMusic = document.getElementById("score_music");
//=======================全局变量==========================
var isReady = false;
var isOver = false;
var upTimer = null;
var downTimer = null;
var pipeTimer = null;
//检测碰撞定时器
var checkTimer = null;
var maxSpeed = 5;
var speed = maxSpeed;
var isGameOver = false;

function birdUp() {
	bird.style.webkitTransform = "rotate(-20deg)";
	upTimer = setInterval(function() {
		if(!isOver) {
			speed -= 0.4;
			if(speed <= 0) {
				speed = 0;
				clearInterval(upTimer);
				//开始下降
				birdDown();
			}

			if(bird.offsetTop < -30) {
				bird.style.top = -30 + "px";
			}
			bird.style.top = bird.offsetTop - speed + "px";
		}

	}, 30)
}

function birdDown() {
	downTimer = setInterval(function() {
		if(!isOver) {
			speed += 0.4;
			var degree = speed * 5 - 20;
			if(degree <= 90) {
				bird.style.webkitTransform = "rotate(" + degree + "deg)";
			} else {
				bird.style.webkitTransform = "rotate(90deg)";
			}
			var tempTop = bird.offsetTop + speed + "px";
			bird.style.top = tempTop;
		}
	}, 30)
}

//小鸟跳跃
function birdJump() {
	if(isReady && !isOver) {
		//隐藏准备页面
		prompt.style.display = "none";
		//隐藏小鸟动画
		bird.className = "bird";
		score.style.display = "block";
		//每一次起跳都获得最大速度
		speed = maxSpeed;
		clearInterval(upTimer);
		clearInterval(downTimer);
		birdUp();
	}
}

function randomNum(max, min) {
	return parseInt(Math.random() * (max - min + 1)) + min;
}

//生成管道
function createPipe() {
	pipe.style.display = "block";

	pipeTimer = setInterval(function() {
		//创建一个管道

		var li = document.createElement("li");
		var upDiv = document.createElement("div");
		var downDiv = document.createElement("div");
		upDiv.className = "pp_up";
		downDiv.className = "pp_down";
		//一个管道最多只能增加一分，添加分数锁
		var numLock = false;
		//		随机设置管道窟窿位置
		var num = randomNum(200, 40);
		upDiv.style.top = -num + "px";
		downDiv.style.bottom = num - 240 + "px";
		//		设置上下管道
		li.appendChild(upDiv);
		li.appendChild(downDiv);
		//		添加管道页面
		pipe.appendChild(li);
		//管道运动
		var deviceWidth = flappyBird.offsetWidth;
		li.style.left = deviceWidth + "px";
		var liTimer = setInterval(function() {
			if(!isOver) {
				deviceWidth -= 2;
				li.style.left = deviceWidth + "px";
				//计分
				if(deviceWidth <= bird.offsetLeft - li.offsetWidth && !numLock) {
					count++;
					score.children[0].innerHTML = count;
					scoreMusic.play();
					numLock = true;
					
				}
				//删除一次
				if(deviceWidth < li.offsetWidth - 100) {
					pipe.removeChild(li);
					clearInterval(liTimer);

				}
			}

		}, 20)

	}, 3000)
}

//检测碰撞
function checkCrash() {
	checkTimer = setInterval(function() {
		//检测和管道是否碰撞
		for(var i = 0; i < pipe.children.length; i++) {
			isCrash(pipe.children[i].children[0]);
			isCrash(pipe.children[i].children[1]);
		}
		//检测和地板是否碰撞
		if(bird.offsetTop + bird.offsetWidth >= 520) {
			//游戏结束
			console.log("碰了")
			gg();
		}
	}, 10)
}

//是否与管道碰撞
function isCrash(obj) {
	var objT = obj.offsetTop;
	var objB = obj.offsetTop + obj.offsetHeight;
	var objL = obj.parentElement.offsetLeft;
	var objR = obj.parentElement.offsetLeft + obj.offsetWidth;

	var birdT = bird.offsetTop;
	var birdB = bird.offsetTop + bird.offsetHeight;
	var birdL = bird.offsetLeft;
	var birdR = bird.offsetLeft + bird.offsetWidth;

	if(!(birdT > objB || birdB < objT || birdL > objR || birdR < objL)) {
		gg();
	}
}

//游戏结束
function gg() {
	gameOver.style.display = "block";
	score.style.display = "block";
	isOver = true;
	clearInterval(upTimer);
	clearInterval(downTimer);
	clearInterval(pipeTimer);
	clearInterval(checkTimer);
	//	可以这样清除所有定时器
	//	var timer = setTimeout(function(){},30);
	//	for (var i = 0 ; i < timer ; i++) {
	//		clearInterval(i);
	//	}
	//地板停下
	floor.children[0].style.webkitAnimationPlayState = "paused";

	//小鸟翅膀
	bird.children[0].style.webkitAnimationPlayState = "paused";
	//	var fallTimer = setTimeout(function() {
	//		
	//	})
	bird.style.webkitTransform = "rotate(90deg)";
	bird.style.top = 520 - bird.offsetWidth + "px";
	bird.style.transition = "all 1s";

	restart.onclick = function() {
		location.reload();
		gameOver.style.display = "block";
	}
	//设置奖牌
	if (count < 3) {
		endMedal.style.backgroundImage = "url(img/medal/bronze.png)";
	}
	else if (count < 5) {
		endMedal.style.backgroundImage = "url(img/medal/silver.png)"
	}
	else if (count<7) {
		endMedal.style.backgroundImage = "url(img/medal/glod.png)"
	}
	else{
		endMedal.style.backgroundImage = "url(img/medal/platinum.png)"
	}
	//设置分数
	endScore.innerHTML = count;
	
	//

}


//2.预备工作
function promptJob() {
	//短期存活,为了激活游戏
	document.onclick = function() {
		//游戏一开始,小鸟就蹦跶一下
		birdJump();
		//让该绑定事件在一次晟敏周期中只存活一次
		document.onclick = null;
		//点击任何位置跳跃
		//		document.addEventListener("click", birdJump);
		document.onclick = birdJump;
		//产生管道
		createPipe();
		//检车碰撞
		checkCrash()

	}

}

//1.进入游戏
function gameStart(e) {
	var ev = e || event;
	ev.cancelBubble = true;//
	start.style.display = "none"
	prompt.style.display = "block";
	bird.style.display = "block";
	score.style.display = "block";
	isReady = true;
	promptJob();

}

function initGame() {

	//start.children[2].addEventListener("click", gameStart)
	start.children[2].onclick=function(){
		gameStart()
	}
		//
		
}

initGame();