import  { useContext, useEffect, useRef, useState } from "react";

import Peer, { SignalData } from "simple-peer";
import styled from "styled-components";
import SocketContext from "../../contexts/socket_context/Context";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { Visualizer } from "react-sound-visualizer";
import { MdMicOff } from 'react-icons/md';
import { MdMic } from 'react-icons/md';
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

const RoomAudioStudent = (props:any) => {
    const {socket, user_name} = useContext(SocketContext).SocketState;
    
    const [myStream, setMyStream] = useState<MediaStream>();
    const [audioEnabled, setAudioEnabled] = useState(true);

    
    //const [peers, setPeers] = useState<Peer.Instance[] | undefined>([])
    const [peers, setPeers] = useState<PeerProps[] | undefined>([])
    
    const userAudio = useRef<HTMLAudioElement>(null);
   
    const peersRef = useRef<PeerProps[]>([]);

    const toggleAudio = () => {
        if (myStream) {
          myStream.getAudioTracks()[0].enabled = !audioEnabled;
          setAudioEnabled(!audioEnabled);
        }
      };

    //navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
    useEffect(() => {
        if (socket) {
           
            navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
            if (userAudio.current) {
                userAudio.current.srcObject = stream;
            }
            
            setMyStream(stream.clone());
            //console.log("1) RoomAudioStudent Basic 2 emits JOIN ROOM")
            socket.emit("join room");

            socket.on("teacher_id", (teacher: SocketInfo) => {
                //console.log("RoomAudioStudent all users message received, all users:", users)
                const peers:PeerProps[] = [];
                 //for a student in star configuration, "users" should contain only the teacher
                //users.forEach(usr => {
                  if (socket.id) {
                    //console.log(user_name, " is creating peer for user ", usr.user_name, ' which has socket id ', usr.socket_id)
                    //create teacher peer
                    const peer = createPeer(teacher.socket_id, {socket_id: socket.id, user_name: user_name}, stream);
                    peersRef.current.push({
                        peerID: teacher.socket_id,
                        peerName: teacher.user_name,
                        peer,
                    })
                    peers.push({peer: peer, peerID: teacher.socket_id, peerName: teacher.user_name} );
                  }
                //})
                setPeers(peers);
                
            })

            // via server, student receives an "answer" signal (from teacher) in response to an offer made earlier by student.
            // signal the teacher peer with the "answer" signal from the payload
            // the handshaking loop is now complete.
            socket.on("receiving returned signal", (payload: {id: string, signal: SignalData}) => {
               // console.log(" RoomAudioStudent received receiving returned signal  payload signal type =", payload.signal.type)
                //console.log(" look in peersRef for the peer from whom we are receiving the signal (type= answer) from ")
                //console.log(" for the star topology, this peer represents the teacher")
                const the_peer = peersRef.current.find(p => p.peerID === payload.id);
                //console.log(" found peer with peerId = ", payload.id, ". Let's signal that peer with signal type =", payload.signal.type, " as parameter")
                //console.log(" RoomAudioStudent Call SIMPLE PEER signal function with type : ", payload.signal.type)
                //right here, payload.signal.type is 'answer'
                // finish the round trip for signaling
                the_peer?.peer?.signal(payload.signal);
            });
            return () => {
                socket.off("receiving returned signal")
                socket.off("all users")
            }
        })
        }
    }, []);

    function createPeer(userToSignal:any, caller: SocketInfo | undefined, stream: any) {
        //console.log(" in create peer....caller = ", caller, " userToSignal = ", userToSignal)
        // create teacher peer with student's stream
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

        //this event is fired AS SOON AS the teacher peer object is constructed, the signal type is "offer"
        peer.on("signal", signal => {
          //console.log(" RoomAudioStudent emit sending signal caller=", caller, " signal type =", signal.type, " userToCall=", userToSignal)
          //send 'offer' signal to teacher's browser window, via server
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
            
            //peer.removeStream(stream)
           
          });
        return peer;
    }

    useEffect(() => {
        if (socket) {
            socket.on("user_disconnected", (socket_id: string) => {
                //console.log("in Room, user disconnected socket_id = ", socket_id )
                // look in peersRef for this socket_id
                
                const disconnecting_peer = peersRef.current.find(peer => peer.peerID === socket_id)
                disconnecting_peer?.peer?.destroy()
                
                const audio_div = document.getElementById(socket_id)
                //console.log("video div", video_div)
                
                while (audio_div?.firstChild) {
                    audio_div.firstChild.remove()
                }
                

            })
            return () => {
                socket.off("user_disconnected")
            }
        }
    }, [socket])

    return (
        <div>
            <div className="bg-bgColor1 text-green-800 text-3xl flex flex-row justify-center" onClick={toggleAudio}>
                {audioEnabled ?
                    <MdMic />
                    :
                    <MdMicOff />
                }
            </div>
            <div>
                <div className="bg-bgColor1 text-textColor1">Me: {user_name}</div>
                <audio muted ref={userAudio} autoPlay />
            </div>
            {myStream &&
                                
                                <div>
                                <Visualizer audio={myStream} autoStart={true} mode='current'>
                                    {({ canvasRef }) => (
                                        <>
                                            <canvas ref={canvasRef} width={150} height={70} />

                                        </>
                                    )}
                                </Visualizer>
                                </div>
                            }
            {peers &&
                peers.map((peer, index) => {
                    if (peer) {
                        return (
                            <div key={index} id={peer.peerID.toString()}>
                                <span className="bg-bgColor3 text-textColor3 text-xl mb-2">{peer.peerName}
                                </span>
                                <Audio peer={peer.peer} />
                            
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

export default RoomAudioStudent;

/*
  {myStream &&
                                    <Visualizer audio={myStream} autoStart={true} mode='current'>
                                        {({ canvasRef }) => (
                                            <>
                                                <canvas ref={canvasRef} width={150} height={70} />

                                            </>
                                        )}
                                    </Visualizer>
                                }
*/

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