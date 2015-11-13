
/**
 * FIXME: not works
 * @param block
 * @returns {Function}
 * @constructor
 */
var ScribeRemoveSirTrevorBarPlugin =  function (block) {
    return function (scribe) {
        jQuery('.st-format-bar').on('show', function() {
            $(this).remove();
        });
    };
};

var Styles = function($elem) {
    var _getStyles = function(style) {
        var result = {};
        style && style.split(';').forEach(function(e) {
            var sp = e.split(/: ?/);
            result[sp[0].replace(/ /g, '')] = sp[1];
        });

        return result;
    };
    return {
        style:  function(styleKey, value) {
            if (!value) {
                var styles = _getStyles($elem.attr('style'));
                return styles[styleKey];
            } else {
                $elem.css(styleKey, value);
            }
        }
    }

};

var Color = function(styleColor) {
    var _componentToHex = function (x) {
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
    };

    var _rgbToHex = function (style) {
        style = style.replace("rgb(", "").replace(")", "").replace(/ /g, "");
        var rgb = style.split(",");
        return "#" + _componentToHex(rgb[0]) + _componentToHex(rgb[1]) + _componentToHex(rgb[2]);
    };

    return {
        toHex: function() {
            return _rgbToHex(styleColor);
        }
    }
};


var ScribeFontTypePlugin = function() {
    return function (scribe) {
        var commandName = 'fontType';

        var command = new scribe.api.Command('formatBlock');

        command.execute = function (value) {
            if (this.queryState(value)) {
                scribe.api.Command.prototype.execute.call(this, '<p>');
            } else {
                scribe.api.Command.prototype.execute.call(this, value);
            }
        };

        command.queryState = function (value) {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                return node.nodeName === value.toUpperCase();
            });
        };

        /**
         * All: Executing a heading command inside a list element corrupts the markup.
         * Disabling for now.
         */
        command.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listNode = selection.getContaining(function (node) {
                return node.nodeName === 'OL' || node.nodeName === 'UL';
            });

            return scribe.allowsBlockElements() && ! listNode;
        };

        command.getCurrentVal = function() {
            if (_getElement().length > 0) {
                return  _getElement()[0].nodeName.toLowerCase();
            }
            else {
                return undefined;
            }
        };

        var _getElement = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands[commandName] = command;
    };
};

