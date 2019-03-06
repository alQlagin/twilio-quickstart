// Attach the Tracks to the DOM.
export function attachTracks(tracks, container) {
    tracks.forEach(function (track) {
        const el = track.attach();
        el.autoplay = true;
        container.appendChild(el);
        el.play();
    });
}

// Attach the Participant's Tracks to the DOM.
export function attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
export function detachTracks(tracks) {
    tracks.forEach(function (track) {
        track.detach().forEach(function (detachedElement) {
            detachedElement.remove();
        });
    });
}


// Detach the Participant's Tracks from the DOM.
export function detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    detachTracks(tracks);
}

export interface Observer<T extends any> {
    add(watcher: (value: T) => void): void;

    next(value: T): void;
}

export function createObserver<T>(): Observer<T> {
    const watchers = [];
    return {
        add(watcher) {
            watchers.push(watcher)
        },
        next(value) {
            watchers.forEach(watcher => watcher(value))
        }
    }
}

// Activity log.
export function log(message) {
    var logDiv = document.getElementById('log');
    logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    logDiv.scrollTop = logDiv.scrollHeight;
}
