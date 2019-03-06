import { attachParticipantTracks, attachTracks, detachParticipantTracks, detachTracks, log, Observer } from './helpers';

export class Renderer {
    constructor(public readonly observer: Observer) {
    }

    get remotesContainer() {
        return document.getElementById('remote-media');
    }

    get previewContainer() {
        return document.getElementById('local-media');
    }

    init(payload) {
        try {
            document.getElementById('connecting').style.display = 'none';
            document.getElementById('controls').classList.add('visible');
            document.getElementById('room-controls').style.display = 'block';

            // Bind button to join Room.
            document.getElementById('button-join').onclick = async () => {
                const {value} = document.getElementById('room-name') as HTMLInputElement;
                this.observer.next({
                    event: 'join',
                    payload: {
                        roomName: value,
                        payload
                    }
                });
            };

            // Bind button to leave Room.
            document.getElementById('button-leave').onclick = () => {
                this.observer.next({event: 'leave'})
            }
        } catch (e) {
            // TODO handle errors
        }
    }

    joined(room) {
        // this.hidePreview();
        try {
            document.getElementById('room-controls').style.display = 'none';
            document.getElementById('button-leave').style.display = 'block';
        } catch (e) {
            // TODO handle errors
        }

        // Attach LocalParticipant's Tracks, if not already attached.
        var previewContainer = this.previewContainer;
        if (previewContainer && !previewContainer.querySelector('video')) {
            attachParticipantTracks(room.localParticipant, previewContainer);
        }

        // Attach the Tracks of the Room's Participants.
        room.participants.forEach((participant) => {
            log("Already in Room: '" + participant.identity + "'");
            attachParticipantTracks(participant, this.remotesContainer);
        });
    }

    left() {
        try {
            this.showPreview();
            document.getElementById('room-controls').style.display = 'block';
            document.getElementById('button-leave').style.display = 'none';
        } catch (e) {
            // TODO handle error
        }
    }

    trackAdded(track) {
        attachTracks([track], this.remotesContainer);
    }

    trackRemoved(track) {
        detachTracks([track]);
    }

    participantDisconnected(participant) {
        detachParticipantTracks(participant);
    }

    disconnected(room) {
        room.participants.forEach(detachParticipantTracks);
        document.getElementById('button-join').style.display = 'inline';
        document.getElementById('button-leave').style.display = 'none';
    }

    private hidePreview() {
        document.getElementById('preview').style.display = 'none';
    }

    private showPreview() {
        document.getElementById('preview').style.display = 'block';
    }
}



