/**
 * An HTML view function for a collapsible panel section, as found throughout the dataview (for
 * example, see the "Data Provenance and Reference Network" section, found in provenancePanel.js).
 * This can be imported with the path 'plugins/dataview/modules/collapsiblePanel'
 *
 * You can pass in config properties for `title`, `icon` (a font-awesome icon classname), `content` (a DOM node), and
 * `collapsed`.
 *
 * If you set the `collapsed` option to `false`, then the panel will be open on pageload. If you do
 * not set that option (or set it to anything besides `false`), then the panel will be collapsed on
 * pageload.
 */

define(['kb_common/html'], function (html) {
    'use strict';

    function renderPanel({collapsed, icon, title, content}) {
        const panelId = html.genId(),
            headingId = html.genId(),
            collapseId = html.genId();

        const div = html.tag('div'),
            h4 = html.tag('h4'),
            span = html.tag('span');

        return div({
            'class': 'panel-group kb-widget',
            id: panelId,
            role: 'tablist',
            'aria-multiselectable': 'true'
        }, [
            div({class: 'panel panel-default'}, [
                div({
                    class: 'panel-heading',
                    role: 'tab',
                    id: headingId
                }, [
                    h4({class: 'panel-title'}, [
                        span({
                            'data-toggle': 'collapse',
                            'data-parent': '#' + panelId,
                            'data-target': '#' + collapseId,
                            'aria-expanded': 'false',
                            'aria-controls': collapseId,
                            'class': (collapsed === false ? '' : 'collapsed'),
                            style: {cursor: 'pointer'}
                        }, [
                            span({
                                'class': 'fa fa-' + icon + ' fa-rotate-90',
                                style: {'margin-left': '10px', 'margin-right': '10px'}
                            }),
                            title
                        ])
                    ])
                ]),
                div({
                    class: 'panel-collapse collapse ' + (collapsed === false ? 'in' : ''),
                    id: collapseId,
                    role: 'tabpanel',
                    'aria-labelledby': 'provHeading'
                }, [
                    div({class: 'panel-body'}, [content])
                ])
            ])
        ]);
    }

    return renderPanel;
});
