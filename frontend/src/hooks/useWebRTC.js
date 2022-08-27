import { useEffect, useState, useRef, useCallback } from 'react';
import { ACTIONS } from '../actions';

import socketInit from '../socket';
import freeice from 'freeice';
import { useStateWithCallback } from './useStateWithCallback';
import { Connection } from 'mongoose';
   
export const useWebRTC = (roomId, user) => {
   
    const [clients, setClients] = useStateWithCallback([]);
 
    const audioElements = useRef({});
    const connections = useRef({});
    const socket = useRef(null);
    const localMediaStream = useRef(null);
    const clientsRef = useRef(null);

    useEffect(() => {
        socket.current= socketInit();
    }, []);
    



     useEffect(() => {
        const startCapture= async()=>{
            localMediaStream.current=
             await navigator.mediaDevices.getUserMedia({
                audio:true
            })
        };
        startCapture().then(()=>{
            addNewClient({ ...user, muted: true },()=>{
                const localElement= audioElements.current[user.id];
                if (localElement){
                    localElement.volume=0;
                    localElement.srcObject=localMediaStream.current;
                }
                socket.current.emit(ACTIONS.JOIN,{roomId, user})
            });
        });
        return ()=>{
            
            // localMediaStream.current
            // .getTracks()
            // .forEach((track) => track.stop());
        socket.current.emit(ACTIONS.LEAVE, { roomId });

        };
    }, []);



    // const clientsRef = useRef(null);

    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id
            );

            if (lookingFor === undefined) {
                setClients(
                    (existingClients) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );



    useEffect(() => {


   
    const handleNewPeer=    
            async ({
                peerId,
                createOffer,
                user: remoteUser,
            }) =>{
                if (peerId in connections.current) {
                    return console.warn(
                        `You are already connected with ${peerId} (${user.name})`
                    );
                }

    //             // Store it to connections
                connections.current[peerId] = new RTCPeerConnection({
                    iceServers: freeice(),
                });
// 
    //             // Handle new ice candidate on this peer connection
                connections.current[peerId].onicecandidate = (event) => {
                    socket.current.emit(ACTIONS.RELAY_ICE, {
                        peerId,
                        icecandidate: event.candidate,
                    });
                };

    //             // Handle on track event on this connection
                connections.current[peerId].ontrack = ({
                    streams: [remoteStream],
                }) => {
                    addNewClient({ ...remoteUser, muted: true }, () => {
                  
       
                        if (audioElements.current[remoteUser.id]) {
                            audioElements.current[remoteUser.id].srcObject =
                                remoteStream;
                        } 
                    else {
                            let settled = false;
                            const interval = setInterval(() => {
                                if (audioElements.current[remoteUser.id]) {
                                    audioElements.current[
                                        remoteUser.id
                                    ].srcObject = remoteStream;
                                    settled = true;
                                }

                                if (settled) {
                                    clearInterval(interval);
                                }
                            }, 1000);
                        }
                    });
                };

    //             // Add connection to peer connections track
                localMediaStream.current.getTracks().forEach((track) => {
                    connections.current[peerId].addTrack(
                        track,
                        localMediaStream.current
                    );
                });

    //             // Create an offer if required
                if (createOffer) {
                    const offer = await connections.current[
                        peerId
                    ].createOffer();

                    // // Set as local description
                    await connections.current[peerId].setLocalDescription(
                        offer
                    );

                    // send offer to the server
                    socket.current.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription: offer,
                    });
                }
            };
            socket.current.on(ACTIONS.ADD_PEER,handleNewPeer);
    
        return () => {
   
            socket.current.off(ACTIONS.ADD_PEER);

        };

    }, []);

    useEffect(()=>{

        socket.current.on(ACTIONS.ICE_CANDIDATE,({peerId, icecandidate})=>{
            if(icecandidate){
                //_______________________________________________________________XXXXXXXXXXX__________________________________________
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        });
        return ()=>{
            socket.current.off(ACTIONS.ICE_CANDIDATE)
        };
    },[])
    useEffect(()=>{

        const handleRemoteSdp= async({
            peerId,
             sessionDescription:remoteSessionDescription
            })=>{
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            );

            if(remoteSessionDescription.type==='offer'){
                const connection = connections.current[peerId];
                const answer= await connection.createAnswer();

                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP,{
                    peerId,
                    sessionDescription: answer,
                })
            }

        };
        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp)
        return ()=>{
            socket.current.off(ACTIONS.SESSION_DESCRIPTION)
        };
    },[])

    ///handel remove peer
    useEffect(() => {
        const handelRemovePeer= async({peerId,userId})=>{

            if(connections.current[peerId]){
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((list)=>list.filter(client=>client.id !==userId))
        };
        socket.current.on(ACTIONS.REMOVE_PEER,handelRemovePeer );
        return ()=>{
            socket.current.off(ACTIONS.REMOVE_PEER)
        };
    }, []);


    useEffect(()=>{

        clientsRef.current= clients;
    },[clients]);


     /////listen for mut/ unmute

     useEffect(()=>{

        socket.current.on(ACTIONS.MUTE, ({peerId, userId})=>{
            setMute(true, userId)
        })
        socket.current.on(ACTIONS.UNMUTE, ({peerId, userId})=>{
            setMute(false, userId)
        })
        const setMute=(mute,userId)=>{

            const clientIdx= clientsRef.current.map(client=>client.id).indexOf(userId);
            const connectedClients =JSON.parse(JSON.stringify(clientsRef.current));
            if(clientIdx>-1){
                connectedClients[clientIdx].muted=mute;
                setClients(connectedClients);
            }
        }
    },[clients]);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };
    const handleMute = (isMute, userId) => {
        let settled = false;

        if (userId === user.id) {
            let interval = setInterval(() => {
                if (localMediaStream.current) {
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if (isMute) {
                        socket.current.emit(ACTIONS.MUTE, {
                            roomId,
                            userId: user.id,
                        });
                    } else {
                        socket.current.emit(ACTIONS.UNMUTE, {
                            roomId,
                            userId: user.id,
                        });
                    }
                    settled = true;
                }
                if (settled) {
                    clearInterval(interval);
                }
            }, 200);
        }
    };
//     const uniqueclients = Array.from(new Set(clients)); // Unique Array ['a', 'b'];

//    console.log(uniqueclients);
    return {
        clients,
        provideRef,
        handleMute
    };
};
