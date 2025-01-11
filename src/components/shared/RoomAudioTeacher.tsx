import  { useContext, useEffect, useRef, useState } from "react";

import Peer, { SignalData } from "simple-peer";
import styled from "styled-components";
import SocketContext from "../../contexts/socket_context/Context";
//import { v1 as uuid } from "uuid";

interface SocketInfo {
    socket_id: string;
    user_name: string;
}

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Audio =  (props: {peer: Peer.Instance | undefined}) => {
    const ref = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (props.peer) {
            props.peer.on("stream", stream => {
                if (ref.current) {
                    ref.current.srcObject = stream;
                }
            })
        }
    }, []);

    return (
        <audio autoPlay ref={ref} />
    );
}

interface PeerProps {
    peer: Peer.Instance | undefined;
    peerID: string;
    peerName: string;
  }

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const RoomAudioTeacher = (props:{roomID: string}) => {
    const {socket, user_name} = useContext(SocketContext).SocketState;
    
    
    //const [peers, setPeers] = useState<Peer.Instance[] | undefined>([])
    const [peers, setPeers] = useState<PeerProps[] | undefined>([])
    
    const userAudio = useRef<HTMLAudioElement>(null);
   
    const peersRef = useRef<PeerProps[]>([]);

    //const params = useParams<{ roomID: string }>();
    //const roomID = params.roomID;
    //const roomID = uuid();
    //navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
    useEffect(() => {
        if (socket) {
           
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            if (userAudio.current) {
                userAudio.current.srcObject = stream;
            }
            console.log("RoomAudioTeacher EMIT JOIN ROOM")
            socket.emit("join room", props.roomID);

            // receive an signal of type 'offer' (via the server) from a student.
            socket.on("user joined", (payload: {signal: SignalData, caller: SocketInfo}) => {
                // { signal: payload.signal, caller: payload.caller });
              //console.log("RoomAudioTeacher ON user joined payload =", payload)
              //console.log(" Teacher received - user joined message from payload.caller = ", payload.caller )
              //console.log(" Teacher calling addPeer with signal =", payload.signal, 'signal type =', payload.signal.type)
           
                // construct a peer and add it to teacher's peersRef array and peers array
                const peer = addPeer(payload.signal, payload.caller, stream);
                
                peersRef.current.push({
                    peerID: payload.caller.socket_id,
                    peerName: payload.caller.user_name,
                    peer,
                })
                setPeers(users => [...users as PeerProps[], {peer: peer, peerID: payload.caller.socket_id, peerName: payload.caller.user_name}]);
            });

            return () => {
                socket.off("user joined")
                socket.off("all users")
              }
            
        })
        }
    }, []);

    function addPeer(incomingSignal: SignalData, caller:SocketInfo, stream: any) {
        // create a student peer and add it to my peersRef array and peers array
        //console.log(" in RoomAudioTeacher addPeer....., caller = ", caller, "incoming signal type =", incomingSignal.type)
        // incomingSignal type = offer
        //console.log(" RoomAudioTeacher making new peer with initiator  = false")
        const peer = new Peer({
            initiator: false,
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
            stream,
        })

        //this event is not fired upon peer creation, but when the peer makes an offer and it is accepted (see line 268 - accept offer)
        peer.on("signal", signal => {
            console.log(" RoomAudioTeacher on signal signal type = ", signal.type)
            // Now, signal.type is "answer". I.e, the teacher answers the call from the caller, basic2 or any other student
            console.log(" RoomAudioTeacher EMITTING returning signal to caller =", caller, " signal type =", signal.type)
            socket?.emit("returning signal", { signal, caller })
        })

        peer.on('close', () => {
            console.log(" addPeer, on peer close...trying to remove stream")
            //peer.streams.forEach(stream => stream.getTracks().forEach(track => track.stop))

            console.log(" createPeer on peer close removing stream")
            
            peer.streams.forEach(stream => {
                //stream.removeTrack(stream.getAudioTracks()[0])
                stream.getAudioTracks().forEach(track => track.stop());
            });

            peer.streams.forEach(stream => {
                stream.removeTrack(stream.getAudioTracks()[0])
              
            });

            peer.removeStream(stream)
           // peer.stream.getTracks().forEach(track => track.stop());
            //peer.removeStream(stream)
           // peer.removeTrack( stream)
            //  peer.stream.getTracks().forEach(track => track.stop());
            //}
          
            //const videoElement = document.getElementById('remoteVideo');
            //if (videoElement) {
            //  videoElement.remove();
            //}
            
          });

        console.log(" Accept the incoming signal of type=", incomingSignal.type)
        //here, incomingSignal.type is "offer"
        peer.signal(incomingSignal);

        return peer;
    }

    useEffect(() => {
        if (socket) { 
            socket.on("user_disconnected", (socket_id: string) => {
                console.log("in Room, user disconnected socket_id = ", socket_id )
               // look in peersRef for this socket_id
               const disconnecting_peer = peersRef.current.find(peer => peer.peerID === socket_id)
               
               //console.log("Here1 disconnecting_peer", disconnecting_peer)

                //console.log("Here2 peersRef current", peersRef.current)
                //peerID": "bmkJ9U0syTTqqVyYAABV",
                
               //console.log("Here3 peers ", peers)

               //const index = peers?.findIndex(p => p.peerID === disconnecting_peer?.peerID);

               // console.log("MMMMNNNNNNnNNNNNxxxxx index", index)
               disconnecting_peer?.peer?.destroy()
               const audio_div = document.getElementById(socket_id)
               //console.log("video div", video_div)
               while (audio_div?.firstChild) {
                audio_div.firstChild.remove()
            }
               //peer: Peer.Instance | undefined;
               //peerID: string;
               // setCallAccepted(false)
                //peerRef.current?.destroy();
            })
            return () => {
              socket.off("user_disconnected")
            }
        }
      },[socket])

    return (
        <div>
            <div>
            <div className="bg-bgColor1 text-textColor1">Me: {user_name}</div>
            <audio muted ref={userAudio} autoPlay />
            </div>
            { peers && 
            peers.map((peer, index) => {
                if (peer) {
                return (
                    <div key={index} id={peer.peerID.toString()}>
                        <span className="bg-bgColor3 text-textColor3 text-xl mb-2">Peer: {peer.peerName}
                        </span>
                    <Audio peer={peer.peer}  />
                    </div>
                );
                }
                else {
                    return <div className="text-textColor1">ENPTY</div>
                }
            })
            }
        </div>
    );
};

export default RoomAudioTeacher;

/*
 return (
        <Container>
            <StyledVideo muted ref={userAudio} autoPlay playsInline />
            { peers && 
            peers.map((peer, index) => {
                if (peer) {
                return (
                    <div key={index} id={peer.peerID.toString()}>
                    <Video peer={peer.peer}  />
                    </div>
                );
                }
                else {
                    return <div className="text-textColor1">ENPTY</div>
                }
            })
            }
        </Container>
    );
*/