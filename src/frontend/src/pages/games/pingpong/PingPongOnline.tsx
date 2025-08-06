import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PingPongDisplay from "./PingPongCanvas";
import { useUser } from "@/hooks/useUser";
import "@/assets/PingPong.css";

var PingPongOnline = () => {
  const [queryString, useQueryString] = useSearchParams();
  const { user, setUser } = useUser();
  const userId = queryString.get("id");
  const game_mode = queryString.get("mode");

  var address = `${import.meta.env.VITE_IP_ADDRESS}:8081/ws/`;

  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState(game_mode);
  const [obj, setObj] = useState(null);
  const [state, setState] = useState(-1);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState("...");
  const roleRef = useRef(role);
  const stateRef = useRef(state);
  const socketRef = useRef(socket);
  const playerI = useRef(0);
  const oPlayerI = useRef(1);
  const [pause_txt, setPause_txt] = useState("PAUSE");
  const navigate = useNavigate();

  var connect = () => {
    var ws = new WebSocket("wss://" + address);
    ws.onmessage = (e) => {
      var data = JSON.parse(e.data);
      if (data.msg_type === "server update") {
        if (data.obj) setObj(data.obj);
        if (data.role) {
          setRole(data.role);
          playerI.current = data.role == "host" ? 0 : 1;
          oPlayerI.current = playerI.current ? 0 : 1;
          /* self identificaiton */
          ws.send(
            JSON.stringify({
              message: "self update",
              target: "server",
              name: user.username,
              id: user.id,
              i: playerI.current,
            })
          );
        }
        if (data.state != undefined) {
          setState(data.state);
        }
        if (data.room_name) setRoomName(data.room_name);
        if (data.pause_txt) setPause_txt(data.pause_txt);
      } else if (
        data.msg_type === "pair update" &&
        data.target == roleRef.current
      ) {
        if (data.state !== undefined) {
          setState(data.state);
        }
        if (data.obj) setObj(data.obj);
      }
      if (data.message) setMessage(data.message);
    };
    ws.onerror = (e) => {
      setMessage("WebSocket error");
    };
    ws.onclose = (e) => {
      setObj(null);
      setMessage("WebSocket closed");
    };

    ws.onopen = (e) => {
      ws.send(
        JSON.stringify({
          message: "self init",
          target: "server",
          room_id: game_mode,
          id: user.id,
        })
      );
    };

    setSocket(ws);
    return ws;
  };

  var reconnect = () => {
    socket.close();
    /* clean */
    setState(-1);
    setPause_txt("PAUSE");
    setRole("unknown");
    setRoomName(null);
    setObj(null);
    /* */
    connect();
  };

  var send_state = (target, state) => {
    if (socketRef?.current?.readyState == WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: "state update",
          target: target,
          state: state,
        })
      );
    }
  };
  var send_move = (up, down) => {
    if (socketRef?.current?.readyState == WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: "player move",
          target: "server",
          i: playerI.current,
          downState: down,
          upState: up,
        })
      );
    }
  };

  var control_handler = (mode, event) => {
    if (mode && stateRef.current != 1) return;
    let key = event.key;
    switch (event.key) {
      case "ArrowUp":
        send_move(mode, -1);
        break;
      case "ArrowDown":
        send_move(-1, mode);
        break;
    }
  };

  var Loading = (props) => {
    const [elem, setElem] = useState(".");
    const elemRef = useRef(elem);
    var intervId = null;
    var interv = () => {
      setElem((elemRef.current.length < 3 ? elemRef.current : "") + ".");
    };
    useEffect(() => {
      intervId = window.setInterval(interv, 1000);
      return () => {
        if (intervId) window.clearInterval(intervId);
      };
    }, []);
    useEffect(() => {
      elemRef.current = elem;
    }, [elem]);
    return <span>{props.content + elem}</span>;
  };

  useEffect(() => {
    socketRef.current = connect();
    document.onkeydown = (e) => control_handler(1, e);
    document.onkeyup = (e) => control_handler(0, e);
    return () => {
      socketRef.current.close();
      document.onkeydown = null;
      document.onkeyup = null;
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    roleRef.current = role;
  }, [role]);
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  if (!user) return <h1>initiation error!</h1>;
  if (userId != user.id) return <h1>invalid query string</h1>;

  if (!game_mode) return <h1>invalid query string</h1>;
  else if (game_mode == "random") address += "game_random/";
  else address += "game_invite/";

  return (
    <div id="ping_pong">
      <div id="game_header">
        <h1>Ping Pong online!</h1>
        <button
          onClick={() => {
            navigate("/dashboard/games/ping_pong", { replace: true });
          }}
        >
          back
        </button>
        <button
          onClick={() => {
            navigate("/offline", { replace: false });
          }}
        >
          go local
        </button>
        <div id="game_prep">
          <h1>
            {message == "waiting for your pair" ? <Loading content="" /> : ""}
          </h1>
          <h1>game-room: {roomName}</h1>
          <h1>
            user: {user.username}, game-role:{" "}
            {role ? role : <Loading content="" />}
          </h1>
          <h1>
            opponent:{" "}
            {obj &&
            obj.paddles &&
            obj.paddles[oPlayerI.current].name.length != 0 ? (
              obj.paddles[oPlayerI.current].name
            ) : (
              <Loading content="" />
            )}
          </h1>
          <h1>
            score:{" "}
            {obj &&
            obj.paddles &&
            obj.paddles[playerI.current].score != undefined ? (
              obj.paddles[playerI.current].score
            ) : (
              <Loading content="" />
            )}{" "}
            --{" "}
            {obj &&
            obj.paddles &&
            obj.paddles[oPlayerI.current].name.length != 0 ? (
              obj.paddles[oPlayerI.current].score
            ) : (
              <Loading content="" />
            )}
          </h1>
          {state == 0 ? (
            <button
              onClick={() => {
                setState(3);
                send_state(playerI.current ? "host" : "guest", 3);
              }}
            >
              start
            </button>
          ) : state == 1 ? (
            <button
              onClick={() => {
                setState(0);
                send_state(playerI.current ? "host" : "guest", 0);
              }}
            >
              pause
            </button>
          ) : state == 2 ? (
            <h1>winner is {obj && obj.result ? obj.result.name : ""}!</h1>
          ) : (
            []
          )}
          {game_mode == "random" && (
            <button
              onClick={() => {
                reconnect();
              }}
            >
              rematch
            </button>
          )}
        </div>
      </div>
      <PingPongDisplay
        online={true}
        multiple={false}
        state={state}
        obj={obj}
        setState={setState}
        setObj={setObj}
        pause_txt={pause_txt}
        rounds={5}
      />
    </div>
  );
};

export default PingPongOnline;
