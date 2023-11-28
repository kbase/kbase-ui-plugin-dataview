define([
    'bluebird',
    'kb_lib/props',
    'kb_lib/messenger',
    './services/session',
    './services/widget',
    './services/type',
    './services/rpc'
], (Promise, props, Messenger, SessionService, WidgetService, TypeService, RPCService) => {
    class Runtime {
        constructor({authorization, token, username, config, pluginConfigDB}) {
            this.authorization = authorization;
            this.token = token;
            this.username = username;

            this.configDB = new props.Props({data: config});
            this.pluginConfigDB = pluginConfigDB;

            // TODO: fix this!
            this.pluginPath = `/modules/plugins/${  pluginConfigDB.getItem('package.name')  }/iframe_root`;
            this.pluginResourcePath = `${this.pluginPath  }/resources`;

            this.messenger = new Messenger();

            this.heartbeatTimer = null;

            this.services = {
                session: new SessionService({runtime: this}),
                widget: new WidgetService({runtime: this}),
                type: new TypeService({
                    runtime: this,
                    config: this.pluginConfigDB.getItem('install.types')
                }),
                rpc: new RPCService({runtime: this})
            };

            this.featureSwitches = {};
            this.configDB.getItem('ui.featureSwitches.available', []).forEach((featureSwitch) => {
                this.featureSwitches[featureSwitch.id] = featureSwitch;
            });
        }

        config(path, defaultValue) {
            return this.configDB.getItem(path, defaultValue);
        }

        getConfig(path, defaultValue) {
            return this.config(path, defaultValue);
        }

        service(name) {
            if (!(name in this.services)) {
                throw new Error(`The UI service "${  name  }" is not defined`);
            }
            return this.services[name];
        }

        getService(name) {
            return this.service(name);
        }

        origin() {
            return this.config('deploy.ui.origin');
        }

        // Europa URL and Link

        europaURL(hashPath) {
            const {hash, pathname, params} = hashPath;

            const url = new URL(this.configDB.getItem('deploy.ui.origin'));
            
            if (pathname) {
                url.pathname = pathname;
            }
            if (params && Object.keys(params).length > 0) {
                const searchParams = new URLSearchParams(params);
                if (hash) {
                    // Use our special notation for params on the hash
                    url.hash = url.hash + `${hash}$${searchParams}`;
                } else {
                    // Otherwise, assume we just want a standard search component
                    searchParams.forEach((value, key) => {
                        url.searchParams.set(key, value);
                    });
                }
            } else {
                if (hash) {
                    url.hash = `#${hash}`;
                }
            }
            
            return url;
        }

        europaLink(hashPath, label, options={}) {
            const url = this.europaURL(hashPath);

            const $link = $(document.createElement('a'))
                .attr('href', url.toString())
                .text(label);

            if (typeof options.newWindow === 'undefined' || options.newWindow) {
                $link.attr('target', '_blank');
            } else {
                $link.attr('target', '_top');
            }

            return $link.get(0).outerHTML;
        }

        /**
         * Dedicated to links within kbase-ui, including self-links within the catalog plugin.
         *
         * @param {*} path
         * @param {*} label
         * @param {*} options
         * @returns A jquery object wrapping an anchor link to a kbase-ui endpoint.
         */
        $kbaseUILink(hash, label, options={}) {
            const url = kbaseUIURL(hash);
            const $link = $(document.createElement('a'))
                .attr('href', url.toString())
                .attr('target', '_parent');

            if (options.icon) {
                $link.append($('<span>')
                    .addClass(`fa fa-${options.icon}`));
            }

            $link.append($('<span> </span>'));
            $link.append($('<span>').text(label));

            if (options.stopPropagation) {
                $link.on('click', (e) => {e.stopPropagation();});
            }

            return $link;
        }

        /**
         * Creates a jQuery HTML anchor link with for a kbase-ui endpoint, via the
         * Europa top level ui. The only useful such use-case is opening such a
         * link in a new window. See $kbaseUILink above for the case of opening a plugin
         * or other kbase-ui link via kbase-ui itself.
         *
         * @param {*} hash
         * @param {*} label
         * @param {*} options
         * @returns
         */
        $europaKBaseUILink(hash, label, options={}) {
            const url = europaURL({hash}, true);
            const $link = $(document.createElement('a'))
                .attr('href', url.toString())
                .attr('target', '_blank');

            if (options.icon) {
                $link.append($('<span>')
                    .addClass(`fa fa-${options.icon}`));
            }

            $link.append($('<span> </span>'));
            $link.append($('<span>').text(label));

            if (options.stopPropagation) {
                $link.on('click', (e) => {e.stopPropagation();});
            }

            return $link;
        }

        // COMM

        send(channel, message, data) {
            this.messenger.send({channel, message, data});
        }

        receive(channel, message, handler) {
            return this.messenger.receive({channel, message, handler});
        }

        recv(channel, message, handler) {
            return this.receive(channel, message, handler);
        }

        drop(subscription) {
            this.messenger.unreceive(subscription);
        }

        // FEATURE SWITCHES

        featureEnabled(id, defaultValue = false) {
            const featureSwitch = this.featureSwitches[id];
            if (!featureSwitch) {
                throw new Error(`Feature switch "${  id  }" not defined`);
            }

            const enabledFeatureSwitches = this.configDB.getItem('ui.featureSwitches.enabled');
            const enabled = enabledFeatureSwitches.includes(id);
            return enabled || defaultValue;
        }

        // LIFECYCLE

        start() {
            return Promise.try(() => {
                this.heartbeatTimer = window.setInterval(() => {
                    this.send('app', 'heartbeat', {time: new Date().getTime()});
                }, 1000);
                return this.services.session.start();
            });
        }

        stop() {
            return Promise.try(() => {
                window.clearInterval(this.heartbeatTimer);

                return this.services.session.stop();
            });
        }
    }

    return Runtime;
});
