
import Peer, { SignalData } from "simple-peer";
import styled from "styled-components";
import SocketContext from '../contexts/socket_context/Context';
import { useContext, useEffect, useRef, useState } from "react";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

export function SimplePeer() {

    const {socket, uid } = useContext(SocketContext).SocketState;

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState<SignalData | string | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  //const socket = useRef();

  useEffect(() => {
    console.log("MMMMMMMMM")
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

      if (socket) {
          socket.on("yourID", (id) => {
              setYourID(id);
          })
          socket.on("allUsers", (users) => {
            console.log(" on allUsers = ", users)
              setUsers(users);
          })

          socket.on("hey", (data) => {
            console.log("hey received")
              setReceivingCall(true);
              setCaller(data.from);
              setCallerSignal(data.signal);
          })
      }
  }, []);

  function callPeer(id:any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      if (socket) {
        console.log(" socket emit callUser userToCall=", id)
        socket.emit("callUser", { userToCall: id, signalData: data, from: yourID })
      }
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    if (socket) {
        socket.on("callAccepted", signal => {
            console.log(" callAccepted received")
              setCallAccepted(true);
              peer.signal(signal);
        })
    }
  }

  function acceptCall() {
    setCallAccepted(true);
    /*
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    */

    const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
            iceServers: [
                {
                  urls: "stun:stun.relay.metered.ca:80",
                },
                {
                  urls: "turn:global.relay.metered.ca:80",
                  username: "c272ce74be69d6f69c0f13ab",
                  credential: "MvofS5mzj2TCXVDZ",
                },
                {
                  urls: "turn:global.relay.metered.ca:80?transport=tcp",
                  username: "c272ce74be69d6f69c0f13ab",
                  credential: "MvofS5mzj2TCXVDZ",
                },
                {
                  urls: "turn:global.relay.metered.ca:443",
                  username: "c272ce74be69d6f69c0f13ab",
                  credential: "MvofS5mzj2TCXVDZ",
                },
                {
                  urls: "turns:global.relay.metered.ca:443?transport=tcp",
                  username: "c272ce74be69d6f69c0f13ab",
                  credential: "MvofS5mzj2TCXVDZ",
                },
            ],
          
      },
        stream: stream,
      });

      peer.on("signal", data => {
          if (socket)
              socket.emit("acceptCall", { signal: data, to: caller })
      })

      peer.on("stream", stream => {
          if (partnerVideo.current) {
              partnerVideo.current.srcObject = stream;
          }
      });

    peer.signal(callerSignal as SignalData);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }
  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key)}>Call {key}</button>
          );
        })}
      </Row>
      <Row>
        {incomingCall}
      </Row>
    </Container>
  );
}

export default SimplePeer;

/*
 function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }
*/