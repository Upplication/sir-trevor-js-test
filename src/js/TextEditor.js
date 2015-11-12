
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


var ScribeFontTypePlugin = function() {
    return function (scribe) {
        var commandName = 'fontType';

        var fontTypeCommand = new scribe.api.Command('formatBlock');

        fontTypeCommand.execute = function (value) {
            if (this.queryState(value)) {
                scribe.api.Command.prototype.execute.call(this, '<p>');
            } else {
                scribe.api.Command.prototype.execute.call(this, value);
            }
        };

        fontTypeCommand.queryState = function (value) {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                return node.nodeName === value.toUpperCase();
            });
        };

        /**
         * All: Executing a heading command inside a list element corrupts the markup.
         * Disabling for now.
         */
        fontTypeCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listNode = selection.getContaining(function (node) {
                return node.nodeName === 'OL' || node.nodeName === 'UL';
            });

            return scribe.allowsBlockElements() && ! listNode;
        };

        scribe.commands[commandName] = fontTypeCommand;
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
                var selection = new scribe.api.Selection(),
                    $parentNodeSelection = jQuery(selection.selection.focusNode.parentNode);
                $parentNodeSelection.css('font-family', value);
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
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
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
                var selection = new scribe.api.Selection(),
                    $parentNodeSelection = jQuery(selection.selection.focusNode.parentNode);
                $parentNodeSelection.css('color', value);
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
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
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
                var selection = new scribe.api.Selection(),
                    $parentNodeSelection = jQuery(selection.selection.focusNode.parentNode);
                $parentNodeSelection.css('font-size', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @returns {boolean} always true you can change font size of everyblock
         */
        command.queryState = function () {
            return true;
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        command.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
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
                var selection = new scribe.api.Selection(),
                    $parentNodeSelection = jQuery(selection.selection.focusNode.parentNode);
                $parentNodeSelection.css('background', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @param value optional
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
         * @returns {boolean}
         */
        command.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
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
                var selection = new scribe.api.Selection(),
                    $parentNodeSelection = jQuery(selection.selection.focusNode.parentNode);
                $parentNodeSelection.css('text-align', value);
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @param value optional
         * @returns {boolean} true of we have a text-align
         */
        command.queryState = function () {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf('text-align:') != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean} always true
         */
        command.queryEnabled = function () {
            return true;
        };

        scribe.commands.textAlign = command;
    };
};

var ScribeToolbarPlugin = {

    getToolbarHtml: function() {
        return "<div class=\"toolbar\">\n" +
        "       <button data-command-name=\"bold\" disabled=\"disabled\">Bold</button>\n" +
        "       <button data-command-name=\"italic\" class=\"\" disabled=\"disabled\">Italic</button>\n" +
        "       <button data-command-name=\"underline\" disabled=\"disabled\">Underline</button>\n" +
        "       <button data-command-name=\"strikeThrough\" class=\"\" disabled=\"disabled\">Strike Through</button>\n" +
        "       <button data-command-name=\"removeFormat\" disabled=\"disabled\">Remove Formatting</button>\n" +
        "       <button data-command-name=\"linkPrompt\" disabled=\"disabled\">Link</button>\n" +
        "       <button data-command-name=\"unlink\" disabled=\"disabled\">Unlink</button>\n" +
        "       <button data-command-name=\"insertOrderedList\" disabled=\"disabled\">Ordered List</button>\n" +
        "       <button data-command-name=\"insertUnorderedList\" disabled=\"disabled\">Unordered List</button>\n" +
        "       <button data-command-name=\"indent\" disabled=\"disabled\">Indent</button>" +
        "       <button data-command-name=\"outdent\" disabled=\"disabled\">Outdent</button>" +
        "       <button data-command-name=\"blockquote\" disabled=\"disabled\">Blockquote</button>" +
        "       <button data-command-name=\"code\">Code</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"left\" >left</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"right\" >right</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"center\" >center</button>" +
        "       <button data-command-name=\"textAlign\" disabled=\"disabled\" value=\"justify\" >justify</button>" +
        "       <select data-command-name=\"fontFamily\">" +
        "           <option value=\"'Times New Roman', Times, serif\" selected>Times New Roman</option>" +
        "           <option value=\"Georgia, serif\">Georgia</option>" +
        "           <option value=\"'Palatino Linotype', 'Book Antiqua', Palatino, serif\" >Palatino</option>" +
        "           <option value=\"Arial, Helvetica, sans-serif\">Arial</option>" +
        "           <option value=\"'Courier New', Courier, monospace\">Courier</option>" +
        "       </select>" +
        "       <select data-command-name=\"fontType\">" +
        "           <option value=\"h1\">Header</option>" +
        "           <option value=\"h2\">Header2</option>" +
        "           <option value=\"h3\">Header3</option>" +
        "           <option value=\"h4\">Header4</option>" +
        "           <option value=\"p\" selected>Text</option>" +
        "           <option value=\"small\">small</option>" +
        "       </select>" +
        "       <select data-command-name=\"fontSize\">" +
        "           <option value=\"10px\">10</option>" +
        "           <option value=\"12px\" selected>12</option>" +
        "           <option value=\"14px\">14</option>" +
        "           <option value=\"16px\">16</option>" +
        "           <option value=\"18px\">18</option>" +
        "           <option value=\"20px\">20</option>" +
        "           <option value=\"22px\">22</option>" +
        "           <option value=\"24px\">24</option>" +
        "       </select>" +
        "       <input class=\"st-value\" data-command-name=\"fontColor\" name=\"css-border-color\" type=\"color\" value=\"#4D4D4D\" >\n" +
        "       <input class=\"st-value\" data-command-name=\"backgroundColor\" name=\"css-border-color\" type=\"color\" value=\"#4D4D4D\" >\n" +
        "       <button data-command-name=\"undo\">Undo</button>\n" +
        "       <button data-command-name=\"redo\" disabled=\"disabled\">Redo</button>\n" +
        "       <button data-command-name=\"cleanup\">Clean</button>\n" +
        "</div>";
    },

    build: function (toolbarNode) {
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
                // Look for a predefined command.
                var command = scribe.getCommand($elem.attr('data-command-name'));

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

                // TODO: set a val the $elem.css('???'); it is the computedStyle
            }
        };
    }
};





/**
 *
 */
SirTrevor.Blocks.TextEditor = SirTrevor.Blocks.Text.extend({
    type: 'text-editor',
    formatBar: false,
    options: {
        formatBar: false
    },
    // expose what kind of tags we allow!
    scribeOptions: {
        tags: {
            p: true,
            h1: true,
            h2: true,
            h3: true,
            h4: true,
            small: true,
            ul: true,
            ol: true,
            pepe: true,
            li: true,
            a: {
                href: true,
                style: true,
                target: '_blank',
                class: true
            },
            u: true,
            center: true,
            bold: true,
            strike: true
        }
    },

    editorHTML: "" +
        "<div>" +
            ScribeToolbarPlugin.getToolbarHtml() +
        "   <div class=\"st-required st-text-block\" contenteditable=\"true\"></div>" +
        "</div>",

    configureScribe: function(scribe) {
        var $toolbar = this.$editor.find('.toolbar');
        scribe.use(new ScribeFontTypePlugin());
        scribe.use(ScribeToolbarPlugin.build($toolbar[0]));
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
