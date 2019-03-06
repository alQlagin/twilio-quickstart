import { App } from './app';
import { Renderer } from './renderer';

export async function init(
    app: App,
    renderer: Renderer,
    joinOptions: { video?: boolean, audio?: boolean, autoJoin?: string } = {}
) {
    app.observer.add(({event, payload}) => {
        switch (event) {
            case 'init':
                return renderer.init(payload);
            case 'joined':
                return renderer.joined(payload);
            case 'left':
                return renderer.left();
            case 'trackAdded':
                return renderer.trackAdded(payload);
            case 'trackRemoved':
                return renderer.trackRemoved(payload);
            case 'participantDisconnected':
                return renderer.participantDisconnected(payload);
            case 'disconnected':
                return renderer.disconnected(payload);
        }
    });
    renderer.observer.add(({event, payload}) => {
        switch (event) {
            case 'join':
                return app.join(payload.roomName, joinOptions);
            case 'leave':
                return app.leaveRoom();
        }
    });
    await app.init();
    if (joinOptions.autoJoin)
        await app.join(joinOptions.autoJoin, joinOptions);

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener('beforeunload', () => app.leaveRoom());
}

