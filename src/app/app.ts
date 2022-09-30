// import { getEl } from "./utils/view";
import './app.scss';
import { AppBackgroundTransition } from './components/appBackgroundTransition/appBackgroundTransition';
import { Bubble } from './components/bubble/bubble';
import { BubbleMoveParams } from './types';
import {
    BUBBLE_GRADIENT_1,
    BUBBLE_GRADIENT_2,
    BUBBLE_MOVE_EVENT,
    BUBBLE_RENDERED_EVENT,
    SCREEN_ONE_ID,
    SCREEN_TWO_ID,
} from './variables';

export const getEl = (selector: string): HTMLElement | null => {
    return document.querySelector(selector);
};

export class App {
    private bubbleContainer: Element | null = null;
    private bubbleContainer2: Element | null = null;

    public initialize() {
        // getEl('body')!.innerHTML = `<div>hello world</div>`;

        this.initBubbles();
        this.initMouseMoveEvent();

        AppBackgroundTransition.initialize();
    }

    initBubbles() {
        this.bubbleContainer = getEl(SCREEN_ONE_ID);

        const bubble1 = new Bubble(30, 30, this.bubbleContainer, BUBBLE_GRADIENT_1);
        bubble1.initialize();
        this.bubbleContainer!.append(bubble1.render());

        const bubble2 = new Bubble(50, 50, this.bubbleContainer, BUBBLE_GRADIENT_1);
        bubble2.initialize();
        this.bubbleContainer!.append(bubble2.render());

        this.bubbleContainer?.dispatchEvent(new CustomEvent(BUBBLE_RENDERED_EVENT));

        /*
            Bubbles screen#2
        */
        this.bubbleContainer2 = getEl(SCREEN_TWO_ID);

        const bubble2_1 = new Bubble(30, 30, this.bubbleContainer2, BUBBLE_GRADIENT_2);
        bubble2_1.initialize();
        this.bubbleContainer2!.append(bubble2_1.render());

        const bubble2_2 = new Bubble(50, 50, this.bubbleContainer2, BUBBLE_GRADIENT_2);
        bubble2_2.initialize();
        this.bubbleContainer2!.append(bubble2_2.render());

        this.bubbleContainer2?.dispatchEvent(new CustomEvent(BUBBLE_RENDERED_EVENT));
    }

    initMouseMoveEvent() {
        getEl('body')?.addEventListener('mousemove', (event: MouseEvent) => {
            this.bubbleContainer?.dispatchEvent(
                new CustomEvent(BUBBLE_MOVE_EVENT, {
                    detail: { name: 'bubbleMove', x: event.offsetX, y: event.offsetY } as BubbleMoveParams,
                })
            );

            this.bubbleContainer2?.dispatchEvent(
                new CustomEvent(BUBBLE_MOVE_EVENT, {
                    detail: { name: 'bubbleMove', x: event.offsetX, y: event.offsetY } as BubbleMoveParams,
                })
            );
        });
    }
}
