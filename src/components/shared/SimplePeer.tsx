
import Peer, { SignalData } from 'simple-peer'
import styled from "styled-components";
import SocketContext from '../../contexts/socket_context/Context';
import { useContext, useEffect, useRef, useState } from "react";
//import { useLocation } from 'react-router-dom';

/*
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
*/

const Video = styled.video`
  border: 1px solid blue;
  width: 20%;
  height: 20%;
`;

interface SocketInfo {
  socket_id: string;
  user_name: string;

}

export function SimplePeer() {

    const {socket, user_name, users} = useContext(SocketContext).SocketState;

  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerUserName, setCallerUserName] = useState('')
  const [callerSignal, setCallerSignal] = useState<SignalData | string | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  //const socket = useRef();
  const peerRef =useRef<Peer.Instance | null>(null);

   
  //const location = useLocation();
  //const logged_in_users: SocketInfo[] = location.state;
  //console.log("YYYYYYYY logged in users", logged_in_users)


  //user_disconnected
  useEffect(() => {
    if (socket) { 
        socket.on("user_disconnected", (user_name: string) => {
            //console.log("in Simple Peer, user disconnected user name = ", user_name )
            setCaller('')
            setCallAccepted(false)
            peerRef.current?.destroy();
        })
        return () => {
          socket.off("user_disconnected")
        }
    }
  },[socket])

  useEffect(() => {
    if (socket) {
      if (users) {
        //console.log(" in Simple Peer HERE users...", users)
        users.forEach((usr, index) => {
          //console.log("mmmm wwwww usr", usr)
          if (usr.socket_id === socket.id) {
            //console.log(" xxxxxxxxxx found my ID", socket.id)
            setYourID(socket.id)
          }

        })
      }
    }
    //setLoggedInUsers(logged_in_users)
  
  },[users, socket])

  useEffect(() => {
    //console.log(" HERE socket =", socket)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

      if (socket) {
        /*
          socket.on("yourID", (id) => {
              console.log("xxxxxxx ... received yourID...id =", id)
            //socket.emit("yourID", socket.id); on server side
           
             // setYourID(id);
          })
          */
          //socket.on("allUsers", (users) => {
            //console.log(" on allUsers = ", users)
             // setUsers(users);
          //})

          socket.on("hey", (data:any) => {
              //console.log("hey ......,,,,,,,,,,,,,,,,,xxxxxxxx received, data from user", data.from_user)
              setReceivingCall(true);
              setCaller(data.from);
              setCallerSignal(data.signal);
              setCallerUserName(data.from_name)
          })
          return () => {
            socket?.off("hey")
          }
      }
  }, [socket]);

  function callPeer(id:any) {
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
      if (socket) {
        //console.log(" socket emit callUser userToCall=", id)
        //console.log(" socket emit callUser userToCall user_name=", user_name)
       // socket.emit("callUser", { userToCall: id, signalData: data, from: yourID })
       socket.emit("callUser", { userToCall: id, signalData: data, from: yourID, from_user: user_name })
      }
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peerRef.current = peer;

    if (socket) {
        socket.on("callAccepted", signal => {
            //console.log(" callAccepted received")
              setCallAccepted(true);
              peer.signal(signal);
        })
    }
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
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

      peerRef.current = peer;

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
    //console.log('Receving call from ', caller)
    incomingCall = (
      <div>
        <h1 className='text-textColor2'>{caller} is calling you</h1>
       
        <button className='text-textColor2' onClick={acceptCall}>Accept</button>
      </div>
    )
  }
  return (
    <div>
      <div>
        {UserVideo}
        {PartnerVideo}
      </div>
      <div>
        { users &&
        users.map( (usr, index) => {
          return (
            <div key={index} className='mt-3'>
              <div>
                { usr.user_name === 'kpham' &&
              <button className='bg-amber-500 p-2 rounded-md mx-2' onClick={() => callPeer(usr)}>Call teacher</button>
                }
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {incomingCall}
      </div>
    </div>
  );
}

export default SimplePeer;

/*
return (
    <Container>
      <Row>
        <div>In SIMPLE PEER</div>
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
*/