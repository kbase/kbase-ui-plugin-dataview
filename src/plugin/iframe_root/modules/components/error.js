define([
    'preact'
], function (preact) {
    'use strict';

    const {h, Component} = preact;

    class ErrorComponent extends Component {
        constructor(props) {
            super(props);
            this.message = null;
        }

        componentDidMount() {
            this.setTitle();
        }

        setTitle() {
            switch (this.props.error.code) {
            case 'private-object-no-authorization':
                this.props.runtime.send('ui', 'setTitle', 'Error : Access Denied - No Authorization');
                break;
            case 'private-object-inadequate-authorization':
                this.props.runtime.send('ui', 'setTitle', 'Error : Access Denied - Inadequate Authorization');
                break;
            default:
                this.props.runtime.send('ui', 'setTitle', 'Error');
            }
        }

        renderDescription(error) {
            switch (error.code) {
            case 'private-object-no-authorization':
                return h('div', null,
                    h('p', null, [
                        'This object is located in a private Narrative. ',
                        'This means that you may only access it if you are logged in and have access to the Narrative.'
                    ]),
                    h('p', null, [
                        'In order to access this object you must first log in.'
                    ]));
            case 'private-object-inadequate-authorization':
                return h('div', null,
                    h('p', null, [
                        'This object is located in a private Narrative. ',
                        'This means that you may only access it if you are logged in and have access to the Narrative.'
                    ]),
                    h('p', null, [
                        'You are logged in but do not have access to the Narrative this object is located in.'
                    ])
                );
            default:
                // The original error should be included as data.originalError
                if (error.data.originalError) {
                    return h('div', null, h('p', null, [
                        'The original error message is: ',
                        error.data.originalError.message
                    ]));
                } else {
                    return h('div', null, h('p', null, 'No additional information available'));
                }
            }
        }

        renderFooter(error) {
            switch (error.code) {
            case 'private-object-no-authorization':
                var url = new URL('', window.location.origin);
                url.hash = 'login';
                var hash = window.parent.location.hash.substr(1);
                var nextRequest = {
                    original: hash,
                    path: hash.split('/')
                };
                url.searchParams.set('nextrequest', JSON.stringify(nextRequest));

                return h('div', null, [
                    h('div', null, [
                        h('a', {
                            href: url.toString(),
                            target: '_parent'
                        }, 'Log in and try again')
                    ]),
                    h('div', null, [
                        h('a', {
                            href: 'https://kbase.us/contact-us',
                            target: '_blank'
                        }, 'KBase Help')
                    ])
                ]);
            case 'private-object-inadequate-authorization':
                return h('div', null, [
                    h('div', null, [
                        h('a', {
                            href: '/narrative/' + error.data.workspaceID,
                            target: '_blank'
                        }, 'Visit the narrative and request access')
                    ]),
                    h('div', null, [
                        h('a', {
                            href: 'https://kbase.us/contact-us',
                            target: '_blank'
                        }, 'KBase Help')
                    ])
                ]);
            default:
                return h('div', null, [
                    h('div', null, [
                        h('a', {
                            href: 'https://kbase.us/contact-us',
                            target: '_blank'
                        }, 'KBase Help')
                    ])
                ]);
            }
        }

        renderError(error) {
            return h('div', {
                className: 'panel panel-danger'
            }, [
                h('div', {
                    className: 'panel-heading',
                    style: {
                        fontWeight: 'bold'
                    }
                }, 'Error'),
                h('div', {
                    className: 'panel-body'
                },  [
                    h('p', null, error.message),

                    h('p', {
                        style: {
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: 'rgba(150, 150, 150)'
                        }
                    }, 'code: ', error.code),
                    h('p', {
                        style: {
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: 'rgba(150, 150, 150)'
                        }
                    }, 'plugin: ', 'dataview'),
                    h('hr'),
                    this.renderDescription(error)
                ]),
                h('div', {
                    className: 'panel-footer'
                }, [
                    h('div', {
                        style: {
                            fontWeight: 'bold', color: 'rgba(150, 150, 150)'
                        }
                    }, 'Resolutions'),
                    this.renderFooter(error)
                ])
            ]);
        }

        render() {
            return this.renderError(this.props.error);
        }
    }

    return ErrorComponent;
});
