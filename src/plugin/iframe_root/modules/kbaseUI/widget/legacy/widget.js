/*global define*/
/*jslint browser:true,white:true*/
/**
 * @class KBWidget
 *

 kbwidget.js defines the jquery kbase widget superclass and provides some additional functionality based around it.

 The main thing that comes out of it is the $.KBWidget() function, which is a function that creates a constructor for your widget.
 There are other things available, but we'll come back to them.

 It also creates the root class for the jquery widgets (kbaseWidgets), although you won't directly interact with that.

 And it makes available a registery of all widgets at window.KBase.

 But $.KBWidget is the important one. This is your constructor constructor and should be used to create new jquery based widgets.

 Doing so is easy. It creates a classical inheritance environment. Simply call the function, name the widget, and define a parent.

 $.KBWidget(
 {
 name: 'myFancyNewWidget',
 parent: 'someOtherWidget',  //if parent is not provided, defaults to kbaseWidget
 options : {
 // key / value pairs of optional values to hand into the object. These can be used to override values set as options
 // for the superclass. This key really should've been called defaults, but oh well.
 }

 version : "1.0.0",  //future proofing, but completely unused

 _accessors : [  //optional. A list of values to automatically create setter/getters for.
 'foo'       //you'll now be able to store something at $widget.foo('newValue') and access it via var foo = $widget.foo();
 {name : 'bar', setter : 'setBar', getter : 'getBar'}    // the setter/getter can also be overridden If these functions are not
 // defined in your object, you'll get default implementations. Add new methods
 // in the object body for specific behavior. See the caveat about bindings and notifications
 // below.
 ],

 init : function(options) {  // the initializer. Is given an options hash containing the closest value. So if you have
 this._super(options);   // bar : 1 up in your options hash, and instantiate your widget with no args, it'll get bar : 1 in
 // this options argument. If you hand in bar : 2, you'll get bar : 2. If nothing is defined in your
 // class, but your parent has bar : 3, you'll get bar : 3, and so on.
 //
 // do whatever class initialization is necessary here. Set variables, establish network connections, layout
 // your interface, etc. It may be good to lay out your UI in another method, but that's not enforced.
 // $fancy.$elem contains the jquery wrapped reference to the widget you were instantiated against.

 return this;            //return self when you're done. You actually can return a different object, but only do so if you know what
 //you're doing
 },

 someMethod : function (args) {
 //do something interesting
 },

 anotherMethod : function(args) {
 //something else worthwhile
 }
 }
 );

 Instantiate as follows:

 var $fancy = $('some-jquery-selector').myFancyNewWidget(
 {
 bar : 7
 }
 );

 var foo = $fancy.foo();
 var $element = $fancy.$elem; //is the same as $('some-jquery-selector');

 You get a lot of methods availabe by default:

 callAfterInit(func) -   a semi magic function to use as a callback after the object is fully initialized. Use it to do work after callbacks may have been
 required during initalization. Call this from within your init, if you need it.
 dbg(text)           -   wrapper around console.warn, that checks for its existence. Thanks, IE!
 appendUI            -   a default implementation to create the UI of the object. Used to pull in and initialize a handlebars template, if one
 was handed in as an option
 templateSuccess(string) - callback if the template is successfully loaded
 templateFailure(string) - callback if the template did not load
 templateContent         - returns the template content
 valueForKey(attr)   -   different way to write $fancy.attr(); Universally works regardless of what getter is named.
 setValueForKey(attr, newValue)   -   different way to write $fancy.attr('newValue'); Universally works regardless of what setter is named.
 setValueForKeys(obj)    - shorthand to set many values at once. key / value pairs of attribute name and new value.
 data                - a generic block of data for you. Used by _rewireIds as a bucket to strip out IDs from HTML
 - my $inputField = $fancy.data('inputField'), for example
 sortCaseInsensitively(a,b) - helper function for sorting strings insensitively
 sortByKey(key, insensitively) - herlper to sort arrays of objects by the value of a particular key. insensitively is a boolean flag.
 trigger('event')             - triggers an event, emitted from $fancy.$elem;
 observe($target, attribute, callback)   - when the attribute value of $target changes, call callback on yourself.
 unobserve($target, attribute, callback) - stop watching $target's attribute value.
 uuid                - generate a reasonably universally unique ID.
 _rewireIds($elem, $target) - HTML IDs are required to be unique in a document, but that's a bitch to work with.
 _rewireIds will strip ids from $elem, and put them into $target's data() block.
 So, if $elem = <div id = 'one'><span id = 'two'>Some text</span></div>

 $fancy._rewireIds($elem, $fancy) would do this:
 $elem becomes <div><span>Some text</span></div>
 $fancy.data now holds:
 $fancy.data('one') === $(<div><span>Some text</span></div>)
 $fancy.data('two') === $(<span>Some text</span>)
 (to clarify, they're not new instances, they're the actual elements contained with $elem. Difficult to express...)


 The widgets will generate a lot of notifications from their setters/getters.

 $fancy.foo('new foo');  // posts events - willChangeValueForFoo, and then didChangeValueForFoo.

 You can listen for those events on $(document) and react as appropriately. If you create your own custom setter, be sure to call the notifications yourself.

 The other functions exported are:

 $.jqElem('name-of-html-tag')    //this is just a wrapper around $('<name-of-html-tag></name-of-html-tag>'), but it takes into account non-closing tags.

 $('someElement').asD3() - just a wrapper to d3.select('someElement'). Convenient for hiding d3, but not very widely used.

 $('someElement').kb_bind($target, attribute, ?transformers?, ?accessors?)
 binds and synchronizes the value displayed in 'someElement' with the named attribute of the $target jQuery object.
 Optionally hand in an object of transformers -
 {
 transformedValue : function(val) { return newVal }
 reverseTransformedValue : function(val) { return newVal }
 }

 transformedValue will convert the value in someElement through some function before setting it as an attribute of the $target
 reverseTransformedValue will convert the attribute of $target to something else before setting it as the value of someElement

 Optionally hand in an object of accessors -
 {
 setter : "name of setter function"
 getter : "name of getter function"
 }

 To call that setter/getter on $target instead of using a mutator named "attribute", by default.

 $('someElement').kb_unbind($target, attribute, callback, transformers, accessors)
 needs the same arguments and reverses the above.


 */

