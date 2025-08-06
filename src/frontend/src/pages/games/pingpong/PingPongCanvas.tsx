import { useEffect, useState, useRef } from 'react';

/*
	props.objRef.current:
		ball {
			color<hex>: str,
			radius<px>: num,
			X<%>: num, Y<%>: num,
			VX<float>: num, VY<float>: num,
			AX<float>: num, AY<float>: num,
			border_touch: boolean
		},
		paddles [
			{
				name: str,
				score: num,
				color<hex>: str,
				y<%>: num,
			},
			..+1
		]

	props.stateRef.current:
		-2: 2/4 offline mode
		-1: prepare
		 0: pause
		 1: on
		 2: result
		 3: counter
*/

var	PingPongDisplay = props => {
	const [canvasRefresh, setCanvasRefresh] = useState(-1);

	var canvasElemRef = useRef(null);
	var canvasConElemRef = useRef(null);
	var canvasRefreshRef = useRef(canvasRefresh);
	var CWidth = useRef(null);
	var CHeight = useRef(null);
	var requestId = useRef(null);

	var dt = 0.7;
	
	var objRef = useRef(props.obj);
	var stateRef = useRef(props.state);
	var pause_txtRef = useRef(props.pause_txt);
	var context = useRef(null);

	const refRequestAnimationFrame = context => {
		requestId.current = requestAnimationFrame(() => render(context));
	}
	
	var draw_background = context => {
		context.current.globalAlpha = 0.7;
		context.current.strokeStyle = "#1b4d82";
		for (let i = 0; i < CWidth.current; i += 20) {
			context.current.beginPath();
			context.current.moveTo(i, 0);
			context.current.lineTo(i, CHeight.current);
			context.current.stroke();
		}
		for (let i = 0; i < CHeight.current; i += 20) {
			context.current.beginPath();
			context.current.moveTo(0, i);
			context.current.lineTo(CWidth.current, i);
			context.current.stroke();
		}
	}

	var draw_rounded_rect = (context, x, y, width, height, radius) => {
		context.current.beginPath();
		context.current.moveTo(x, y + radius);
		context.current.arcTo(x, y + height, x + radius, y + height, radius);
		context.current.arcTo(x + width, y + height, x + width, y + height - radius, radius);
		context.current.arcTo(x + width, y, x + width - radius, y, radius);
		context.current.arcTo(x, y, x, y + radius, radius);
		context.current.stroke();
	}

	var rand = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}	

	var detect_collision = (x1, y1, w1, h1, x2, y2, w2, h2) => {
		if (
			x1 < x2 + w2 &&
			x1 + w1 > x2 &&
			y1 < y2 + h2 &&
			y1 + h1 > y2
			) return true;
		return false;
	}
	
	var calc_new_range = (old_val, old_min, old_max, new_min, new_max) => {
		return (((old_val - old_min) * (new_max - new_min)) / (old_max - old_min)) + new_min;
	}

	////////////////// ANIMATE ///
	var animate = () => {
		if (stateRef.current == 1) {
			// game ON
			if (objRef.current.ball) {
				objRef.current.ball.x += objRef.current.ball.vx * dt;
				objRef.current.ball.y += objRef.current.ball.vy * dt;

				objRef.current.ball.ax *= 0.01;
				objRef.current.ball.ay *= 0.01;

				objRef.current.ball.vx += objRef.current.ball.ax * dt;
				objRef.current.ball.vy += objRef.current.ball.ay * dt;

				for (let cur_paddle = 0; cur_paddle < 2; cur_paddle++) {
					if (!objRef.current.paddles[cur_paddle])
						continue;
					if (detect_collision(
						cur_paddle ? (100 - objRef.current.paddles[cur_paddle].w) : 0,
						objRef.current.paddles[cur_paddle].y,
						objRef.current.paddles[cur_paddle].w, objRef.current.paddles[cur_paddle].h,
						objRef.current.ball.x - objRef.current.ball.radius,
						objRef.current.ball.y - objRef.current.ball.radius,
						objRef.current.ball.radius * 2,
						objRef.current.ball.radius * 2
							)) {
						objRef.current.ball.vx *= -1;
						objRef.current.ball.ax = Math.sign(objRef.current.ball.vx) * 1;
						if (!cur_paddle) {
							objRef.current.ball.x = objRef.current.paddles[cur_paddle].w
								+ objRef.current.ball.radius;
						}
						else	objRef.current.ball.x = 100 - objRef.current.paddles[cur_paddle].w
								- objRef.current.ball.radius;
						break;
					}
				}
				if ((objRef.current.ball.x - objRef.current.ball.radius) <= 0
					|| (objRef.current.ball.x + objRef.current.ball.radius) >= 100) {
					//if (!objRef.current.ball.border_touch) {
						objRef.current.ball.vx *= -1;
						objRef.current.ball.ax = Math.sign(objRef.current.ball.vx) * 1;
						//objRef.current.ball.border_touch = true;
						if ((objRef.current.ball.x - objRef.current.ball.radius) <= 0) // left intersection
							objRef.current.paddles[1].score += 1;
						else // right intersection
							objRef.current.paddles[0].score += 1;
						// ball reset
						//objRef.current.ball.border_touch = false;
						objRef.current.ball.x = 50;
						objRef.current.ball.y = 50;
						objRef.current.ball.vx = rand(0, 1) ? -0.2 : 0.2;
						objRef.current.ball.vy = rand(0, 1) ? -0.9 : 0.9;
						objRef.current.ax = 0;
						objRef.current.ay = 0;
						// stateRef.current update
						// match end check
						if (objRef.current.paddles[0].score != objRef.current.paddles[1].score &&
						(objRef.current.paddles[0].score + objRef.current.paddles[1].score >= props.rounds || 
						objRef.current.paddles[0].score > props.rounds / 2 || objRef.current.paddles[1].score > props.rounds / 2)) {
							if (objRef.current.paddles[0].score > objRef.current.paddles[1].score)
								objRef.current.result = objRef.current.paddles[0];
							else	objRef.current.result = objRef.current.paddles[1];
							props.setObj(objRef.current);
							props.setState(2);
						}
						else {
							if (!props.online) {
								props.setState(3);
								props.start_game(3);
							}
							else	props.setState(1);
						}
					//}
				}
				else if ((objRef.current.ball.y - objRef.current.ball.radius) <= 0
					|| (objRef.current.ball.y + objRef.current.ball.radius) >= 100) {
					//if (!objRef.current.ball.border_touch) {
						objRef.current.ball.vy *= -1;
						objRef.current.ball.ay = Math.sign(objRef.current.ball.vy) * 1;
						objRef.current.ball.border_touch = true;
					//}
				}
				//else	objRef.current.ball.border_touch = false;
			}
			for (let cur_paddle = 0; cur_paddle < 2; cur_paddle++) {
				if (!objRef.current.paddles[cur_paddle])
					continue;

				objRef.current.paddles[cur_paddle].y += objRef.current.paddles[cur_paddle].upState
					? -1
					: objRef.current.paddles[cur_paddle].downState
						? 1
						: 0;

				if ((objRef.current.paddles[cur_paddle].y <= 1)
					|| ((objRef.current.paddles[cur_paddle].y + objRef.current.paddles[cur_paddle].h) >= 99)) {
					if (objRef.current.paddles[cur_paddle].y <= 1)
						objRef.current.paddles[cur_paddle].y = 1;
					else	objRef.current.paddles[cur_paddle].y = 99 - objRef.current.paddles[cur_paddle].h;
				}
			}
		}
	}
	//////////////////////////////
	
	//////////////// RENDER ///
	var render = context => {
		if (!context.current || !objRef.current) 
			return;
		context.current.clearRect(0, 0, CWidth.current, CHeight.current);
		/*if (!props.online)
			draw_background(context);*/
		if (stateRef.current == 1) {
			// game ON
			if (!props.online)
				animate();
			if (objRef.current.ball) {
				/* very smart translation from percentage to actual cords */
				let x = calc_new_range(objRef.current.ball.x, 0, 100, 0, CWidth.current);
				let y = calc_new_range(objRef.current.ball.y, 0, 100, 0, CHeight.current);
				let radius = calc_new_range(objRef.current.ball.radius, 0, 100, 0, CWidth.current);
				context.current.strokeStyle = objRef.current.ball.color;
				context.current.fillStyle = objRef.current.ball.color;
				context.current.globalAlpha = 1;
				context.current.beginPath();
				context.current.arc(x, y, radius, 0, 2 * Math.PI);
				context.current.stroke();
				context.current.globalAlpha = 0.3;
				context.current.fill();
			}
			for (let cur_paddle = 0; cur_paddle < 2; cur_paddle++) {
				if (!objRef.current.paddles[cur_paddle])
					continue;
				let y = calc_new_range(objRef.current.paddles[cur_paddle].y, 0, 100, 0, CHeight.current);
				let h = calc_new_range(objRef.current.paddles[cur_paddle].h, 0, 100, 0, CHeight.current);
				let w = calc_new_range(objRef.current.paddles[cur_paddle].w, 0, 100, 0, CWidth.current);
				context.current.strokeStyle = objRef.current.paddles[cur_paddle].color;
				context.current.fillStyle = objRef.current.paddles[cur_paddle].color;
				context.current.globalAlpha = 1;
				draw_rounded_rect(context, cur_paddle ? (CWidth.current - w) : 0, y, w, h, CWidth.current / 50);
				context.current.globalAlpha = 0.3;
				context.current.fill();
			}
		}
		if (stateRef.current != 1) {
			context.current.fillStyle = "#FFFFFF";
			context.current.fillText(pause_txtRef.current, CWidth.current / 2, CHeight.current / 2);
		}
		if (stateRef.current == 1 && !props.online)
			requestId.current = requestAnimationFrame(() => render(context));
		if (!props.online)
			props.setObj(objRef.current);
	}
	//////////////////////////

	useEffect(() => {
		if (canvasRefresh == -1)
			setCanvasRefresh(0);
		if (typeof window !== undefined)
			window.onresize = () => {
				setCanvasRefresh( canvasRefreshRef.current ? 0 : 1 );
			}
		return () => {
			window.onresize = undefined;
		}
	}, [])
	
	useEffect(() => {
		canvasRefreshRef.current = canvasRefresh;

		if (!canvasElemRef.current) canvasElemRef.current = document.getElementById("main_game_canvas");
		if (!canvasConElemRef.current) canvasConElemRef.current = document.getElementById("canvas_container");
		
		if (canvasElemRef.current) {
			CWidth.current = canvasElemRef.current.width = canvasConElemRef.current.offsetWidth;
			CHeight.current = canvasElemRef.current.height = canvasConElemRef.current.offsetHeight;
			if (!context.current) 
				context.current = canvasElemRef.current.getContext("2d");
			if (context.current) {
				context.current.lineWidth = 1;
				context.current.font = "70px monospace";
				context.current.textAlign = "center";
				context.current.globalAlpha = 1;
				context.current.fontVariantCaps = "all-small-caps";
				if (requestId.current !== null)
					cancelAnimationFrame(requestId.current);
				render(context);
			}
		}
		return () => {
			if (requestId.current !== null)
				cancelAnimationFrame(requestId.current);
		}
	}, [canvasRefresh])

	useEffect(() => {
		objRef.current = props.obj;
		render(context);
	}, [props.obj]);

	useEffect(() => {
		stateRef.current = props.state;
		if (props.multiple)
			setCanvasRefresh(canvasRefreshRef.current ? 0 : 1);
		else	render(context);
	}, [props.state]);

	useEffect(() => {
		pause_txtRef.current = props.pause_txt;
		render(context);
	}, [props.pause_txt]);

	return (
		<div id="canvas_container">
			<canvas id="main_game_canvas">
				something went wrong!, try <a onClick={() => window.location.reload()}>refreshing</a>
			</canvas>
		</div>
	)
}

export default PingPongDisplay;
