import  { useContext, useEffect, useRef, useState } from "react";

import Peer, { SignalData } from "simple-peer";
import styled from "styled-components";
import SocketContext from "../../contexts/socket_context/Context";
//import { v1 as uuid } from "uuid";

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

const Video =  (props: {peer: Peer.Instance | undefined}) => {
    const ref = useRef<HTMLVideoElement>(null);

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
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

interface PeerProps {
    peer: Peer.Instance | undefined;
    peerID: string;
  }

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props:{roomID: string}) => {
    const {socket} = useContext(SocketContext).SocketState;
    
    
    //const [peers, setPeers] = useState<Peer.Instance[] | undefined>([])
    const [peers, setPeers] = useState<PeerProps[] | undefined>([])
    
    const userVideo = useRef<HTMLVideoElement>(null);
   
    const peersRef = useRef<PeerProps[]>([]);

    //const params = useParams<{ roomID: string }>();
    //const roomID = params.roomID;
    //const roomID = uuid();

    useEffect(() => {
        if (socket) {
            //console.log("EEEEE eeeee EEEEEE room id", props.roomID)
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
            socket.emit("join room", props.roomID);
            socket.on("all users", (users: string[]) => {
                console.log("MMMM users", users)
                
                //const peers:Peer.Instance[] = [];
                const peers:PeerProps[] = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socket.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({peer: peer, peerID: userID} );
                })
                setPeers(peers);
                
            })

            socket.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users as PeerProps[], {peer: peer, peerID: payload.callerID}]);
            });
            socket.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item?.peer?.signal(payload.signal);
            });
            
        })
        }
    }, []);

    function createPeer(userToSignal:any, callerID: string | undefined, stream: any) {
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
            socket?.emit("sending signal", { userToSignal, callerID, signal })
        })

        peer.on('close', () => {
            console.log(" createPeer on peer close removing stream")
            peer.removeStream(stream)
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

    function addPeer(incomingSignal: SignalData | string, callerID:string, stream: any) {
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
            socket?.emit("returning signal", { signal, callerID })
        })

        peer.on('close', () => {
            console.log(" addPeer, on peer close...trying to remove stream")
            peer.streams.forEach(stream => stream.getTracks().forEach(track => track.stop))
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
               const video_div = document.getElementById(socket_id)
               console.log("video div", video_div)
               while (video_div?.firstChild) {
                video_div.firstChild.remove()
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
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
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
};

export default Room;