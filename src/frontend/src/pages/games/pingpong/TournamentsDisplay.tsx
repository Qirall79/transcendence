import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import {
	get_tournaments,
	delete_tournament,
	create_tournament,
	subscribe,
	get_subscriptions,
	unsubscribe,
} from '@/actions/tournamentActions';
import '@/assets/Tournaments.css';

/*

	operations
		0: no operation
		1: filling tournament info

*/

var TournamentsDisplay = () => {
	const {user, setUser} = useUser();
	const [tournaments, setTournaments] = useState([]);
	const [available_tournaments, set_available_tournaments] = useState(0);
	const [current_tournament_name, set_current_tournament_name] = useState("");
	const [current_tournament_participants, set_current_tournament_participants] = useState(4);
	const [operation, setOperation] = useState(0);

	var count_available_tournaments = tournaments => {
		let available = 0;
		if (tournaments) {
			for (let i = 0; i < tournaments.length; i++)
				if (tournaments[i].is_open && !tournaments.is_full)
					available++;
		}
		return available;
	}

	const request_tournaments = async () => {
		let res;
		try {
			res = await get_tournaments(() => setUser(null));
			setTournaments(res);
		} catch (error) {
			alert("failed to retrieve tournaments");
		}
	};

	const create = async (name, game, participants) => {
		let res;
		try {
			res = await create_tournament(name, game, participants, () => setUser(null));
			if (!res.success)
				throw new Error(res.error);
		} catch (error) {
			alert("can't create tournament" + error);
		}
		request_tournaments();
	};

	const deletet = async (id) => {
		let res;
		try {
			res = await delete_tournament(id, () => setUser(null));
			if (!res.success)
				throw new Error(res.error);
			else	request_tournaments();
		} catch (error) {
			alert("can't delete tournament" + error);
		}
	};

	const tournament_acts = async (action, id) => {
		let res;
		try {
			if (action) res = await subscribe(id, () => setUser(null));
			else res = await unsubscribe(id, () => setUser(null));
		} catch (error) {
			alert("can't " + (action ? "subscribe" : "unsubscribe") + " from tournament");
		}
		request_tournaments();
	};

	var SingleTournament = (props) => {
		const [subscribed, setSubscribed] = useState(false);
		const [subscribers, setSubscribers] = useState(0);

		const is_subscribed = async (id) => {
			let res;
			try {
				res = await get_subscriptions(id, () => setUser(null));
				if (res.subscribers && res.subscribers.length) {
					for (let i = 0; i < res.subscribers.length; i++) {
						if (res.subscribers[i].id == user?.id) {
							if (!subscribed) setSubscribed(true);
							return;
						}
					}
				}
			} catch (error) {
				alert('cant check if user is subscribed' + error);
			}
			if (subscribed) setSubscribed(false);
		};

		const update_subscribers = async (id) => {
			let res;
			try {
				res = await get_subscriptions(id, () => setUser(null));
				if (res.subscribers) {
					if (subscribers != res.subscribers.length)
						setSubscribers(res.subscribers.length);
					return;
				}
			} catch (error) {
				alert("failed to retrieve tournament subscribers");
			}
			if (subscribers) setSubscribers(0);
		};

		useEffect(() => {
			is_subscribed(props.t.id);
			update_subscribers(props.t.id);
		}, []);


		return (
		<div id="single_tournament" key={props.t.id}>
			<h1>Name: {props.t.name}</h1>
			<h1>is-open: {props.t.is_open ? "true" : "false"}</h1>
			<h1>is-full: {props.t.is_full ? "true" : "false"}</h1>
			<h1>required-participants: {props.t.participants}</h1>
			<h1>current-subscribers: {subscribers}</h1>
			{
				props.t.is_open && !props.t.is_full ? (
					<button onClick={() =>
						tournament_acts(subscribed ? false : true, props.t.id)
					}>{ subscribed ? 'unsubscribe' : 'subscribe' }</button>
				) : ([])
			}
			{
				props.t.owner.id == user?.id ? (
					<button onClick={() => deletet(props.t.id)}>
						delete
					</button>
				) : ([])
			}
		</div>
		);
	};

	var toggle_this_button = e => {
		let target = e.target;
		if (target && target.classList) {
			let selected_inputs = document.querySelectorAll(".selected_tournament_option");
			for (let i = 0; selected_inputs && i < selected_inputs.length; i++)
				selected_inputs[i].classList?.remove("selected_tournament_option");
			target.classList.add("selected_tournament_option");
			set_current_tournament_participants(parseInt(target.textContent));
		}
	}

	var check_this_input = e => {
		let target = e.target;
		if (target)
			set_current_tournament_name(target.value);
	}

	var validate_this = e => {
		if (!current_tournament_name || current_tournament_name.length < 1
			|| current_tournament_name.length > 15) {
			alert("invalid tournament name");
			return;
		}
		if (!current_tournament_participants) {
			alert("invalid tournament participants number");
			return;
		}
		create(current_tournament_name, 'ping pong', current_tournament_participants);
		setOperation(0);
	}
	
	useEffect(() => { request_tournaments(); }, [])
	useEffect(() => { set_available_tournaments(count_available_tournaments(tournaments)); }, [tournaments])

	return (
	<div id="tournaments_display">
		<h1>ping pong tournaments!</h1>
		<div id="tournaments_header">
			<h1>tournaments: {tournaments?.length}</h1>
			<h1>available: {available_tournaments}</h1>
			{
				operation == 0 ?
					<button id="creation_button" onClick={() => setOperation(1)}>Create new one</button>
				: operation == 1 ?
					<div id="tournaments_info_inputs">
						<div>
							<label>Name: </label>
							<input type="text" placeholder="1 -> 15" onChange={check_this_input} />
						</div>
						<div>
							<label>required-participants: </label>
							<button className="selected_tournament_option" onClick={toggle_this_button}>4</button>
						</div>
						<div>
						<button onClick={() => setOperation(0)} >cancel</button>
						<button onClick={validate_this}>Create</button>
						</div>
					</div>
				: []
				
			}
			<button onClick={request_tournaments}>Refresh</button>
			<h2>note:<br/>- you will get a notification when a tournament you subscribed to is starting<br/>
			- tournaments starts automatically when they are full (required-participants = current-subscribers)<br/>
			- tournaments are only deleted manually</h2>
		</div>
		<div id="tournaments_list">
			{
				tournaments?.map((t) => (
					<SingleTournament t={t} key={t.id + Math.random()} />
				))
			}
		</div>
	</div>);
};

export default TournamentsDisplay;
