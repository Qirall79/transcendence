import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PingPongDisplay from './PingPongCanvas';
import { useUser } from '@/hooks/useUser';
import '@/assets/PingPong.css';
import { check_tournament } from '@/actions/tournamentActions';

var	PingPongOnlineTournament = () => {
	const [queryString, useQueryString] = useSearchParams();
	const {user, setUser} = useUser();
	const userId = queryString.get("id");

	var address = `${import.meta.env.VITE_IP_ADDRESS}:8081/ws/game_tournament/`;
	
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("...");
	const [tournament, setTournament] = useState(null);
	const [players, setPlayers] = useState(null);
	const [currentMatch, setCurrentMatch] = useState(null);
	const [matchResult, setMatchResult] = useState(null);
	const [tournamentResult, setTournamentResult] = useState(null);

	const [roomName, setRoomName] = useState(null);
	const [obj, setObj] = useState(null);
	const [state, setState] = useState(-1);
	const [role, setRole] = useState(null);
	const [pause_txt, setPause_txt] = useState("PAUSE");
	const [tid, setTid] = useState(queryString.get("tid"));

	var roleRef = useRef(role);
	var stateRef = useRef(state);
	var timeout_id = useRef(0);

	var tournamentRef = useRef(tournament);
	var socketRef = useRef(socket);
	var navigate = useNavigate();

	var connect = () => {
		var ws = new WebSocket('wss://' + address);
		ws.onmessage = e => {
			var data = JSON.parse(e.data);
			if (data.msg_type === 'server update') {
				if (data.obj) setObj(data.obj);
				if (data.state != undefined) {
					setState(data.state);
				}
				if (data.tournament) {
					setTournament(data.tournament);
					if (data.message == "tournament ended")
						setTournamentResult(data.tournament);
				}
				if (data.players) setPlayers(data.players);
				if (data.message == "match result" && data.match_result) {
					if (user.id == data.winner || user.id == data.loser)
						setMatchResult(JSON.parse(data.match_result));
				}

				if (data.message == "invalid tournament cridentials")
					ws.close();

				if (data.tournament_state && data.tournament_state == "won" 
					&& data.target == user.id) {
					ws.send(JSON.stringify({
						target: "server",
						message: "winners hall confirmation",
						id: user.id,
					}))
				}
				
				if (data.tournament_state && data.tournament_state == "lost"
					&& data.target == user.id) { 
					setState(5);
					if (ws.readyState == WebSocket.OPEN)
						ws.close();
				}

				if (data.message == "tournament result" && data.tournament_result) {
					setTournamentResult(JSON.parse(data.tournament_result));
					setState(4);
				}
					
				if (data.message == "match init") {
					if (data.player1 == user.id || data.player2 == user.id) {
						setObj(null);
						setRoomName(data.match_id);
						setCurrentMatch(JSON.parse(data.match));

						let role = "host";
						if (data.player2 == user.id)
							role = "guest";
						setRole(role);

						ws.send(JSON.stringify({
							target: "server",
							message: "match confirmation",
							match_id: data.match_id,
							role: role,
						}))
					}
				}
				
				if (data.pause_txt) 
					setPause_txt(data.pause_txt);
			}
			else if (data.msg_type === 'pair update' && data.target == roleRef.current) {
				if (data.state !== undefined) 
					setState(data.state);
			}
			if (data.message) setMessage(data.message);
		}
		ws.onerror = e => {
			if (ws.readyState === WebSocket.OPEN)
				ws.close();
			setMessage("WebSocket error");
		}
		ws.onclose = e => {
			setObj(null);
			setPlayers(null);
			setTournament(null);
			setCurrentMatch(null);
			//setMatchResult(null);
			//setTournamentResult(null);
			setMessage("WebSocket closed");
		}
		ws.onopen = e => {
			ws.send(JSON.stringify({
				message: "self init",
				target: "server",
				id: user.id,
				tid: tid,
			}))
		}
		setSocket(ws);
		return	ws;
	}

	var	reconnect = () => {
		socket.close();
		setState(-1);
		setPause_txt("PAUSE");
		setRole("unknown");
		connect();
	}

	var send_state = (target, state) => {
		if (socketRef?.current?.readyState == WebSocket.OPEN) {

			socketRef.current.send(JSON.stringify({
				message: "state update",
				target: target,
				state: state,
			}))
		}
	}

	var send_move = (up, down) => {
		if (socketRef?.current?.readyState == WebSocket.OPEN) {

			socketRef.current.send(JSON.stringify({
				message: "player move",
				target: "server",
				id: user.id,
				downState: down,
				upState: up,
			}))
		}
	}

	var control_handler = (mode, event) => {
		if (mode && stateRef.current != 1)
			return;
		let key = event.key;
		switch (key) {
			case "ArrowUp":
				send_move(mode, -1);
				break;
			case "ArrowDown":
				send_move(-1, mode);
				break;
		}
	}

	var Loading = props => {
		const [elem, setElem] = useState(".");
		const elemRef = useRef(elem);
		var interv = () => {
			setElem((elemRef.current.length < 3 ? elemRef.current : "") + '.');
		}
		useEffect(() => {
			const intervId = window.setInterval(interv, 1000);
			return () => {
				window.clearInterval(intervId);
				
			}
		}, [])
		useEffect(() => { elemRef.current = elem}, [elem]);
		return	<span>{props.content + elem}</span>;
	}

	useEffect(() => {
		var ws = connect();
		document.onkeydown = e => control_handler(1, e);
		document.onkeyup = e => control_handler(0, e);
		return () => {
			document.onkeyup = null;
			document.onkeydown = null;
			ws.close();
		}
	}, [])

	var CurrentMatch = props => {
		return props.match ? (
			<div id="tournament_match_container">
				<h1>id: <span>{props.match.match_id}</span></h1>
				<h1>state: <span>{props.match.state}</span></h1>
				<h1>player-1-name: <span>{props.match.paddles[0].name}</span></h1>
				<h1>player-2-name: <span>{props.match.paddles[1].name}</span></h1>
				<h1>player-1-score: <span>{props.match.paddles[0].score}</span></h1>
				<h1>player-2-score: <span>{props.match.paddles[1].score}</span></h1>
			</div>
		) : [] 
	}

	var CurrentTournament = props => {
		return props.tournament ? (
			<div id="tournament_info_display_container">
				<h1>id: <span>{props.tournament.id}</span></h1>
				<h1>name: <span>{props.tournament.name}</span></h1>
				<h1>participants: <span>{props.tournament.participants}</span></h1>
				<h1>opened: <span>{props.tournament.opened}</span></h1>
				<h1>started: <span>{props.tournament.started}</span></h1>
				<h1>attended: <span>{props.tournament.attended}</span></h1>
			</div>
		) : [] 
	}

	var TournamentResult = props => {
		return (props.tournament && props.tournament.winner) ? (
			<div id="tournament_result_display_container">
				<h1>winner-user: </h1>
				<h1>username: {props.tournament.winner.username}</h1>
				<h1>total-score: {props.tournament.winner.total_score}</h1>
				<h1>matches-played: {props.tournament.winner.matches_played}</h1>
				<h1>wins: {props.tournament.winner.wins}</h1>
			</div>
		) : []
	}

	var MatchResult = props => {
		return props.match ? (
			<div id="tournament_match_result_display_container">
				<h1>winner-id: {props.match.winner_id}</h1>
				<h1>loser-id: {props.match.loser_id}</h1>
				<h1>winner-score: {props.match.winner_score}</h1>
				<h1>loser-score: {props.match.loser_score}</h1>
				<h1>cause: {props.match.cause}</h1>
			</div>
		) : []
	}

	useEffect(() => { stateRef.current = state }, [state]);
	useEffect(() => { socketRef.current = socket }, [socket]);
	useEffect(() => { roleRef.current = role }, [role]);

	if (!user)
		return (<h1>initiation error!</h1>)
	if (!tid || userId != user.id)
		return (<h1>invalid query string(user id, tournament id)</h1>);
	
	return (
		<div id="ping_pong">
			<div id="game_header">
			<h1>Ping Pong online tournament!</h1>
			<button onClick={() => { navigate("/dashboard/games/ping_pong", { replace: true });}} >back</button>
			<button onClick={() => { navigate("/offline", { replace: false })}} >go local</button>
			<button onClick={() => { navigate("/dashboard/games/ping_pong/online?mode=random&id="+user.id, { replace: false })}} >go single online</button>
			<div id="game_prep">
			<h1>game-room: {roomName}</h1>
			<h1>user: {user.username}, game-role: {role ? role : <Loading content="" />}</h1>
			{
				state == 0 ?
					<button onClick={() => {
						setState(3);
						send_state(roleRef.current == "guest" ? "host" : "guest", 3);
					}} >start</button>
				: state == 1 ?
					<button onClick={() => {
						setState(0);
						send_state("server", 0);
						send_state(roleRef.current == "guest" ? "host" : "guest", 0);
					}} >pause</button>
				: []
			}
			</div>
			</div>
			{
			state == 2 ?
				<div id="match_end">
					<h1>match ended!</h1>
					{<MatchResult match={matchResult} />}
				</div>
			: state == 4 ?
				<div id="tournament_end">
					<h1>tournament ended!!</h1>
					{<TournamentResult tournament={tournamentResult} />}
				</div>
			: state == 5 ?
				<div id="tournament_loss">
					<h1>tournament ended, and you lost, good luck next time!!</h1>
					{<TournamentResult tournament={tournamentResult} />}
				</div>
			: (
				<div id="tournament_container">
					<PingPongDisplay online={true} multiple={true} state={state} obj={obj}
						setState={setState} setObj={setObj} pause_txt={pause_txt}
						rounds={3} />
					<div id="tournament_info_display">
						{obj ? <h1>current-match:</h1> : []}
						{<CurrentMatch match={obj} />}
						{tournament ? <h1>tournament:</h1> : []}
						{<CurrentTournament tournament={tournament} />}
					</div>
				</div>
			)
			}
		</div>
	)
}

export default PingPongOnlineTournament;
