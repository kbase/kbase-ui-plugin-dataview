define([
    'uuid'
], function (
    Uuid
) {
    'use strict';

    class LocalPost {
        constructor(arg) {
            if (arg.partner.location.origin !== window.location.origin) {
                throw new Error('LocalPost may only be used to communicate on the same host (origin).')
            }
            this.partnerWindow = arg.partner;
            this.channel = arg.channel || new Uuid(4).format();

            this.origin = window.location.origin;

            this.listener = null;
            this.listeners = {};
        }

        processMessage(message) {
            if (!message.id) {
                console.warn('not a valid message', message);
                return;
            }
            let listeners = this.listeners[message.id];
            if (!listeners) {
                return;
            }
            listeners.forEach((listener) => {
                try {
                    listener.callback(message.payload);
                } catch (ex) {
                    console.error('error processing messagse', ex);
                }
            });
        }

        startListenLoop() {
            this.listener = window.addEventListener('message', (message) => {                
                if (message.origin !== this.origin) {
                    console.warn('not for us', message);
                    return;
                }
                if (message.data.channel !== this.channel) {
                    console.warn('not our channel', this.channel, message);
                }

                this.processMessage(message.data);                
            });
        }

        stopListenLoop() {
            window.removeEventListener('message', this.listener);
        }

        start() {
            this.startListenLoop();
        }

        stop() {
            this.stopListenLoop();
        }

        on(eventId, callback) {
            if (!this.listeners[eventId]) {
                this.listeners[eventId] = [];
            }
            this.listeners[eventId].push({
                callback: callback
            });        
        }

        send(eventId, payload) {
            let message = {
                id: eventId,
                channel: this.channel,
                payload: payload
            };
            this.partnerWindow.postMessage(message, this.origin);
        }
    }

    return {LocalPost};
});