var ScribeFontFamilyPlugin = function() {
    return function (scribe) {
        var command = new scribe.api.SimpleCommand('fontFamily', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        command.execute = function (value) {
            scribe.transactionManager.run(function () {
                _getElementStyleApplied().css('font-family', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @returns {boolean} true if the selection have a font-family style
         */
        command.queryState = function () {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf('font-family:') != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        command.queryEnabled = function () {
            return true;
        };

        command.getCurrentVal = function() {
            return Styles(_getElementStyleApplied()).style('font-family');
        };

        var _getElementStyleApplied = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands.fontFamily = command;
    };
};


var ScribeFontColorPlugin =  function () {
    return function (scribe) {
        var command = new scribe.api.SimpleCommand('fontColor', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        command.execute = function (value) {
            scribe.transactionManager.run(function () {
                _getElementStyleApplied().css('color', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @returns {boolean} true of the selection have a color style
         */
        command.queryState = function () {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf('color:') != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        command.queryEnabled = function () {
            return true;
        };

        command.getCurrentVal = function() {

            var cssColor = Styles(_getElementStyleApplied()).style('color');
            if (cssColor) {
                return Color(cssColor).toHex();
            } else {
                return cssColor;
            }
        };

        var _getElementStyleApplied = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands.fontColor = command;
    };
};

var ScribeFontSizePlugin =  function () {
    return function (scribe) {
        var command = new scribe.api.SimpleCommand('fontSize', '');
        /**
         * Executed the command and set the style or remove
         *
         * @param value
         */
        command.execute = function (value) {
            scribe.transactionManager.run(function () {
                _getElementStyleApplied().css('font-size', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @returns {boolean} always true you can change font size of every text
         */
        command.queryState = function () {
            // TODO: title (h1, h2..) maybe not?
            return true;
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        command.queryEnabled = function () {
            return true;
        };

        command.getCurrentVal = function() {
            return Styles(_getElementStyleApplied()).style('font-size');
        };

        var _getElementStyleApplied = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands.fontSize = command;
    };
};

var ScribeBackgroundColorPlugin =  function () {
    return function (scribe) {
        var command = new scribe.api.SimpleCommand('fontColor', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        command.execute = function (value) {
            scribe.transactionManager.run(function () {
                _getElementStyleApplied().css('background', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @returns {boolean} true of we have a background style
         */
        command.queryState = function () {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf('background:') != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean} true for all block
         */
        command.queryEnabled = function () {
           return true;
        };

        command.getCurrentVal = function() {
            var cssBackground = Styles(_getElementStyleApplied()).style('background');
            if (cssBackground) {
                return Color(cssBackground).toHex();
            } else {
                return cssBackground;
            }
        };

        var _getElementStyleApplied = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands.backgroundColor = command;
    };
};

var ScribeAlignPlugin =  function () {
    return function (scribe) {
        var command = new scribe.api.SimpleCommand('textAlign', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        command.execute = function (value) {
            scribe.transactionManager.run(function () {
                _getElementStyleApplied().css('text-align', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @param value optional
         * @returns {boolean} true of we have a text-align
         */
        command.queryState = function (value) {
            var style = Styles(_getElementStyleApplied()).style("text-align");
            return style && style === value;
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean} always true
         */
        command.queryEnabled = function () {
            return true;
        };

        var _getElementStyleApplied = function() {
            var selection = new scribe.api.Selection();
            var $focusParent = jQuery(selection.selection.focusNode.parentNode);
            while ($focusParent.length > 0 && !$focusParent.is('p, h1, h2, h3, h4, li')){
                $focusParent = $focusParent.parent();
            }
            return $focusParent;
        };

        scribe.commands.textAlign = command;
    };
};

var ScribeToolbarPlugin = function (toolbarNode) {
        return function (scribe) {
            var elems = toolbarNode.querySelectorAll('[data-command-name]');
            Array.prototype.forEach.call(elems, function (elem) {
                var $elem = jQuery(elem);
                var callback = function(value) {
                    // Look for a predefined command.
                    var command = scribe.getCommand($elem.attr('data-command-name'));

                    /**
                     * Focus will have been taken away from the Scribe instance when
                     * clicking on a button (Chrome will return the focus automatically
                     * but only if the selection is not collapsed. As per: http://jsbin.com/tupaj/1/edit?html,js,output).
                     * It is important that we focus the instance again before executing
                     * the command, because it might rely on selection data.
                     */
                    scribe.el.focus();
                    command.execute(value);
                    /**
                     * Chrome has a bit of magic to re-focus the `contenteditable` when a
                     * command is executed.
                     * As per: http://jsbin.com/papi/1/edit?html,js,output
                     */
                };

                if ($elem.is('button')){
                    $elem.on('mousedown', function () {
                        callback($elem.val());
                    });
                } else {
                    $elem.on('change', function () {
                        callback($elem.val());
                    });
                }

                // Keep the state of toolbar buttons in sync with the current selection.
                // Unfortunately, there is no `selectionchange` event.
                scribe.el.addEventListener('keyup', function() {
                    updateUi($elem);
                });
                scribe.el.addEventListener('mouseup', function() {
                    updateUi($elem);
                });
                scribe.el.addEventListener('focus', function() {
                    updateUi($elem);
                });
                scribe.el.addEventListener('blur', function() {
                    updateUi($elem);
                });
                // We also want to update the UI whenever the content changes. This
                // could be when one of the toolbar buttons is actioned.
                scribe.on('content-changed', function() {
                    updateUi($elem);
                });
            });

            function updateUi($elem) {
                console.log(scribe);
                // Look for a predefined command.
                var command = scribe.getCommand($elem.attr('data-command-name'));
                console.log(command);

                var selection = new scribe.api.Selection();

                // TODO: Do we need to check for the selection?
                if (selection.range && command.queryState($elem.val())) {
                    $elem.addClass('active');
                } else {
                    $elem.removeClass('active');
                }


                if (selection.range && command.queryEnabled()) {
                    $elem.removeAttr('disabled');
                } else {
                    $elem.attr('disabled', 'disabled');
                }

                // somme commands have the method to know what value are applied
                if (command.getCurrentVal){
                    var newVal = command.getCurrentVal();
                    if (newVal) {
                        $elem.val(newVal);
                    } else {
                        $elem.val($elem.prop("defaultValue"));
                    }
                }
            }
        };
};


/**
 *
 */
SirTrevor.Blocks.TextEditor = SirTrevor.Blocks.Text.extend({
    type: 'text-editor',
    // expose what kind of tags we allow!
    scribeOptions: {
        tags: {
            p: true,
            h1: true,
            h2: true,
            h3: true,
            h4: true,
            ul: true,
            ol: true,
            li: true,
            a: {
                href: true,
                style: true,
                target: '_blank',
                class: true
            },
            u: true,
            bold: true,
            strike: true
        }
    },

    editorHTML: "" +
        "<div>" +
        "   <div class=\"toolbar\">\n" +
        "       <select data-command-name=\"fontType\" disabled=\"disabled\">" +
        "           <option value=\"h1\">Header</option>" +
        "           <option value=\"h2\">Header2</option>" +
        "           <option value=\"h3\">Header3</option>" +
        "           <option value=\"h4\">Header4</option>" +
        "           <option value=\"p\" selected>Text</option>" +
        "           <option value=\"small\">small</option>" +
        "       </select>" +
        "       <select data-command-name=\"fontFamily\" disabled=\"disabled\">" +
        "           <option value=\"'Times New Roman', Times, serif\" selected>Times New Roman</option>" +
        "           <option value=\"Georgia, serif\">Georgia</option>" +
        "           <option value=\"'Palatino Linotype', 'Book Antiqua', Palatino, serif\" >Palatino</option>" +
        "           <option value=\"Arial, Helvetica, sans-serif\">Arial</option>" +
        "           <option value=\"'Courier New', Courier, monospace\">Courier</option>" +
        "       </select>" +
        "       <select data-command-name=\"fontSize\" disabled=\"disabled\">" +
        "           <option value=\"10px\">10</option>" +
        "           <option value=\"12px\" selected>12</option>" +
        "           <option value=\"14px\">14</option>" +
        "           <option value=\"16px\">16</option>" +
        "           <option value=\"18px\">18</option>" +
        "           <option value=\"20px\">20</option>" +
        "           <option value=\"22px\">22</option>" +
        "           <option value=\"24px\">24</option>" +
        "           <option value=\"26px\">26</option>" +
        "           <option value=\"28px\">28</option>" +
        "           <option value=\"30px\">30</option>" +
        "       </select>" +
        "       <input data-command-name=\"fontColor\" type=\"color\" value=\"#4D4D4D\" disabled=\"disabled\">\n" +
        "       <input data-command-name=\"backgroundColor\" type=\"color\" value=\"#ffffff\" disabled=\"disabled\">\n" +
        "       <button data-command-name=\"bold\" disabled=\"disabled\">Bold</button>\n" +
        "       <button data-command-name=\"italic\" class=\"\" disabled=\"disabled\">Italic</button>\n" +
        "       <button data-command-name=\"underline\" disabled=\"disabled\">Underline</button>\n" +
        "       <button data-command-name=\"strikeThrough\" class=\"\" disabled=\"disabled\">Strike Through</button>\n" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"left\" >left</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"right\" >right</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"center\" >center</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"justify\" >justify</button>" +
        "       <button data-command-name=\"linkPrompt\" disabled=\"disabled\">Link</button>\n" +
        "       <button data-command-name=\"unlink\" disabled=\"disabled\">Unlink</button>\n" +
        "       <button data-command-name=\"insertOrderedList\" disabled=\"disabled\">Ordered List</button>\n" +
        "       <button data-command-name=\"insertUnorderedList\" disabled=\"disabled\">Unordered List</button>\n" +
        "       <button data-command-name=\"indent\" disabled=\"disabled\">Indent</button>" +
        "       <button data-command-name=\"outdent\" disabled=\"disabled\">Outdent</button>" +
        "       <button data-command-name=\"undo\">Undo</button>\n" +
        "       <button data-command-name=\"redo\" disabled=\"disabled\">Redo</button>\n" +
        "       <button data-command-name=\"removeFormat\" disabled=\"disabled\">Remove Formatting</button>\n" +
        "   </div>" +
        "   <div class=\"st-required st-text-block\" contenteditable=\"true\"></div>" +
        "</div>",

    configureScribe: function(scribe) {
        scribe.use(new ScribeFontTypePlugin());
        scribe.use(new ScribeToolbarPlugin(this.$editor.find('.toolbar')[0]));
        scribe.use(new ScribeFontColorPlugin());
        scribe.use(new ScribeRemoveSirTrevorBarPlugin(this));
        scribe.use(new ScribeBackgroundColorPlugin(this));
        scribe.use(new ScribeFontFamilyPlugin());
        scribe.use(new ScribeFontSizePlugin());
        scribe.use(new ScribeAlignPlugin());
    },

    clearInsertedStyles: function(e) {
        // only allow a subset of styles
        var target = e.target;
        var $elem = jQuery(target);
        if ($elem.attr('style')) {
            var styles = $elem.attr('style').split(";");
            var stylesSanitize = "";
            for (var i = 0; i < styles.length; i++) {
                if (styles[i].indexOf("color:") != -1 ||
                    styles[i].indexOf("background:") != -1 ||
                    styles[i].indexOf("font-family:") != -1 ||
                    styles[i].indexOf("font-size:") != -1 ||
                    styles[i].indexOf("text-align:") != -1) {
                    stylesSanitize = stylesSanitize + styles[i] + ";";
                }
            }
            // parsed!
            if (stylesSanitize.length > 0) {
                $elem.attr('style', stylesSanitize);
            } else {
                $elem.removeAttr('style');
            }
        }
    }
});
