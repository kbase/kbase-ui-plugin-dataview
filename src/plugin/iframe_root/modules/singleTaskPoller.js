define([], function () {
    'use strict';
    function Poller() {
        var running = false;
        var task;
        var currentPoll = {
            id: null,
            timer: null,
            cancelled: false
        };
        var lastId = 0;

        function nextId() {
            lastId += 1;
            return lastId;
        }

        function start(theTask) {
            task = theTask;
            task.lastRun = null;
            running = true;
            if (task.runInitially) {
                if (task.doContinue) {
                    if (!task.doContinue()) {
                        stop();
                        return;
                    }
                }
                runTask().then(function () {
                    poll();
                });
            } else {
                poll();
            }
        }

        function stop() {
            running = false;
        }

        function timestamp() {
            return new Date().toLocaleString();
        }

        function runTask() {
            var start = new Date().getTime();
            return task.task().catch(function (err) {
                console.error(timestamp() + ': Error while running task', err);
            });
        }

        function poll() {
            // If we aren't polling at all, ignore.
            if (!running) {
                return;
            }

            // If called when a poll is already waiting, just ignore.
            // The proper way is to cancel the original one.
            if (currentPoll.timer) {
                return;
            }

            // This is the global current poll. It can be touched during cancellation
            // to signal to the timer which has captured it to halt.
            currentPoll = {
                timer: null,
                id: nextId(),
                cancelled: false
            };

            currentPoll.timer = window.setTimeout(function () {
                // Store a private reference so new pollers don't interfere if they are
                // created while we are still running.
                var thisPoll = currentPoll;
                if (thisPoll.cancelled) {
                    // don't do it!
                    console.warn('poll cancelled! ' + thisPoll.id);
                }
                if (task.doContinue) {
                    if (!task.doContinue()) {
                        stop();
                        return;
                    }
                }
                runTask().finally(function () {
                    thisPoll.timer = null;
                    poll();
                });
            }, task.interval);
        }

        function cancelCurrentPoll() {
            if (currentPoll.timer) {
                window.clearTimeout(currentPoll.timer);
                currentPoll.timer = null;
                currentPoll.cancelled = true;
            }
        }

        function force() {
            if (!running) {
                running = true;
            } else {
                cancelCurrentPoll();
            }
            runTask().then(function () {
                poll();
            });
        }

        function restart() {
            if (!running) {
                running = true;
            } else {
                cancelCurrentPoll();
            }
            poll();
        }

        function update(config) {
            if (config.interval) {
                if (config.interval !== task.interval) {
                    task.interval = config.interval;
                    restart();
                }
            }
        }

        return {
            start: start,
            stop: stop,
            force: force,
            update: update
        };
    }
    return Poller;
});
