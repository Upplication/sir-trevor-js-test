
var scribePluginToolbar = require("../../bower_components/scribe-plugin-toolbar/scribe-plugin-toolbar");

var ScribeHeaderPlugin = function(block) {
    return function (scribe) {
        var tag = '<h2>';
        var nodeName = 'H2';
        var commandName = 'h2';

        /**
         * Chrome: the `heading` command doesn't work. Supported by Firefox only.
         */

        var headingCommand = new scribe.api.Command('formatBlock');

        headingCommand.execute = function () {
            if (this.queryState()) {
                scribe.api.Command.prototype.execute.call(this, '<p>');
            } else {
                scribe.api.Command.prototype.execute.call(this, tag);
            }
        };

        headingCommand.queryState = function () {
            var selection = new scribe.api.Selection();
            return !! selection.getContaining(function (node) {
                return node.nodeName === nodeName;
            });
        };

        /**
         * All: Executing a heading command inside a list element corrupts the markup.
         * Disabling for now.
         */
        headingCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var listNode = selection.getContaining(function (node) {
                return node.nodeName === 'OL' || node.nodeName === 'UL';
            });

            return scribe.api.Command.prototype.queryEnabled.apply(this, arguments)
                && scribe.allowsBlockElements() && ! listNode;
        };

        scribe.commands[commandName] = headingCommand;
    };
};

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


var ScribeFontColorPlugin =  function () {
    return function (scribe) {
        var codeCommand = new scribe.api.SimpleCommand('fontColor', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        codeCommand.execute = function (value) {
            scribe.transactionManager.run(function () {
                var selection = new scribe.api.Selection();

                var parentNodeSelection = selection.selection.focusNode.parentNode,
                    $parentNodeSelection = jQuery(parentNodeSelection),
                    styleToApply = 'color:'+value+';',
                    style = $parentNodeSelection.attr('style');

                if (this.queryState(value)) {
                    var index = style.indexOf(styleToApply);
                    if (index != -1) {
                        styleToApply = style.substring(0, index) + style.substring(index+styleToApply.length, style.length)
                        $parentNodeSelection.attr('style', styleToApply);
                    }

                } else {
                    if (style){
                        style += styleToApply;
                    } else {
                        style = styleToApply;
                    }
                    $parentNodeSelection.attr('style', style);
                }
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @param value optional
         * @returns {boolean}
         */
        codeCommand.queryState = function (value) {
            var selection = new scribe.api.Selection();

            var currentStyle = 'color:';
            if (value) {
                currentStyle += value + ";";
            }

            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf(currentStyle) != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        codeCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
        };

        scribe.commands.fontColor = codeCommand;
    };
};

var ScribeBackgroundColorPlugin =  function () {
    return function (scribe) {
        var codeCommand = new scribe.api.SimpleCommand('fontColor', '');
        /**
         * Executed the command and set the style or remove if
         *
         * @param value
         */
        codeCommand.execute = function (value) {
            scribe.transactionManager.run(function () {
                var selection = new scribe.api.Selection();

                var parentNodeSelection = selection.selection.focusNode.parentNode,
                    $parentNodeSelection = jQuery(parentNodeSelection),
                    styleToApply = 'background:'+value+';';

                if (this.queryState(value)) {
                    var style = $parentNodeSelection.attr('style'),
                        index = style.indexOf(styleToApply);
                    if (index != -1) {
                        styleToApply = style.substring(0, index) + style.substring(index+styleToApply.length, style.length)
                        $parentNodeSelection.attr('style', styleToApply);
                    }

                } else {
                    var style = $parentNodeSelection.attr('style');
                    if (style){
                        style += styleToApply;
                    } else {
                        style = styleToApply;
                    }
                    $parentNodeSelection.attr('style', style);
                }
            }.bind(this));
        };

        /**
         * check the selection and return true if the command are already applied
         * or false if not.
         * @param value optional
         * @returns {boolean}
         */
        codeCommand.queryState = function (value) {
            var selection = new scribe.api.Selection();

            var currentStyle = 'background:';
            if (value) {
                currentStyle += value + ";";
            }

            return !! selection.getContaining(function (node) {
                var style = jQuery(node).attr('style');
                return style && style.indexOf(currentStyle) != -1;
            }.bind(this));
        };

        /**
         * check if we can use the command in the current selection
         * @returns {boolean}
         */
        codeCommand.queryEnabled = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            // TODO: Support uncollapsed ranges
            return ! range.collapsed;
        };

        scribe.commands.backgroundColor = codeCommand;
    };
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
            h2: true,
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
        "   <div class=\"toolbar\">\n" +
        "       <button data-command-name=\"bold\" disabled=\"disabled\">Bold</button>\n" +
        "       <button data-command-name=\"italic\" class=\"\" disabled=\"disabled\">Italic</button>\n" +
        "       <button data-command-name=\"underline\" disabled=\"disabled\">Underline</button>\n" +
        "       <button data-command-name=\"strikeThrough\" class=\"\" disabled=\"disabled\">Strike Through</button>\n" +
        "       <button data-command-name=\"removeFormat\" disabled=\"disabled\">Remove Formatting</button>\n" +
        "       <button data-command-name=\"linkPrompt\" disabled=\"disabled\">Link</button>\n" +
        "       <button data-command-name=\"unlink\" disabled=\"disabled\">Unlink</button>\n" +
        "       <button data-command-name=\"insertOrderedList\" disabled=\"disabled\">Ordered List</button>\n" +
        "       <button data-command-name=\"insertUnorderedList\" disabled=\"disabled\">Unordered List</button>\n" +
        "       <button data-command-name=\"indent\" disabled=\"disabled\">Indent</button>\n" +
        "       <button data-command-name=\"outdent\" disabled=\"disabled\">Outdent</button>\n" +
        "       <button data-command-name=\"blockquote\" disabled=\"disabled\">Blockquote</button>\n" +
        "       <button data-command-name=\"code\">Code</button>\n" +
        "       <button data-command-name=\"h2\" disabled=\"disabled\">H2</button>\n" +
        "       <button data-command-name=\"fontColor\" data-command-value=\"green\" disabled=\"disabled\">Font color</button>\n" +
        "       <button data-command-name=\"backgroundColor\" data-command-value=\"red\" disabled=\"disabled\">Background color</button>\n" +
        "       <button data-command-name=\"undo\">Undo</button>\n" +
        "       <button data-command-name=\"redo\" disabled=\"disabled\">Redo</button>\n" +
        "       <button data-command-name=\"cleanup\">Clean</button>\n" +
        "   </div>" +
        "   <div class=\"st-required st-text-block\" contenteditable=\"true\"></div>" +
        "</div>",

    configureScribe: function(scribe) {

        scribe.use(new ScribeHeaderPlugin(this));
        scribe.use(scribePluginToolbar(this.$editor.find('.toolbar')[0]));
        scribe.use(new ScribeFontColorPlugin());
        scribe.use(new ScribeRemoveSirTrevorBarPlugin(this));
        scribe.use(new ScribeBackgroundColorPlugin(this));
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
                    styles[i].indexOf("font-size:") != -1) {
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
