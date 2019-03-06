import axios from 'axios';
import { detachParticipantTracks, log, Observer } from './helpers';
import { connect, ConnectOptions, Room } from 'twilio-video';

export class App {
    private identity;
    private token;
    private room: Room;

    constructor(public readonly observer: Observer) {
    }

    async init() {
        const {data} = await axios.get('/token');
        this.identity = data.identity;
        this.token = data.token;
        this.observer.next({
            event: 'init',
            payload: data.token
        })
    }

    async join(roomName, {video = true, audio = true}: { video?: boolean, audio?: boolean } = {}) {
        if (!this.token) {
            alert('Not identified');
            return;
        }
        if (!roomName) {
            alert('Please enter a room name.');
            return;
        }

        log("Joining room '" + roomName + "'...");
        const connectOptions: ConnectOptions = {
            name: roomName,
            logLevel: 'debug',
            video, audio
        };

        // Join the Room with the token from the server and the
        // LocalParticipant's Tracks.
        try {
            const room = this.room = await connect(this.token, connectOptions);

            log("Joined as '" + room.localParticipant.identity + "'");

            this.observer.next({
                event: 'joined',
                payload: room
            });
            this.roomJoined();
        } catch (error) {
            log('Could not connect to Twilio: ' + error.message);
        }
    }


    // Leave Room.
    leaveRoom() {
        if (this.room) {
            log('Leaving room...');
            this.room.disconnect();
            this.observer.next({event: 'left'})
        }
    }

    private roomJoined() {
        const {room} = this;
        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function (participant) {
            log("Joining: '" + participant.identity + "'");
        });

        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackAdded', (track, participant) => {
            log(participant.identity + " added track: " + track.kind);
            this.observer.next({event: 'trackAdded', payload: track});
        });

        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackRemoved', (track, participant) => {
            log(participant.identity + " removed track: " + track.kind);
            this.observer.next({event: 'trackRemoved', payload: track});
        });

        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', (participant) => {
            log("Participant '" + participant.identity + "' left the room");
            this.observer.next({event: 'participantDisconnected', payload: participant});
        });

        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', () => {
            log('Left');
            detachParticipantTracks(room.localParticipant);
            this.observer.next({event: 'disconnected', payload: this.room});
            this.room = null;
        });
    }
}
