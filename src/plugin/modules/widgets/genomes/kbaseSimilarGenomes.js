/*
NOTE: we don't use the jslint hints at the top of module files any more; most of us
are using eslint, supported by an eslint configuration file in the project.
This project, for instance, has a .eslintrc.yml file at the top level. I use
Visual Studio Code these days, which provides great support for it. If you need to use
a different editor/IDE feel free to add a parallel eslintrc file if it cannot
use this one.
*/
define([
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',

    // for effect
    /*
     NOTE: bootstrap is surely loaded by this point, but expressing even css
     dependencies ensures their availability, e.g., if we ever have
     "integration unit tests"...
     NOTE: that since there is nothing to do with the bootstrap module, we
     don't receive the module value in the function arguments.
    */
    'bootstrap'
],
/*
 NOTE: the module "receiver" arguments are listed vertically, to match the
 module strings above; this is purely for symmetry and ease of matching them up.
 A fairly common mistake when there are many modules is that the two lists don't
 match up.
*/
function (
    html,
    DynamicServiceClient
) {
    'use strict';

    /*
    NOTE: html "tags" as provided by the html module's tag method may be defined
    at the top of the module. This has a few benefits:
    - available throughout the module
    - lets you keep track of the markup complexity and usage
    - editors and IDEs code analysis (e.g. linting and friends) play very well with this;
      when you use them for markup, undefined "tags" are easily spotted because they are
      undefined identifiers.

    Also note that the html module caches the tag functions, so each invocation of t('tag')
    after the first will just pull the function out of the cache (a simple object.)
    */
    const t = html.tag,
        div = t('div'),
        p = t('p'),
        table = t('table'),
        thead = t('thead'),
        tr = t('tr'),
        th = t('th'),
        tbody = t('tbody'),
        td = t('td');

    /*
    NOTE: We added ES6 support a few months ago, so this is the preferred way to construct a
    "classic" widget (the ones with attach, start, stop, detach methods).
    Note that in the config.yml plug config file the widget type is "es6".
    */
    class Widget {
        /*
        NOTE: usage of object destructuring for arguments. Not necessary, but helps clarify
        the interface to this widget (although constructors args are always the same for these
        type of widgets.)
        */
        constructor({runtime}) {
            /*
            NOTE: the "runtime" object is created by kbase-ui for interaction with the global
            ui environment and ui services. Although initially it was specified as a module named
            "Runtime", with global state maintained in the module itself, I was not comfortable
            with this approach because I wasn't sure of the commitment of the module loader
            to maintain the module in memory. So, it is threaded through from the top level of
            kbase-ui to whatever needs it.
            */
            this.runtime = runtime;

            /*
            NOTE: These can be anything you like, but these are the names I prefer.
            To keep things clean, all we ever do with the node provided for the widget is
            attach another node to it, and then remove that node when the widget is being removed.
            Of course, we don't really need to "declare" them in the constructor, but it is
            a nice thing to do.
            */
            this.hostNode = null;
            this.container = null;
        }

        dataLayout({distances}) {
            /*
            NOTE: Here we create markup using the "tag" functions created at the module level.
            I've found this makes for very clean, idiomatic, and composable markup. I used to be
            a big template (mustache, handlebars, jinja, etc.) fan, but after discovering this
            approach I've not looked back.
            The result of any tag function is simply a string.
            */
            return div(
                table({
                    class: 'table'
                }, [
                    thead(
                        tr([
                            th('Distance'),
                            th('Scientific name'),
                            th('Database name'),
                            th('Database ID')
                        ])
                    ),
                    tbody(distances.map((each) => {
                        return tr([
                            td([String(each.dist)]),
                            td([each.sciname]),
                            td([each.namespaceid]),
                            td([each.sourceid])
                        ]);
                    }))
                ])
            );
        }

        loadingLayout() {
            return div(p(html.loading('Finding similar genomes')));
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.innerHTML = this.loadingLayout();
        }

        start({workspaceId, objectId, objectVersion}) {
            const workspaceRef = [workspaceId, objectId, objectVersion || '1'].join('/');

            /*
            NOTE: not necessary, but I usually create an rpc client as close to the site of
            usage as is practical. Of course there may be other considerations -- it may be
            used all over the place, in which case perhaps defined in the constructor.
            */
            const sketchClient = new DynamicServiceClient({
                url: this.runtime.config('services.service_wizard.url'),
                token: this.runtime.service('session').getAuthToken(),
                module: 'sketch_service'
            });

            sketchClient.callFunc('get_homologs', [workspaceRef])
                .then((data) => {
                    this.container.innerHTML = this.dataLayout(data);
                })
                .catch((err) => {
                    this.container.innerHTML = div({
                        class: 'alert alert-danger'
                    }, err.message);
                });
        }

        stop() {
            /*
            NOTE: stop would typically be used to "stop" any thing which has been "started".
            E.g. timers, pollers, sub-widgets.
            This is just part of an early widget API we developed to define a standard
            protocol for widget lifecycle supporting arbitrary nesting. There are other methods
            as well (init, destroy) but they are seldom used. The "lifcycle methods"
            attach, start, stop, detach are theoretically optional in usage, but it is good practice
            to always provide these four even if they do nothing.
            In the widget loading implementation they are wrapped in a promise, so any of them
            may also return a promise.
            This is to support concurrent loading of many widgets while still supporting a
            semi-deterministic lifecycle. So, for instance, the start method could be used to
            load data from a service, and set up so that the start method only completes when the
            data is loaded. This can be used to prevent partial loading of sibling widgets, only
            to have one spoil the party.
            In practice, though, many widgets simply show a spinner and then launch any async
            code into orphan promises.
            In situations in which you need to have a set of widgets all load or fail together, this
            pattern is helpful.
            */
        }

        detach() {
            /*
            NOTE: this may seem paranoid, but just in case the widget attach method
            failed, or was never called...
            */
            if (this.hostNode && this.container) {
                this.hostNode.removeChild(this.container);
            }
        }
    }

    return Widget;
});
