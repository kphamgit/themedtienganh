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

const RoomAudio = (props:{roomID: string}) => {
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
            console.log("EMIT JOIN ROOM")
            socket.emit("join room", props.roomID);

            socket.on("all users", (users: SocketInfo[]) => {
                console.log("MMMM users", users)
                
                //const peers:Peer.Instance[] = [];
                const peers:PeerProps[] = [];
                users.forEach(usr => {
                  if (socket.id) {
                    const peer = createPeer(usr.socket_id, {socket_id: socket.id, user_name: user_name}, stream);
                    peersRef.current.push({
                        peerID: usr.socket_id,
                        peerName: usr.user_name,
                        peer,
                    })
                    peers.push({peer: peer, peerID: usr.socket_id, peerName: usr.user_name} );
                  }
                })
                setPeers(peers);
                
            })

            socket.on("user joined", payload => {
              //console.log(" received - sending signal, payload caller=", payload)
              //this.io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, caller: payload.caller });
                const peer = addPeer(payload.signal, payload.caller, stream);
                peersRef.current.push({
                    peerID: payload.caller.socket_id,
                    peerName: payload.caller.user_name,
                    peer,
                })
                setPeers(users => [...users as PeerProps[], {peer: peer, peerID: payload.caller.socket_id, peerName: payload.caller.user_name}]);
            });
            socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item?.peer?.signal(payload.signal);
            });
            
        })
        }
    }, []);

    function createPeer(userToSignal:any, caller: SocketInfo | undefined, stream: any) {
        console.log(" in create peer....")
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
            stream,
        });

        peer.on("signal", signal => {
          console.log(" emit sending signal caller=", caller)
          console.log(" emit sending signal userToCall=", userToSignal)
            socket?.emit("sending signal", { userToSignal, caller, signal })
        })

        peer.on('close', () => {
            console.log(" createPeer on peer close removing stream")
            peer.streams.forEach(stream => {
                stream.getAudioTracks().forEach(track => track.stop());
            });
            
            peer.streams.forEach(stream => {
                stream.removeTrack(stream.getAudioTracks()[0])
            });
            peer.removeStream(stream)
            /*
                 peerConnection.localStreams.forEach { mediaStream ->
            mediaStream.videoTracks.forEach { it.setEnabled(false) }
            mediaStream.audioTracks.forEach { it.setEnabled(false) }
        }
            */
            /*
            if (peer.stream) {
              peer.stream.getTracks().forEach(track => track.stop());
            }
          
            const videoElement = document.getElementById('remoteVideo');
            if (videoElement) {
              videoElement.remove();
            }
            */
          });
        return peer;
    }

    function addPeer(incomingSignal: SignalData | string, caller:SocketInfo, stream: any) {
        console.log(" in addPeer.....")
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

        peer.on("signal", signal => {
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
            <div className="bg-bgColor1 text-textColor1">{user_name}</div>
            <audio muted ref={userAudio} autoPlay />
            </div>
            { peers && 
            peers.map((peer, index) => {
                if (peer) {
                return (
                    <div key={index} id={peer.peerID.toString()}>
                        <span className="bg-bgColor3 text-textColor3 text-xl mb-2">{peer.peerName}
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

export default RoomAudio;

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