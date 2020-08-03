define([], function () {
    'use strict';

    function outerDimensions(el) {
        el.offsetHeight;
        const rect = el.getBoundingClientRect();
        const width = Math.ceil(rect.right - rect.left);
        const height = Math.ceil(rect.bottom - rect.top);
        return {
            width, height
        };
    }

    class ResizeObserver {
        constructor(callback) {
            if (window.ResizeObserver) {
                this.observer = new window.ResizeObserver(callback);
            } else {
                this.observer = new FakeResizeObserver(callback);
            }
        }

        observe(element) {
            this.observer.observe(element);
        }

        unobserve(element) {
            this.observer.unobserve(element);
        }
    }

    class FakeResizeObserver {
        constructor(callback) {
            this.callback = callback;
            this.interval = 100; // ms
            this.lastWidth;
            this.lastHeight;
        }

        observe(element) {
            this.observedElement = element;
            this.intervalTimer = window.setInterval(() => {
                const {width, height} = outerDimensions(element);
                if (this.lastWidth !== width || this.lastHeight !== height) {
                    try {
                        this.callback();
                    } catch (ex) {
                        console.error('Error in callback, stopping observation.');
                        this.unobserve();
                    }
                }
            }, this.interval);
        }

        unobserve() {
            if (this.intervalTimer) {
                window.clearTimeout(this.intervalTimer);
            }
            this.observedElement = null;
        }
    }

    return ResizeObserver;
});