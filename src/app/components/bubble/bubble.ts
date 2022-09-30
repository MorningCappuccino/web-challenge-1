import { getEl } from '../../app';
import { BubbleMoveLeftParams, BubbleMoveParams } from '../../types';
import { convertStringToHTML } from '../../utils/view';
import { BUBBLE_MOVE_EVENT, BUBBLE_MOVE_LEFT_EVENT, BUBBLE_RENDERED_EVENT } from '../../variables';
import './bubble.scss';

export class Bubble {
    constructor(posPercentX: number, posPercentY: number, container: Element | null, bgCSS: string) {
        this.posPercentX = posPercentX;
        this.posPercentY = posPercentY;
        this.container = container;
        this.bgCSS = bgCSS;
    }

    private posPercentX;
    private posPercentY;
    private posX: number = 0;
    private posY: number = 0;
    private container;
    private size: number = 50;
    private bubble?: HTMLElement;
    private id?: number;
    private bgCSS?: string;

    public static scrollContainer = document.querySelector('#wrapper') as HTMLElement;

    initialize() {
        this.size = this.getRandomSize();
        this.convertPercentageToPx();

        this.container?.addEventListener(BUBBLE_MOVE_EVENT, (e: CustomEventInit<BubbleMoveParams>) => {
            if (e.detail == undefined) {
                throw new Error('No BubbleMove param detais');
            }

            const { x, y } = e.detail;

            this.moveBubble(x, y);
        });

        this.container?.addEventListener(BUBBLE_RENDERED_EVENT, () => {
            this.bubble = this.getLinkToBubbleElement();
        });

        Bubble.scrollContainer.addEventListener(
            BUBBLE_MOVE_LEFT_EVENT,
            (event: CustomEventInit<BubbleMoveLeftParams>) => {
                if (!this.bubble) {
                    return;
                }

                const leftOffset = event.detail!.deltaY;

                this.posX -= leftOffset;

                this.bubble.style.left = `${this.posX}px`;
            }
        );
    }

    getLinkToBubbleElement(): HTMLElement {
        // console.log(this.id);
        console.log(getEl(`.bubble-${this.id}`));
        return getEl(`.bubble-${this.id}`)!;
    }

    render(): HTMLElement {
        this.id = Math.round(Math.random() * 1000);

        const html = `<div
            class="bubble bubble-${this.id} ${this.bgCSS}"
            style="top: ${this.posY}px;
            left: ${this.posX}px;
            width: ${this.size}px;
            height: ${this.size}px;
            ">
        </div>`;

        return convertStringToHTML(html);
    }

    getRandomSize(): number {
        return 100;
    }

    convertPercentageToPx(): void {
        if (!this.container) {
            throw Error('No container for Bubbles');
        }

        // console.log(this.container.clientWidth);
        // console.log(this.container.clientWidth * (this.posPercentX / 100));
        // console.log(this.container.clientWidth * (this.posPercentX / 100) - this.size / 2);

        this.posX = this.container.clientWidth * (this.posPercentX / 100) - this.size / 2;
        this.posY = this.container.clientHeight * (this.posPercentY / 100) - this.size / 2;
    }

    moveBubble(mouseX: number, mouseY: number) {
        if (!this.bubble) {
            return;
        }
        //1 * 100-150%
        const moveOffset = 1 + Math.round(Math.random() * 50) / 100;

        let xVector = mouseX - this.posX;
        let yVector = mouseY - this.posY;

        this.posX = xVector > 0 ? (this.posX += moveOffset) : (this.posX -= moveOffset);
        this.posY = yVector > 0 ? (this.posY += moveOffset) : (this.posY -= moveOffset);

        this.bubble.style.left = `${this.posX}px`;
        this.bubble.style.top = `${this.posY}px`;
    }
}