define(['jquery', 'handlebars', 'd3'], function ($, Handlebars, d3) {
    'use strict';
    $(document).on('libsLoaded.kbase', function () {
        $('[data-kbwidget]').each(function (idx, val) {
            var $val = $(val);
            var widget = $val.attr('data-kbwidget');

            var options = $val.text();

            $val.empty();
            if (options !== undefined) {
                options = JSON.parse(options);
            } else {
                options = {};
            }

            $val[widget](options);
        });
    });

    var KBase;
    var ucfirst = function (string) {
        if (string !== undefined && string.length) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    };

    var willChangeNoteForName = function (name) {
        return 'willChangeValueFor' + ucfirst(name);
    };

    var didChangeNoteForName = function (name) {
        return 'didChangeValueFor' + ucfirst(name);
    };

    var defaultBindingAccessors = function (elem) {
        var tagName = $(elem)
            .prop('tagName')
            .toLowerCase();

        if (tagName.match(/^(input|select|textarea)$/)) {
            if ($(elem).attr('type') === 'checkbox') {
                return {
                    setter: 'checked',
                    getter: 'checked'
                };
            }
            return {
                setter: 'val',
                getter: 'val'
            };
        }
        return {
            setter: 'html',
            getter: 'html'
        };
    };

    var makeBindingCallback = function (elem, $target, attribute, transformers, accessors) {
        return $.proxy(function (e, vals) {
            e.preventDefault();
            e.stopPropagation();

            var newVal = vals.newValue;

            if (transformers.transformedValue !== undefined) {
                newVal = transformers.transformedValue(newVal);
            }

            if (accessors.setter === 'checked') {
                $(elem).attr(accessors.setter, newVal);
            } else {
                $(elem)[accessors.setter](newVal);
            }
        }, $(elem));
    };

    var makeBindingBlurCallback = function (elem, $target, attribute, transformers, accessors) {
        return $.proxy(function (e) {
            if (e.type === 'keypress' && e.which !== 13) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var newVal;

            if (accessors.getter === 'checked') {
                newVal = this.is(':checked') ? true : false;
            } else {
                newVal = this[accessors.getter]();
            }

            if (newVal !== this.data('kbase_bindingValue')) {
                if (transformers.validator !== undefined) {
                    var validation = transformers.validator(newVal);

                    if (!validation.success) {
                        $(elem).data('validationError.kbaseBinding', validation.msg);
                        this.popover({
                            placement: 'right',
                            title: 'Validation error',
                            content: $.proxy(function () {
                                return this.data('validationError.kbaseBinding');
                            }, $(elem)),
                            trigger: 'manual',
                            html: true
                        });

                        this.popover('show');
                        return;
                    } else {
                        $(elem).popover('hide');
                        if (validation.newVal) {
                            newVal = validation.newVal;
                        }
                    }
                }

                if (transformers.reverseTransformedValue !== undefined) {
                    newVal = transformers.reverseTransformedValue(newVal);
                }

                var setter = $target.__attributes[attribute].setter;

                $target[setter](newVal);
                this.data('kbase_bindingValue', this[accessors.getter]());
            }
        }, $(elem));
    };

    var makeBindingFocusCallback = function (elem, transformers, accessors) {
        return $.proxy(function (e) {
            e.preventDefault();
            e.stopPropagation();

            this.data('kbase_bindingValue', this[accessors.getter]());
        }, $(elem));
    };

    $.fn.asD3 = function () {
        if (this.data('d3rep') === undefined) {
            this.data('d3rep', d3.select(this.get(0)));
        }
        return this.data('d3rep');
    };

    $.fn.kb_bind = function ($target, attribute, transformers, accessors) {
        if (this.length > 1) {
            var methodArgs = arguments;
            $.each(this, function (idx, elem) {
                $.fn.kb_bind.apply($(elem), methodArgs);
            });
            return this;
        }

        if (accessors === undefined) {
            accessors = defaultBindingAccessors(this);
        }

        if (transformers === undefined) {
            transformers = {};
        }

        var event = didChangeNoteForName(attribute);
        $target.on(event, makeBindingCallback(this, $target, attribute, transformers, accessors));

        $(this).on('blur.kbaseBinding', makeBindingBlurCallback(this, $target, attribute, transformers, accessors));

        $(this).on('focus.kbaseBinding', makeBindingFocusCallback(this, transformers, accessors));

        var tagName = $(this)
            .prop('tagName')
            .toLowerCase();
        if (tagName.match(/^(input)$/)) {
            $(this).on(
                'keypress.kbaseBinding',
                makeBindingBlurCallback(this, $target, attribute, transformers, accessors)
            );

            if ($(this).attr('type') === 'checkbox') {
                $(this).on(
                    'change.kbaseBinding',
                    makeBindingBlurCallback(this, $target, attribute, transformers, accessors)
                );
            }
        }

        var target_getter = $target.__attributes[attribute].getter;
        var newVal = $target[target_getter]();

        if (transformers.transformedValue !== undefined) {
            newVal = transformers.transformedValue(newVal);
        }

        if (accessors.setter === 'checked') {
            $(this).attr(accessors.setter, newVal);
        } else {
            $(this)[accessors.setter](newVal);
        }

        return this;
    };

    $.fn.kb_unbind = function ($target, attribute, callback, transformers, accessors) {
        if (this.length > 1) {
            var methodArgs = arguments;
            $.each(this, function (idx, elem) {
                $.fn.kb_unbind.apply($(elem), methodArgs);
            });
            return this;
        }

        if (accessors === undefined) {
            accessors = defaultBindingAccessors(this);
        }

        if (transformers === undefined) {
            transformers = {};
        }

        var event = didChangeNoteForName(attribute);
        $target.off(event, makeBindingCallback(this, $target, attribute, transformers, accessors));

        $(this).off('blur.kbaseBinding', makeBindingBlurCallback(this, $target, attribute, transformers, accessors));

        $(this).off('focus.kbaseBinding', makeBindingBlurCallback(this, transformers, accessors));

        var tagName = $(this)
            .prop('tagName')
            .toLowerCase();
        if (tagName.match(/^(input)$/)) {
            // Disabled - no makeBindingEnterCallback exists!
            // $(this).off(
            //     'keypress.kbaseBinding',
            //     makeBindingEnterCallback(this, $target, attribute, transformers, accessors)
            // );
            if ($(this).attr('type') === 'checkbox') {
                $(this).off(
                    'change.kbaseBinding',
                    makeBindingBlurCallback(this, $target, attribute, transformers, accessors)
                );
            }
        }

        return this;
    };

    var widgetRegistry = {};
    if (KBase === undefined) {
        KBase = window.KBase;
    }
    if (window.KBase === undefined) {
        KBase = window.KBase = {
            _functions: {
                getter: function (name) {
                    return function () {
                        return this.valueForKey(name);
                    };
                },
                setter: function (name) {
                    return function (newVal) {
                        return this.setValueForKey(name, newVal);
                    };
                },
                getter_setter: function (name) {
                    return function (newVal) {
                        if (arguments.length === 1) {
                            return this.setValueForKey(name, newVal);
                        } else {
                            return this.valueForKey(name);
                        }
                    };
                }
            }
        };
    }

    function subclass(constructor, superConstructor) {
        function surrogateConstructor() { }

        surrogateConstructor.prototype = superConstructor.prototype;

        var prototypeObject = new surrogateConstructor();
        prototypeObject.constructor = constructor;

        constructor.prototype = prototypeObject;
    }

    $.jqElem = function (tagName) {
        var tag = '<' + tagName + '>';
        if (!tag.match(/^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track)/)) {
            tag += '</' + tagName + '>';
        }
        return $(tag);
    };

    $.KBWidget = function (def) {
        def = def || {};
        var name = def.name;
        var parent = def.parent;

        if (parent === undefined) {
            parent = 'kbaseWidget';
        }

        var asPlugin = def.asPlugin;
        if (asPlugin === undefined) {
            asPlugin = true;
        }

        var Widget = function ($elem) {
            this.$elem = $elem;
            this.options = $.extend(true, {}, def.options, this.constructor.prototype.options);
            return this;
        };

        if (name) {
            var directName = name;
            directName = directName.replace(/^kbase/, '');
            directName = directName.charAt(0).toLowerCase() + directName.slice(1);

            KBase[directName] = function (options, $elem) {
                var $w = new Widget();
                if ($elem === undefined) {
                    $elem = $.jqElem('div');
                }
                $w.$elem = $elem;

                if (options === undefined) {
                    options = {};
                }
                options.headless = true;

                $w.init(options);
                $w._init = true;
                $w.trigger('initialized');
                return $w;
            };

            widgetRegistry[name] = Widget;

            if (def === undefined) {
                def = parent;
                parent = 'kbaseWidget';
                if (def === undefined) {
                    def = {};
                }
            }
        }

        if (parent) {
            var pWidget = widgetRegistry[parent];
            if (pWidget === undefined)
                throw new Error('Parent widget is not registered. Cannot find ' + parent + ' for ' + name);
            subclass(Widget, pWidget);
        }

        var defCopy = $.extend(true, {}, def);

        Widget.prototype.__attributes = {};

        if (defCopy._accessors !== undefined) {
            //for (var accessor in defCopy._accessors) {
            $.each(
                defCopy._accessors,
                $.proxy(function (idx, accessor) {
                    var info = {
                        name: accessor,
                        setter: accessor,
                        getter: accessor,
                        type: 'rw'
                    };

                    if (typeof accessor === 'object') {
                        info.setter = accessor.name;
                        info.getter = accessor.name;

                        for (var key in accessor) {
                            info[key] = accessor[key];
                        }
                    }

                    Widget.prototype.__attributes[info.name] = info;

                    if (info.setter === info.getter && info.type.match(/rw/)) {
                        Widget.prototype[info.getter] = KBase._functions.getter_setter(info.name);
                    } else {
                        if (info.type.match(/w/) && info.setter !== undefined) {
                            Widget.prototype[info.setter] = KBase._functions.setter(info.name);
                        }

                        if (info.type.match(/r/) && info.getter !== undefined) {
                            Widget.prototype[info.getter] = KBase._functions.getter(info.name);
                        }
                    }
                }, this)
            );

            defCopy._accessors = undefined;
        }

        var extension = $.extend(
            true,
            {},
            Widget.prototype.__attributes,
            widgetRegistry[parent].prototype.__attributes
        );
        Widget.prototype.__attributes = extension;

        for (var prop in defCopy) {
            //hella slick closure based _super method adapted from JQueryUI.
            //*

            if ($.isFunction(defCopy[prop])) {
                Widget.prototype[prop] = (function (methodName, method) {
                    let _super = function () {
                        throw 'No parent method defined! Play by the rules!';
                    };
                    let _superMethod = function () {
                        throw 'No parent method defined! Play by the rules!';
                    };

                    if (parent) {
                        _super = function () {
                            return widgetRegistry[parent].prototype[methodName].apply(this, arguments);
                        };

                        _superMethod = function (superMethodName) {
                            return widgetRegistry[parent].prototype[superMethodName].apply(
                                this,
                                Array.prototype.slice.call(arguments, 1)
                            );
                        };
                    }

                    return function () {
                        var _oSuper = this._super;
                        var _oSuperMethod = this._superMethod;
                        this._super = _super;
                        this._superMethod = _superMethod;

                        var retValue = method.apply(this, arguments);

                        this._super = _oSuper;
                        this._superMethod = _oSuperMethod;

                        return retValue;
                    };
                })(prop, defCopy[prop]);
            } else {
                //*/
                Widget.prototype[prop] = defCopy[prop];
            }
        }

        if (parent) {
            Widget.prototype.options = $.extend(
                true,
                {},
                widgetRegistry[parent].prototype.options,
                Widget.prototype.options
            );
        }

        if (asPlugin) {
            var ctor = function (method) {
                if (this.length > 1) {
                    var methodArgs = arguments;
                    $.each(this, function (idx, elem) {
                        $.fn[name].apply($(elem), methodArgs);
                    });
                    return this;
                }

                if (this.data(name) === undefined) {
                    this.data(name, new Widget(this));
                }

                // Method calling logic
                if (Widget.prototype[method]) {
                    return Widget.prototype[method].apply(this.data(name), Array.prototype.slice.call(arguments, 1));
                } else if (typeof method === 'object' || !method) {
                    //return this.data(name).init( arguments );
                    var $w = this.data(name);
                    if ($w._init === undefined) {
                        $w = Widget.prototype.init.apply($w, arguments);
                    }
                    $w._init = true;
                    $w.trigger('initialized');
                    return $w;
                } else {
                    $.error('Method ' + method + ' does not exist on ' + name);
                }

                return this;
            };

            //ctor.name = name;
            $.fn[name] = ctor;
            $[name] = $.fn[name];
        }

        /**
         * Registers events on this element.
         * @param {String} name The event name to register
         * @param {Function} callback The function to call when an event is
         *        emitted.
         */
        this.on = function (evt, callback) {
            this.$elem.bind(evt, callback);
            return this;
        };

        /**
         * Emits an event.
         * @param {String} name The event name
         * @param {Object} data The data to emit with the event
         */
        this.emit = function (evt, data) {
            this.$elem.trigger(evt, data);
            return this;
        };

        /**
         * Unregisters events on this element.
         * @param {String} name The event name to unregister from
         */
        this.off = function (evt) {
            this.$elem.unbind(evt);
            return this;
        };

        if (name !== undefined) {
            Widget.prototype[name] = function () {
                return $.fn[name].apply(this.$elem, arguments);
            };

            return $.fn[name];
        } else {
            return this;
        }
    };

    /**
     * @method registry
     * The set of globally-registered widgets.
     * @return {Object} The registry
     * @return {String} return.key The name of the widget
     * @return {Object} return.value The widget
     * @static
     */
    $.KBWidget.registry = function () {
        var registry = {};
        for (var widget in widgetRegistry) {
            if (widget !== 'kbaseWidget') {
                registry[widget] = widgetRegistry[widget];
            }
        }
        return registry;
    };

    /**
     * @method resetRegistry
     * Unregisters all global widgets.
     * Note that this does not delete the widgets if another reference to them
     * is maintained (e.g., by variable assignment).
     * @static
     * @chainable
     */
    $.KBWidget.resetRegistry = function () {
        for (var widget in widgetRegistry) {
            if (widget !== 'kbaseWidget') {
                delete widgetRegistry[widget];
            }
        }
        return this;
    };

    $.KBWidget({
        name: 'kbaseWidget',
        /**
         * Writes text to console.
         * @param {String} txt The text to write.
         */
        dbg: function (txt) {
            if (window.console) {
                // eslint-disable-next-line no-console
                console.warn(txt);
            }
        },
        callAfterInit: function (func) {
            var self = this;

            function delayer() {
                if (self._init) {
                    func();
                } else {
                    setTimeout(delayer, 10);
                }
            }
            delayer();
            return delayer;
        },
        /**
         * Initializes the widget.
         * @param {Object} args Initialization arguments
         */
        init: function (args) {
            this._attributes = {};

            this.runtime = args.runtime;
            //                if (!this.runtime) {
            //                    throw new Error('The required runtime option was not provided to the widget');
            //                }

            var opts = $.extend(true, {}, this.options);
            this.options = $.extend(true, {}, opts, args);

            var arg;
            for (arg in args) {
                if (args[arg] === undefined && this.options[arg] !== undefined) {
                    delete this.options[arg];
                }
            }

            var attribute;
            for (attribute in this.__attributes) {
                if (this.options[attribute] !== undefined) {
                    var setter = this.__attributes[attribute].setter;
                    this[setter](this.options[attribute]);
                }
            }

            if (this.options.template) {
                this.callAfterInit(
                    $.proxy(function () {
                        this.appendUI(this.$elem);
                    }, this)
                );
            }

            return this;
        },
        appendUI: function ($elem) {
            if (this.options.template) {
                $.ajax(this.options.template)
                    .done(
                        $.proxy(function () {
                            this.templateSuccess.apply(this, arguments);
                        }, this)
                    )
                    .fail(
                        $.proxy(function () {
                            this.templateFailure.apply(this, arguments);
                        }, this)
                    );
            }

            return $elem;
        },
        templateSuccess: function (templateString) {
            var template = Handlebars.compile(templateString),
                res = template(this.templateContent()),
                // xss safe (need to trust)
                $res = $.jqElem('span').append(res);
            this._rewireIds($res, this);
            // xss safe
            this.$elem.append($res);
        },
        templateFailure: function (res) {
            this.dbg('Template load failure');
            this.dbg(res);
        },
        templateContent: function () {
            return this.options.templateContent || {};
        },
        /**
         * Sets an alert to display
         * @param {String} msg The message to display
         */
        alert: function (msg) {
            if (msg === undefined) {
                msg = this.data('msg');
            }
            this.data('msg', msg);

            return this;
        },
        valueForKey: function (attribute) {
            //this.trigger('didAccessValueFor' + name + '.kbase');
            return this._attributes[attribute];
        },
        setValueForKey: function (attribute, newVal) {
            var triggerValues = undefined;
            var oldVal = this.valueForKey(attribute);

            if (newVal !== oldVal) {
                var willChangeNote = willChangeNoteForName(attribute);

                triggerValues = {
                    oldValue: oldVal,
                    newValue: newVal
                };
                this.trigger(willChangeNote, triggerValues);

                this._attributes[attribute] = triggerValues.newValue;

                if (triggerValues.newValue !== oldVal) {
                    var didChangeNote = didChangeNoteForName(attribute);

                    this.trigger(didChangeNote, triggerValues);
                }
            }

            return this.valueForKey(attribute);
        },
        setValuesForKeys: function (obj) {
            var objCopy = $.extend({}, obj);

            for (var attribute in this.__attributes) {
                if (objCopy[attribute] !== undefined) {
                    var setter = this.__attributes[attribute].setter;
                    this[setter](objCopy[attribute]);
                    delete objCopy[attribute];
                }
            }

            this.options = $.extend(this.options, objCopy);
        },
        /**
         * Sets data.
         * @param {Object} key The key for the data
         * @param {Object} value The data itself
         */
        data: function (key, val) {
            if (this.options._storage === undefined) {
                this.options._storage = {};
            }

            if (arguments.length === 2) {
                this.options._storage[key] = val;
            }

            if (key !== undefined) {
                return this.options._storage[key];
            } else {
                return this.options._storage;
            }
        },
        _rewireIds: function ($elem, $target) {
            if ($target === undefined) {
                $target = $elem;
            }

            if ($elem.attr('id')) {
                $target.data($elem.attr('id'), $elem);
                $elem.removeAttr('id');
            }

            $.each($elem.find('[id]'), function () {
                $target.data($(this).attr('id'), $(this));
                $(this).attr('data-id', $(this).attr('id'));
                $(this).removeAttr('id');
            });

            return $elem;
        },
        sortCaseInsensitively: function (a, b) {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
            return 0;
        },
        sortByKey: function (key, insensitively) {
            if (insensitively) {
                return function (a, b) {
                    if (a[key].toLowerCase() < b[key].toLowerCase()) {
                        return -1;
                    }
                    if (a[key].toLowerCase() > b[key].toLowerCase()) {
                        return 1;
                    }
                    return 0;
                };
            } else {
                return function (a, b) {
                    if (a[key] < b[key]) {
                        return -1;
                    }
                    if (a[key] > b[key]) {
                        return 1;
                    }
                    return 0;
                };
            }
        },
        trigger: function () {
            this.$elem.trigger.apply(this.$elem, arguments);
        },
        on: function () {
            this.$elem.on.apply(this.$elem, arguments);
        },
        off: function () {
            this.$elem.off.apply(this.$elem, arguments);
        },
        makeObserverCallback: function ($target, attribute, callback) {
            return $.proxy(function (e, vals) {
                e.preventDefault();
                e.stopPropagation();

                callback.call(this, e, $target, vals);
            }, this);
        },
        observe: function ($target, attribute, callback) {
            $target.on(attribute, $target, this.makeObserverCallback($target, attribute, callback));
        },
        unobserve: function ($target, attribute, callback) {
            $target.off(attribute, $target, this.makeObserverCallback($target, attribute, callback));
        },
        /*
         kb_bind : function($target, attribute, callback) {
         var event = didChangeNoteForName(attribute);
         $target.on(event, $target, callback);
         },

         kb_unbind : function($target, attribute, callback) {
         var event = didChangeNoteForName(attribute);
         $target.off(event, callback);
         },
         */

        //*
        kb_bind: function ($target, attribute, callback) {
            var event = didChangeNoteForName(attribute);
            this.observe($target, event, callback);
        },
        kb_unbind: function ($target, attribute, callback) {
            var event = didChangeNoteForName(attribute);
            //$target.off(event, callback);
            this.unobserve($target, event, callback);
        },
        uuid: function () {
            var result = '';
            for (var i = 0; i < 32; i++) {
                result += Math.floor(Math.random() * 16)
                    .toString(16)
                    .toUpperCase();
            }

            return 'uuid-' + result;
        }
    });
});
