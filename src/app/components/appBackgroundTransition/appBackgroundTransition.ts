import { BubbleMoveLeftParams, Rgb } from '../../types';
import { BUBBLE_MOVE_LEFT_EVENT } from '../../variables';

export class AppBackgroundTransition {
    public static colorSections: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll('[data-color]'));
    public static backgroundColorArray: BackgroundColorController[] = [];
    public static backgroundMask = document.querySelector('body');
    public static scrollContainer = document.querySelector('#wrapper') as HTMLElement;

    public static initialize() {
        this.initColorControllers();
        this.initHorizontalScroll();
    }

    private static initColorControllers() {
        AppBackgroundTransition.colorSections.forEach(function (elem, index) {
            if (index > 0) {
                var colorStart: Rgb = getSectionColorCode(AppBackgroundTransition.colorSections[index - 1]);
                var colorEnd: Rgb = getSectionColorCode(AppBackgroundTransition.colorSections[index]);
                AppBackgroundTransition.backgroundColorArray.push(
                    new BackgroundColorController(elem, index, colorStart, colorEnd)
                );
            }
        }, this);
    }

    private static initHorizontalScroll() {
        this.scrollContainer.addEventListener('wheel', (event) => {
            event.preventDefault();
            this.scrollContainer!.scrollLeft += event.deltaY;

            AppBackgroundTransition.backgroundColorArray.forEach(function (elem, index) {
                elem.run();
            }, this);

            this.scrollContainer.dispatchEvent(
                new CustomEvent(BUBBLE_MOVE_LEFT_EVENT, {
                    detail: {
                        deltaY: event.deltaY,
                    },
                })
            );
        });
    }
}

class BackgroundColorController {
    constructor(elem: HTMLElement, index: number, colorStart: Rgb, colorEnd: Rgb) {
        this.elem = elem;
        this.index = index;
        this.colorStart = colorStart;
        this.colorEnd = colorEnd;

        this.colorDiff = {
            r: this.colorStart.r - this.colorEnd.r,
            g: this.colorStart.g - this.colorEnd.g,
            b: this.colorStart.b - this.colorEnd.b,
        };

        this.transitionRange = AppBackgroundTransition.colorSections[this.index - 1].clientHeight;

        this.colorTransition = {
            r: this.colorDiff.r === 0 ? 0 : Math.floor(this.transitionRange / this.colorDiff.r),
            g: this.colorDiff.g === 0 ? 0 : Math.floor(this.transitionRange / this.colorDiff.g),
            b: this.colorDiff.b === 0 ? 0 : Math.floor(this.transitionRange / this.colorDiff.b),
        };
    }

    elem: HTMLElement;
    index: number;
    colorStart: Rgb;
    colorEnd: Rgb;
    colorDiff: Rgb;
    colorTransition: Rgb;
    transitionRange: number;

    run() {
        console.log('run');
        var boundingRectY = this.elem.getBoundingClientRect().left;

        if (boundingRectY < this.transitionRange && boundingRectY > 0) {
            var changeForR =
                    this.colorTransition.r === 0
                        ? 0
                        : Math.floor((this.transitionRange - boundingRectY) / this.colorTransition.r),
                changeForG =
                    this.colorTransition.g === 0
                        ? 0
                        : Math.floor((this.transitionRange - boundingRectY) / this.colorTransition.g),
                changeForB =
                    this.colorTransition.b === 0
                        ? 0
                        : Math.floor((this.transitionRange - boundingRectY) / this.colorTransition.b);

            var r = this.colorStart.r - changeForR,
                g = this.colorStart.g - changeForG,
                b = this.colorStart.b - changeForB;

            var colorChangeString = 'rgb(' + r + ', ' + g + ', ' + b + ')';

            AppBackgroundTransition.backgroundMask!.style.backgroundColor = colorChangeString;
        }
    }
}

function getSectionColorCode(sectionElem: HTMLElement): Rgb {
    try {
        var colorString = sectionElem.getAttribute('data-color');

        var colorStringArray: string[] | undefined = colorString?.split(',');
        var colorNums: number[] = [];

        colorStringArray?.forEach(function (elem) {
            colorNums.push(parseInt(elem));
        });

        return { r: colorNums[0], g: colorNums[1], b: colorNums[2] };
    } catch (err) {
        throw Error('No data-color attribute', {
            cause: err,
        });
    }
}
