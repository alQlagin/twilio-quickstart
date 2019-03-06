import { createObserver } from './helpers';
import { Renderer } from './renderer';
import { App } from './app';
import { init } from './init';

const app = new App(createObserver());
const renderer = new Renderer(createObserver());

window.addEventListener('load', () => init(
    app,
    renderer,
    {
        audio: false,
        video: false
    }
));
