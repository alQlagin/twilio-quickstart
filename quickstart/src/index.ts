import * as Video from 'twilio-video';
import { attachTracks, createObserver, log } from './helpers';
import { Renderer } from './renderer';
import { App } from './app';
import { createObserver } from './helpers';
import { Renderer } from './renderer';
import { App } from './app';
import { init } from './init';

const app = new App(createObserver());
const renderer = new Renderer(createObserver());
let previewTracks;

window.addEventListener('load', () => init(
    app,
    renderer,
    {
        autojoin: 'ismail',
        audio: false
    }
));


// Preview LocalParticipant's Tracks.
document.getElementById('button-preview').onclick = function () {
    var localTracksPromise = previewTracks
        ? Promise.resolve(previewTracks)
        : Video.createLocalTracks();

    localTracksPromise.then(function (tracks) {
        (window as any).previewTracks = previewTracks = tracks;
        var previewContainer = document.getElementById('local-media');
        if (!previewContainer.querySelector('video')) {
            attachTracks(tracks, previewContainer);
        }
    }, function (error) {
        console.error('Unable to access local media', error);
        log('Unable to access Camera and Microphone');
    });
};
