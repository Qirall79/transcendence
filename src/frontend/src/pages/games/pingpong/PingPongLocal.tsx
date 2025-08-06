import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PingPongDisplay from './PingPongCanvas';
import { useUser } from '@/hooks/useUser';
import '@/assets/PingPong.css';

/*
	props.obj:
		ball {
			color<hex>: str,
			radius<px>: num,
			X<%>: num, Y<%>: num,
			VX<float>: num, VY<float>: num,
			AX<float>: num, AY<float>: num,
			paddle_touch: boolean, border_touch: boolean
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

	props.state:
		-1: prepare
		 0: pause
		 1: on
		 2: result
		 3: counter
*/

var	PingPongLocal = () => {
	const [queryString, useQueryString] = useSearchParams();
	const prePlayers: any = queryString.get("players");

	const [state, setState] = useState(prePlayers ? -1 : -2);
	const [obj, setObj] = useState(null);
	const navigate = useNavigate();
	const stateRef = useRef(state);
	const objRef = useRef(obj);
	const canvas_container_ref = useRef(null);
	const [pause_txt, setPause_txt] = useState("PAUSE");
	const [players, setPlayers] = useState(prePlayers ? prePlayers : 2);
	var timeout_id = useRef(0);

	var init_paddles = (num) => {
		let ob = new Array;
		for (let i = 0; i < num; i++) {
			ob[i] = new Object;
			ob[i].color = "#FFFFFF";
			ob[i].index = i;
			ob[i].score = 0;
			ob[i].name = "";
			ob[i].y = 10;
			ob[i].h = 20;
			ob[i].w = 4;
			ob[i].upState = 0;
			ob[i].downState = 0;
		}
		return ob;
	}

	var rand = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	var control_handler = (mode, event) => {
		if (mode && stateRef.current != 1)
			return;
		let key = event.key;
		switch (key) {
			case "W": key = "w";
			case "S": key = "s";
			case "ArrowUp": objRef.current.paddles[0].upState = mode; break;
			case "ArrowDown": objRef.current.paddles[0].downState = mode; break;
			case "w": objRef.current.paddles[1].upState = mode; break;
			case "s": objRef.current.paddles[1].downState = mode;break;
			default: break;
		}
	}
	
	var start_game = counter => {
		if (counter) {
			setPause_txt(counter.toString());
			timeout_id.current = window.setTimeout(() => start_game(counter - 1), 1000);
			return;
		}
		setPause_txt("PAUSE");
		setState(1);
	}

	useEffect(() => {
		canvas_container_ref.current = document.getElementById("canvas_container");

		var match: any = new Array;

		match.ball = new Object;
		match.ball.radius = 2;
		match.ball.border_touch = false;
		match.ball.color = "#FFFFFF";
		match.ball.x = 50;
		match.ball.y = 50;
		match.ball.vx = rand(0, 1) ? -0.2 : 0.2;
		match.ball.vy = rand(0, 1) ? -1 : 1;
		match.ball.ax = 0;
		match.ball.ay = 0;
		match.result = new Object;
		if (prePlayers)
			match.paddles = init_paddles(prePlayers);
		setObj(match);

		document.onkeydown = e => control_handler(1, e);
		document.onkeyup = e => control_handler(0, e);
		return (() => {
			document.onkeydown = null;
			document.onkeyup = null;
			if (timeout_id.current != 0)
				window.clearTimeout(timeout_id.current);
		})
	}, [])	

	useEffect(() => {
		stateRef.current = state;
		if (state == 2) {
			if (obj.paddles.length == 2) // reset game
				window.setTimeout(() => {
					obj.paddles = init_paddles(players);
					setState(-1);
				}, 5500);
			else if (obj.paddles.length == 4)
				window.setTimeout(() => {
					obj.paddles[0] = obj.paddles[2];
					obj.paddles[1] = obj.paddles[3];
					obj.paddles[2] = obj.result;
					obj.paddles.splice(3, 1);
					setState(0);
				}, 3000);
			else if (obj.paddles.length == 3)
				window.setTimeout(() => {
					obj.paddles[0] = obj.result;
					obj.paddles[1] = obj.paddles[2];
					obj.paddles[0].score = 0;
					obj.paddles[1].score = 0;
					obj.paddles.splice(2, 1);
					setState(0);
				}, 3000);
			obj.ball.x = 50;
			obj.ball.y = 50;
			obj.ball.vx = rand(0, 1) ? -0.2 : 0.2;
			obj.ball.vy = rand(0, 1) ? -0.9 : 0.9;
		}
	}, [state]);

	useEffect(() => {objRef.current = obj}, [obj]);
	
	if (prePlayers && prePlayers != 2 && prePlayers != 4)
		return (<h1>invalid query string</h1>);

	return (
		<div id="ping_pong" >
			<div id="game_header">
			<h1>Ping Pong local!</h1>
			<button onClick={() => {
				navigate("/", { replace: false });
			}} >back</button>
			{/*
				state != -2
				? []
				: <button onClick={() => {
					setPause_txt("PAUSE");
					if (timeout_id.current != 0)
						window.clearTimeout(timeout_id.current);
					setState(-2);
				}} >reset</button>
				: []
			*/}
			{
				state == -2 ?
					<div id="game_prep">
						<button onClick={e => {
							setPlayers(2);
							obj.paddles = init_paddles(2);
							setState(-1);
						}}>2 players</button>
						<button onClick={() => {
							setPlayers(4);
							obj.paddles = init_paddles(4);
							setState(-1);
						}}>4 players</button>
					</div>
				: state == -1 ?
					<div id="game_prep">
						{
							obj ? obj.paddles.map((el, i) =>  {
								return (<input
									key={i}
									type="text"
									id={"input " + i}
									placeholder={"player " + (i+1) + " name, 1 -> 15"}
									onChange={(e) => {
										el.name = e.target.value;
									}}
								/>)
							}) : []
						}
						<button onClick={e => {
							if (obj) {
								for (let i = 0; i < obj.paddles.length; i++) {
									if (!obj.paddles[i].name || !obj.paddles[i].name.length
										|| obj.paddles[i].name.length > 15) {
										alert("invalid player " + i + " name!");
										return;
									}
									for (let j = 0; j < obj.paddles.length; j++) {
										if (i != j && obj.paddles[i].name == obj.paddles[j].name) {
											alert("cant have the same name multiple times");
											return;
										}
									}
								}
								setState(0);
							}
						}}>done</button>
					</div>
				: <div id="game_result">
					{
						state == 2 ?
							<h1>winner is {obj.result.name}!</h1>
						: <h1>{obj.paddles[0].name}, {obj.paddles[0].score} VS {obj.paddles[1].name}, {obj.paddles[1].score}</h1>
					}
				</div>
			}
			{
				state == 0 ? <button onClick={() => {
					if (timeout_id.current != 0)
						window.clearTimeout(timeout_id.current);
					setState(3);
					start_game(5);
				}} >start</button>
				: state == 1 ? <button onClick={() => {
					if (timeout_id.current != 0)
						window.clearTimeout(timeout_id.current);
					setState(0)
				}} >pause</button>
				: []
			}
			</div>	
			<PingPongDisplay online={false} multiple={false}
				state={state} obj={obj}
				setState={setState} setObj={setObj}
				pause_txt={pause_txt} rounds={5}
				start_game={start_game} />
		</div>
	)
}

export default PingPongLocal;
