/* utilities.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

Object.type = function(obj, win)
{
    if (obj === null)
        return "null";

    var type = typeof obj;
    if (type !== "object" && type !== "function")
        return type;

    win = win || window;

    if (obj instanceof win.String)
        return "string";
    if (obj instanceof win.Array)
        return "array";
    if (obj instanceof win.Boolean)
        return "boolean";
    if (obj instanceof win.Number)
        return "number";
    if (obj instanceof win.Date)
        return "date";
    if (obj instanceof win.RegExp)
        return "regexp";
    if (obj instanceof win.Error)
        return "error";
    return type;
}

Object.hasProperties = function(obj)
{
    if (typeof obj === "undefined" || typeof obj === "null")
        return false;
    for (var name in obj)
        return true;
    return false;
}

Object.describe = function(obj, abbreviated)
{
    var type1 = Object.type(obj);
    var type2 = Object.prototype.toString.call(obj).replace(/^\[object (.*)\]$/i, "$1");

    switch (type1) {
    case "object":
        return type2;
    case "array":
        return "[" + obj.toString() + "]";
    case "string":
        if (obj.length > 100)
            return "\"" + obj.substring(0, 100) + "\u2026\"";
        return "\"" + obj + "\"";
    case "function":
        var objectText = String(obj);
        if (!/^function /.test(objectText))
            objectText = (type2 == "object") ? type1 : type2;
        else if (abbreviated)
            objectText = /.*/.exec(obj)[0].replace(/ +$/g, "");
        return objectText;
    case "regexp":
        return String(obj).replace(/([\\\/])/g, "\\$1").replace(/\\(\/[gim]*)$/, "$1").substring(1);
    default:
        return String(obj);
    }
}

Object.sortedProperties = function(obj)
{
    var properties = [];
    for (var prop in obj)
        properties.push(prop);
    properties.sort();
    return properties;
}

Function.prototype.bind = function(thisObject)
{
    var func = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() { return func.apply(thisObject, args.concat(Array.prototype.slice.call(arguments, 0))) };
}

Node.prototype.rangeOfWord = function(offset, stopCharacters, stayWithinNode, direction)
{
    var startNode;
    var startOffset = 0;
    var endNode;
    var endOffset = 0;

    if (!stayWithinNode)
        stayWithinNode = this;

    if (!direction || direction === "backward" || direction === "both") {
        var node = this;
        while (node) {
            if (node === stayWithinNode) {
                if (!startNode)
                    startNode = stayWithinNode;
                break;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                var start = (node === this ? (offset - 1) : (node.nodeValue.length - 1));
                for (var i = start; i >= 0; --i) {
                    if (stopCharacters.indexOf(node.nodeValue[i]) !== -1) {
                        startNode = node;
                        startOffset = i + 1;
                        break;
                    }
                }
            }

            if (startNode)
                break;

            node = node.traversePreviousNode(false, stayWithinNode);
        }

        if (!startNode) {
            startNode = stayWithinNode;
            startOffset = 0;
        }
    } else {
        startNode = this;
        startOffset = offset;
    }

    if (!direction || direction === "forward" || direction === "both") {
        node = this;
        while (node) {
            if (node === stayWithinNode) {
                if (!endNode)
                    endNode = stayWithinNode;
                break;
            }

            if (node.nodeType === Node.TEXT_NODE) {
                var start = (node === this ? offset : 0);
                for (var i = start; i < node.nodeValue.length; ++i) {
                    if (stopCharacters.indexOf(node.nodeValue[i]) !== -1) {
                        endNode = node;
                        endOffset = i;
                        break;
                    }
                }
            }

            if (endNode)
                break;

            node = node.traverseNextNode(false, stayWithinNode);
        }

        if (!endNode) {
            endNode = stayWithinNode;
            endOffset = stayWithinNode.nodeType === Node.TEXT_NODE ? stayWithinNode.nodeValue.length : stayWithinNode.childNodes.length;
        }
    } else {
        endNode = this;
        endOffset = offset;
    }

    var result = this.ownerDocument.createRange();
    result.setStart(startNode, startOffset);
    result.setEnd(endNode, endOffset);

    return result;
}

Element.prototype.removeStyleClass = function(className) 
{
    // Test for the simple case before using a RegExp.
    if (this.className === className) {
        this.className = "";
        return;
    }

    this.removeMatchingStyleClasses(className.escapeForRegExp());
}

Element.prototype.removeMatchingStyleClasses = function(classNameRegex)
{
    var regex = new RegExp("(^|\\s+)" + classNameRegex + "($|\\s+)");
    if (regex.test(this.className))
        this.className = this.className.replace(regex, " ");
}

Element.prototype.addStyleClass = function(className) 
{
    if (className && !this.hasStyleClass(className))
        this.className += (this.className.length ? " " + className : className);
}

Element.prototype.hasStyleClass = function(className) 
{
    if (!className)
        return false;
    // Test for the simple case before using a RegExp.
    if (this.className === className)
        return true;
    var regex = new RegExp("(^|\\s)" + className.escapeForRegExp() + "($|\\s)");
    return regex.test(this.className);
}

Node.prototype.enclosingNodeOrSelfWithNodeNameInArray = function(nameArray)
{
    for (var node = this; node && !objectsAreSame(node, this.ownerDocument); node = node.parentNode)
        for (var i = 0; i < nameArray.length; ++i)
            if (node.nodeName.toLowerCase() === nameArray[i].toLowerCase())
                return node;
    return null;
}

Node.prototype.enclosingNodeOrSelfWithNodeName = function(nodeName)
{
    return this.enclosingNodeOrSelfWithNodeNameInArray([nodeName]);
}

Node.prototype.enclosingNodeOrSelfWithClass = function(className)
{
    for (var node = this; node && !objectsAreSame(node, this.ownerDocument); node = node.parentNode)
        if (node.nodeType === Node.ELEMENT_NODE && node.hasStyleClass(className))
            return node;
    return null;
}

Node.prototype.enclosingNodeWithClass = function(className)
{
    if (!this.parentNode)
        return null;
    return this.parentNode.enclosingNodeOrSelfWithClass(className);
}

Element.prototype.query = function(query) 
{
    return this.ownerDocument.evaluate(query, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

Element.prototype.removeChildren = function()
{
    while (this.firstChild) 
        this.removeChild(this.firstChild);        
}

Element.prototype.isInsertionCaretInside = function()
{
    var selection = window.getSelection();
    if (!selection.rangeCount || !selection.isCollapsed)
        return false;
    var selectionRange = selection.getRangeAt(0);
    return selectionRange.startContainer === this || selectionRange.startContainer.isDescendant(this);
}

Element.prototype.__defineGetter__("totalOffsetLeft", function()
{
    var total = 0;
    for (var element = this; element; element = element.offsetParent)
        total += element.offsetLeft;
    return total;
});

Element.prototype.__defineGetter__("totalOffsetTop", function()
{
    var total = 0;
    for (var element = this; element; element = element.offsetParent)
        total += element.offsetTop;
    return total;
});

Element.prototype.firstChildSkippingWhitespace = firstChildSkippingWhitespace;
Element.prototype.lastChildSkippingWhitespace = lastChildSkippingWhitespace;

Node.prototype.isWhitespace = isNodeWhitespace;
Node.prototype.nodeTypeName = nodeTypeName;
Node.prototype.displayName = nodeDisplayName;
Node.prototype.contentPreview = nodeContentPreview;
Node.prototype.isAncestor = isAncestorNode;
Node.prototype.isDescendant = isDescendantNode;
Node.prototype.firstCommonAncestor = firstCommonNodeAncestor;
Node.prototype.nextSiblingSkippingWhitespace = nextSiblingSkippingWhitespace;
Node.prototype.previousSiblingSkippingWhitespace = previousSiblingSkippingWhitespace;
Node.prototype.traverseNextNode = traverseNextNode;
Node.prototype.traversePreviousNode = traversePreviousNode;
Node.prototype.onlyTextChild = onlyTextChild;

String.prototype.hasSubstring = function(string, caseInsensitive)
{
    if (!caseInsensitive)
        return this.indexOf(string) !== -1;
    return this.match(new RegExp(string.escapeForRegExp(), "i"));
}

String.prototype.escapeCharacters = function(chars)
{
    var foundChar = false;
    for (var i = 0; i < chars.length; ++i) {
        if (this.indexOf(chars.charAt(i)) !== -1) {
            foundChar = true;
            break;
        }
    }

    if (!foundChar)
        return this;

    var result = "";
    for (var i = 0; i < this.length; ++i) {
        if (chars.indexOf(this.charAt(i)) !== -1)
            result += "\\";
        result += this.charAt(i);
    }

    return result;
}

String.prototype.escapeForRegExp = function()
{
    return this.escapeCharacters("^[]{}()\\.$*+?|");
}

String.prototype.escapeHTML = function()
{
    return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

String.prototype.collapseWhitespace = function()
{
    return this.replace(/[\s\xA0]+/g, " ");
}

String.prototype.trimLeadingWhitespace = function()
{
    return this.replace(/^[\s\xA0]+/g, "");
}

String.prototype.trimTrailingWhitespace = function()
{
    return this.replace(/[\s\xA0]+$/g, "");
}

String.prototype.trimWhitespace = function()
{
    return this.replace(/^[\s\xA0]+|[\s\xA0]+$/g, "");
}

String.prototype.trimURL = function(baseURLDomain)
{
    var result = this.replace(new RegExp("^http[s]?:\/\/", "i"), "");
    if (baseURLDomain)
        result = result.replace(new RegExp("^" + baseURLDomain.escapeForRegExp(), "i"), "");
    return result;
}

function getStyleTextWithShorthands(style)
{
    var cssText = "";
    var foundProperties = {};
    for (var i = 0; i < style.length; ++i) {
        var individualProperty = style[i];
        var shorthandProperty = style.getPropertyShorthand(individualProperty);
        var propertyName = (shorthandProperty || individualProperty);

        if (propertyName in foundProperties)
            continue;

        if (shorthandProperty) {
            var value = getShorthandValue(style, shorthandProperty);
            var priority = getShorthandPriority(style, shorthandProperty);
        } else {
            var value = style.getPropertyValue(individualProperty);
            var priority = style.getPropertyPriority(individualProperty);
        }

        foundProperties[propertyName] = true;

        cssText += propertyName + ": " + value;
        if (priority)
            cssText += " !" + priority;
        cssText += "; ";
    }

    return cssText;
}

function getShorthandValue(style, shorthandProperty)
{
    var value = style.getPropertyValue(shorthandProperty);
    if (!value) {
        // Some shorthands (like border) return a null value, so compute a shorthand value.
        // FIXME: remove this when http://bugs.webkit.org/show_bug.cgi?id=15823 is fixed.

        var foundProperties = {};
        for (var i = 0; i < style.length; ++i) {
            var individualProperty = style[i];
            if (individualProperty in foundProperties || style.getPropertyShorthand(individualProperty) !== shorthandProperty)
                continue;

            var individualValue = style.getPropertyValue(individualProperty);
            if (style.isPropertyImplicit(individualProperty) || individualValue === "initial")
                continue;

            foundProperties[individualProperty] = true;

            if (!value)
                value = "";
            else if (value.length)
                value += " ";
            value += individualValue;
        }
    }
    return value;
}

function getShorthandPriority(style, shorthandProperty)
{
    var priority = style.getPropertyPriority(shorthandProperty);
    if (!priority) {
        for (var i = 0; i < style.length; ++i) {
            var individualProperty = style[i];
            if (style.getPropertyShorthand(individualProperty) !== shorthandProperty)
                continue;
            priority = style.getPropertyPriority(individualProperty);
            break;
        }
    }
    return priority;
}

function getLonghandProperties(style, shorthandProperty)
{
    var properties = [];
    var foundProperties = {};

    for (var i = 0; i < style.length; ++i) {
        var individualProperty = style[i];
        if (individualProperty in foundProperties || style.getPropertyShorthand(individualProperty) !== shorthandProperty)
            continue;
        foundProperties[individualProperty] = true;
        properties.push(individualProperty);
    }

    return properties;
}

function getUniqueStyleProperties(style)
{
    var properties = [];
    var foundProperties = {};

    for (var i = 0; i < style.length; ++i) {
        var property = style[i];
        if (property in foundProperties)
            continue;
        foundProperties[property] = true;
        properties.push(property);
    }

    return properties;
}

function isNodeWhitespace()
{
    if (!this || this.nodeType !== Node.TEXT_NODE)
        return false;
    if (!this.nodeValue.length)
        return true;
    return this.nodeValue.match(/^[\s\xA0]+$/);
}

function nodeTypeName()
{
    if (!this)
        return "(unknown)";

    switch (this.nodeType) {
        case Node.ELEMENT_NODE: return "Element";
        case Node.ATTRIBUTE_NODE: return "Attribute";
        case Node.TEXT_NODE: return "Text";
        case Node.CDATA_SECTION_NODE: return "Character Data";
        case Node.ENTITY_REFERENCE_NODE: return "Entity Reference";
        case Node.ENTITY_NODE: return "Entity";
        case Node.PROCESSING_INSTRUCTION_NODE: return "Processing Instruction";
        case Node.COMMENT_NODE: return "Comment";
        case Node.DOCUMENT_NODE: return "Document";
        case Node.DOCUMENT_TYPE_NODE: return "Document Type";
        case Node.DOCUMENT_FRAGMENT_NODE: return "Document Fragment";
        case Node.NOTATION_NODE: return "Notation";
    }

    return "(unknown)";
}

function nodeDisplayName()
{
    if (!this)
        return "";

    switch (this.nodeType) {
        case Node.DOCUMENT_NODE:
            return "Document";

        case Node.ELEMENT_NODE:
            var name = "<" + this.nodeName.toLowerCase();

            if (this.hasAttributes()) {
                var value = this.getAttribute("id");
                if (value)
                    name += " id=\"" + value + "\"";
                value = this.getAttribute("class");
                if (value)
                    name += " class=\"" + value + "\"";
                if (this.nodeName.toLowerCase() === "a") {
                    value = this.getAttribute("name");
                    if (value)
                        name += " name=\"" + value + "\"";
                    value = this.getAttribute("href");
                    if (value)
                        name += " href=\"" + value + "\"";
                } else if (this.nodeName.toLowerCase() === "img") {
                    value = this.getAttribute("src");
                    if (value)
                        name += " src=\"" + value + "\"";
                } else if (this.nodeName.toLowerCase() === "iframe") {
                    value = this.getAttribute("src");
                    if (value)
                        name += " src=\"" + value + "\"";
                } else if (this.nodeName.toLowerCase() === "input") {
                    value = this.getAttribute("name");
                    if (value)
                        name += " name=\"" + value + "\"";
                    value = this.getAttribute("type");
                    if (value)
                        name += " type=\"" + value + "\"";
                } else if (this.nodeName.toLowerCase() === "form") {
                    value = this.getAttribute("action");
                    if (value)
                        name += " action=\"" + value + "\"";
                }
            }

            return name + ">";

        case Node.TEXT_NODE:
            if (isNodeWhitespace.call(this))
                return "(whitespace)";
            return "\"" + this.nodeValue + "\"";

        case Node.COMMENT_NODE:
            return "<!--" + this.nodeValue + "-->";
            
        case Node.DOCUMENT_TYPE_NODE:
            var docType = "<!DOCTYPE " + this.nodeName;
            if (this.publicId) {
                docType += " PUBLIC \"" + this.publicId + "\"";
                if (this.systemId)
                    docType += " \"" + this.systemId + "\"";
            } else if (this.systemId)
                docType += " SYSTEM \"" + this.systemId + "\"";
            if (this.internalSubset)
                docType += " [" + this.internalSubset + "]";
            return docType + ">";
    }

    return this.nodeName.toLowerCase().collapseWhitespace();
}

function nodeContentPreview()
{
    if (!this || !this.hasChildNodes || !this.hasChildNodes())
        return "";

    var limit = 0;
    var preview = "";

    // always skip whitespace here
    var currentNode = traverseNextNode.call(this, true, this);
    while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE)
            preview += currentNode.nodeValue.escapeHTML();
        else
            preview += nodeDisplayName.call(currentNode).escapeHTML();

        currentNode = traverseNextNode.call(currentNode, true, this);

        if (++limit > 4) {
            preview += "&#x2026;"; // ellipsis
            break;
        }
    }

    return preview.collapseWhitespace();
}

function objectsAreSame(a, b)
{
    // FIXME: Make this more generic so is works with any wrapped object, not just nodes.
    // This function is used to compare nodes that might be JSInspectedObjectWrappers, since
    // JavaScript equality is not true for JSInspectedObjectWrappers of the same node wrapped
    // with different global ExecStates, we use isSameNode to compare them.
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    if (a.isSameNode && b.isSameNode)
        return a.isSameNode(b);
    return false;
}

function isAncestorNode(ancestor)
{
    if (!this || !ancestor)
        return false;

    var currentNode = ancestor.parentNode;
    while (currentNode) {
        if (objectsAreSame(this, currentNode))
            return true;
        currentNode = currentNode.parentNode;
    }

    return false;
}

function isDescendantNode(descendant)
{
    return isAncestorNode.call(descendant, this);
}

function firstCommonNodeAncestor(node)
{
    if (!this || !node)
        return;

    var node1 = this.parentNode;
    var node2 = node.parentNode;

    if ((!node1 || !node2) || !objectsAreSame(node1, node2))
        return null;

    while (node1 && node2) {
        if (!node1.parentNode || !node2.parentNode)
            break;
        if (!objectsAreSame(node1, node2))
            break;

        node1 = node1.parentNode;
        node2 = node2.parentNode;
    }

    return node1;
}

function nextSiblingSkippingWhitespace()
{
    if (!this)
        return;
    var node = this.nextSibling;
    while (node && node.nodeType === Node.TEXT_NODE && isNodeWhitespace.call(node))
        node = node.nextSibling;
    return node;
}

function previousSiblingSkippingWhitespace()
{
    if (!this)
        return;
    var node = this.previousSibling;
    while (node && node.nodeType === Node.TEXT_NODE && isNodeWhitespace.call(node))
        node = node.previousSibling;
    return node;
}

function firstChildSkippingWhitespace()
{
    if (!this)
        return;
    var node = this.firstChild;
    while (node && node.nodeType === Node.TEXT_NODE && isNodeWhitespace.call(node))
        node = nextSiblingSkippingWhitespace.call(node);
    return node;
}

function lastChildSkippingWhitespace()
{
    if (!this)
        return;
    var node = this.lastChild;
    while (node && node.nodeType === Node.TEXT_NODE && isNodeWhitespace.call(node))
        node = previousSiblingSkippingWhitespace.call(node);
    return node;
}

function traverseNextNode(skipWhitespace, stayWithin)
{
    if (!this)
        return;

    var node = skipWhitespace ? firstChildSkippingWhitespace.call(this) : this.firstChild;
    if (node)
        return node;

    if (stayWithin && objectsAreSame(this, stayWithin))
        return null;

    node = skipWhitespace ? nextSiblingSkippingWhitespace.call(this) : this.nextSibling;
    if (node)
        return node;

    node = this;
    while (node && !(skipWhitespace ? nextSiblingSkippingWhitespace.call(node) : node.nextSibling) && (!stayWithin || !node.parentNode || !objectsAreSame(node.parentNode, stayWithin)))
        node = node.parentNode;
    if (!node)
        return null;

    return skipWhitespace ? nextSiblingSkippingWhitespace.call(node) : node.nextSibling;
}

function traversePreviousNode(skipWhitespace, stayWithin)
{
    if (!this)
        return;
    if (stayWithin && objectsAreSame(this, stayWithin))
        return null;
    var node = skipWhitespace ? previousSiblingSkippingWhitespace.call(this) : this.previousSibling;
    while (node && (skipWhitespace ? lastChildSkippingWhitespace.call(node) : node.lastChild) )
        node = skipWhitespace ? lastChildSkippingWhitespace.call(node) : node.lastChild;
    if (node)
        return node;
    return this.parentNode;
}

function onlyTextChild(ignoreWhitespace)
{
    if (!this)
        return null;

    var firstChild = ignoreWhitespace ? firstChildSkippingWhitespace.call(this) : this.firstChild;
    if (!firstChild || firstChild.nodeType !== Node.TEXT_NODE)
        return null;

    var sibling = ignoreWhitespace ? nextSiblingSkippingWhitespace.call(firstChild) : firstChild.nextSibling;
    return sibling ? null : firstChild;
}

function nodeTitleInfo(hasChildren, linkify)
{
    var info = {title: "", hasChildren: hasChildren};

    switch (this.nodeType) {
        case Node.DOCUMENT_NODE:
            info.title = "Document";
            break;

        case Node.ELEMENT_NODE:
            info.title = "<span class=\"webkit-html-tag\">&lt;" + this.nodeName.toLowerCase().escapeHTML();

            if (this.hasAttributes()) {
                for (var i = 0; i < this.attributes.length; ++i) {
                    var attr = this.attributes[i];
                    info.title += " <span class=\"webkit-html-attribute\"><span class=\"webkit-html-attribute-name\">" + attr.name.escapeHTML() + "</span>=&#8203;\"";

                    var value = attr.value;
                    if (linkify && (attr.name === "src" || attr.name === "href")) {
                        var value = value.replace(/([\/;:\)\]\}])/g, "$1\u200B");
                        info.title += linkify(attr.value, value, "webkit-html-attribute-value", this.nodeName.toLowerCase() == "a");
                    } else {
                        var value = value.escapeHTML();
                        value = value.replace(/([\/;:\)\]\}])/g, "$1&#8203;");
                        info.title += "<span class=\"webkit-html-attribute-value\">" + value + "</span>";
                    }
                    info.title += "\"</span>";
                }
            }
            info.title += "&gt;</span>&#8203;";

            // If this element only has a single child that is a text node,
            // just show that text and the closing tag inline rather than
            // create a subtree for them

            var textChild = onlyTextChild.call(this, Preferences.ignoreWhitespace);
            var showInlineText = textChild && textChild.textContent.length < Preferences.maxInlineTextChildLength;

            if (showInlineText) {
                info.title += "<span class=\"webkit-html-text-node\">" + textChild.nodeValue.escapeHTML() + "</span>&#8203;<span class=\"webkit-html-tag\">&lt;/" + this.nodeName.toLowerCase().escapeHTML() + "&gt;</span>";
                info.hasChildren = false;
            }
            break;

        case Node.TEXT_NODE:
            if (isNodeWhitespace.call(this))
                info.title = "(whitespace)";
            else
                info.title = "\"<span class=\"webkit-html-text-node\">" + this.nodeValue.escapeHTML() + "</span>\"";
            break

        case Node.COMMENT_NODE:
            info.title = "<span class=\"webkit-html-comment\">&lt;!--" + this.nodeValue.escapeHTML() + "--&gt;</span>";
            break;

        case Node.DOCUMENT_TYPE_NODE:
            info.title = "<span class=\"webkit-html-doctype\">&lt;!DOCTYPE " + this.nodeName;
            if (this.publicId) {
                info.title += " PUBLIC \"" + this.publicId + "\"";
                if (this.systemId)
                    info.title += " \"" + this.systemId + "\"";
            } else if (this.systemId)
                info.title += " SYSTEM \"" + this.systemId + "\"";
            if (this.internalSubset)
                info.title += " [" + this.internalSubset + "]";
            info.title += "&gt;</span>";
            break;
        default:
            info.title = this.nodeName.toLowerCase().collapseWhitespace().escapeHTML();
    }

    return info;
}

function getDocumentForNode(node) {
    return node.nodeType == Node.DOCUMENT_NODE ? node : node.ownerDocument;
}

function parentNodeOrFrameElement(node) {
    var parent = node.parentNode;
    if (parent)
        return parent;

    return getDocumentForNode(node).defaultView.frameElement;
}

function isAncestorIncludingParentFrames(a, b) {
    if (objectsAreSame(a, b))
        return false;
    for (var node = b; node; node = getDocumentForNode(node).defaultView.frameElement)
        if (objectsAreSame(a, node) || isAncestorNode.call(a, node))
            return true;
    return false;
}

Number.secondsToString = function(seconds, formatterFunction, higherResolution)
{
    if (!formatterFunction)
        formatterFunction = String.sprintf;

    var ms = seconds * 1000;
    if (higherResolution && ms < 1000)
        return formatterFunction("%.3fms", ms);
    else if (ms < 1000)
        return formatterFunction("%.0fms", ms);

    if (seconds < 60)
        return formatterFunction("%.2fs", seconds);

    var minutes = seconds / 60;
    if (minutes < 60)
        return formatterFunction("%.1fmin", minutes);

    var hours = minutes / 60;
    if (hours < 24)
        return formatterFunction("%.1fhrs", hours);

    var days = hours / 24;
    return formatterFunction("%.1f days", days);
}

Number.bytesToString = function(bytes, formatterFunction)
{
    if (!formatterFunction)
        formatterFunction = String.sprintf;

    if (bytes < 1024)
        return formatterFunction("%.0fB", bytes);

    var kilobytes = bytes / 1024;
    if (kilobytes < 1024)
        return formatterFunction("%.2fKB", kilobytes);

    var megabytes = kilobytes / 1024;
    return formatterFunction("%.3fMB", megabytes);
}

Number.constrain = function(num, min, max)
{
    if (num < min)
        num = min;
    else if (num > max)
        num = max;
    return num;
}

HTMLTextAreaElement.prototype.moveCursorToEnd = function()
{
    var length = this.value.length;
    this.setSelectionRange(length, length);
}

Array.prototype.remove = function(value, onlyFirst)
{
    if (onlyFirst) {
        var index = this.indexOf(value);
        if (index !== -1)
            this.splice(index, 1);
        return;
    }

    var length = this.length;
    for (var i = 0; i < length; ++i) {
        if (this[i] === value)
            this.splice(i, 1);
    }
}

String.sprintf = function(format)
{
    return String.vsprintf(format, Array.prototype.slice.call(arguments, 1));
}

String.tokenizeFormatString = function(format)
{
    var tokens = [];
    var substitutionIndex = 0;

    function addStringToken(str)
    {
        tokens.push({ type: "string", value: str });
    }

    function addSpecifierToken(specifier, precision, substitutionIndex)
    {
        tokens.push({ type: "specifier", specifier: specifier, precision: precision, substitutionIndex: substitutionIndex });
    }

    var index = 0;
    for (var precentIndex = format.indexOf("%", index); precentIndex !== -1; precentIndex = format.indexOf("%", index)) {
        addStringToken(format.substring(index, precentIndex));
        index = precentIndex + 1;

        if (format[index] === "%") {
            addStringToken("%");
            ++index;
            continue;
        }

        if (!isNaN(format[index])) {
            // The first character is a number, it might be a substitution index.
            var number = parseInt(format.substring(index));
            while (!isNaN(format[index]))
                ++index;
            // If the number is greater than zero and ends with a "$",
            // then this is a substitution index.
            if (number > 0 && format[index] === "$") {
                substitutionIndex = (number - 1);
                ++index;
            }
        }

        var precision = -1;
        if (format[index] === ".") {
            // This is a precision specifier. If no digit follows the ".",
            // then the precision should be zero.
            ++index;
            precision = parseInt(format.substring(index));
            if (isNaN(precision))
                precision = 0;
            while (!isNaN(format[index]))
                ++index;
        }

        addSpecifierToken(format[index], precision, substitutionIndex);

        ++substitutionIndex;
        ++index;
    }

    addStringToken(format.substring(index));

    return tokens;
}

String.standardFormatters = {
    d: function(substitution)
    {
        substitution = parseInt(substitution);
        return !isNaN(substitution) ? substitution : 0;
    },

    f: function(substitution, token)
    {
        substitution = parseFloat(substitution);
        if (substitution && token.precision > -1)
            substitution = substitution.toFixed(token.precision);
        return !isNaN(substitution) ? substitution : (token.precision > -1 ? Number(0).toFixed(token.precision) : 0);
    },

    s: function(substitution)
    {
        return substitution;
    },
};

String.vsprintf = function(format, substitutions)
{
    return String.format(format, substitutions, String.standardFormatters, "", function(a, b) { return a + b; }).formattedResult;
}

String.format = function(format, substitutions, formatters, initialValue, append)
{
    if (!format || !substitutions || !substitutions.length)
        return { formattedResult: append(initialValue, format), unusedSubstitutions: substitutions };

    function prettyFunctionName()
    {
        return "String.format(\"" + format + "\", \"" + substitutions.join("\", \"") + "\")";
    }

    function warn(msg)
    {
        console.warn(prettyFunctionName() + ": " + msg);
    }

    function error(msg)
    {
        console.error(prettyFunctionName() + ": " + msg);
    }

    var result = initialValue;
    var tokens = String.tokenizeFormatString(format);
    var usedSubstitutionIndexes = {};

    for (var i = 0; i < tokens.length; ++i) {
        var token = tokens[i];

        if (token.type === "string") {
            result = append(result, token.value);
            continue;
        }

        if (token.type !== "specifier") {
            error("Unknown token type \"" + token.type + "\" found.");
            continue;
        }

        if (token.substitutionIndex >= substitutions.length) {
            // If there are not enough substitutions for the current substitutionIndex
            // just output the format specifier literally and move on.
            error("not enough substitution arguments. Had " + substitutions.length + " but needed " + (token.substitutionIndex + 1) + ", so substitution was skipped.");
            result = append(result, "%" + (token.precision > -1 ? token.precision : "") + token.specifier);
            continue;
        }

        usedSubstitutionIndexes[token.substitutionIndex] = true;

        if (!(token.specifier in formatters)) {
            // Encountered an unsupported format character, treat as a string.
            warn("unsupported format character \u201C" + token.specifier + "\u201D. Treating as a string.");
            result = append(result, substitutions[token.substitutionIndex]);
            continue;
        }

        result = append(result, formatters[token.specifier](substitutions[token.substitutionIndex], token));
    }

    var unusedSubstitutions = [];
    for (var i = 0; i < substitutions.length; ++i) {
        if (i in usedSubstitutionIndexes)
            continue;
        unusedSubstitutions.push(substitutions[i]);
    }

    return { formattedResult: result, unusedSubstitutions: unusedSubstitutions };
}
/* treeoutline.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function TreeOutline(listNode)
{
    this.children = [];
    this.selectedTreeElement = null;
    this._childrenListNode = listNode;
    this._childrenListNode.removeChildren();
    this._knownTreeElements = [];
    this._treeElementsExpandedState = [];
    this.expandTreeElementsWhenArrowing = false;
    this.root = true;
    this.hasChildren = false;
    this.expanded = true;
    this.selected = false;
    this.treeOutline = this;
}

TreeOutline._knownTreeElementNextIdentifier = 1;

TreeOutline._appendChild = function(child)
{
    if (!child)
        throw("child can't be undefined or null");

    var lastChild = this.children[this.children.length - 1];
    if (lastChild) {
        lastChild.nextSibling = child;
        child.previousSibling = lastChild;
    } else {
        child.previousSibling = null;
        child.nextSibling = null;
    }

    this.children.push(child);
    this.hasChildren = true;
    child.parent = this;
    child.treeOutline = this.treeOutline;
    child.treeOutline._rememberTreeElement(child);

    var current = child.children[0];
    while (current) {
        current.treeOutline = this.treeOutline;
        current.treeOutline._rememberTreeElement(current);
        current = current.traverseNextTreeElement(false, child, true);
    }

    if (child.hasChildren && child.treeOutline._treeElementsExpandedState[child.identifier] !== undefined)
        child.expanded = child.treeOutline._treeElementsExpandedState[child.identifier];

    if (!this._childrenListNode) {
        this._childrenListNode = this.treeOutline._childrenListNode.ownerDocument.createElement("ol");
        this._childrenListNode.parentTreeElement = this;
        this._childrenListNode.addStyleClass("children");
        if (this.hidden)
            this._childrenListNode.addStyleClass("hidden");
    }

    child._attach();
}

TreeOutline._insertChild = function(child, index)
{
    if (!child)
        throw("child can't be undefined or null");

    var previousChild = (index > 0 ? this.children[index - 1] : null);
    if (previousChild) {
        previousChild.nextSibling = child;
        child.previousSibling = previousChild;
    } else {
        child.previousSibling = null;
    }

    var nextChild = this.children[index];
    if (nextChild) {
        nextChild.previousSibling = child;
        child.nextSibling = nextChild;
    } else {
        child.nextSibling = null;
    }

    this.children.splice(index, 0, child);
    this.hasChildren = true;
    child.parent = this;
    child.treeOutline = this.treeOutline;
    child.treeOutline._rememberTreeElement(child);

    var current = child.children[0];
    while (current) {
        current.treeOutline = this.treeOutline;
        current.treeOutline._rememberTreeElement(current);
        current = current.traverseNextTreeElement(false, child, true);
    }

    if (child.hasChildren && child.treeOutline._treeElementsExpandedState[child.identifier] !== undefined)
        child.expanded = child.treeOutline._treeElementsExpandedState[child.identifier];

    if (!this._childrenListNode) {
        this._childrenListNode = this.treeOutline._childrenListNode.ownerDocument.createElement("ol");
        this._childrenListNode.parentTreeElement = this;
        this._childrenListNode.addStyleClass("children");
        if (this.hidden)
            this._childrenListNode.addStyleClass("hidden");
    }

    child._attach();
}

TreeOutline._removeChildAtIndex = function(childIndex)
{
    if (childIndex < 0 || childIndex >= this.children.length)
        throw("childIndex out of range");

    var child = this.children[childIndex];
    this.children.splice(childIndex, 1);

    child.deselect();

    if (child.previousSibling)
        child.previousSibling.nextSibling = child.nextSibling;
    if (child.nextSibling)
        child.nextSibling.previousSibling = child.previousSibling;

    if (child.treeOutline) {
        child.treeOutline._forgetTreeElement(child);
        child.treeOutline._forgetChildrenRecursive(child);
    }

    child._detach();
    child.treeOutline = null;
    child.parent = null;
    child.nextSibling = null;
    child.previousSibling = null;
}

TreeOutline._removeChild = function(child)
{
    if (!child)
        throw("child can't be undefined or null");

    var childIndex = this.children.indexOf(child);
    if (childIndex === -1)
        throw("child not found in this node's children");

    TreeOutline._removeChildAtIndex.call(this, childIndex);
}

TreeOutline._removeChildren = function()
{
    for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i];
        child.deselect();

        if (child.treeOutline) {
            child.treeOutline._forgetTreeElement(child);
            child.treeOutline._forgetChildrenRecursive(child);
        }

        child._detach();
        child.treeOutline = null;
        child.parent = null;
        child.nextSibling = null;
        child.previousSibling = null;
    }

    this.children = [];
}

TreeOutline._removeChildrenRecursive = function()
{
    var childrenToRemove = this.children;

    var child = this.children[0];
    while (child) {
        if (child.children.length)
            childrenToRemove = childrenToRemove.concat(child.children);
        child = child.traverseNextTreeElement(false, this, true);
    }

    for (var i = 0; i < childrenToRemove.length; ++i) {
        var child = childrenToRemove[i];
        child.deselect();
        if (child.treeOutline)
            child.treeOutline._forgetTreeElement(child);
        child._detach();
        child.children = [];
        child.treeOutline = null;
        child.parent = null;
        child.nextSibling = null;
        child.previousSibling = null;
    }

    this.children = [];
}

TreeOutline.prototype._rememberTreeElement = function(element)
{
    if (!this._knownTreeElements[element.identifier])
        this._knownTreeElements[element.identifier] = [];

    // check if the element is already known
    var elements = this._knownTreeElements[element.identifier];
    if (elements.indexOf(element) !== -1)
        return;

    // add the element
    elements.push(element);
}

TreeOutline.prototype._forgetTreeElement = function(element)
{
    if (this._knownTreeElements[element.identifier])
        this._knownTreeElements[element.identifier].remove(element, true);
}

TreeOutline.prototype._forgetChildrenRecursive = function(parentElement)
{
    var child = parentElement.children[0];
    while (child) {
        this._forgetTreeElement(child);
        child = child.traverseNextTreeElement(false, this, true);
    }
}

TreeOutline.prototype.findTreeElement = function(representedObject, isAncestor, getParent, equal)
{
    if (!representedObject)
        return null;

    if (!equal)
        equal = function(a, b) { return a === b };

    if ("__treeElementIdentifier" in representedObject) {
        // If this representedObject has a tree element identifier, and it is a known TreeElement
        // in our tree we can just return that tree element.
        var elements = this._knownTreeElements[representedObject.__treeElementIdentifier];
        if (elements) {
            for (var i = 0; i < elements.length; ++i)
                if (equal(elements[i].representedObject, representedObject))
                    return elements[i];
        }
    }

    if (!isAncestor || !(isAncestor instanceof Function) || !getParent || !(getParent instanceof Function))
        return null;

    // The representedObject isn't know, so we start at the top of the tree and work down to find the first
    // tree element that represents representedObject or one of its ancestors.
    var item;
    var found = false;
    for (var i = 0; i < this.children.length; ++i) {
        item = this.children[i];
        if (equal(item.representedObject, representedObject) || isAncestor(item.representedObject, representedObject)) {
            found = true;
            break;
        }
    }

    if (!found)
        return null;

    // Make sure the item that we found is connected to the root of the tree.
    // Build up a list of representedObject's ancestors that aren't already in our tree.
    var ancestors = [];
    var currentObject = representedObject;
    while (currentObject) {
        ancestors.unshift(currentObject);
        if (equal(currentObject, item.representedObject))
            break;
        currentObject = getParent(currentObject);
    }

    // For each of those ancestors we populate them to fill in the tree.
    for (var i = 0; i < ancestors.length; ++i) {
        // Make sure we don't call findTreeElement with the same representedObject
        // again, to prevent infinite recursion.
        if (equal(ancestors[i], representedObject))
            continue;
        // FIXME: we could do something faster than findTreeElement since we will know the next
        // ancestor exists in the tree.
        item = this.findTreeElement(ancestors[i], isAncestor, getParent, equal);
        if (item && item.onpopulate)
            item.onpopulate(item);
    }

    // Now that all the ancestors are populated, try to find the representedObject again. This time
    // without the isAncestor and getParent functions to prevent an infinite recursion if it isn't found.
    return this.findTreeElement(representedObject, null, null, equal);
}

TreeOutline.prototype.treeElementFromPoint = function(x, y)
{
    var node = this._childrenListNode.ownerDocument.elementFromPoint(x, y);
    var listNode = node.enclosingNodeOrSelfWithNodeNameInArray(["ol", "li"]);
    if (listNode)
        return listNode.parentTreeElement || listNode.treeElement;
    return null;
}

TreeOutline.prototype.handleKeyEvent = function(event)
{
    if (!this.selectedTreeElement || event.shiftKey || event.metaKey || event.ctrlKey)
        return false;

    var handled = false;
    var nextSelectedElement;
    if (event.keyIdentifier === "Up" && !event.altKey) {
        nextSelectedElement = this.selectedTreeElement.traversePreviousTreeElement(true);
        while (nextSelectedElement && !nextSelectedElement.selectable)
            nextSelectedElement = nextSelectedElement.traversePreviousTreeElement(!this.expandTreeElementsWhenArrowing);
        handled = nextSelectedElement ? true : false;
    } else if (event.keyIdentifier === "Down" && !event.altKey) {
        nextSelectedElement = this.selectedTreeElement.traverseNextTreeElement(true);
        while (nextSelectedElement && !nextSelectedElement.selectable)
            nextSelectedElement = nextSelectedElement.traverseNextTreeElement(!this.expandTreeElementsWhenArrowing);
        handled = nextSelectedElement ? true : false;
    } else if (event.keyIdentifier === "Left") {
        if (this.selectedTreeElement.expanded) {
            if (event.altKey)
                this.selectedTreeElement.collapseRecursively();
            else
                this.selectedTreeElement.collapse();
            handled = true;
        } else if (this.selectedTreeElement.parent && !this.selectedTreeElement.parent.root) {
            handled = true;
            if (this.selectedTreeElement.parent.selectable) {
                nextSelectedElement = this.selectedTreeElement.parent;
                handled = nextSelectedElement ? true : false;
            } else if (this.selectedTreeElement.parent)
                this.selectedTreeElement.parent.collapse();
        }
    } else if (event.keyIdentifier === "Right") {
        if (!this.selectedTreeElement.revealed()) {
            this.selectedTreeElement.reveal();
            handled = true;
        } else if (this.selectedTreeElement.hasChildren) {
            handled = true;
            if (this.selectedTreeElement.expanded) {
                nextSelectedElement = this.selectedTreeElement.children[0];
                handled = nextSelectedElement ? true : false;
            } else {
                if (event.altKey)
                    this.selectedTreeElement.expandRecursively();
                else
                    this.selectedTreeElement.expand();
            }
        }
    }

    if (nextSelectedElement) {
        nextSelectedElement.reveal();
        nextSelectedElement.select();
    }

    if (handled) {
        event.preventDefault();
        event.stopPropagation();
    }

    return handled;
}

TreeOutline.prototype.expand = function()
{
    // this is the root, do nothing
}

TreeOutline.prototype.collapse = function()
{
    // this is the root, do nothing
}

TreeOutline.prototype.revealed = function()
{
    return true;
}

TreeOutline.prototype.reveal = function()
{
    // this is the root, do nothing
}

TreeOutline.prototype.appendChild = TreeOutline._appendChild;
TreeOutline.prototype.insertChild = TreeOutline._insertChild;
TreeOutline.prototype.removeChild = TreeOutline._removeChild;
TreeOutline.prototype.removeChildAtIndex = TreeOutline._removeChildAtIndex;
TreeOutline.prototype.removeChildren = TreeOutline._removeChildren;
TreeOutline.prototype.removeChildrenRecursive = TreeOutline._removeChildrenRecursive;

function TreeElement(title, representedObject, hasChildren)
{
    this._title = title;
    this.representedObject = (representedObject || {});

    if (this.representedObject.__treeElementIdentifier)
        this.identifier = this.representedObject.__treeElementIdentifier;
    else {
        this.identifier = TreeOutline._knownTreeElementNextIdentifier++;
        this.representedObject.__treeElementIdentifier = this.identifier;
    }

    this._hidden = false;
    this.expanded = false;
    this.selected = false;
    this.hasChildren = hasChildren;
    this.children = [];
    this.treeOutline = null;
    this.parent = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this._listItemNode = null;
}

TreeElement.prototype = {
    selectable: true,
    arrowToggleWidth: 10,

    get listItemElement() {
        return this._listItemNode;
    },

    get childrenListElement() {
        return this._childrenListNode;
    },

    get title() {
        return this._title;
    },

    set title(x) {
        this._title = x;
        if (this._listItemNode)
            this._listItemNode.innerHTML = x;
    },

    get tooltip() {
        return this._tooltip;
    },

    set tooltip(x) {
        this._tooltip = x;
        if (this._listItemNode)
            this._listItemNode.title = x ? x : "";
    },

    get hasChildren() {
        return this._hasChildren;
    },

    set hasChildren(x) {
        if (this._hasChildren === x)
            return;

        this._hasChildren = x;

        if (!this._listItemNode)
            return;

        if (x)
            this._listItemNode.addStyleClass("parent");
        else {
            this._listItemNode.removeStyleClass("parent");
            this.collapse();
        }
    },

    get hidden() {
        return this._hidden;
    },

    set hidden(x) {
        if (this._hidden === x)
            return;

        this._hidden = x;

        if (x) {
            if (this._listItemNode)
                this._listItemNode.addStyleClass("hidden");
            if (this._childrenListNode)
                this._childrenListNode.addStyleClass("hidden");
        } else {
            if (this._listItemNode)
                this._listItemNode.removeStyleClass("hidden");
            if (this._childrenListNode)
                this._childrenListNode.removeStyleClass("hidden");
        }
    },

    get shouldRefreshChildren() {
        return this._shouldRefreshChildren;
    },

    set shouldRefreshChildren(x) {
        this._shouldRefreshChildren = x;
        if (x && this.expanded)
            this.expand();
    }
}

TreeElement.prototype.appendChild = TreeOutline._appendChild;
TreeElement.prototype.insertChild = TreeOutline._insertChild;
TreeElement.prototype.removeChild = TreeOutline._removeChild;
TreeElement.prototype.removeChildAtIndex = TreeOutline._removeChildAtIndex;
TreeElement.prototype.removeChildren = TreeOutline._removeChildren;
TreeElement.prototype.removeChildrenRecursive = TreeOutline._removeChildrenRecursive;

TreeElement.prototype._attach = function()
{
    if (!this._listItemNode || this.parent._shouldRefreshChildren) {
        if (this._listItemNode && this._listItemNode.parentNode)
            this._listItemNode.parentNode.removeChild(this._listItemNode);

        this._listItemNode = this.treeOutline._childrenListNode.ownerDocument.createElement("li");
        this._listItemNode.treeElement = this;
        this._listItemNode.innerHTML = this._title;
        this._listItemNode.title = this._tooltip ? this._tooltip : "";

        if (this.hidden)
            this._listItemNode.addStyleClass("hidden");
        if (this.hasChildren)
            this._listItemNode.addStyleClass("parent");
        if (this.expanded)
            this._listItemNode.addStyleClass("expanded");
        if (this.selected)
            this._listItemNode.addStyleClass("selected");

        this._listItemNode.addEventListener("mousedown", TreeElement.treeElementSelected, false);
        this._listItemNode.addEventListener("click", TreeElement.treeElementToggled, false);
        this._listItemNode.addEventListener("dblclick", TreeElement.treeElementDoubleClicked, false);

        if (this.onattach)
            this.onattach(this);
    }

    var nextSibling = null;
    if (this.nextSibling && this.nextSibling._listItemNode && this.nextSibling._listItemNode.parentNode === this.parent._childrenListNode)
        nextSibling = this.nextSibling._listItemNode;
    this.parent._childrenListNode.insertBefore(this._listItemNode, nextSibling);
    if (this._childrenListNode)
        this.parent._childrenListNode.insertBefore(this._childrenListNode, this._listItemNode.nextSibling);
    if (this.selected)
        this.select();
    if (this.expanded)
        this.expand();
}

TreeElement.prototype._detach = function()
{
    if (this._listItemNode && this._listItemNode.parentNode)
        this._listItemNode.parentNode.removeChild(this._listItemNode);
    if (this._childrenListNode && this._childrenListNode.parentNode)
        this._childrenListNode.parentNode.removeChild(this._childrenListNode);
}

TreeElement.treeElementSelected = function(event)
{
    var element = event.currentTarget;
    if (!element || !element.treeElement || !element.treeElement.selectable)
        return;

    if (element.treeElement.isEventWithinDisclosureTriangle(event))
        return;

    element.treeElement.select();
}

TreeElement.treeElementToggled = function(event)
{
    var element = event.currentTarget;
    if (!element || !element.treeElement)
        return;

    if (!element.treeElement.isEventWithinDisclosureTriangle(event))
        return;

    if (element.treeElement.expanded) {
        if (event.altKey)
            element.treeElement.collapseRecursively();
        else
            element.treeElement.collapse();
    } else {
        if (event.altKey)
            element.treeElement.expandRecursively();
        else
            element.treeElement.expand();
    }
}

TreeElement.treeElementDoubleClicked = function(event)
{
    var element = event.currentTarget;
    if (!element || !element.treeElement)
        return;

    if (element.treeElement.ondblclick)
        element.treeElement.ondblclick(element.treeElement, event);
    else if (element.treeElement.hasChildren && !element.treeElement.expanded)
        element.treeElement.expand();
}

TreeElement.prototype.collapse = function()
{
    if (this._listItemNode)
        this._listItemNode.removeStyleClass("expanded");
    if (this._childrenListNode)
        this._childrenListNode.removeStyleClass("expanded");

    this.expanded = false;
    if (this.treeOutline)
        this.treeOutline._treeElementsExpandedState[this.identifier] = true;

    if (this.oncollapse)
        this.oncollapse(this);
}

TreeElement.prototype.collapseRecursively = function()
{
    var item = this;
    while (item) {
        if (item.expanded)
            item.collapse();
        item = item.traverseNextTreeElement(false, this, true);
    }
}

TreeElement.prototype.expand = function()
{
    if (!this.hasChildren || (this.expanded && !this._shouldRefreshChildren && this._childrenListNode))
        return;

    if (this.treeOutline && (!this._childrenListNode || this._shouldRefreshChildren)) {
        if (this._childrenListNode && this._childrenListNode.parentNode)
            this._childrenListNode.parentNode.removeChild(this._childrenListNode);

        this._childrenListNode = this.treeOutline._childrenListNode.ownerDocument.createElement("ol");
        this._childrenListNode.parentTreeElement = this;
        this._childrenListNode.addStyleClass("children");

        if (this.hidden)
            this._childrenListNode.addStyleClass("hidden");

        if (this.onpopulate)
            this.onpopulate(this);

        for (var i = 0; i < this.children.length; ++i)
            this.children[i]._attach();

        delete this._shouldRefreshChildren;
    }

    if (this._listItemNode) {
        this._listItemNode.addStyleClass("expanded");
        if (this._childrenListNode && this._childrenListNode.parentNode != this._listItemNode.parentNode)
            this.parent._childrenListNode.insertBefore(this._childrenListNode, this._listItemNode.nextSibling);
    }

    if (this._childrenListNode)
        this._childrenListNode.addStyleClass("expanded");

    this.expanded = true;
    if (this.treeOutline)
        this.treeOutline._treeElementsExpandedState[this.identifier] = true;

    if (this.onexpand)
        this.onexpand(this);
}

TreeElement.prototype.expandRecursively = function(maxDepth)
{
    var item = this;
    var info = {};
    var depth = 0;

    // The Inspector uses TreeOutlines to represents object properties, so recursive expansion
    // in some case can be infinite, since JavaScript objects can hold circular references.
    // So default to a recursion cap of 3 levels, since that gives fairly good results.
    if (typeof maxDepth === "undefined" || typeof maxDepth === "null")
        maxDepth = 3;

    while (item) {
        if (depth < maxDepth)
            item.expand();
        item = item.traverseNextTreeElement(false, this, (depth >= maxDepth), info);
        depth += info.depthChange;
    }
}

TreeElement.prototype.hasAncestor = function(ancestor) {
    if (!ancestor)
        return false;

    var currentNode = this.parent;
    while (currentNode) {
        if (ancestor === currentNode)
            return true;
        currentNode = currentNode.parent;
    }

    return false;
}

TreeElement.prototype.reveal = function()
{
    var currentAncestor = this.parent;
    while (currentAncestor && !currentAncestor.root) {
        if (!currentAncestor.expanded)
            currentAncestor.expand();
        currentAncestor = currentAncestor.parent;
    }

    if (this.onreveal)
        this.onreveal(this);
}

TreeElement.prototype.revealed = function()
{
    var currentAncestor = this.parent;
    while (currentAncestor && !currentAncestor.root) {
        if (!currentAncestor.expanded)
            return false;
        currentAncestor = currentAncestor.parent;
    }

    return true;
}

TreeElement.prototype.select = function(supressOnSelect)
{
    if (!this.treeOutline || !this.selectable || this.selected)
        return;

    if (this.treeOutline.selectedTreeElement)
        this.treeOutline.selectedTreeElement.deselect();

    this.selected = true;
    this.treeOutline.selectedTreeElement = this;
    if (this._listItemNode)
        this._listItemNode.addStyleClass("selected");

    if (this.onselect && !supressOnSelect)
        this.onselect(this);
}

TreeElement.prototype.deselect = function(supressOnDeselect)
{
    if (!this.treeOutline || this.treeOutline.selectedTreeElement !== this || !this.selected)
        return;

    this.selected = false;
    this.treeOutline.selectedTreeElement = null;
    if (this._listItemNode)
        this._listItemNode.removeStyleClass("selected");

    if (this.ondeselect && !supressOnDeselect)
        this.ondeselect(this);
}

TreeElement.prototype.traverseNextTreeElement = function(skipHidden, stayWithin, dontPopulate, info)
{
    if (!dontPopulate && this.hasChildren && this.onpopulate)
        this.onpopulate(this);

    if (info)
        info.depthChange = 0;

    var element = skipHidden ? (this.revealed() ? this.children[0] : null) : this.children[0];
    if (element && (!skipHidden || (skipHidden && this.expanded))) {
        if (info)
            info.depthChange = 1;
        return element;
    }

    if (this === stayWithin)
        return null;

    element = skipHidden ? (this.revealed() ? this.nextSibling : null) : this.nextSibling;
    if (element)
        return element;

    element = this;
    while (element && !element.root && !(skipHidden ? (element.revealed() ? element.nextSibling : null) : element.nextSibling) && element.parent !== stayWithin) {
        if (info)
            info.depthChange -= 1;
        element = element.parent;
    }

    if (!element)
        return null;

    return (skipHidden ? (element.revealed() ? element.nextSibling : null) : element.nextSibling);
}

TreeElement.prototype.traversePreviousTreeElement = function(skipHidden, dontPopulate)
{
    var element = skipHidden ? (this.revealed() ? this.previousSibling : null) : this.previousSibling;
    if (!dontPopulate && element && element.hasChildren && element.onpopulate)
        element.onpopulate(element);

    while (element && (skipHidden ? (element.revealed() && element.expanded ? element.children[element.children.length - 1] : null) : element.children[element.children.length - 1])) {
        if (!dontPopulate && element.hasChildren && element.onpopulate)
            element.onpopulate(element);
        element = (skipHidden ? (element.revealed() && element.expanded ? element.children[element.children.length - 1] : null) : element.children[element.children.length - 1]);
    }

    if (element)
        return element;

    if (!this.parent || this.parent.root)
        return null;

    return this.parent;
}

TreeElement.prototype.isEventWithinDisclosureTriangle = function(event)
{
    var left = this._listItemNode.totalOffsetLeft;
    return event.pageX >= left && event.pageX <= left + this.arrowToggleWidth && this.hasChildren;
}
/* inspector.js */

/*
 * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2007 Matt Lilek (pewtermoose@gmail.com).
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var Preferences = {
    ignoreWhitespace: true,
    showUserAgentStyles: true,
    maxInlineTextChildLength: 80,
    minConsoleHeight: 75,
    minSidebarWidth: 100,
    minElementsSidebarWidth: 200,
    minScriptsSidebarWidth: 200,
    showInheritedComputedStyleProperties: false,
    styleRulesExpandedState: {},
    showMissingLocalizedStrings: false
}

var WebInspector = {
    resources: [],
    resourceURLMap: {},
    missingLocalizedStrings: {},

    get previousFocusElement()
    {
        return this._previousFocusElement;
    },

    get currentFocusElement()
    {
        return this._currentFocusElement;
    },

    set currentFocusElement(x)
    {
        if (this._currentFocusElement !== x)
            this._previousFocusElement = this._currentFocusElement;
        this._currentFocusElement = x;

        if (this._currentFocusElement) {
            this._currentFocusElement.focus();

            // Make a caret selection inside the new element if there isn't a range selection and
            // there isn't already a caret selection inside.
            var selection = window.getSelection();
            if (selection.isCollapsed && !this._currentFocusElement.isInsertionCaretInside()) {
                var selectionRange = document.createRange();
                selectionRange.setStart(this._currentFocusElement, 0);
                selectionRange.setEnd(this._currentFocusElement, 0);

                selection.removeAllRanges();
                selection.addRange(selectionRange);
            }
        } else if (this._previousFocusElement)
            this._previousFocusElement.blur();
    },

    get currentPanel()
    {
        return this._currentPanel;
    },

    set currentPanel(x)
    {
        if (this._currentPanel === x)
            return;

        if (this._currentPanel)
            this._currentPanel.hide();

        this._currentPanel = x;

        this.updateSearchLabel();

        if (x) {
            x.show();

            if (this.currentQuery) {
                if (x.performSearch) {
                    function performPanelSearch()
                    {
                        this.updateSearchMatchesCount();

                        x.currentQuery = this.currentQuery;
                        x.performSearch(this.currentQuery);
                    }

                    // Perform the search on a timeout so the panel switches fast.
                    setTimeout(performPanelSearch.bind(this), 0);
                } else {
                    // Update to show Not found for panels that can't be searched.
                    this.updateSearchMatchesCount();
                }
            }
        }
    },

    get attached()
    {
        return this._attached;
    },

    set attached(x)
    {
        if (this._attached === x)
            return;

        this._attached = x;

        this.updateSearchLabel();

        var dockToggleButton = document.getElementById("dock-status-bar-item");
        var body = document.body;

        if (x) {
            InspectorController.attach();
            body.removeStyleClass("detached");
            body.addStyleClass("attached");
            dockToggleButton.title = WebInspector.UIString("Undock into separate window.");
        } else {
            InspectorController.detach();
            body.removeStyleClass("attached");
            body.addStyleClass("detached");
            dockToggleButton.title = WebInspector.UIString("Dock to main window.");
        }
    },

    get errors()
    {
        return this._errors || 0;
    },

    set errors(x)
    {
        x = Math.max(x, 0);

        if (this._errors === x)
            return;
        this._errors = x;
        this._updateErrorAndWarningCounts();
    },

    get warnings()
    {
        return this._warnings || 0;
    },

    set warnings(x)
    {
        x = Math.max(x, 0);

        if (this._warnings === x)
            return;
        this._warnings = x;
        this._updateErrorAndWarningCounts();
    },

    _updateErrorAndWarningCounts: function()
    {
        var errorWarningElement = document.getElementById("error-warning-count");
        if (!errorWarningElement)
            return;

        if (!this.errors && !this.warnings) {
            errorWarningElement.addStyleClass("hidden");
            return;
        }

        errorWarningElement.removeStyleClass("hidden");

        errorWarningElement.removeChildren();

        if (this.errors) {
            var errorElement = document.createElement("span");
            errorElement.id = "error-count";
            errorElement.textContent = this.errors;
            errorWarningElement.appendChild(errorElement);
        }

        if (this.warnings) {
            var warningsElement = document.createElement("span");
            warningsElement.id = "warning-count";
            warningsElement.textContent = this.warnings;
            errorWarningElement.appendChild(warningsElement);
        }

        if (this.errors) {
            if (this.warnings) {
                if (this.errors == 1) {
                    if (this.warnings == 1)
                        errorWarningElement.title = WebInspector.UIString("%d error, %d warning", this.errors, this.warnings);
                    else
                        errorWarningElement.title = WebInspector.UIString("%d error, %d warnings", this.errors, this.warnings);
                } else if (this.warnings == 1)
                    errorWarningElement.title = WebInspector.UIString("%d errors, %d warning", this.errors, this.warnings);
                else
                    errorWarningElement.title = WebInspector.UIString("%d errors, %d warnings", this.errors, this.warnings);
            } else if (this.errors == 1)
                errorWarningElement.title = WebInspector.UIString("%d error", this.errors);
            else
                errorWarningElement.title = WebInspector.UIString("%d errors", this.errors);
        } else if (this.warnings == 1)
            errorWarningElement.title = WebInspector.UIString("%d warning", this.warnings);
        else if (this.warnings)
            errorWarningElement.title = WebInspector.UIString("%d warnings", this.warnings);
        else
            errorWarningElement.title = null;
    },

    get hoveredDOMNode()
    {
        return this._hoveredDOMNode;
    },

    set hoveredDOMNode(x)
    {
        if (objectsAreSame(this._hoveredDOMNode, x))
            return;

        this._hoveredDOMNode = x;

        if (this._hoveredDOMNode)
            this._updateHoverHighlightSoon(this.showingDOMNodeHighlight ? 50 : 500);
        else
            this._updateHoverHighlight();
    },

    _updateHoverHighlightSoon: function(delay)
    {
        if ("_updateHoverHighlightTimeout" in this)
            clearTimeout(this._updateHoverHighlightTimeout);
        this._updateHoverHighlightTimeout = setTimeout(this._updateHoverHighlight.bind(this), delay);
    },

    _updateHoverHighlight: function()
    {
        if ("_updateHoverHighlightTimeout" in this) {
            clearTimeout(this._updateHoverHighlightTimeout);
            delete this._updateHoverHighlightTimeout;
        }

        if (this._hoveredDOMNode) {
            InspectorController.highlightDOMNode(this._hoveredDOMNode);
            this.showingDOMNodeHighlight = true;
        } else {
            InspectorController.hideDOMNodeHighlight();
            this.showingDOMNodeHighlight = false;
        }
    }
}

WebInspector.loaded = function()
{
    var platform = InspectorController.platform();
    document.body.addStyleClass("platform-" + platform);

    this.console = new WebInspector.Console();
    this.panels = {
        elements: new WebInspector.ElementsPanel(),
        resources: new WebInspector.ResourcesPanel(),
        scripts: new WebInspector.ScriptsPanel(),
        profiles: new WebInspector.ProfilesPanel(),
        databases: new WebInspector.DatabasesPanel()
    };

    var toolbarElement = document.getElementById("toolbar");
    var previousToolbarItem = toolbarElement.children[0];

    for (var panelName in this.panels) {
        var panel = this.panels[panelName];
        var panelToolbarItem = panel.toolbarItem;
        panelToolbarItem.addEventListener("click", this._toolbarItemClicked.bind(this));
        if (previousToolbarItem)
            toolbarElement.insertBefore(panelToolbarItem, previousToolbarItem.nextSibling);
        else
            toolbarElement.insertBefore(panelToolbarItem, toolbarElement.firstChild);
        previousToolbarItem = panelToolbarItem;
    }

    this.currentPanel = this.panels.elements;

    this.resourceCategories = {
        documents: new WebInspector.ResourceCategory(WebInspector.UIString("Documents"), "documents"),
        stylesheets: new WebInspector.ResourceCategory(WebInspector.UIString("Stylesheets"), "stylesheets"),
        images: new WebInspector.ResourceCategory(WebInspector.UIString("Images"), "images"),
        scripts: new WebInspector.ResourceCategory(WebInspector.UIString("Scripts"), "scripts"),
        xhr: new WebInspector.ResourceCategory(WebInspector.UIString("XHR"), "xhr"),
        fonts: new WebInspector.ResourceCategory(WebInspector.UIString("Fonts"), "fonts"),
        other: new WebInspector.ResourceCategory(WebInspector.UIString("Other"), "other")
    };

    this.Tips = {
        ResourceNotCompressed: {id: 0, message: WebInspector.UIString("You could save bandwidth by having your web server compress this transfer with gzip or zlib.")}
    };

    this.Warnings = {
        IncorrectMIMEType: {id: 0, message: WebInspector.UIString("Resource interpreted as %s but transferred with MIME type %s.")}
    };

    this.addMainEventListeners(document);

    window.addEventListener("unload", this.windowUnload.bind(this), true);
    window.addEventListener("resize", this.windowResize.bind(this), true);

    document.addEventListener("focus", this.focusChanged.bind(this), true);
    document.addEventListener("keydown", this.documentKeyDown.bind(this), true);
    document.addEventListener("keyup", this.documentKeyUp.bind(this), true);
    document.addEventListener("beforecopy", this.documentCanCopy.bind(this), true);
    document.addEventListener("copy", this.documentCopy.bind(this), true);

    var mainPanelsElement = document.getElementById("main-panels");
    mainPanelsElement.handleKeyEvent = this.mainKeyDown.bind(this);
    mainPanelsElement.handleKeyUpEvent = this.mainKeyUp.bind(this);
    mainPanelsElement.handleCopyEvent = this.mainCopy.bind(this);

    // Focus the mainPanelsElement in a timeout so it happens after the initial focus,
    // so it doesn't get reset to the first toolbar button. This initial focus happens
    // on Mac when the window is made key and the WebHTMLView becomes the first responder.
    setTimeout(function() { WebInspector.currentFocusElement = mainPanelsElement }, 0);

    var dockToggleButton = document.getElementById("dock-status-bar-item");
    dockToggleButton.addEventListener("click", this.toggleAttach.bind(this), false);

    if (this.attached)
        dockToggleButton.title = WebInspector.UIString("Undock into separate window.");
    else
        dockToggleButton.title = WebInspector.UIString("Dock to main window.");

    var errorWarningCount = document.getElementById("error-warning-count");
    errorWarningCount.addEventListener("click", this.console.show.bind(this.console), false);
    this._updateErrorAndWarningCounts();

    var searchField = document.getElementById("search");
    searchField.addEventListener("keydown", this.searchKeyDown.bind(this), false);
    searchField.addEventListener("keyup", this.searchKeyUp.bind(this), false);
    searchField.addEventListener("search", this.performSearch.bind(this), false); // when the search is emptied

    document.getElementById("toolbar").addEventListener("mousedown", this.toolbarDragStart, true);
    document.getElementById("close-button").addEventListener("click", this.close, true);

    InspectorController.loaded();
}

var windowLoaded = function()
{
    var localizedStringsURL = InspectorController.localizedStringsURL();
    if (localizedStringsURL) {
        var localizedStringsScriptElement = document.createElement("script");
        localizedStringsScriptElement.addEventListener("load", WebInspector.loaded.bind(WebInspector), false);
        localizedStringsScriptElement.type = "text/javascript";
        localizedStringsScriptElement.src = localizedStringsURL;
        document.getElementsByTagName("head").item(0).appendChild(localizedStringsScriptElement);
    } else
        WebInspector.loaded();

    window.removeEventListener("load", windowLoaded, false);
    delete windowLoaded;
};

window.addEventListener("load", windowLoaded, false);

WebInspector.windowUnload = function(event)
{
    InspectorController.windowUnloading();
}

WebInspector.windowResize = function(event)
{
    if (this.currentPanel && this.currentPanel.resize)
        this.currentPanel.resize();
}

WebInspector.windowFocused = function(event)
{
    if (event.target.nodeType === Node.DOCUMENT_NODE)
        document.body.removeStyleClass("inactive");
}

WebInspector.windowBlured = function(event)
{
    if (event.target.nodeType === Node.DOCUMENT_NODE)
        document.body.addStyleClass("inactive");
}

WebInspector.focusChanged = function(event)
{
    this.currentFocusElement = event.target;
}

WebInspector.setAttachedWindow = function(attached)
{
    this.attached = attached;
}

WebInspector.close = function(event)
{
    InspectorController.closeWindow();
}

WebInspector.documentClick = function(event)
{
    var anchor = event.target.enclosingNodeOrSelfWithNodeName("a");
    if (!anchor)
        return;

    // Prevent the link from navigating, since we don't do any navigation by following links normally.
    event.preventDefault();

    function followLink()
    {
        // FIXME: support webkit-html-external-link links here.
        if (anchor.href in WebInspector.resourceURLMap) {
            if (anchor.hasStyleClass("webkit-html-external-link")) {
                anchor.removeStyleClass("webkit-html-external-link");
                anchor.addStyleClass("webkit-html-resource-link");
            }

            WebInspector.showResourceForURL(anchor.href, anchor.lineNumber, anchor.preferredPanel);
        } else {
            var profileStringRegEx = new RegExp("webkit-profile://.+/([0-9]+)");
            var profileString = profileStringRegEx.exec(anchor.href);
            if (profileString)
                WebInspector.showProfileById(profileString[1])
        }
    }

    if (WebInspector.followLinkTimeout)
        clearTimeout(WebInspector.followLinkTimeout);

    if (anchor.preventFollowOnDoubleClick) {
        // Start a timeout if this is the first click, if the timeout is canceled
        // before it fires, then a double clicked happened or another link was clicked.
        if (event.detail === 1)
            WebInspector.followLinkTimeout = setTimeout(followLink, 333);
        return;
    }

    followLink();
}

WebInspector.documentKeyDown = function(event)
{
    if (!this.currentFocusElement)
        return;
    if (this.currentFocusElement.handleKeyEvent)
        this.currentFocusElement.handleKeyEvent(event);
    else if (this.currentFocusElement.id && this.currentFocusElement.id.length && WebInspector[this.currentFocusElement.id + "KeyDown"])
        WebInspector[this.currentFocusElement.id + "KeyDown"](event);

    if (!event.handled) {
        var isMac = InspectorController.platform().indexOf("mac-") === 0;

        switch (event.keyIdentifier) {
            case "U+001B": // Escape key
                this.console.visible = !this.console.visible;
                event.preventDefault();
                break;

            case "U+0046": // F key
                if (isMac)
                    var isFindKey = event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
                else
                    var isFindKey = event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;

                if (isFindKey) {
                    var searchField = document.getElementById("search");
                    searchField.focus();
                    searchField.select();
                    event.preventDefault();
                }

                break;

            case "U+0047": // G key
                if (isMac)
                    var isFindAgainKey = event.metaKey && !event.ctrlKey && !event.altKey;
                else
                    var isFindAgainKey = event.ctrlKey && !event.metaKey && !event.altKey;

                if (isFindAgainKey) {
                    if (event.shiftKey) {
                        if (this.currentPanel.jumpToPreviousSearchResult)
                            this.currentPanel.jumpToPreviousSearchResult();
                    } else if (this.currentPanel.jumpToNextSearchResult)
                        this.currentPanel.jumpToNextSearchResult();
                    event.preventDefault();
                }

                break;
        }
    }
}

WebInspector.documentKeyUp = function(event)
{
    if (!this.currentFocusElement || !this.currentFocusElement.handleKeyUpEvent)
        return;
    this.currentFocusElement.handleKeyUpEvent(event);
}

WebInspector.documentCanCopy = function(event)
{
    if (!this.currentFocusElement)
        return;
    // Calling preventDefault() will say "we support copying, so enable the Copy menu".
    if (this.currentFocusElement.handleCopyEvent)
        event.preventDefault();
    else if (this.currentFocusElement.id && this.currentFocusElement.id.length && WebInspector[this.currentFocusElement.id + "Copy"])
        event.preventDefault();
}

WebInspector.documentCopy = function(event)
{
    if (!this.currentFocusElement)
        return;
    if (this.currentFocusElement.handleCopyEvent)
        this.currentFocusElement.handleCopyEvent(event);
    else if (this.currentFocusElement.id && this.currentFocusElement.id.length && WebInspector[this.currentFocusElement.id + "Copy"])
        WebInspector[this.currentFocusElement.id + "Copy"](event);
}

WebInspector.mainKeyDown = function(event)
{
    if (this.currentPanel && this.currentPanel.handleKeyEvent)
        this.currentPanel.handleKeyEvent(event);
}

WebInspector.mainKeyUp = function(event)
{
    if (this.currentPanel && this.currentPanel.handleKeyUpEvent)
        this.currentPanel.handleKeyUpEvent(event);
}

WebInspector.mainCopy = function(event)
{
    if (this.currentPanel && this.currentPanel.handleCopyEvent)
        this.currentPanel.handleCopyEvent(event);
}

WebInspector.animateStyle = function(animations, duration, callback, complete)
{
    if (complete === undefined)
        complete = 0;
    var slice = (1000 / 30); // 30 frames per second

    var defaultUnit = "px";
    var propertyUnit = {opacity: ""};

    for (var i = 0; i < animations.length; ++i) {
        var animation = animations[i];
        var element = null;
        var start = null;
        var current = null;
        var end = null;
        for (key in animation) {
            if (key === "element")
                element = animation[key];
            else if (key === "start")
                start = animation[key];
            else if (key === "current")
                current = animation[key];
            else if (key === "end")
                end = animation[key];
        }

        if (!element || !end)
            continue;

        var computedStyle = element.ownerDocument.defaultView.getComputedStyle(element);
        if (!start) {
            start = {};
            for (key in end)
                start[key] = parseInt(computedStyle.getPropertyValue(key));
            animation.start = start;
        } else if (complete == 0)
            for (key in start)
                element.style.setProperty(key, start[key] + (key in propertyUnit ? propertyUnit[key] : defaultUnit));

        if (!current) {
            current = {};
            for (key in start)
                current[key] = start[key];
            animation.current = current;
        }

        function cubicInOut(t, b, c, d)
        {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }

        var style = element.style;
        for (key in end) {
            var startValue = start[key];
            var currentValue = current[key];
            var endValue = end[key];
            if ((complete + slice) < duration) {
                var delta = (endValue - startValue) / (duration / slice);
                var newValue = cubicInOut(complete, startValue, endValue - startValue, duration);
                style.setProperty(key, newValue + (key in propertyUnit ? propertyUnit[key] : defaultUnit));
                current[key] = newValue;
            } else {
                style.setProperty(key, endValue + (key in propertyUnit ? propertyUnit[key] : defaultUnit));
            }
        }
    }

    if (complete < duration)
        setTimeout(WebInspector.animateStyle, slice, animations, duration, callback, complete + slice);
    else if (callback)
        callback();
}

WebInspector.updateSearchLabel = function()
{
    if (!this.currentPanel)
        return;

    var newLabel = WebInspector.UIString("Search %s", this.currentPanel.toolbarItemLabel);
    if (this.attached)
        document.getElementById("search").setAttribute("placeholder", newLabel);
    else {
        document.getElementById("search").removeAttribute("placeholder");
        document.getElementById("search-toolbar-label").textContent = newLabel;
    }
}

WebInspector.toggleAttach = function()
{
    this.attached = !this.attached;
}

WebInspector.toolbarDragStart = function(event)
{
    if (!WebInspector.attached && InspectorController.platform() !== "mac-leopard")
        return;

    var target = event.target;
    if (target.hasStyleClass("toolbar-item") && target.hasStyleClass("toggleable"))
        return;

    var toolbar = document.getElementById("toolbar");
    if (target !== toolbar && !target.hasStyleClass("toolbar-item"))
        return;

    toolbar.lastScreenX = event.screenX;
    toolbar.lastScreenY = event.screenY;

    WebInspector.elementDragStart(toolbar, WebInspector.toolbarDrag, WebInspector.toolbarDragEnd, event, (WebInspector.attached ? "row-resize" : "default"));
}

WebInspector.toolbarDragEnd = function(event)
{
    var toolbar = document.getElementById("toolbar");

    WebInspector.elementDragEnd(event);

    delete toolbar.lastScreenX;
    delete toolbar.lastScreenY;
}

WebInspector.toolbarDrag = function(event)
{
    var toolbar = document.getElementById("toolbar");

    if (WebInspector.attached) {
        var height = window.innerHeight - (event.screenY - toolbar.lastScreenY);

        InspectorController.setAttachedWindowHeight(height);
    } else {
        var x = event.screenX - toolbar.lastScreenX;
        var y = event.screenY - toolbar.lastScreenY;

        // We cannot call window.moveBy here because it restricts the movement
        // of the window at the edges.
        InspectorController.moveByUnrestricted(x, y);
    }

    toolbar.lastScreenX = event.screenX;
    toolbar.lastScreenY = event.screenY;

    event.preventDefault();
}

WebInspector.elementDragStart = function(element, dividerDrag, elementDragEnd, event, cursor) 
{
    if (this._elementDraggingEventListener || this._elementEndDraggingEventListener)
        this.elementDragEnd(event);

    this._elementDraggingEventListener = dividerDrag;
    this._elementEndDraggingEventListener = elementDragEnd;

    document.addEventListener("mousemove", dividerDrag, true);
    document.addEventListener("mouseup", elementDragEnd, true);

    document.body.style.cursor = cursor;

    event.preventDefault();
}

WebInspector.elementDragEnd = function(event)
{
    document.removeEventListener("mousemove", this._elementDraggingEventListener, true);
    document.removeEventListener("mouseup", this._elementEndDraggingEventListener, true);

    document.body.style.removeProperty("cursor");

    delete this._elementDraggingEventListener;
    delete this._elementEndDraggingEventListener;

    event.preventDefault();
}

WebInspector.showConsole = function()
{
    this.console.show();
}

WebInspector.showElementsPanel = function()
{
    this.currentPanel = this.panels.elements;
}

WebInspector.showResourcesPanel = function()
{
    this.currentPanel = this.panels.resources;
}

WebInspector.showScriptsPanel = function()
{
    this.currentPanel = this.panels.scripts;
}

WebInspector.showProfilesPanel = function()
{
    this.currentPanel = this.panels.profiles;
}

WebInspector.showDatabasesPanel = function()
{
    this.currentPanel = this.panels.databases;
}

WebInspector.addResource = function(resource)
{
    this.resources.push(resource);
    this.resourceURLMap[resource.url] = resource;

    if (resource.mainResource) {
        this.mainResource = resource;
        this.panels.elements.reset();
    }

    this.panels.resources.addResource(resource);
}

WebInspector.removeResource = function(resource)
{
    resource.category.removeResource(resource);
    delete this.resourceURLMap[resource.url];

    this.resources.remove(resource, true);

    this.panels.resources.removeResource(resource);
}

WebInspector.addDatabase = function(database)
{
    this.panels.databases.addDatabase(database);
}

WebInspector.debuggerWasEnabled = function()
{
    this.panels.scripts.debuggerWasEnabled();
}

WebInspector.debuggerWasDisabled = function()
{
    this.panels.scripts.debuggerWasDisabled();
}

WebInspector.profilerWasEnabled = function()
{
    this.panels.profiles.profilerWasEnabled();
}

WebInspector.profilerWasDisabled = function()
{
    this.panels.profiles.profilerWasDisabled();
}

WebInspector.parsedScriptSource = function(sourceID, sourceURL, source, startingLine)
{
    this.panels.scripts.addScript(sourceID, sourceURL, source, startingLine);
}

WebInspector.failedToParseScriptSource = function(sourceURL, source, startingLine, errorLine, errorMessage)
{
    this.panels.scripts.addScript(null, sourceURL, source, startingLine, errorLine, errorMessage);
}

WebInspector.pausedScript = function()
{
    this.panels.scripts.debuggerPaused();
}

WebInspector.populateInterface = function()
{
    for (var panelName in this.panels) {
        var panel = this.panels[panelName];
        if ("populateInterface" in panel)
            panel.populateInterface();
    }
}

WebInspector.reset = function()
{
    for (var panelName in this.panels) {
        var panel = this.panels[panelName];
        if ("reset" in panel)
            panel.reset();
    }

    for (var category in this.resourceCategories)
        this.resourceCategories[category].removeAllResources();

    this.resources = [];
    this.resourceURLMap = {};
    this.hoveredDOMNode = null;

    delete this.mainResource;

    this.console.clearMessages();
}

WebInspector.inspectedWindowCleared = function(inspectedWindow)
{
    this.panels.elements.inspectedWindowCleared(inspectedWindow);
}

WebInspector.resourceURLChanged = function(resource, oldURL)
{
    delete this.resourceURLMap[oldURL];
    this.resourceURLMap[resource.url] = resource;
}

WebInspector.addMessageToConsole = function(msg)
{
    this.console.addMessage(msg);
}

WebInspector.addProfile = function(profile)
{
    this.panels.profiles.addProfile(profile);
}

WebInspector.setRecordingProfile = function(isProfiling)
{
    this.panels.profiles.setRecordingProfile(isProfiling);
}

WebInspector.drawLoadingPieChart = function(canvas, percent) {
    var g = canvas.getContext("2d");
    var darkColor = "rgb(122, 168, 218)";
    var lightColor = "rgb(228, 241, 251)";
    var cx = 8;
    var cy = 8;
    var r = 7;

    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2, false); 
    g.closePath();

    g.lineWidth = 1;
    g.strokeStyle = darkColor;
    g.fillStyle = lightColor;
    g.fill();
    g.stroke();

    var startangle = -Math.PI / 2;
    var endangle = startangle + (percent * Math.PI * 2);

    g.beginPath();
    g.moveTo(cx, cy);
    g.arc(cx, cy, r, startangle, endangle, false); 
    g.closePath();

    g.fillStyle = darkColor;
    g.fill();
}

WebInspector.updateFocusedNode = function(node)
{
    if (!node)
        // FIXME: Should we deselect if null is passed in?
        return;

    this.currentPanel = this.panels.elements;
    this.panels.elements.focusedDOMNode = node;
}

WebInspector.displayNameForURL = function(url)
{
    if (!url)
        return "";
    var resource = this.resourceURLMap[url];
    if (resource)
        return resource.displayName;
    return url.trimURL(WebInspector.mainResource ? WebInspector.mainResource.domain : "");
}

WebInspector.resourceForURL = function(url)
{
    if (url in this.resourceURLMap)
        return this.resourceURLMap[url];

    // No direct match found. Search for resources that contain
    // a substring of the URL.
    for (var resourceURL in this.resourceURLMap) {
        if (resourceURL.hasSubstring(url))
            return this.resourceURLMap[resourceURL];
    }

    return null;
}

WebInspector.showResourceForURL = function(url, line, preferredPanel)
{
    var resource = this.resourceForURL(url);
    if (!resource)
        return false;

    if (preferredPanel && preferredPanel in WebInspector.panels) {
        var panel = this.panels[preferredPanel];
        if (!("showResource" in panel))
            panel = null;
        else if ("canShowResource" in panel && !panel.canShowResource(resource))
            panel = null;
    }

    this.currentPanel = panel || this.panels.resources;
    this.currentPanel.showResource(resource, line);
    return true;
}

WebInspector.linkifyStringAsFragment = function(string)
{
    var container = document.createDocumentFragment();
    var linkStringRegEx = new RegExp("(?:[a-zA-Z][a-zA-Z0-9+.-]{2,}://|www\\.)[\\w$\\-_+*'=\\|/\\\\(){}[\\]%@&#~,:;.!?]{2,}[\\w$\\-_+*=\\|/\\\\({%@&#~]");

    while (string) {
        var linkString = linkStringRegEx.exec(string);
        if (!linkString)
            break;

        linkString = linkString[0];
        var title = linkString;
        var linkIndex = string.indexOf(linkString);
        var nonLink = string.substring(0, linkIndex);
        container.appendChild(document.createTextNode(nonLink));

        var profileStringRegEx = new RegExp("webkit-profile://(.+)/[0-9]+");
        var profileStringMatches = profileStringRegEx.exec(title);
        var profileTitle;
        if (profileStringMatches)
            profileTitle = profileStringMatches[1];
        if (profileTitle)
            title = WebInspector.panels.profiles.displayTitleForProfileLink(profileTitle);

        var realURL = (linkString.indexOf("www.") === 0 ? "http://" + linkString : linkString);
        container.appendChild(WebInspector.linkifyURLAsNode(realURL, title, null, (realURL in WebInspector.resourceURLMap)));
        string = string.substring(linkIndex + linkString.length, string.length);
    }

    if (string)
        container.appendChild(document.createTextNode(string));

    return container;
}

WebInspector.showProfileById = function(uid) {
    WebInspector.showProfilesPanel();
    WebInspector.panels.profiles.showProfileById(uid);
}

WebInspector.linkifyURLAsNode = function(url, linkText, classes, isExternal)
{
    if (!linkText)
        linkText = url;
    classes = (classes ? classes + " " : "");
    classes += isExternal ? "webkit-html-external-link" : "webkit-html-resource-link";

    var a = document.createElement("a");
    a.href = url;
    a.className = classes;
    a.title = url;
    a.target = "_blank";
    a.textContent = linkText;
    
    return a;
}

WebInspector.linkifyURL = function(url, linkText, classes, isExternal)
{
    // Use the DOM version of this function so as to avoid needing to escape attributes.
    // FIXME:  Get rid of linkifyURL entirely.
    return WebInspector.linkifyURLAsNode(url, linkText, classes, isExternal).outerHTML;
}

WebInspector.addMainEventListeners = function(doc)
{
    doc.defaultView.addEventListener("focus", this.windowFocused.bind(this), true);
    doc.defaultView.addEventListener("blur", this.windowBlured.bind(this), true);
    doc.addEventListener("click", this.documentClick.bind(this), true);
}

WebInspector.searchKeyDown = function(event)
{
    if (event.keyIdentifier !== "Enter")
        return;

    // Call preventDefault since this was the Enter key. This prevents a "search" event
    // from firing for key down. We handle the Enter key on key up in searchKeyUp. This
    // stops performSearch from being called twice in a row.
    event.preventDefault();
}

WebInspector.searchKeyUp = function(event)
{
    if (event.keyIdentifier !== "Enter")
        return;

    // Select all of the text so the user can easily type an entirely new query.
    event.target.select();

    // Only call performSearch if the Enter key was pressed. Otherwise the search
    // performance is poor because of searching on every key. The search field has
    // the incremental attribute set, so we still get incremental searches.
    this.performSearch(event);
}

WebInspector.performSearch = function(event)
{
    var query = event.target.value;
    var forceSearch = event.keyIdentifier === "Enter";

    if (!query || !query.length || (!forceSearch && query.length < 3)) {
        delete this.currentQuery;

        for (var panelName in this.panels) {
            var panel = this.panels[panelName];
            if (panel.currentQuery && panel.searchCanceled)
                panel.searchCanceled();
            delete panel.currentQuery;
        }

        this.updateSearchMatchesCount();

        return;
    }

    if (query === this.currentPanel.currentQuery && this.currentPanel.currentQuery === this.currentQuery) {
        // When this is the same query and a forced search, jump to the next
        // search result for a good user experience.
        if (forceSearch && this.currentPanel.jumpToNextSearchResult)
            this.currentPanel.jumpToNextSearchResult();
        return;
    }

    this.currentQuery = query;

    this.updateSearchMatchesCount();

    if (!this.currentPanel.performSearch)
        return;

    this.currentPanel.currentQuery = query;
    this.currentPanel.performSearch(query);
}

WebInspector.updateSearchMatchesCount = function(matches, panel)
{
    if (!panel)
        panel = this.currentPanel;

    panel.currentSearchMatches = matches;

    if (panel !== this.currentPanel)
        return;

    if (!this.currentPanel.currentQuery) {
        document.getElementById("search-results-matches").addStyleClass("hidden");
        return;
    }

    if (matches) {
        if (matches === 1)
            var matchesString = WebInspector.UIString("1 match");
        else
            var matchesString = WebInspector.UIString("%d matches", matches);
    } else
        var matchesString = WebInspector.UIString("Not Found");

    var matchesToolbarElement = document.getElementById("search-results-matches");
    matchesToolbarElement.removeStyleClass("hidden");
    matchesToolbarElement.textContent = matchesString;
}

WebInspector.UIString = function(string)
{
    if (window.localizedStrings && string in window.localizedStrings)
        string = window.localizedStrings[string];
    else {
        if (!(string in this.missingLocalizedStrings)) {
            console.error("Localized string \"" + string + "\" not found.");
            this.missingLocalizedStrings[string] = true;
        }

        if (Preferences.showMissingLocalizedStrings)
            string += " (not localized)";
    }

    return String.vsprintf(string, Array.prototype.slice.call(arguments, 1));
}

WebInspector.isBeingEdited = function(element)
{
    return element.__editing;
}

WebInspector.startEditing = function(element, committedCallback, cancelledCallback, context)
{
    if (element.__editing)
        return;
    element.__editing = true;

    var oldText = element.textContent;
    var oldHandleKeyEvent = element.handleKeyEvent;

    element.addStyleClass("editing");

    var oldTabIndex = element.tabIndex;
    if (element.tabIndex < 0)
        element.tabIndex = 0;

    function blurEventListener() {
        editingCommitted.call(element);
    }

    function cleanUpAfterEditing() {
        delete this.__editing;

        this.removeStyleClass("editing");
        this.tabIndex = oldTabIndex;
        this.scrollTop = 0;
        this.scrollLeft = 0;

        this.handleKeyEvent = oldHandleKeyEvent;
        element.removeEventListener("blur", blurEventListener, false);

        if (element === WebInspector.currentFocusElement || element.isAncestor(WebInspector.currentFocusElement))
            WebInspector.currentFocusElement = WebInspector.previousFocusElement;
    }

    function editingCancelled() {
        this.innerText = oldText;

        cleanUpAfterEditing.call(this);

        cancelledCallback(this, context);
    }

    function editingCommitted() {
        cleanUpAfterEditing.call(this);

        committedCallback(this, this.textContent, oldText, context);
    }

    element.handleKeyEvent = function(event) {
        if (oldHandleKeyEvent)
            oldHandleKeyEvent(event);
        if (event.handled)
            return;

        if (event.keyIdentifier === "Enter") {
            editingCommitted.call(element);
            event.preventDefault();
        } else if (event.keyCode === 27) { // Escape key
            editingCancelled.call(element);
            event.preventDefault();
            event.handled = true;
        }
    }

    element.addEventListener("blur", blurEventListener, false);

    WebInspector.currentFocusElement = element;
}

WebInspector._toolbarItemClicked = function(event)
{
    var toolbarItem = event.currentTarget;
    this.currentPanel = toolbarItem.panel;
}

// This table maps MIME types to the Resource.Types which are valid for them.
// The following line:
//    "text/html":                {0: 1},
// means that text/html is a valid MIME type for resources that have type
// WebInspector.Resource.Type.Document (which has a value of 0).
WebInspector.MIMETypes = {
    "text/html":                   {0: true},
    "text/xml":                    {0: true},
    "text/plain":                  {0: true},
    "application/xhtml+xml":       {0: true},
    "text/css":                    {1: true},
    "text/xsl":                    {1: true},
    "image/jpeg":                  {2: true},
    "image/png":                   {2: true},
    "image/gif":                   {2: true},
    "image/bmp":                   {2: true},
    "image/x-icon":                {2: true},
    "image/x-xbitmap":             {2: true},
    "font/ttf":                    {3: true},
    "font/opentype":               {3: true},
    "application/x-font-type1":    {3: true},
    "application/x-font-ttf":      {3: true},
    "application/x-truetype-font": {3: true},
    "text/javascript":             {4: true},
    "text/ecmascript":             {4: true},
    "application/javascript":      {4: true},
    "application/ecmascript":      {4: true},
    "application/x-javascript":    {4: true},
    "text/javascript1.1":          {4: true},
    "text/javascript1.2":          {4: true},
    "text/javascript1.3":          {4: true},
    "text/jscript":                {4: true},
    "text/livescript":             {4: true},
}
/* Object.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Object = function() {
}

WebInspector.Object.prototype = {
    addEventListener: function(eventType, listener, thisObject) {
        if (!("_listeners" in this))
            this._listeners = {};
        if (!(eventType in this._listeners))
            this._listeners[eventType] = [];
        this._listeners[eventType].push({ thisObject: thisObject, listener: listener });
    },

    removeEventListener: function(eventType, listener, thisObject) {
        if (!("_listeners" in this) || !(eventType in this._listeners))
            return;
        var listeners = this._listeners[eventType];
        for (var i = 0; i < listeners.length; ++i) {
            if (listener && listeners[i].listener === listener && listeners[i].thisObject === thisObject)
                listeners.splice(i, 1);
            else if (!listener && thisObject && listeners[i].thisObject === thisObject)
                listeners.splice(i, 1);
        }

        if (!listeners.length)
            delete this._listeners[eventType];
    },

    dispatchEventToListeners: function(eventType) {
        if (!("_listeners" in this) || !(eventType in this._listeners))
            return;

        var stoppedPropagation = false;

        function stopPropagation()
        {
            stoppedPropagation = true;
        }

        function preventDefault()
        {
            this.defaultPrevented = true;
        }

        var event = {target: this, type: eventType, defaultPrevented: false};
        event.stopPropagation = stopPropagation.bind(event);
        event.preventDefault = preventDefault.bind(event);

        var listeners = this._listeners[eventType];
        for (var i = 0; i < listeners.length; ++i) {
            listeners[i].listener.call(listeners[i].thisObject, event);
            if (stoppedPropagation)
                break;
        }

        return event.defaultPrevented;
    }
}
/* TextPrompt.js */

/*
 * Copyright (C) 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.TextPrompt = function(element, completions, stopCharacters)
{
    this.element = element;
    this.completions = completions;
    this.completionStopCharacters = stopCharacters;
    this.history = [];
    this.historyOffset = 0;
}

WebInspector.TextPrompt.prototype = {
    get text()
    {
        return this.element.textContent;
    },

    set text(x)
    {
        if (!x) {
            // Append a break element instead of setting textContent to make sure the selection is inside the prompt.
            this.element.removeChildren();
            this.element.appendChild(document.createElement("br"));
        } else
            this.element.textContent = x;

        this.moveCaretToEndOfPrompt();
    },

    handleKeyEvent: function(event)
    {
        switch (event.keyIdentifier) {
            case "Up":
                this._upKeyPressed(event);
                break;
            case "Down":
                this._downKeyPressed(event);
                break;
            case "U+0009": // Tab
                this._tabKeyPressed(event);
                break;
            case "Right":
                if (!this.acceptAutoComplete())
                    this.autoCompleteSoon();
                break;
            default:
                this.clearAutoComplete();
                this.autoCompleteSoon();
                break;
        }
    },

    acceptAutoComplete: function()
    {
        if (!this.autoCompleteElement || !this.autoCompleteElement.parentNode)
            return false;

        var text = this.autoCompleteElement.textContent;
        var textNode = document.createTextNode(text);
        this.autoCompleteElement.parentNode.replaceChild(textNode, this.autoCompleteElement);
        delete this.autoCompleteElement;

        var finalSelectionRange = document.createRange();
        finalSelectionRange.setStart(textNode, text.length);
        finalSelectionRange.setEnd(textNode, text.length);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(finalSelectionRange);

        return true;
    },

    clearAutoComplete: function(includeTimeout)
    {
        if (includeTimeout && "_completeTimeout" in this) {
            clearTimeout(this._completeTimeout);
            delete this._completeTimeout;
        }

        if (!this.autoCompleteElement)
            return;

        if (this.autoCompleteElement.parentNode)
            this.autoCompleteElement.parentNode.removeChild(this.autoCompleteElement);
        delete this.autoCompleteElement;

        if (!this._userEnteredRange || !this._userEnteredText)
            return;

        this._userEnteredRange.deleteContents();

        var userTextNode = document.createTextNode(this._userEnteredText);
        this._userEnteredRange.insertNode(userTextNode);           

        var selectionRange = document.createRange();
        selectionRange.setStart(userTextNode, this._userEnteredText.length);
        selectionRange.setEnd(userTextNode, this._userEnteredText.length);

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(selectionRange);

        delete this._userEnteredRange;
        delete this._userEnteredText;
    },

    autoCompleteSoon: function()
    {
        if (!("_completeTimeout" in this))
            this._completeTimeout = setTimeout(this.complete.bind(this, true), 250);
    },

    complete: function(auto)
    {
        this.clearAutoComplete(true);

        var selection = window.getSelection();
        if (!selection.rangeCount)
            return;

        var selectionRange = selection.getRangeAt(0);
        if (!selectionRange.commonAncestorContainer.isDescendant(this.element))
            return;
        if (auto && !this.isCaretAtEndOfPrompt())
            return;

        var wordPrefixRange = selectionRange.startContainer.rangeOfWord(selectionRange.startOffset, this.completionStopCharacters, this.element, "backward");
        var completions = this.completions(wordPrefixRange, auto);

        if (!completions || !completions.length)
            return;

        var fullWordRange = document.createRange();
        fullWordRange.setStart(wordPrefixRange.startContainer, wordPrefixRange.startOffset);
        fullWordRange.setEnd(selectionRange.endContainer, selectionRange.endOffset);

        if (completions.length === 1 || selection.isCollapsed || auto) {
            var completionText = completions[0];
        } else {
            var currentText = fullWordRange.toString();

            var foundIndex = null;
            for (var i = 0; i < completions.length; ++i) {
                if (completions[i] === currentText)
                    foundIndex = i;
            }

            if (foundIndex === null || (foundIndex + 1) >= completions.length)
                var completionText = completions[0];
            else
                var completionText = completions[foundIndex + 1];
        }

        var wordPrefixLength = wordPrefixRange.toString().length;

        this._userEnteredRange = fullWordRange;
        this._userEnteredText = fullWordRange.toString();

        fullWordRange.deleteContents();

        var finalSelectionRange = document.createRange();

        if (auto) {
            var prefixText = completionText.substring(0, wordPrefixLength);
            var suffixText = completionText.substring(wordPrefixLength);

            var prefixTextNode = document.createTextNode(prefixText);
            fullWordRange.insertNode(prefixTextNode);           

            this.autoCompleteElement = document.createElement("span");
            this.autoCompleteElement.className = "auto-complete-text";
            this.autoCompleteElement.textContent = suffixText;

            prefixTextNode.parentNode.insertBefore(this.autoCompleteElement, prefixTextNode.nextSibling);

            finalSelectionRange.setStart(prefixTextNode, wordPrefixLength);
            finalSelectionRange.setEnd(prefixTextNode, wordPrefixLength);
        } else {
            var completionTextNode = document.createTextNode(completionText);
            fullWordRange.insertNode(completionTextNode);           

            if (completions.length > 1)
                finalSelectionRange.setStart(completionTextNode, wordPrefixLength);
            else
                finalSelectionRange.setStart(completionTextNode, completionText.length);

            finalSelectionRange.setEnd(completionTextNode, completionText.length);
        }

        selection.removeAllRanges();
        selection.addRange(finalSelectionRange);
    },

    isCaretInsidePrompt: function()
    {
        return this.element.isInsertionCaretInside();
    },

    isCaretAtEndOfPrompt: function()
    {
        var selection = window.getSelection();
        if (!selection.rangeCount || !selection.isCollapsed)
            return false;

        var selectionRange = selection.getRangeAt(0);
        var node = selectionRange.startContainer;
        if (node !== this.element && !node.isDescendant(this.element))
            return false;

        if (node.nodeType === Node.TEXT_NODE && selectionRange.startOffset < node.nodeValue.length)
            return false;

        var foundNextText = false;
        while (node) {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.length) {
                if (foundNextText)
                    return false;
                foundNextText = true;
            }

            node = node.traverseNextNode(false, this.element);
        }

        return true;
    },

    moveCaretToEndOfPrompt: function()
    {
        var selection = window.getSelection();
        var selectionRange = document.createRange();

        var offset = this.element.childNodes.length;
        selectionRange.setStart(this.element, offset);
        selectionRange.setEnd(this.element, offset);

        selection.removeAllRanges();
        selection.addRange(selectionRange);
    },

    _tabKeyPressed: function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        this.complete();
    },

    _upKeyPressed: function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (this.historyOffset == this.history.length)
            return;

        this.clearAutoComplete(true);

        if (this.historyOffset == 0)
            this.tempSavedCommand = this.text;

        ++this.historyOffset;
        this.text = this.history[this.history.length - this.historyOffset];
    },

    _downKeyPressed: function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (this.historyOffset == 0)
            return;

        this.clearAutoComplete(true);

        --this.historyOffset;

        if (this.historyOffset == 0) {
            this.text = this.tempSavedCommand;
            delete this.tempSavedCommand;
            return;
        }

        this.text = this.history[this.history.length - this.historyOffset];
    }
}
/* Placard.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Placard = function(title, subtitle)
{
    this.element = document.createElement("div");
    this.element.className = "placard";
    this.element.placard = this;

    this.titleElement = document.createElement("div");
    this.titleElement.className = "title";

    this.subtitleElement = document.createElement("div");
    this.subtitleElement.className = "subtitle";

    this.element.appendChild(this.subtitleElement);
    this.element.appendChild(this.titleElement);

    this.title = title;
    this.subtitle = subtitle;
    this.selected = false;
}

WebInspector.Placard.prototype = {
    get title()
    {
        return this._title;
    },

    set title(x)
    {
        if (this._title === x)
            return;
        this._title = x;
        this.titleElement.textContent = x;
    },

    get subtitle()
    {
        return this._subtitle;
    },

    set subtitle(x)
    {
        if (this._subtitle === x)
            return;
        this._subtitle = x;
        this.subtitleElement.innerHTML = x;
    },

    get selected()
    {
        return this._selected;
    },

    set selected(x)
    {
        if (x)
            this.select();
        else
            this.deselect();
    },

    select: function()
    {
        if (this._selected)
            return;
        this._selected = true;
        this.element.addStyleClass("selected");
    },

    deselect: function()
    {
        if (!this._selected)
            return;
        this._selected = false;
        this.element.removeStyleClass("selected");
    },

    toggleSelected: function()
    {
        this.selected = !this.selected;
    }
}
/* View.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.View = function(element)
{
    this.element = element || document.createElement("div");
    this._visible = false;
}

WebInspector.View.prototype = {
    get visible()
    {
        return this._visible;
    },

    set visible(x)
    {
        if (this._visible === x)
            return;

        if (x)
            this.show();
        else
            this.hide();
    },

    show: function(parentElement)
    {
        this._visible = true;
        if (parentElement && parentElement !== this.element.parentNode) {
            this.detach();
            parentElement.appendChild(this.element);
        }
        if (!this.element.parentNode && this.attach)
            this.attach();
        this.element.addStyleClass("visible");
    },

    hide: function()
    {
        this.element.removeStyleClass("visible");
        this._visible = false;
    },

    detach: function()
    {
        if (this.element.parentNode)
            this.element.parentNode.removeChild(this.element);
    }
}

WebInspector.View.prototype.__proto__ = WebInspector.Object.prototype;
/* Console.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Console = function()
{
    this.messages = [];

    WebInspector.View.call(this, document.getElementById("console"));

    this.messagesElement = document.getElementById("console-messages");
    this.messagesElement.addEventListener("selectstart", this._messagesSelectStart.bind(this), false);
    this.messagesElement.addEventListener("click", this._messagesClicked.bind(this), true);

    this.promptElement = document.getElementById("console-prompt");
    this.promptElement.handleKeyEvent = this._promptKeyDown.bind(this);
    this.prompt = new WebInspector.TextPrompt(this.promptElement, this.completions.bind(this), " .=:[({;");

    this.toggleButton = document.getElementById("console-status-bar-item");
    this.toggleButton.title = WebInspector.UIString("Show console.");
    this.toggleButton.addEventListener("click", this._toggleButtonClicked.bind(this), false);

    this.clearButton = document.getElementById("clear-console-status-bar-item");
    this.clearButton.title = WebInspector.UIString("Clear console log.");
    this.clearButton.addEventListener("click", this._clearButtonClicked.bind(this), false);

    this.topGroup = new WebInspector.ConsoleGroup(null, 0);
    this.messagesElement.insertBefore(this.topGroup.element, this.promptElement);
    this.groupLevel = 0;
    this.currentGroup = this.topGroup;

    document.getElementById("main-status-bar").addEventListener("mousedown", this._startStatusBarDragging.bind(this), true);
}

WebInspector.Console.prototype = {
    show: function()
    {
        if (this._animating || this.visible)
            return;

        WebInspector.View.prototype.show.call(this);

        this._animating = true;

        this.toggleButton.addStyleClass("toggled-on");
        this.toggleButton.title = WebInspector.UIString("Hide console.");

        document.body.addStyleClass("console-visible");

        var anchoredItems = document.getElementById("anchored-status-bar-items");

        var animations = [
            {element: document.getElementById("main"), end: {bottom: this.element.offsetHeight}},
            {element: document.getElementById("main-status-bar"), start: {"padding-left": anchoredItems.offsetWidth - 1}, end: {"padding-left": 0}},
            {element: document.getElementById("other-console-status-bar-items"), start: {opacity: 0}, end: {opacity: 1}}
        ];

        var consoleStatusBar = document.getElementById("console-status-bar");
        consoleStatusBar.insertBefore(anchoredItems, consoleStatusBar.firstChild);

        function animationFinished()
        {
            if ("updateStatusBarItems" in WebInspector.currentPanel)
                WebInspector.currentPanel.updateStatusBarItems();
            WebInspector.currentFocusElement = this.promptElement;
            delete this._animating;
        }

        WebInspector.animateStyle(animations, window.event && window.event.shiftKey ? 2000 : 250, animationFinished.bind(this));

        if (!this.prompt.isCaretInsidePrompt())
            this.prompt.moveCaretToEndOfPrompt();
    },

    hide: function()
    {
        if (this._animating || !this.visible)
            return;

        WebInspector.View.prototype.hide.call(this);

        this._animating = true;

        this.toggleButton.removeStyleClass("toggled-on");
        this.toggleButton.title = WebInspector.UIString("Show console.");

        if (this.element === WebInspector.currentFocusElement || this.element.isAncestor(WebInspector.currentFocusElement))
            WebInspector.currentFocusElement = WebInspector.previousFocusElement;

        var anchoredItems = document.getElementById("anchored-status-bar-items");

        // Temporally set properties and classes to mimic the post-animation values so panels
        // like Elements in their updateStatusBarItems call will size things to fit the final location.
        document.getElementById("main-status-bar").style.setProperty("padding-left", (anchoredItems.offsetWidth - 1) + "px");
        document.body.removeStyleClass("console-visible");
        if ("updateStatusBarItems" in WebInspector.currentPanel)
            WebInspector.currentPanel.updateStatusBarItems();
        document.body.addStyleClass("console-visible");

        var animations = [
            {element: document.getElementById("main"), end: {bottom: 0}},
            {element: document.getElementById("main-status-bar"), start: {"padding-left": 0}, end: {"padding-left": anchoredItems.offsetWidth - 1}},
            {element: document.getElementById("other-console-status-bar-items"), start: {opacity: 1}, end: {opacity: 0}}
        ];

        function animationFinished()
        {
            var mainStatusBar = document.getElementById("main-status-bar");
            mainStatusBar.insertBefore(anchoredItems, mainStatusBar.firstChild);
            mainStatusBar.style.removeProperty("padding-left");
            document.body.removeStyleClass("console-visible");
            delete this._animating;
        }

        WebInspector.animateStyle(animations, window.event && window.event.shiftKey ? 2000 : 250, animationFinished.bind(this));
    },

    addMessage: function(msg)
    {
        if (msg instanceof WebInspector.ConsoleMessage) {
            msg.totalRepeatCount = msg.repeatCount;
            msg.repeatDelta = msg.repeatCount;

            var messageRepeated = false;

            if (msg.isEqual && msg.isEqual(this.previousMessage)) {
                // Because sometimes we get a large number of repeated messages and sometimes
                // we get them one at a time, we need to know the difference between how many
                // repeats we used to have and how many we have now.
                msg.repeatDelta -= this.previousMessage.totalRepeatCount;

                if (!isNaN(this.repeatCountBeforeCommand))
                    msg.repeatCount -= this.repeatCountBeforeCommand;

                if (!this.commandSincePreviousMessage) {
                    // Recreate the previous message element to reset the repeat count.
                    var messagesElement = this.currentGroup.messagesElement;
                    messagesElement.removeChild(messagesElement.lastChild);
                    messagesElement.appendChild(msg.toMessageElement());

                    messageRepeated = true;
                }
            } else
                delete this.repeatCountBeforeCommand;

            // Increment the error or warning count
            switch (msg.level) {
            case WebInspector.ConsoleMessage.MessageLevel.Warning:
                WebInspector.warnings += msg.repeatDelta;
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Error:
                WebInspector.errors += msg.repeatDelta;
                break;
            }

            // Add message to the resource panel
            if (msg.url in WebInspector.resourceURLMap) {
                msg.resource = WebInspector.resourceURLMap[msg.url];
                WebInspector.panels.resources.addMessageToResource(msg.resource, msg);
            }

            this.commandSincePreviousMessage = false;
            this.previousMessage = msg;

            if (messageRepeated)
                return;
        } else if (msg instanceof WebInspector.ConsoleCommand) {
            if (this.previousMessage) {
                this.commandSincePreviousMessage = true;
                this.repeatCountBeforeCommand = this.previousMessage.totalRepeatCount;
            }
        }

        this.messages.push(msg);

        if (msg.level === WebInspector.ConsoleMessage.MessageLevel.EndGroup) {
            if (this.groupLevel < 1)
                return;

            this.groupLevel--;

            this.currentGroup = this.currentGroup.parentGroup;
        } else {
            if (msg.level === WebInspector.ConsoleMessage.MessageLevel.StartGroup) {
                this.groupLevel++;

                var group = new WebInspector.ConsoleGroup(this.currentGroup, this.groupLevel);
                this.currentGroup.messagesElement.appendChild(group.element);
                this.currentGroup = group;
            }

            this.currentGroup.addMessage(msg);
        }

        this.promptElement.scrollIntoView(false);
    },

    clearMessages: function(clearInspectorController)
    {
        if (clearInspectorController)
            InspectorController.clearMessages();
        WebInspector.panels.resources.clearMessages();

        this.messages = [];

        this.groupLevel = 0;
        this.currentGroup = this.topGroup;
        this.topGroup.messagesElement.removeChildren();

        WebInspector.errors = 0;
        WebInspector.warnings = 0;

        delete this.commandSincePreviousMessage;
        delete this.repeatCountBeforeCommand;
        delete this.previousMessage;
    },

    completions: function(wordRange, bestMatchOnly)
    {
        // Pass less stop characters to rangeOfWord so the range will be a more complete expression.
        const expressionStopCharacters = " =:{;";
        var expressionRange = wordRange.startContainer.rangeOfWord(wordRange.startOffset, expressionStopCharacters, this.promptElement, "backward");
        var expressionString = expressionRange.toString();
        var lastIndex = expressionString.length - 1;

        var dotNotation = (expressionString[lastIndex] === ".");
        var bracketNotation = (expressionString[lastIndex] === "[");

        if (dotNotation || bracketNotation)
            expressionString = expressionString.substr(0, lastIndex);

        var prefix = wordRange.toString();
        if (!expressionString && !prefix)
            return;

        var result;
        if (expressionString) {
            try {
                result = this._evalInInspectedWindow(expressionString);
            } catch(e) {
                // Do nothing, the prefix will be considered a window property.
            }
        } else {
            // There is no expressionString, so the completion should happen against global properties.
            // Or if the debugger is paused, against properties in scope of the selected call frame.
            if (WebInspector.panels.scripts.paused)
                result = WebInspector.panels.scripts.variablesInScopeForSelectedCallFrame();
            else
                result = InspectorController.inspectedWindow();
        }

        if (bracketNotation) {
            if (prefix.length && prefix[0] === "'")
                var quoteUsed = "'";
            else
                var quoteUsed = "\"";
        }

        var results = [];
        var properties = Object.sortedProperties(result);
        for (var i = 0; i < properties.length; ++i) {
            var property = properties[i];

            if (dotNotation && !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(property))
                continue;

            if (bracketNotation) {
                if (!/^[0-9]+$/.test(property))
                    property = quoteUsed + property.escapeCharacters(quoteUsed + "\\") + quoteUsed;
                property += "]";
            }

            if (property.length < prefix.length)
                continue;
            if (property.indexOf(prefix) !== 0)
                continue;

            results.push(property);
            if (bestMatchOnly)
                break;
        }

        return results;
    },

    _toggleButtonClicked: function()
    {
        this.visible = !this.visible;
    },

    _clearButtonClicked: function()
    {
        this.clearMessages(true);
    },

    _messagesSelectStart: function(event)
    {
        if (this._selectionTimeout)
            clearTimeout(this._selectionTimeout);

        this.prompt.clearAutoComplete();

        function moveBackIfOutside()
        {
            delete this._selectionTimeout;
            if (!this.prompt.isCaretInsidePrompt() && window.getSelection().isCollapsed)
                this.prompt.moveCaretToEndOfPrompt();
            this.prompt.autoCompleteSoon();
        }

        this._selectionTimeout = setTimeout(moveBackIfOutside.bind(this), 100);
    },

    _messagesClicked: function(event)
    {
        var link = event.target.enclosingNodeOrSelfWithNodeName("a");
        if (!link || !link.representedNode)
            return;

        WebInspector.updateFocusedNode(link.representedNode);
        event.stopPropagation();
        event.preventDefault();
    },

    _promptKeyDown: function(event)
    {
        switch (event.keyIdentifier) {
            case "Enter":
                this._enterKeyPressed(event);
                return;
        }

        this.prompt.handleKeyEvent(event);
    },

    _startStatusBarDragging: function(event)
    {
        if (!this.visible || event.target !== document.getElementById("main-status-bar"))
            return;

        WebInspector.elementDragStart(document.getElementById("main-status-bar"), this._statusBarDragging.bind(this), this._endStatusBarDragging.bind(this), event, "row-resize");

        this._statusBarDragOffset = event.pageY - this.element.totalOffsetTop;

        event.stopPropagation();
    },

    _statusBarDragging: function(event)
    {
        var mainElement = document.getElementById("main");

        var height = window.innerHeight - event.pageY + this._statusBarDragOffset;
        height = Number.constrain(height, Preferences.minConsoleHeight, window.innerHeight - mainElement.totalOffsetTop - Preferences.minConsoleHeight);

        mainElement.style.bottom = height + "px";
        this.element.style.height = height + "px";

        event.preventDefault();
        event.stopPropagation();
    },

    _endStatusBarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);

        delete this._statusBarDragOffset;

        event.stopPropagation();
    },

    _evalInInspectedWindow: function(expression)
    {
        if (WebInspector.panels.scripts.paused)
            return WebInspector.panels.scripts.evaluateInSelectedCallFrame(expression);

        var inspectedWindow = InspectorController.inspectedWindow();
        if (!inspectedWindow._inspectorCommandLineAPI) {
            inspectedWindow.eval("window._inspectorCommandLineAPI = { \
                $: function() { return document.getElementById.apply(document, arguments) }, \
                $$: function() { return document.querySelectorAll.apply(document, arguments) }, \
                $x: function(xpath, context) { \
                    var nodes = []; \
                    try { \
                        var doc = context || document; \
                        var results = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null); \
                        var node; \
                        while (node = results.iterateNext()) nodes.push(node); \
                    } catch (e) {} \
                    return nodes; \
                }, \
                dir: function() { return console.dir.apply(console, arguments) }, \
                dirxml: function() { return console.dirxml.apply(console, arguments) }, \
                keys: function(o) { var a = []; for (k in o) a.push(k); return a; }, \
                values: function(o) { var a = []; for (k in o) a.push(o[k]); return a; }, \
                profile: function() { return console.profile.apply(console, arguments) }, \
                profileEnd: function() { return console.profileEnd.apply(console, arguments) } \
            };");

            inspectedWindow._inspectorCommandLineAPI.clear = InspectorController.wrapCallback(this.clearMessages.bind(this));
        }

        // Surround the expression in with statements to inject our command line API so that
        // the window object properties still take more precedent than our API functions.
        expression = "with (window._inspectorCommandLineAPI) { with (window) { " + expression + " } }";

        return inspectedWindow.eval(expression);
    },

    _enterKeyPressed: function(event)
    {
        if (event.altKey)
            return;

        event.preventDefault();
        event.stopPropagation();

        this.prompt.clearAutoComplete(true);

        var str = this.prompt.text;
        if (!str.length)
            return;

        var result;
        var exception = false;
        try {
            result = this._evalInInspectedWindow(str);
        } catch(e) {
            result = e;
            exception = true;
        }

        this.prompt.history.push(str);
        this.prompt.historyOffset = 0;
        this.prompt.text = "";

        var level = exception ? WebInspector.ConsoleMessage.MessageLevel.Error : WebInspector.ConsoleMessage.MessageLevel.Log;
        this.addMessage(new WebInspector.ConsoleCommand(str, result, this._format(result), level));
    },

    _mouseOverNode: function(event)
    {
        var anchorElement = event.target.enclosingNodeOrSelfWithNodeName("a");
        WebInspector.hoveredDOMNode = (anchorElement ? anchorElement.representedNode : null);
    },

    _mouseOutOfNode: function(event)
    {
        var nodeUnderMouse = document.elementFromPoint(event.pageX, event.pageY);
        var anchorElement = nodeUnderMouse.enclosingNodeOrSelfWithNodeName("a");
        if (!anchorElement || !anchorElement.representedNode)
            WebInspector.hoveredDOMNode = null;
    },

    _format: function(output)
    {
        var type = Object.type(output, InspectorController.inspectedWindow());
        if (type === "object") {
            if (output instanceof InspectorController.inspectedWindow().Node)
                type = "node";
        }

        // We don't perform any special formatting on these types, so we just
        // pass them through the simple _formatvalue function.
        var undecoratedTypes = {
            "undefined": 1,
            "null": 1,
            "boolean": 1,
            "number": 1,
            "date": 1,
            "function": 1,
        };

        var formatter;
        if (type in undecoratedTypes)
            formatter = "_formatvalue";
        else {
            formatter = "_format" + type;
            if (!(formatter in this)) {
                formatter = "_formatobject";
                type = "object";
            }
        }

        var span = document.createElement("span");
        span.addStyleClass("console-formatted-" + type);
        this[formatter](output, span);
        return span;
    },

    _formatvalue: function(val, elem)
    {
        elem.appendChild(document.createTextNode(val));
    },

    _formatstring: function(str, elem)
    {
        elem.appendChild(document.createTextNode("\"" + str + "\""));
    },

    _formatregexp: function(re, elem)
    {
        var formatted = String(re).replace(/([\\\/])/g, "\\$1").replace(/\\(\/[gim]*)$/, "$1").substring(1);
        elem.appendChild(document.createTextNode(formatted));
    },

    _formatarray: function(arr, elem)
    {
        elem.appendChild(document.createTextNode("["));
        for (var i = 0; i < arr.length; ++i) {
            elem.appendChild(this._format(arr[i]));
            if (i < arr.length - 1)
                elem.appendChild(document.createTextNode(", "));
        }
        elem.appendChild(document.createTextNode("]"));
    },

    _formatnode: function(node, elem)
    {
        var anchor = document.createElement("a");
        anchor.className = "inspectible-node";
        anchor.innerHTML = nodeTitleInfo.call(node).title;
        anchor.representedNode = node;
        anchor.addEventListener("mouseover", this._mouseOverNode.bind(this), false);
        anchor.addEventListener("mouseout", this._mouseOutOfNode.bind(this), false);
        elem.appendChild(anchor);
    },

    _formatobject: function(obj, elem)
    {
        elem.appendChild(document.createTextNode(Object.describe(obj)));
    },

    _formaterror: function(obj, elem)
    {
        elem.appendChild(document.createTextNode(obj.name + ": " + obj.message + " "));

        if (obj.sourceURL) {
            var urlElement = document.createElement("a");
            urlElement.className = "console-message-url webkit-html-resource-link";
            urlElement.href = obj.sourceURL;
            urlElement.lineNumber = obj.line;
            urlElement.preferredPanel = "scripts";

            if (obj.line > 0)
                urlElement.textContent = WebInspector.UIString("%s (line %d)", obj.sourceURL, obj.line);
            else
                urlElement.textContent = obj.sourceURL;

            elem.appendChild(urlElement);
        }
    },
}

WebInspector.Console.prototype.__proto__ = WebInspector.View.prototype;

WebInspector.ConsoleMessage = function(source, level, line, url, groupLevel, repeatCount)
{
    this.source = source;
    this.level = level;
    this.line = line;
    this.url = url;
    this.groupLevel = groupLevel;
    this.repeatCount = repeatCount;

    switch (this.level) {
        case WebInspector.ConsoleMessage.MessageLevel.Object:
            var propertiesSection = new WebInspector.ObjectPropertiesSection(arguments[6], null, null, null, true);
            propertiesSection.element.addStyleClass("console-message");
            this.propertiesSection = propertiesSection;
            break;
        case WebInspector.ConsoleMessage.MessageLevel.Node:
            var node = arguments[6];
            if (!(node instanceof InspectorController.inspectedWindow().Node))
                return;
            this.elementsTreeOutline = new WebInspector.ElementsTreeOutline();
            this.elementsTreeOutline.rootDOMNode = node;
            break;
        case WebInspector.ConsoleMessage.MessageLevel.Trace:
            var span = document.createElement("span");
            span.addStyleClass("console-formatted-trace");
            var stack = Array.prototype.slice.call(arguments, 6);
            var funcNames = stack.map(function(f) {
                return f || WebInspector.UIString("(anonymous function)");
            });
            span.appendChild(document.createTextNode(funcNames.join("\n")));
            this.formattedMessage = span;
            break;
        default:
            // The formatedMessage property is used for the rich and interactive console.
            this.formattedMessage = this._format(Array.prototype.slice.call(arguments, 6));

            // This is used for inline message bubbles in SourceFrames, or other plain-text representations.
            this.message = this.formattedMessage.textContent;
            break;
    }
}

WebInspector.ConsoleMessage.prototype = {
    isErrorOrWarning: function()
    {
        return (this.level === WebInspector.ConsoleMessage.MessageLevel.Warning || this.level === WebInspector.ConsoleMessage.MessageLevel.Error);
    },

    _format: function(parameters)
    {
        var formattedResult = document.createElement("span");

        if (!parameters.length)
            return formattedResult;

        function formatForConsole(obj)
        {
            return WebInspector.console._format(obj);
        }

        if (Object.type(parameters[0], InspectorController.inspectedWindow()) === "string") {
            var formatters = {}
            for (var i in String.standardFormatters)
                formatters[i] = String.standardFormatters[i];

            // Firebug uses %o for formatting objects.
            formatters.o = formatForConsole;
            // Firebug allows both %i and %d for formatting integers.
            formatters.i = formatters.d;

            function append(a, b)
            {
                if (!(b instanceof Node))
                    a.appendChild(WebInspector.linkifyStringAsFragment(b.toString()));
                else
                    a.appendChild(b);
                return a;
            }

            var result = String.format(parameters[0], parameters.slice(1), formatters, formattedResult, append);
            formattedResult = result.formattedResult;
            parameters = result.unusedSubstitutions;
            if (parameters.length)
                formattedResult.appendChild(document.createTextNode(" "));
        }

        for (var i = 0; i < parameters.length; ++i) {
            if (typeof parameters[i] === "string")
                formattedResult.appendChild(WebInspector.linkifyStringAsFragment(parameters[i]));
            else
                formattedResult.appendChild(formatForConsole(parameters[i]));
            if (i < parameters.length - 1)
                formattedResult.appendChild(document.createTextNode(" "));
        }

        return formattedResult;
    },

    toMessageElement: function()
    {
        if (this.propertiesSection)
            return this.propertiesSection.element;

        var element = document.createElement("div");
        element.message = this;
        element.className = "console-message";

        switch (this.source) {
            case WebInspector.ConsoleMessage.MessageSource.HTML:
                element.addStyleClass("console-html-source");
                break;
            case WebInspector.ConsoleMessage.MessageSource.WML:
                element.addStyleClass("console-wml-source");
                break;
            case WebInspector.ConsoleMessage.MessageSource.XML:
                element.addStyleClass("console-xml-source");
                break;
            case WebInspector.ConsoleMessage.MessageSource.JS:
                element.addStyleClass("console-js-source");
                break;
            case WebInspector.ConsoleMessage.MessageSource.CSS:
                element.addStyleClass("console-css-source");
                break;
            case WebInspector.ConsoleMessage.MessageSource.Other:
                element.addStyleClass("console-other-source");
                break;
        }

        switch (this.level) {
            case WebInspector.ConsoleMessage.MessageLevel.Tip:
                element.addStyleClass("console-tip-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Log:
                element.addStyleClass("console-log-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Warning:
                element.addStyleClass("console-warning-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Error:
                element.addStyleClass("console-error-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.StartGroup:
                element.addStyleClass("console-group-title-level");
        }

        if (this.elementsTreeOutline) {
            element.addStyleClass("outline-disclosure");
            element.appendChild(this.elementsTreeOutline.element);
            return element;
        }

        if (this.repeatCount > 1) {
            var messageRepeatCountElement = document.createElement("span");
            messageRepeatCountElement.className = "bubble";
            messageRepeatCountElement.textContent = this.repeatCount;

            element.appendChild(messageRepeatCountElement);
            element.addStyleClass("repeated-message");
        }

        if (this.url && this.url !== "undefined") {
            var urlElement = document.createElement("a");
            urlElement.className = "console-message-url webkit-html-resource-link";
            urlElement.href = this.url;
            urlElement.lineNumber = this.line;

            if (this.source === WebInspector.ConsoleMessage.MessageSource.JS)
                urlElement.preferredPanel = "scripts";

            if (this.line > 0)
                urlElement.textContent = WebInspector.UIString("%s (line %d)", WebInspector.displayNameForURL(this.url), this.line);
            else
                urlElement.textContent = WebInspector.displayNameForURL(this.url);

            element.appendChild(urlElement);
        }

        var messageTextElement = document.createElement("span");
        messageTextElement.className = "console-message-text";
        messageTextElement.appendChild(this.formattedMessage);
        element.appendChild(messageTextElement);

        return element;
    },

    toString: function()
    {
        var sourceString;
        switch (this.source) {
            case WebInspector.ConsoleMessage.MessageSource.HTML:
                sourceString = "HTML";
                break;
            case WebInspector.ConsoleMessage.MessageSource.WML:
                sourceString = "WML";
                break;
            case WebInspector.ConsoleMessage.MessageSource.XML:
                sourceString = "XML";
                break;
            case WebInspector.ConsoleMessage.MessageSource.JS:
                sourceString = "JS";
                break;
            case WebInspector.ConsoleMessage.MessageSource.CSS:
                sourceString = "CSS";
                break;
            case WebInspector.ConsoleMessage.MessageSource.Other:
                sourceString = "Other";
                break;
        }

        var levelString;
        switch (this.level) {
            case WebInspector.ConsoleMessage.MessageLevel.Tip:
                levelString = "Tip";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Log:
                levelString = "Log";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Warning:
                levelString = "Warning";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Error:
                levelString = "Error";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Object:
                levelString = "Object";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.GroupTitle:
                levelString = "GroupTitle";
                break;
        }

        return sourceString + " " + levelString + ": " + this.formattedMessage.textContent + "\n" + this.url + " line " + this.line;
    },
    
    isEqual: function(msg, disreguardGroup)
    {
        if (!msg)
            return false;

        var ret = (this.source == msg.source)
            && (this.level == msg.level)
            && (this.line == msg.line)
            && (this.url == msg.url)
            && (this.message == msg.message);

        return (disreguardGroup ? ret : (ret && (this.groupLevel == msg.groupLevel)));
    }
}

// Note: Keep these constants in sync with the ones in Console.h
WebInspector.ConsoleMessage.MessageSource = {
    HTML: 0,
    WML: 1,
    XML: 2,
    JS: 3,
    CSS: 4,
    Other: 5
}

WebInspector.ConsoleMessage.MessageLevel = {
    Tip: 0,
    Log: 1,
    Warning: 2,
    Error: 3,
    Object: 4,
    Node: 5,
    Trace: 6,
    StartGroup: 7,
    EndGroup: 8
}

WebInspector.ConsoleCommand = function(command, result, formattedResultElement, level)
{
    this.command = command;
    this.formattedResultElement = formattedResultElement;
    this.level = level;
}

WebInspector.ConsoleCommand.prototype = {
    toMessageElement: function()
    {
        var element = document.createElement("div");
        element.command = this;
        element.className = "console-user-command";

        var commandTextElement = document.createElement("span");
        commandTextElement.className = "console-message-text";
        commandTextElement.textContent = this.command;
        element.appendChild(commandTextElement);

        var resultElement = document.createElement("div");
        resultElement.className = "console-message";
        element.appendChild(resultElement);

        switch (this.level) {
            case WebInspector.ConsoleMessage.MessageLevel.Log:
                resultElement.addStyleClass("console-log-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Warning:
                resultElement.addStyleClass("console-warning-level");
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Error:
                resultElement.addStyleClass("console-error-level");
        }

        var resultTextElement = document.createElement("span");
        resultTextElement.className = "console-message-text";
        resultTextElement.appendChild(this.formattedResultElement);
        resultElement.appendChild(resultTextElement);

        return element;
    }
}

WebInspector.ConsoleGroup = function(parentGroup, level)
{
    this.parentGroup = parentGroup;
    this.level = level;

    var element = document.createElement("div");
    element.className = "console-group";
    element.group = this;
    this.element = element;

    var messagesElement = document.createElement("div");
    messagesElement.className = "console-group-messages";
    element.appendChild(messagesElement);
    this.messagesElement = messagesElement;
}

WebInspector.ConsoleGroup.prototype = {
    addMessage: function(msg)
    {
        var element = msg.toMessageElement();
        
        if (msg.level === WebInspector.ConsoleMessage.MessageLevel.StartGroup) {
            this.messagesElement.parentNode.insertBefore(element, this.messagesElement);
            element.addEventListener("click", this._titleClicked.bind(this), true);
        } else
            this.messagesElement.appendChild(element);
    },
    
    _titleClicked: function(event)
    {
        var groupTitleElement = event.target.enclosingNodeOrSelfWithClass("console-group-title-level");
        if (groupTitleElement) {
            var groupElement = groupTitleElement.enclosingNodeOrSelfWithClass("console-group");
            if (groupElement)
                if (groupElement.hasStyleClass("collapsed"))
                    groupElement.removeStyleClass("collapsed");
                else
                    groupElement.addStyleClass("collapsed");
            groupTitleElement.scrollIntoViewIfNeeded(true);
        }

        event.stopPropagation();
        event.preventDefault();
    }
}
/* Resource.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Resource = function(requestHeaders, url, domain, path, lastPathComponent, identifier, mainResource, cached)
{
    this.identifier = identifier;

    this.startTime = -1;
    this.endTime = -1;
    this.mainResource = mainResource;
    this.requestHeaders = requestHeaders;
    this.url = url;
    this.domain = domain;
    this.path = path;
    this.lastPathComponent = lastPathComponent;
    this.cached = cached;

    this.category = WebInspector.resourceCategories.other;
}

// Keep these in sync with WebCore::InspectorResource::Type
WebInspector.Resource.Type = {
    Document:   0,
    Stylesheet: 1,
    Image:      2,
    Font:       3,
    Script:     4,
    XHR:        5,
    Other:      6,

    isTextType: function(type)
    {
        return (type === this.Document) || (type === this.Stylesheet) || (type === this.Script) || (type === this.XHR);
    },

    toString: function(type)
    {
        switch (type) {
            case this.Document:
                return WebInspector.UIString("document");
            case this.Stylesheet:
                return WebInspector.UIString("stylesheet");
            case this.Image:
                return WebInspector.UIString("image");
            case this.Font:
                return WebInspector.UIString("font");
            case this.Script:
                return WebInspector.UIString("script");
            case this.XHR:
                return WebInspector.UIString("XHR");
            case this.Other:
            default:
                return WebInspector.UIString("other");
        }
    }
}

WebInspector.Resource.prototype = {
    get url()
    {
        return this._url;
    },

    set url(x)
    {
        if (this._url === x)
            return;

        var oldURL = this._url;
        this._url = x;

        // FIXME: We should make the WebInspector object listen for the "url changed" event.
        // Then resourceURLChanged can be removed.
        WebInspector.resourceURLChanged(this, oldURL);

        this.dispatchEventToListeners("url changed");
    },

    get domain()
    {
        return this._domain;
    },

    set domain(x)
    {
        if (this._domain === x)
            return;
        this._domain = x;
    },

    get lastPathComponent()
    {
        return this._lastPathComponent;
    },

    set lastPathComponent(x)
    {
        if (this._lastPathComponent === x)
            return;
        this._lastPathComponent = x;
        this._lastPathComponentLowerCase = x ? x.toLowerCase() : null;
    },

    get displayName()
    {
        var title = this.lastPathComponent;
        if (!title)
            title = this.displayDomain;
        if (!title && this.url)
            title = this.url.trimURL(WebInspector.mainResource ? WebInspector.mainResource.domain : "");
        if (title === "/")
            title = this.url;
        return title;
    },

    get displayDomain()
    {
        // WebInspector.Database calls this, so don't access more than this.domain.
        if (this.domain && (!WebInspector.mainResource || (WebInspector.mainResource && this.domain !== WebInspector.mainResource.domain)))
            return this.domain;
        return "";
    },

    get startTime()
    {
        return this._startTime || -1;
    },

    set startTime(x)
    {
        if (this._startTime === x)
            return;

        this._startTime = x;

        if (WebInspector.panels.resources)
            WebInspector.panels.resources.refreshResource(this);
    },

    get responseReceivedTime()
    {
        return this._responseReceivedTime || -1;
    },

    set responseReceivedTime(x)
    {
        if (this._responseReceivedTime === x)
            return;

        this._responseReceivedTime = x;

        if (WebInspector.panels.resources)
            WebInspector.panels.resources.refreshResource(this);
    },

    get endTime()
    {
        return this._endTime || -1;
    },

    set endTime(x)
    {
        if (this._endTime === x)
            return;

        this._endTime = x;

        if (WebInspector.panels.resources)
            WebInspector.panels.resources.refreshResource(this);
    },

    get duration()
    {
        if (this._endTime === -1 || this._startTime === -1)
            return -1;
        return this._endTime - this._startTime;
    },

    get latency()
    {
        if (this._responseReceivedTime === -1 || this._startTime === -1)
            return -1;
        return this._responseReceivedTime - this._startTime;
    },

    get contentLength()
    {
        return this._contentLength || 0;
    },

    set contentLength(x)
    {
        if (this._contentLength === x)
            return;

        this._contentLength = x;

        if (WebInspector.panels.resources)
            WebInspector.panels.resources.refreshResource(this);
    },

    get expectedContentLength()
    {
        return this._expectedContentLength || 0;
    },

    set expectedContentLength(x)
    {
        if (this._expectedContentLength === x)
            return;
        this._expectedContentLength = x;
    },

    get finished()
    {
        return this._finished;
    },

    set finished(x)
    {
        if (this._finished === x)
            return;

        this._finished = x;

        if (x) {
            this._checkTips();
            this._checkWarnings();
            this.dispatchEventToListeners("finished");
        }
    },

    get failed()
    {
        return this._failed;
    },

    set failed(x)
    {
        this._failed = x;
    },

    get category()
    {
        return this._category;
    },

    set category(x)
    {
        if (this._category === x)
            return;

        var oldCategory = this._category;
        if (oldCategory)
            oldCategory.removeResource(this);

        this._category = x;

        if (this._category)
            this._category.addResource(this);

        if (WebInspector.panels.resources) {
            WebInspector.panels.resources.refreshResource(this);
            WebInspector.panels.resources.recreateViewForResourceIfNeeded(this);
        }
    },

    get mimeType()
    {
        return this._mimeType;
    },

    set mimeType(x)
    {
        if (this._mimeType === x)
            return;

        this._mimeType = x;
    },

    get type()
    {
        return this._type;
    },

    set type(x)
    {
        if (this._type === x)
            return;

        this._type = x;

        switch (x) {
            case WebInspector.Resource.Type.Document:
                this.category = WebInspector.resourceCategories.documents;
                break;
            case WebInspector.Resource.Type.Stylesheet:
                this.category = WebInspector.resourceCategories.stylesheets;
                break;
            case WebInspector.Resource.Type.Script:
                this.category = WebInspector.resourceCategories.scripts;
                break;
            case WebInspector.Resource.Type.Image:
                this.category = WebInspector.resourceCategories.images;
                break;
            case WebInspector.Resource.Type.Font:
                this.category = WebInspector.resourceCategories.fonts;
                break;
            case WebInspector.Resource.Type.XHR:
                this.category = WebInspector.resourceCategories.xhr;
                break;
            case WebInspector.Resource.Type.Other:
            default:
                this.category = WebInspector.resourceCategories.other;
                break;
        }
    },

    get documentNode() {
        if ("identifier" in this)
            return InspectorController.getResourceDocumentNode(this.identifier);
        return null;
    },

    get requestHeaders()
    {
        if (this._requestHeaders === undefined)
            this._requestHeaders = {};
        return this._requestHeaders;
    },

    set requestHeaders(x)
    {
        if (this._requestHeaders === x)
            return;

        this._requestHeaders = x;
        delete this._sortedRequestHeaders;

        this.dispatchEventToListeners("requestHeaders changed");
    },

    get sortedRequestHeaders()
    {
        if (this._sortedRequestHeaders !== undefined)
            return this._sortedRequestHeaders;

        this._sortedRequestHeaders = [];
        for (var key in this.requestHeaders)
            this._sortedRequestHeaders.push({header: key, value: this.requestHeaders[key]});
        this._sortedRequestHeaders.sort(function(a,b) { return a.header.localeCompare(b.header) });

        return this._sortedRequestHeaders;
    },

    get responseHeaders()
    {
        if (this._responseHeaders === undefined)
            this._responseHeaders = {};
        return this._responseHeaders;
    },

    set responseHeaders(x)
    {
        if (this._responseHeaders === x)
            return;

        this._responseHeaders = x;
        delete this._sortedResponseHeaders;

        this.dispatchEventToListeners("responseHeaders changed");
    },

    get sortedResponseHeaders()
    {
        if (this._sortedResponseHeaders !== undefined)
            return this._sortedResponseHeaders;

        this._sortedResponseHeaders = [];
        for (var key in this.responseHeaders)
            this._sortedResponseHeaders.push({header: key, value: this.responseHeaders[key]});
        this._sortedResponseHeaders.sort(function(a,b) { return a.header.localeCompare(b.header) });

        return this._sortedResponseHeaders;
    },

    get scripts()
    {
        if (!("_scripts" in this))
            this._scripts = [];
        return this._scripts;
    },

    addScript: function(script)
    {
        if (!script)
            return;
        this.scripts.unshift(script);
        script.resource = this;
    },

    removeAllScripts: function()
    {
        if (!this._scripts)
            return;

        for (var i = 0; i < this._scripts.length; ++i) {
            if (this._scripts[i].resource === this)
                delete this._scripts[i].resource;
        }

        delete this._scripts;
    },

    removeScript: function(script)
    {
        if (!script)
            return;

        if (script.resource === this)
            delete script.resource;

        if (!this._scripts)
            return;

        this._scripts.remove(script);
    },

    get errors()
    {
        return this._errors || 0;
    },

    set errors(x)
    {
        this._errors = x;
    },

    get warnings()
    {
        return this._warnings || 0;
    },

    set warnings(x)
    {
        this._warnings = x;
    },

    get tips()
    {
        if (!("_tips" in this))
            this._tips = {};
        return this._tips;
    },

    _addTip: function(tip)
    {
        if (tip.id in this.tips)
            return;

        this.tips[tip.id] = tip;

        // FIXME: Re-enable this code once we have a scope bar in the Console.
        // Otherwise, we flood the Console with too many tips.
        /*
        var msg = new WebInspector.ConsoleMessage(WebInspector.ConsoleMessage.MessageSource.Other,
            WebInspector.ConsoleMessage.MessageLevel.Tip, -1, this.url, null, 1, tip.message);
        WebInspector.console.addMessage(msg);
        */
    },

    _checkTips: function()
    {
        for (var tip in WebInspector.Tips)
            this._checkTip(WebInspector.Tips[tip]);
    },

    _checkTip: function(tip)
    {
        var addTip = false;
        switch (tip.id) {
            case WebInspector.Tips.ResourceNotCompressed.id:
                addTip = this._shouldCompress();
                break;
        }

        if (addTip)
            this._addTip(tip);
    },

    _shouldCompress: function()
    {
        return WebInspector.Resource.Type.isTextType(this.type)
            && this.domain
            && !("Content-Encoding" in this.responseHeaders)
            && this.contentLength !== undefined
            && this.contentLength >= 512;
    },

    _mimeTypeIsConsistentWithType: function()
    {
        if (typeof this.type === "undefined"
         || this.type === WebInspector.Resource.Type.Other
         || this.type === WebInspector.Resource.Type.XHR)
            return true;

        if (this.mimeType in WebInspector.MIMETypes)
            return this.type in WebInspector.MIMETypes[this.mimeType];

        return true;
    },

    _checkWarnings: function()
    {
        for (var warning in WebInspector.Warnings)
            this._checkWarning(WebInspector.Warnings[warning]);
    },

    _checkWarning: function(warning)
    {
        var addWarning = false;
        var msg;
        switch (warning.id) {
            case WebInspector.Warnings.IncorrectMIMEType.id:
                if (!this._mimeTypeIsConsistentWithType())
                    msg = new WebInspector.ConsoleMessage(WebInspector.ConsoleMessage.MessageSource.Other,
                        WebInspector.ConsoleMessage.MessageLevel.Warning, -1, this.url, null, 1,
                        String.sprintf(WebInspector.Warnings.IncorrectMIMEType.message,
                        WebInspector.Resource.Type.toString(this.type), this.mimeType));
                break;
        }

        if (msg)
            WebInspector.console.addMessage(msg);
    }
}

WebInspector.Resource.prototype.__proto__ = WebInspector.Object.prototype;

WebInspector.Resource.CompareByStartTime = function(a, b)
{
    if (a.startTime < b.startTime)
        return -1;
    if (a.startTime > b.startTime)
        return 1;
    return 0;
}

WebInspector.Resource.CompareByResponseReceivedTime = function(a, b)
{
    if (a.responseReceivedTime === -1 && b.responseReceivedTime !== -1)
        return 1;
    if (a.responseReceivedTime !== -1 && b.responseReceivedTime === -1)
        return -1;
    if (a.responseReceivedTime < b.responseReceivedTime)
        return -1;
    if (a.responseReceivedTime > b.responseReceivedTime)
        return 1;
    return 0;
}

WebInspector.Resource.CompareByEndTime = function(a, b)
{
    if (a.endTime === -1 && b.endTime !== -1)
        return 1;
    if (a.endTime !== -1 && b.endTime === -1)
        return -1;
    if (a.endTime < b.endTime)
        return -1;
    if (a.endTime > b.endTime)
        return 1;
    return 0;
}

WebInspector.Resource.CompareByDuration = function(a, b)
{
    if (a.duration < b.duration)
        return -1;
    if (a.duration > b.duration)
        return 1;
    return 0;
}

WebInspector.Resource.CompareByLatency = function(a, b)
{
    if (a.latency < b.latency)
        return -1;
    if (a.latency > b.latency)
        return 1;
    return 0;
}

WebInspector.Resource.CompareBySize = function(a, b)
{
    if (a.contentLength < b.contentLength)
        return -1;
    if (a.contentLength > b.contentLength)
        return 1;
    return 0;
}
/* ResourceCategory.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ResourceCategory = function(title, name)
{
    this.name = name;
    this.title = title;
    this.resources = [];
}

WebInspector.ResourceCategory.prototype = {
    toString: function()
    {
        return this.title;
    },

    addResource: function(resource)
    {
        var a = resource;
        var resourcesLength = this.resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var b = this.resources[i];
            if (a._lastPathComponentLowerCase && b._lastPathComponentLowerCase)
                if (a._lastPathComponentLowerCase < b._lastPathComponentLowerCase)
                    break;
            else if (a.name && b.name)
                if (a.name < b.name)
                    break;
        }

        this.resources.splice(i, 0, resource);
    },

    removeResource: function(resource)
    {
        this.resources.remove(resource, true);
    },

    removeAllResources: function(resource)
    {
        this.resources = [];
    }
}
/* Database.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Database = function(database, domain, name, version)
{
    this.database = database;
    this.domain = domain;
    this.name = name;
    this.version = version;
}

WebInspector.Database.prototype = {
    get database()
    {
        return this._database;
    },

    set database(x)
    {
        if (this._database === x)
            return;
        this._database = x;
    },

    get name()
    {
        return this._name;
    },

    set name(x)
    {
        if (this._name === x)
            return;
        this._name = x;
    },

    get version()
    {
        return this._version;
    },

    set version(x)
    {
        if (this._version === x)
            return;
        this._version = x;
    },

    get domain()
    {
        return this._domain;
    },

    set domain(x)
    {
        if (this._domain === x)
            return;
        this._domain = x;
    },

    get displayDomain()
    {
        return WebInspector.Resource.prototype.__lookupGetter__("displayDomain").call(this);
    },

    get tableNames()
    {
        return InspectorController.databaseTableNames(this.database).sort();
    }
}
/* DataGrid.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.         IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DataGrid = function(columns)
{
    this.element = document.createElement("div");
    this.element.className = "data-grid";
    this.element.tabIndex = 0;
    this.element.addEventListener("keydown", this._keyDown.bind(this), false);

    this._headerTable = document.createElement("table");
    this._headerTable.className = "header";

    this._dataTable = document.createElement("table");
    this._dataTable.className = "data";

    this._dataTable.addEventListener("mousedown", this._mouseDownInDataTable.bind(this), true);
    this._dataTable.addEventListener("click", this._clickInDataTable.bind(this), true);

    var scrollContainer = document.createElement("div");
    scrollContainer.className = "data-container";
    scrollContainer.appendChild(this._dataTable);

    this.element.appendChild(this._headerTable);
    this.element.appendChild(scrollContainer);

    var headerRow = document.createElement("tr");
    var columnGroup = document.createElement("colgroup");
    var columnCount = 0;

    for (var columnIdentifier in columns) {
        var column = columns[columnIdentifier];
        if (column.disclosure)
            this.disclosureColumnIdentifier = columnIdentifier;

        var col = document.createElement("col");
        if (column.width)
            col.style.width = column.width;
        columnGroup.appendChild(col);

        var cell = document.createElement("th");
        cell.className = columnIdentifier + "-column";
        cell.columnIdentifier = columnIdentifier;

        var div = document.createElement("div");
        div.textContent = column.title;
        cell.appendChild(div);

        if (column.sort) {
            cell.addStyleClass("sort-" + column.sort);
            this._sortColumnCell = cell;
        }

        if (column.sortable) {
            cell.addEventListener("click", this._clickInHeaderCell.bind(this), false);
            cell.addStyleClass("sortable");
        }

        headerRow.appendChild(cell);

        ++columnCount;
    }

    columnGroup.span = columnCount;

    var cell = document.createElement("th");
    cell.className = "corner";
    headerRow.appendChild(cell);

    this._headerTable.appendChild(columnGroup);
    this.headerTableBody.appendChild(headerRow);

    var fillerRow = document.createElement("tr");
    fillerRow.className = "filler";

    for (var i = 0; i < columnCount; ++i) {
        var cell = document.createElement("td");
        fillerRow.appendChild(cell);
    }

    this._dataTable.appendChild(columnGroup.cloneNode(true));
    this.dataTableBody.appendChild(fillerRow);

    this.columns = columns || {};
    this.children = [];
    this.selectedNode = null;
    this.expandNodesWhenArrowing = false;
    this.root = true;
    this.hasChildren = false;
    this.expanded = true;
    this.revealed = true;
    this.selected = false;
    this.dataGrid = this;
    this.indentWidth = 15;
}

WebInspector.DataGrid.prototype = {
    get sortColumnIdentifier()
    {
        if (!this._sortColumnCell)
            return null;
        return this._sortColumnCell.columnIdentifier;
    },

    get sortOrder()
    {
        if (!this._sortColumnCell || this._sortColumnCell.hasStyleClass("sort-ascending"))
            return "ascending";
        if (this._sortColumnCell.hasStyleClass("sort-descending"))
            return "descending";
        return null;
    },

    get headerTableBody()
    {
        if ("_headerTableBody" in this)
            return this._headerTableBody;

        this._headerTableBody = this._headerTable.getElementsByTagName("tbody")[0];
        if (!this._headerTableBody) {
            this._headerTableBody = this.element.ownerDocument.createElement("tbody");
            this._headerTable.insertBefore(this._headerTableBody, this._headerTable.tFoot);
        }

        return this._headerTableBody;
    },

    get dataTableBody()
    {
        if ("_dataTableBody" in this)
            return this._dataTableBody;

        this._dataTableBody = this._dataTable.getElementsByTagName("tbody")[0];
        if (!this._dataTableBody) {
            this._dataTableBody = this.element.ownerDocument.createElement("tbody");
            this._dataTable.insertBefore(this._dataTableBody, this._dataTable.tFoot);
        }

        return this._dataTableBody;
    },

    appendChild: function(child)
    {
        this.insertChild(child, this.children.length);
    },

    insertChild: function(child, index)
    {
        if (!child)
            throw("Node can't be undefined or null.");
        if (child.parent === this)
            throw("Node is already a child of this node.");

        if (child.parent)
            child.parent.removeChild(child);

        var previousChild = (index > 0 ? this.children[index - 1] : null);
        if (previousChild) {
            previousChild.nextSibling = child;
            child.previousSibling = previousChild;
        } else
            child.previousSibling = null;

        var nextChild = this.children[index];
        if (nextChild) {
            nextChild.previousSibling = child;
            child.nextSibling = nextChild;
        } else
            child.nextSibling = null;

        this.children.splice(index, 0, child);
        this.hasChildren = true;

        child.parent = this;
        child.dataGrid = this.dataGrid;

        delete child._depth;
        delete child._revealed;
        delete child._attached;

        var current = child.children[0];
        while (current) {
            current.dataGrid = this.dataGrid;
            delete current._depth;
            delete current._revealed;
            delete current._attached;
            current = current.traverseNextNode(false, child, true);
        }

        if (this.expanded)
            child._attach();
    },

    removeChild: function(child)
    {
        if (!child)
            throw("Node can't be undefined or null.");
        if (child.parent !== this)
            throw("Node is not a child of this node.");

        child.deselect();

        this.children.remove(child, true);

        if (child.previousSibling)
            child.previousSibling.nextSibling = child.nextSibling;
        if (child.nextSibling)
            child.nextSibling.previousSibling = child.previousSibling;

        child.dataGrid = null;
        child.parent = null;
        child.nextSibling = null;
        child.previousSibling = null;
    },

    removeChildren: function()
    {
        for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            child.deselect();
            child._detach();

            child.dataGrid = null;
            child.parent = null;
            child.nextSibling = null;
            child.previousSibling = null;
        }

        this.children = [];
    },

    removeChildrenRecursive: function()
    {
        var childrenToRemove = this.children;

        var child = this.children[0];
        while (child) {
            if (child.children.length)
                childrenToRemove = childrenToRemove.concat(child.children);
            child = child.traverseNextNode(false, this, true);
        }

        for (var i = 0; i < childrenToRemove.length; ++i) {
            var child = childrenToRemove[i];
            child.deselect();
            child._detach();

            child.children = [];
            child.dataGrid = null;
            child.parent = null;
            child.nextSibling = null;
            child.previousSibling = null;
        }

        this.children = [];
    },

    handleKeyEvent: function(event)
    {
        if (!this.selectedNode || event.shiftKey || event.metaKey || event.ctrlKey)
            return false;

        var handled = false;
        var nextSelectedNode;
        if (event.keyIdentifier === "Up" && !event.altKey) {
            nextSelectedNode = this.selectedNode.traversePreviousNode(true);
            while (nextSelectedNode && !nextSelectedNode.selectable)
                nextSelectedNode = nextSelectedNode.traversePreviousNode(!this.expandTreeNodesWhenArrowing);
            handled = nextSelectedNode ? true : false;
        } else if (event.keyIdentifier === "Down" && !event.altKey) {
            nextSelectedNode = this.selectedNode.traverseNextNode(true);
            while (nextSelectedNode && !nextSelectedNode.selectable)
                nextSelectedNode = nextSelectedNode.traverseNextNode(!this.expandTreeNodesWhenArrowing);
            handled = nextSelectedNode ? true : false;
        } else if (event.keyIdentifier === "Left") {
            if (this.selectedNode.expanded) {
                if (event.altKey)
                    this.selectedNode.collapseRecursively();
                else
                    this.selectedNode.collapse();
                handled = true;
            } else if (this.selectedNode.parent && !this.selectedNode.parent.root) {
                handled = true;
                if (this.selectedNode.parent.selectable) {
                    nextSelectedNode = this.selectedNode.parent;
                    handled = nextSelectedNode ? true : false;
                } else if (this.selectedNode.parent)
                    this.selectedNode.parent.collapse();
            }
        } else if (event.keyIdentifier === "Right") {
            if (!this.selectedNode.revealed) {
                this.selectedNode.reveal();
                handled = true;
            } else if (this.selectedNode.hasChildren) {
                handled = true;
                if (this.selectedNode.expanded) {
                    nextSelectedNode = this.selectedNode.children[0];
                    handled = nextSelectedNode ? true : false;
                } else {
                    if (event.altKey)
                        this.selectedNode.expandRecursively();
                    else
                        this.selectedNode.expand();
                }
            }
        }

        if (nextSelectedNode) {
            nextSelectedNode.reveal();
            nextSelectedNode.select();
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }

        return handled;
    },

    expand: function()
    {
        // This is the root, do nothing.
    },

    collapse: function()
    {
        // This is the root, do nothing.
    },

    reveal: function()
    {
        // This is the root, do nothing.
    },

    dataGridNodeFromEvent: function(event)
    {
        var rowElement = event.target.enclosingNodeOrSelfWithNodeName("tr");
        return rowElement._dataGridNode;
    },

    dataGridNodeFromPoint: function(x, y)
    {
        var node = this._dataTable.ownerDocument.elementFromPoint(x, y);
        var rowElement = node.enclosingNodeOrSelfWithNodeName("tr");
        return rowElement._dataGridNode;
    },

    _keyDown: function(event)
    {
        this.handleKeyEvent(event);
    },

    _clickInHeaderCell: function(event)
    {
        var cell = event.target.enclosingNodeOrSelfWithNodeName("th");
        if (!cell || !cell.columnIdentifier || !cell.hasStyleClass("sortable"))
            return;

        var sortOrder = this.sortOrder;

        if (this._sortColumnCell) {
            this._sortColumnCell.removeStyleClass("sort-ascending");
            this._sortColumnCell.removeStyleClass("sort-descending");
        }

        if (cell == this._sortColumnCell) {
            if (sortOrder == "ascending")
                sortOrder = "descending";
            else
                sortOrder = "ascending";
        }

        this._sortColumnCell = cell;

        cell.addStyleClass("sort-" + sortOrder);

        this.dispatchEventToListeners("sorting changed");
    },

    _mouseDownInDataTable: function(event)
    {
        var gridNode = this.dataGridNodeFromEvent(event);
        if (!gridNode || !gridNode.selectable)
            return;
    
        if (gridNode.isEventWithinDisclosureTriangle(event))
            return;

        if (event.metaKey) {
            if (gridNode.selected)
                gridNode.deselect();
            else
                gridNode.select();
        } else
            gridNode.select();
    },

    _clickInDataTable: function(event)
    {
        var gridNode = this.dataGridNodeFromEvent(event);
        if (!gridNode || !gridNode.hasChildren)
            return;

        if (!gridNode.isEventWithinDisclosureTriangle(event))
            return;

        if (gridNode.expanded) {
            if (event.altKey)
                gridNode.collapseRecursively();
            else
                gridNode.collapse();
        } else {
            if (event.altKey)
                gridNode.expandRecursively();
            else
                gridNode.expand();
        }
    }
}

WebInspector.DataGrid.prototype.__proto__ = WebInspector.Object.prototype;

WebInspector.DataGridNode = function(data, hasChildren)
{
    this._expanded = false;
    this._selected = false;
    this._shouldRefreshChildren = true;
    this._data = data || {};
    this.hasChildren = hasChildren || false;
    this.children = [];
    this.dataGrid = null;
    this.parent = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.disclosureToggleWidth = 10;
}

WebInspector.DataGridNode.prototype = {
    selectable: true,

    get element()
    {
        if (this._element)
            return this._element;

        if (!this.dataGrid)
            return null;

        this._element = document.createElement("tr");
        this._element._dataGridNode = this;

        if (this.hasChildren)
            this._element.addStyleClass("parent");
        if (this.expanded)
            this._element.addStyleClass("expanded");
        if (this.selected)
            this._element.addStyleClass("selected");
        if (this.revealed)
            this._element.addStyleClass("revealed");

        for (var columnIdentifier in this.dataGrid.columns) {
            var cell = this.createCell(columnIdentifier);
            this._element.appendChild(cell);
        }

        return this._element;
    },

    get data()
    {
        return this._data;
    },

    set data(x)
    {
        this._data = x || {};
        this.refresh();
    },

    get revealed()
    {
        if ("_revealed" in this)
            return this._revealed;

        var currentAncestor = this.parent;
        while (currentAncestor && !currentAncestor.root) {
            if (!currentAncestor.expanded) {
                this._revealed = false;
                return false;
            }

            currentAncestor = currentAncestor.parent;
        }

        this._revealed = true;
        return true;
    },

    set revealed(x)
    {
        if (this._revealed === x)
            return;

        this._revealed = x;

        if (this._element) {
            if (this._revealed)
                this._element.addStyleClass("revealed");
            else
                this._element.removeStyleClass("revealed");
        }

        for (var i = 0; i < this.children.length; ++i)
            this.children[i].revealed = x && this.expanded;
    },

    get depth()
    {
        if ("_depth" in this)
            return this._depth;
        if (this.parent && !this.parent.root)
            this._depth = this.parent.depth + 1;
        else
            this._depth = 0;
        return this._depth;
    },

    get shouldRefreshChildren()
    {
        return this._shouldRefreshChildren;
    },

    set shouldRefreshChildren(x)
    {
        this._shouldRefreshChildren = x;
        if (x && this.expanded)
            this.expand();
    },

    get selected()
    {
        return this._selected;
    },

    set selected(x)
    {
        if (x)
            this.select();
        else
            this.deselect();
    },

    get expanded()
    {
        return this._expanded;
    },

    set expanded(x)
    {
        if (x)
            this.expand();
        else
            this.collapse();
    },

    refresh: function()
    {
        if (!this._element || !this.dataGrid)
            return;

        this._element.removeChildren();

        for (var columnIdentifier in this.dataGrid.columns) {
            var cell = this.createCell(columnIdentifier);
            this._element.appendChild(cell);
        }
    },

    createCell: function(columnIdentifier)
    {
        var cell = document.createElement("td");
        cell.className = columnIdentifier + "-column";

        var div = document.createElement("div");
        div.textContent = this.data[columnIdentifier];
        cell.appendChild(div);

        if (columnIdentifier === this.dataGrid.disclosureColumnIdentifier) {
            cell.addStyleClass("disclosure");
            if (this.depth)
                cell.style.setProperty("padding-left", (this.depth * this.dataGrid.indentWidth) + "px");
        }

        return cell;
    },

    // Share these functions with DataGrid. They are written to work with a DataGridNode this object.
    appendChild: WebInspector.DataGrid.prototype.appendChild,
    insertChild: WebInspector.DataGrid.prototype.insertChild,
    removeChild: WebInspector.DataGrid.prototype.removeChild,
    removeChildren: WebInspector.DataGrid.prototype.removeChildren,
    removeChildrenRecursive: WebInspector.DataGrid.prototype.removeChildrenRecursive,

    collapse: function()
    {
        if (this._element)
            this._element.removeStyleClass("expanded");

        this._expanded = false;

        for (var i = 0; i < this.children.length; ++i)
            this.children[i].revealed = false;

        this.dispatchEventToListeners("collapsed");
    },

    collapseRecursively: function()
    {
        var item = this;
        while (item) {
            if (item.expanded)
                item.collapse();
            item = item.traverseNextNode(false, this, true);
        }
    },

    expand: function()
    {
        if (!this.hasChildren || this.expanded)
            return;

        if (this.revealed && !this._shouldRefreshChildren)
            for (var i = 0; i < this.children.length; ++i)
                this.children[i].revealed = true;

        if (this._shouldRefreshChildren) {
            for (var i = 0; i < this.children.length; ++i)
                this.children[i]._detach();

            this.dispatchEventToListeners("populate");

            if (this._attached) {
                for (var i = 0; i < this.children.length; ++i) {
                    var child = this.children[i];
                    if (this.revealed)
                        child.revealed = true;
                    child._attach();
                }
            }

            delete this._shouldRefreshChildren;
        }

        if (this._element)
            this._element.addStyleClass("expanded");

        this._expanded = true;

        this.dispatchEventToListeners("expanded");
    },

    expandRecursively: function()
    {
        var item = this;
        while (item) {
            item.expand();
            item = item.traverseNextNode(false, this);
        }
    },

    reveal: function()
    {
        var currentAncestor = this.parent;
        while (currentAncestor && !currentAncestor.root) {
            if (!currentAncestor.expanded)
                currentAncestor.expand();
            currentAncestor = currentAncestor.parent;
        }

        this.element.scrollIntoViewIfNeeded(false);

        this.dispatchEventToListeners("revealed");
    },

    select: function(supressSelectedEvent)
    {
        if (!this.dataGrid || !this.selectable || this.selected)
            return;

        if (this.dataGrid.selectedNode)
            this.dataGrid.selectedNode.deselect();

        this._selected = true;
        this.dataGrid.selectedNode = this;

        if (this._element)
            this._element.addStyleClass("selected");

        if (!supressSelectedEvent)
            this.dispatchEventToListeners("selected");
    },

    deselect: function(supressDeselectedEvent)
    {
        if (!this.dataGrid || this.dataGrid.selectedNode !== this || !this.selected)
            return;

        this._selected = false;
        this.dataGrid.selectedNode = null;

        if (this._element)
            this._element.removeStyleClass("selected");

        if (!supressDeselectedEvent)
            this.dispatchEventToListeners("deselected");
    },

    traverseNextNode: function(skipHidden, stayWithin, dontPopulate, info)
    {
        if (!dontPopulate && this.hasChildren)
            this.dispatchEventToListeners("populate");

        if (info)
            info.depthChange = 0;

        var node = (!skipHidden || this.revealed) ? this.children[0] : null;
        if (node && (!skipHidden || this.expanded)) {
            if (info)
                info.depthChange = 1;
            return node;
        }

        if (this === stayWithin)
            return null;

        node = (!skipHidden || this.revealed) ? this.nextSibling : null;
        if (node)
            return node;

        node = this;
        while (node && !node.root && !((!skipHidden || node.revealed) ? node.nextSibling : null) && node.parent !== stayWithin) {
            if (info)
                info.depthChange -= 1;
            node = node.parent;
        }

        if (!node)
            return null;

        return (!skipHidden || node.revealed) ? node.nextSibling : null;
    },

    traversePreviousNode: function(skipHidden, dontPopulate)
    {
        var node = (!skipHidden || this.revealed) ? this.previousSibling : null;
        if (!dontPopulate && node && node.hasChildren)
            node.dispatchEventToListeners("populate");

        while (node && ((!skipHidden || (node.revealed && node.expanded)) ? node.children[node.children.length - 1] : null)) {
            if (!dontPopulate && node.hasChildren)
                node.dispatchEventToListeners("populate");
            node = ((!skipHidden || (node.revealed && node.expanded)) ? node.children[node.children.length - 1] : null);
        }

        if (node)
            return node;

        if (!this.parent || this.parent.root)
            return null;

        return this.parent;
    },

    isEventWithinDisclosureTriangle: function(event)
    {
        if (!this.hasChildren)
            return false;
        var cell = event.target.enclosingNodeOrSelfWithNodeName("td");
        if (!cell.hasStyleClass("disclosure"))
            return false;
        var computedLeftPadding = window.getComputedStyle(cell).getPropertyCSSValue("padding-left").getFloatValue(CSSPrimitiveValue.CSS_PX);
        var left = cell.totalOffsetLeft + computedLeftPadding;
        return event.pageX >= left && event.pageX <= left + this.disclosureToggleWidth;
    },

    _attach: function()
    {
        if (!this.dataGrid || this._attached)
            return;

        this._attached = true;

        var nextNode = null;
        var previousNode = this.traversePreviousNode(true, true);
        if (previousNode && previousNode.element.parentNode && previousNode.element.nextSibling)
            var nextNode = previousNode.element.nextSibling;
        if (!nextNode)
            nextNode = this.dataGrid.dataTableBody.lastChild;
        this.dataGrid.dataTableBody.insertBefore(this.element, nextNode);

        if (this.expanded)
            for (var i = 0; i < this.children.length; ++i)
                this.children[i]._attach();
    },

    _detach: function()
    {
        if (!this._attached)
            return;

        this._attached = false;

        if (this._element && this._element.parentNode)
            this._element.parentNode.removeChild(this._element);

        for (var i = 0; i < this.children.length; ++i)
            this.children[i]._detach();
    }
}

WebInspector.DataGridNode.prototype.__proto__ = WebInspector.Object.prototype;
/* Script.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Script = function(sourceID, sourceURL, source, startingLine, errorLine, errorMessage)
{
    this.sourceID = sourceID;
    this.sourceURL = sourceURL;
    this.source = source;
    this.startingLine = startingLine;
    this.errorLine = errorLine;
    this.errorMessage = errorMessage;
}

WebInspector.Script.prototype = {
}
/* Breakpoint.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Breakpoint = function(url, line, sourceID)
{
    this.url = url;
    this.line = line;
    this.sourceID = sourceID;
    this._enabled = true;
}

WebInspector.Breakpoint.prototype = {
    get enabled()
    {
        return this._enabled;
    },

    set enabled(x)
    {
        if (this._enabled === x)
            return;

        this._enabled = x;

        if (this._enabled)
            this.dispatchEventToListeners("enabled");
        else
            this.dispatchEventToListeners("disabled");
    }
}

WebInspector.Breakpoint.prototype.__proto__ = WebInspector.Object.prototype;
/* SidebarPane.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.SidebarPane = function(title)
{
    this.element = document.createElement("div");
    this.element.className = "pane";

    this.titleElement = document.createElement("div");
    this.titleElement.className = "title";
    this.titleElement.addEventListener("click", this.toggleExpanded.bind(this), false);

    this.bodyElement = document.createElement("div");
    this.bodyElement.className = "body";

    this.element.appendChild(this.titleElement);
    this.element.appendChild(this.bodyElement);

    this.title = title;
    this.growbarVisible = false;
    this.expanded = false;
}

WebInspector.SidebarPane.prototype = {
    get title()
    {
        return this._title;
    },

    set title(x)
    {
        if (this._title === x)
            return;
        this._title = x;
        this.titleElement.textContent = x;
    },

    get growbarVisible()
    {
        return this._growbarVisible;
    },

    set growbarVisible(x)
    {
        if (this._growbarVisible === x)
            return;

        this._growbarVisible = x;

        if (x && !this._growbarElement) {
            this._growbarElement = document.createElement("div");
            this._growbarElement.className = "growbar";
            this.element.appendChild(this._growbarElement);
        } else if (!x && this._growbarElement) {
            if (this._growbarElement.parentNode)
                this._growbarElement.parentNode(this._growbarElement);
            delete this._growbarElement;
        }
    },

    get expanded()
    {
        return this._expanded;
    },

    set expanded(x)
    {
        if (x)
            this.expand();
        else
            this.collapse();
    },

    expand: function()
    {
        if (this._expanded)
            return;
        this._expanded = true;
        this.element.addStyleClass("expanded");
        if (this.onexpand)
            this.onexpand(this);
    },

    collapse: function()
    {
        if (!this._expanded)
            return;
        this._expanded = false;
        this.element.removeStyleClass("expanded");
        if (this.oncollapse)
            this.oncollapse(this);
    },

    toggleExpanded: function()
    {
        this.expanded = !this.expanded;
    }
}

WebInspector.SidebarPane.prototype.__proto__ = WebInspector.Object.prototype;
/* ElementsTreeOutline.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008 Matt Lilek <webkit@mattlilek.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ElementsTreeOutline = function() {
    this.element = document.createElement("ol");
    this.element.addEventListener("mousedown", this._onmousedown.bind(this), false);
    this.element.addEventListener("dblclick", this._ondblclick.bind(this), false);
    this.element.addEventListener("mousemove", this._onmousemove.bind(this), false);
    this.element.addEventListener("mouseout", this._onmouseout.bind(this), false);

    TreeOutline.call(this, this.element);

    this.includeRootDOMNode = true;
    this.selectEnabled = false;
    this.rootDOMNode = null;
    this.focusedDOMNode = null;
}

WebInspector.ElementsTreeOutline.prototype = {
    get rootDOMNode()
    {
        return this._rootDOMNode;
    },

    set rootDOMNode(x)
    {
        if (objectsAreSame(this._rootDOMNode, x))
            return;

        this._rootDOMNode = x;

        this.update();
    },

    get focusedDOMNode()
    {
        return this._focusedDOMNode;
    },

    set focusedDOMNode(x)
    {
        if (objectsAreSame(this._focusedDOMNode, x)) {
            this.revealAndSelectNode(x);
            return;
        }

        this._focusedDOMNode = x;

        this.revealAndSelectNode(x);

        // The revealAndSelectNode() method might find a different element if there is inlined text,
        // and the select() call would change the focusedDOMNode and reenter this setter. So to
        // avoid calling focusedNodeChanged() twice, first check if _focusedDOMNode is the same
        // node as the one passed in.
        if (objectsAreSame(this._focusedDOMNode, x)) {
            this.focusedNodeChanged();

            if (x && !this.suppressSelectHighlight) {
                InspectorController.highlightDOMNode(x);

                if ("_restorePreviousHighlightNodeTimeout" in this)
                    clearTimeout(this._restorePreviousHighlightNodeTimeout);

                function restoreHighlightToHoveredNode()
                {
                    var hoveredNode = WebInspector.hoveredDOMNode;
                    if (hoveredNode)
                        InspectorController.highlightDOMNode(hoveredNode);
                    else
                        InspectorController.hideDOMNodeHighlight();
                }

                this._restorePreviousHighlightNodeTimeout = setTimeout(restoreHighlightToHoveredNode, 2000);
            }
        }
    },

    update: function()
    {
        this.removeChildren();

        if (!this.rootDOMNode)
            return;

        var treeElement;
        if (this.includeRootDOMNode) {
            treeElement = new WebInspector.ElementsTreeElement(this.rootDOMNode);
            treeElement.selectable = this.selectEnabled;
            this.appendChild(treeElement);
        } else {
            // FIXME: this could use findTreeElement to reuse a tree element if it already exists
            var node = (Preferences.ignoreWhitespace ? firstChildSkippingWhitespace.call(this.rootDOMNode) : this.rootDOMNode.firstChild);
            while (node) {
                treeElement = new WebInspector.ElementsTreeElement(node);
                treeElement.selectable = this.selectEnabled;
                this.appendChild(treeElement);
                node = Preferences.ignoreWhitespace ? nextSiblingSkippingWhitespace.call(node) : node.nextSibling;
            }
        }

        this.updateSelection();
    },

    updateSelection: function()
    {
        if (!this.selectedTreeElement)
            return;
        var element = this.treeOutline.selectedTreeElement;
        element.updateSelection();
    },

    focusedNodeChanged: function(forceUpdate) {},

    findTreeElement: function(node, isAncestor, getParent, equal)
    {
        if (typeof isAncestor === "undefined")
            isAncestor = isAncestorIncludingParentFrames;
        if (typeof getParent === "undefined")
            getParent = parentNodeOrFrameElement;
        if (typeof equal === "undefined")
            equal = objectsAreSame;

        var treeElement = TreeOutline.prototype.findTreeElement.call(this, node, isAncestor, getParent, equal);
        if (!treeElement && node.nodeType === Node.TEXT_NODE) {
            // The text node might have been inlined if it was short, so try to find the parent element.
            treeElement = TreeOutline.prototype.findTreeElement.call(this, node.parentNode, isAncestor, getParent, equal);
        }

        return treeElement;
    },

    revealAndSelectNode: function(node)
    {
        if (!node)
            return;

        var treeElement = this.findTreeElement(node);
        if (!treeElement)
            return;

        treeElement.reveal();
        treeElement.select();
    },

    _treeElementFromEvent: function(event)
    {
        var root = this.element;

        // We choose this X coordinate based on the knowledge that our list
        // items extend nearly to the right edge of the outer <ol>.
        var x = root.totalOffsetLeft + root.offsetWidth - 20;

        var y = event.pageY;

        // Our list items have 1-pixel cracks between them vertically. We avoid
        // the cracks by checking slightly above and slightly below the mouse
        // and seeing if we hit the same element each time.
        var elementUnderMouse = this.treeElementFromPoint(x, y);
        var elementAboveMouse = this.treeElementFromPoint(x, y - 2);
        var element;
        if (elementUnderMouse === elementAboveMouse)
            element = elementUnderMouse;
        else
            element = this.treeElementFromPoint(x, y + 2);

        return element;
    },

    _ondblclick: function(event)
    {
        var element = this._treeElementFromEvent(event);

        if (!element || !element.ondblclick)
            return;

        element.ondblclick(element, event);
    },

    _onmousedown: function(event)
    {
        var element = this._treeElementFromEvent(event);

        if (!element || element.isEventWithinDisclosureTriangle(event))
            return;

        element.select();
    },

    _onmousemove: function(event)
    {
        if (this._previousHoveredElement) {
            this._previousHoveredElement.hovered = false;
            delete this._previousHoveredElement;
        }

        var element = this._treeElementFromEvent(event);
        if (element && !element.elementCloseTag) {
            element.hovered = true;
            this._previousHoveredElement = element;
        }

        WebInspector.hoveredDOMNode = (element && !element.elementCloseTag ? element.representedObject : null);
    },

    _onmouseout: function(event)
    {
        var nodeUnderMouse = document.elementFromPoint(event.pageX, event.pageY);
        if (nodeUnderMouse.isDescendant(this.element))
            return;

        if (this._previousHoveredElement) {
            this._previousHoveredElement.hovered = false;
            delete this._previousHoveredElement;
        }

        WebInspector.hoveredDOMNode = null;
    }
}

WebInspector.ElementsTreeOutline.prototype.__proto__ = TreeOutline.prototype;

WebInspector.ElementsTreeElement = function(node)
{
    var hasChildren = node.contentDocument || (Preferences.ignoreWhitespace ? (firstChildSkippingWhitespace.call(node) ? true : false) : node.hasChildNodes());
    var titleInfo = nodeTitleInfo.call(node, hasChildren, WebInspector.linkifyURL);

    if (titleInfo.hasChildren) 
        this.whitespaceIgnored = Preferences.ignoreWhitespace;

    // The title will be updated in onattach.
    TreeElement.call(this, "", node, titleInfo.hasChildren);
}

WebInspector.ElementsTreeElement.prototype = {
    get highlighted()
    {
        return this._highlighted;
    },

    set highlighted(x)
    {
        if (this._highlighted === x)
            return;

        this._highlighted = x;

        if (this.listItemElement) {
            if (x)
                this.listItemElement.addStyleClass("highlighted");
            else
                this.listItemElement.removeStyleClass("highlighted");
        }
    },

    get hovered()
    {
        return this._hovered;
    },

    set hovered(x)
    {
        if (this._hovered === x)
            return;

        this._hovered = x;

        if (this.listItemElement) {
            if (x) {
                this.updateSelection();
                this.listItemElement.addStyleClass("hovered");
            } else
                this.listItemElement.removeStyleClass("hovered");
        }
    },

    updateSelection: function()
    {
        var listItemElement = this.listItemElement;
        if (!listItemElement)
            return;

        if (document.body.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        if (!this.selectionElement) {
            this.selectionElement = document.createElement("div");
            this.selectionElement.className = "selection selected";
            listItemElement.insertBefore(this.selectionElement, listItemElement.firstChild);
        }

        this.selectionElement.style.height = listItemElement.offsetHeight + "px";
    },

    onattach: function()
    {
        this.listItemElement.addEventListener("mousedown", this.onmousedown.bind(this), false);

        if (this._highlighted)
            this.listItemElement.addStyleClass("highlighted");

        if (this._hovered) {
            this.updateSelection();
            this.listItemElement.addStyleClass("hovered");
        }

        this._updateTitle();

        this._preventFollowingLinksOnDoubleClick();
    },

    _preventFollowingLinksOnDoubleClick: function()
    {
        var links = this.listItemElement.querySelectorAll("li > .webkit-html-tag > .webkit-html-attribute > .webkit-html-external-link, li > .webkit-html-tag > .webkit-html-attribute > .webkit-html-resource-link");
        if (!links)
            return;

        for (var i = 0; i < links.length; ++i)
            links[i].preventFollowOnDoubleClick = true;
    },

    onpopulate: function()
    {
        if (this.children.length || this.whitespaceIgnored !== Preferences.ignoreWhitespace)
            return;

        this.whitespaceIgnored = Preferences.ignoreWhitespace;

        this.updateChildren();
    },

    updateChildren: function(fullRefresh)
    {
        if (fullRefresh) {
            var selectedTreeElement = this.treeOutline.selectedTreeElement;
            if (selectedTreeElement && selectedTreeElement.hasAncestor(this))
                this.select();
            this.removeChildren();
        }

        var treeElement = this;
        var treeChildIndex = 0;

        function updateChildrenOfNode(node)
        {
            var treeOutline = treeElement.treeOutline;
            var child = (Preferences.ignoreWhitespace ? firstChildSkippingWhitespace.call(node) : node.firstChild);
            while (child) {
                var currentTreeElement = treeElement.children[treeChildIndex];
                if (!currentTreeElement || !objectsAreSame(currentTreeElement.representedObject, child)) {
                    // Find any existing element that is later in the children list.
                    var existingTreeElement = null;
                    for (var i = (treeChildIndex + 1); i < treeElement.children.length; ++i) {
                        if (objectsAreSame(treeElement.children[i].representedObject, child)) {
                            existingTreeElement = treeElement.children[i];
                            break;
                        }
                    }

                    if (existingTreeElement && existingTreeElement.parent === treeElement) {
                        // If an existing element was found and it has the same parent, just move it.
                        var wasSelected = existingTreeElement.selected;
                        treeElement.removeChild(existingTreeElement);
                        treeElement.insertChild(existingTreeElement, treeChildIndex);
                        if (wasSelected)
                            existingTreeElement.select();
                    } else {
                        // No existing element found, insert a new element.
                        var newElement = new WebInspector.ElementsTreeElement(child);
                        newElement.selectable = treeOutline.selectEnabled;
                        treeElement.insertChild(newElement, treeChildIndex);
                    }
                }

                child = Preferences.ignoreWhitespace ? nextSiblingSkippingWhitespace.call(child) : child.nextSibling;
                ++treeChildIndex;
            }
        }

        // Remove any tree elements that no longer have this node (or this node's contentDocument) as their parent.
        for (var i = (this.children.length - 1); i >= 0; --i) {
            if ("elementCloseTag" in this.children[i])
                continue;

            var currentChild = this.children[i];
            var currentNode = currentChild.representedObject;
            var currentParentNode = currentNode.parentNode;

            if (objectsAreSame(currentParentNode, this.representedObject))
                continue;
            if (this.representedObject.contentDocument && objectsAreSame(currentParentNode, this.representedObject.contentDocument))
                continue;

            var selectedTreeElement = this.treeOutline.selectedTreeElement;
            if (selectedTreeElement && (selectedTreeElement === currentChild || selectedTreeElement.hasAncestor(currentChild)))
                this.select();

            this.removeChildAtIndex(i);

            if (this.treeOutline.panel && currentNode.contentDocument)
                this.treeOutline.panel.unregisterMutationEventListeners(currentNode.contentDocument.defaultView);
        }

        if (this.representedObject.contentDocument)
            updateChildrenOfNode(this.representedObject.contentDocument);
        updateChildrenOfNode(this.representedObject);

        var lastChild = this.children[this.children.length - 1];
        if (this.representedObject.nodeType == Node.ELEMENT_NODE && (!lastChild || !lastChild.elementCloseTag)) {
            var title = "<span class=\"webkit-html-tag close\">&lt;/" + this.representedObject.nodeName.toLowerCase().escapeHTML() + "&gt;</span>";
            var item = new TreeElement(title, null, false);
            item.selectable = false;
            item.elementCloseTag = true;
            this.appendChild(item);
        }
    },

    onexpand: function()
    {
        this.treeOutline.updateSelection();

        if (this.treeOutline.panel && this.representedObject.contentDocument)
            this.treeOutline.panel.registerMutationEventListeners(this.representedObject.contentDocument.defaultView);
    },

    oncollapse: function()
    {
        this.treeOutline.updateSelection();
    },

    onreveal: function()
    {
        if (this.listItemElement)
            this.listItemElement.scrollIntoViewIfNeeded(false);
    },

    onselect: function()
    {
        this.treeOutline.focusedDOMNode = this.representedObject;
        this.updateSelection();
    },

    onmousedown: function(event)
    {
        if (this._editing)
            return;

        // Prevent selecting the nearest word on double click.
        if (event.detail >= 2)
            event.preventDefault();
    },

    ondblclick: function(treeElement, event)
    {
        if (this._editing)
            return;

        if (this._startEditing(event))
            return;

        if (this.treeOutline.panel) {
            this.treeOutline.rootDOMNode = this.parent.representedObject;
            this.treeOutline.focusedDOMNode = this.representedObject;
        }

        if (this.hasChildren && !this.expanded)
            this.expand();
    },

    _startEditing: function(event)
    {
        if (this.treeOutline.focusedDOMNode != this.representedObject)
            return;

        if (this.representedObject.nodeType != Node.ELEMENT_NODE && this.representedObject.nodeType != Node.TEXT_NODE)
            return false;

        var textNode = event.target.enclosingNodeOrSelfWithClass("webkit-html-text-node");
        if (textNode)
            return this._startEditingTextNode(textNode);

        var attribute = event.target.enclosingNodeOrSelfWithClass("webkit-html-attribute");
        if (attribute)
            return this._startEditingAttribute(attribute, event);

        return false;
    },

    _startEditingAttribute: function(attribute, event)
    {
        if (WebInspector.isBeingEdited(attribute))
            return true;

        var attributeNameElement = attribute.getElementsByClassName("webkit-html-attribute-name")[0];
        if (!attributeNameElement)
            return false;

        var attributeName = attributeNameElement.innerText;

        function removeZeroWidthSpaceRecursive(node)
        {
            if (node.nodeType === Node.TEXT_NODE) {
                node.nodeValue = node.nodeValue.replace(/\u200B/g, "");
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE)
                return;

            for (var child = node.firstChild; child; child = child.nextSibling)
                removeZeroWidthSpaceRecursive(child);
        }

        // Remove zero-width spaces that were added by nodeTitleInfo.
        removeZeroWidthSpaceRecursive(attribute);

        this._editing = true;

        WebInspector.startEditing(attribute, this._attributeEditingCommitted.bind(this), this._editingCancelled.bind(this), attributeName);
        window.getSelection().setBaseAndExtent(event.target, 0, event.target, 1);

        return true;
    },

    _startEditingTextNode: function(textNode)
    {
        if (WebInspector.isBeingEdited(textNode))
            return true;

        this._editing = true;

        WebInspector.startEditing(textNode, this._textNodeEditingCommitted.bind(this), this._editingCancelled.bind(this));
        window.getSelection().setBaseAndExtent(textNode, 0, textNode, 1);

        return true;
    },

    _attributeEditingCommitted: function(element, newText, oldText, attributeName)
    {
        delete this._editing;

        var parseContainerElement = document.createElement("span");
        parseContainerElement.innerHTML = "<span " + newText + "></span>";
        var parseElement = parseContainerElement.firstChild;
        if (!parseElement || !parseElement.hasAttributes()) {
            editingCancelled(element, context);
            return;
        }

        var foundOriginalAttribute = false;
        for (var i = 0; i < parseElement.attributes.length; ++i) {
            var attr = parseElement.attributes[i];
            foundOriginalAttribute = foundOriginalAttribute || attr.name === attributeName;
            InspectorController.inspectedWindow().Element.prototype.setAttribute.call(this.representedObject, attr.name, attr.value);
        }

        if (!foundOriginalAttribute)
            InspectorController.inspectedWindow().Element.prototype.removeAttribute.call(this.representedObject, attributeName);

        this._updateTitle();

        this.treeOutline.focusedNodeChanged(true);
    },

    _textNodeEditingCommitted: function(element, newText)
    {
        delete this._editing;

        var textNode;
        if (this.representedObject.nodeType == Node.ELEMENT_NODE) {
            // We only show text nodes inline in elements if the element only
            // has a single child, and that child is a text node.
            textNode = this.representedObject.firstChild;
        } else if (this.representedObject.nodeType == Node.TEXT_NODE)
            textNode = this.representedObject;

        textNode.nodeValue = newText;
        this._updateTitle();
    },

    _editingCancelled: function(element, context)
    {
        delete this._editing;

        this._updateTitle();
    },

    _updateTitle: function()
    {
        var title = nodeTitleInfo.call(this.representedObject, this.hasChildren, WebInspector.linkifyURL).title;
        this.title = "<span class=\"highlight\">" + title + "</span>";
        delete this.selectionElement;
        this.updateSelection();
        this._preventFollowingLinksOnDoubleClick();
    },
}

WebInspector.ElementsTreeElement.prototype.__proto__ = TreeElement.prototype;
/* SidebarTreeElement.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.SidebarSectionTreeElement = function(title, representedObject, hasChildren)
{
    TreeElement.call(this, title.escapeHTML(), representedObject || {}, hasChildren);
}

WebInspector.SidebarSectionTreeElement.prototype = {
    selectable: false,

    get smallChildren()
    {
        return this._smallChildren;
    },

    set smallChildren(x)
    {
        if (this._smallChildren === x)
            return;

        this._smallChildren = x;

        if (this._smallChildren)
            this._childrenListNode.addStyleClass("small");
        else
            this._childrenListNode.removeStyleClass("small");
    },

    onattach: function()
    {
        this._listItemNode.addStyleClass("sidebar-tree-section");
    },

    onreveal: function()
    {
        if (this.listItemElement)
            this.listItemElement.scrollIntoViewIfNeeded(false);
    }
}

WebInspector.SidebarSectionTreeElement.prototype.__proto__ = TreeElement.prototype;

WebInspector.SidebarTreeElement = function(className, title, subtitle, representedObject, hasChildren)
{
    TreeElement.call(this, "", representedObject || {}, hasChildren);

    if (hasChildren) {
        this.disclosureButton = document.createElement("button");
        this.disclosureButton.className = "disclosure-button";
    }

    if (!this.iconElement) {
        this.iconElement = document.createElement("img");
        this.iconElement.className = "icon";
    }

    this.statusElement = document.createElement("div");
    this.statusElement.className = "status";

    this.titlesElement = document.createElement("div");
    this.titlesElement.className = "titles";

    this.titleElement = document.createElement("span");
    this.titleElement.className = "title";
    this.titlesElement.appendChild(this.titleElement);

    this.subtitleElement = document.createElement("span");
    this.subtitleElement.className = "subtitle";
    this.titlesElement.appendChild(this.subtitleElement);

    this.className = className;
    this.mainTitle = title;
    this.subtitle = subtitle;
}

WebInspector.SidebarTreeElement.prototype = {
    get small()
    {
        return this._small;
    },

    set small(x)
    {
        this._small = x;

        if (this._listItemNode) {
            if (this._small)
                this._listItemNode.addStyleClass("small");
            else
                this._listItemNode.removeStyleClass("small");
        }
    },

    get mainTitle()
    {
        return this._mainTitle;
    },

    set mainTitle(x)
    {
        this._mainTitle = x;
        this.refreshTitles();
    },

    get subtitle()
    {
        return this._subtitle;
    },

    set subtitle(x)
    {
        this._subtitle = x;
        this.refreshTitles();
    },

    get bubbleText()
    {
        return this._bubbleText;
    },

    set bubbleText(x)
    {
        if (!this.bubbleElement) {
            this.bubbleElement = document.createElement("div");
            this.bubbleElement.className = "bubble";
            this.statusElement.appendChild(this.bubbleElement);
        }

        this._bubbleText = x;
        this.bubbleElement.textContent = x;
    },

    refreshTitles: function()
    {
        var mainTitle = this.mainTitle;
        if (this.titleElement.textContent !== mainTitle)
            this.titleElement.textContent = mainTitle;

        var subtitle = this.subtitle;
        if (subtitle) {
            if (this.subtitleElement.textContent !== subtitle)
                this.subtitleElement.textContent = subtitle;
            this.titlesElement.removeStyleClass("no-subtitle");
        } else
            this.titlesElement.addStyleClass("no-subtitle");
    },

    isEventWithinDisclosureTriangle: function(event)
    {
        return event.target === this.disclosureButton;
    },

    onattach: function()
    {
        this._listItemNode.addStyleClass("sidebar-tree-item");

        if (this.className)
            this._listItemNode.addStyleClass(this.className);

        if (this.small)
            this._listItemNode.addStyleClass("small");

        if (this.hasChildren && this.disclosureButton)
            this._listItemNode.appendChild(this.disclosureButton);

        this._listItemNode.appendChild(this.iconElement);
        this._listItemNode.appendChild(this.statusElement);
        this._listItemNode.appendChild(this.titlesElement);
    },

    onreveal: function()
    {
        if (this._listItemNode)
            this._listItemNode.scrollIntoViewIfNeeded(false);
    }
}

WebInspector.SidebarTreeElement.prototype.__proto__ = TreeElement.prototype;
/* PropertiesSection.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.PropertiesSection = function(title, subtitle)
{
    this.element = document.createElement("div");
    this.element.className = "section";

    this.headerElement = document.createElement("div");
    this.headerElement.className = "header";

    this.titleElement = document.createElement("div");
    this.titleElement.className = "title";

    this.subtitleElement = document.createElement("div");
    this.subtitleElement.className = "subtitle";

    this.headerElement.appendChild(this.subtitleElement);
    this.headerElement.appendChild(this.titleElement);

    this.headerElement.addEventListener("click", this.toggleExpanded.bind(this), false);

    this.propertiesElement = document.createElement("ol");
    this.propertiesElement.className = "properties";
    this.propertiesTreeOutline = new TreeOutline(this.propertiesElement);
    this.propertiesTreeOutline.section = this;

    this.element.appendChild(this.headerElement);
    this.element.appendChild(this.propertiesElement);

    this.title = title;
    this.subtitle = subtitle;
    this._expanded = false;
}

WebInspector.PropertiesSection.prototype = {
    get title()
    {
        return this._title;
    },

    set title(x)
    {
        if (this._title === x)
            return;
        this._title = x;
        this.titleElement.textContent = x;
    },

    get subtitle()
    {
        return this._subtitle;
    },

    set subtitle(x)
    {
        if (this._subtitle === x)
            return;
        this._subtitle = x;
        this.subtitleElement.innerHTML = x;
    },

    get expanded()
    {
        return this._expanded;
    },

    set expanded(x)
    {
        if (x)
            this.expand();
        else
            this.collapse();
    },

    get populated()
    {
        return this._populated;
    },

    set populated(x)
    {
        this._populated = x;
        if (!x && this.onpopulate && this._expanded) {
            this.onpopulate(this);
            this._populated = true;
        }
    },

    expand: function()
    {
        if (this._expanded)
            return;
        this._expanded = true;
        this.element.addStyleClass("expanded");

        if (!this._populated && this.onpopulate) {
            this.onpopulate(this);
            this._populated = true;
        }
    },

    collapse: function()
    {
        if (!this._expanded)
            return;
        this._expanded = false;
        this.element.removeStyleClass("expanded");
    },

    toggleExpanded: function()
    {
        this.expanded = !this.expanded;
    }
}
/* ObjectPropertiesSection.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ObjectPropertiesSection = function(object, title, subtitle, emptyPlaceholder, ignoreHasOwnProperty, extraProperties, treeElementConstructor)
{
    if (!title) {
        title = Object.describe(object);
        if (title.match(/Prototype$/)) {
            title = title.replace(/Prototype$/, "");
            if (!subtitle)
                subtitle = WebInspector.UIString("Prototype");
        }
    }

    this.emptyPlaceholder = (emptyPlaceholder || WebInspector.UIString("No Properties"));
    this.object = object;
    this.ignoreHasOwnProperty = ignoreHasOwnProperty;
    this.extraProperties = extraProperties;
    this.treeElementConstructor = treeElementConstructor || WebInspector.ObjectPropertyTreeElement;
    this.editable = true;

    WebInspector.PropertiesSection.call(this, title, subtitle);
}

WebInspector.ObjectPropertiesSection.prototype = {
    onpopulate: function()
    {
        this.update();
    },

    update: function()
    {
        var properties = [];
        for (var prop in this.object)
            properties.push(prop);
        if (this.extraProperties)
            for (var prop in this.extraProperties)
                properties.push(prop);
        properties.sort();

        this.propertiesTreeOutline.removeChildren();

        for (var i = 0; i < properties.length; ++i) {
            var object = this.object;
            var propertyName = properties[i];
            if (this.extraProperties && propertyName in this.extraProperties)
                object = this.extraProperties;
            if (propertyName === "__treeElementIdentifier")
                continue;
            if (!this.ignoreHasOwnProperty && "hasOwnProperty" in object && !object.hasOwnProperty(propertyName))
                continue;
            this.propertiesTreeOutline.appendChild(new this.treeElementConstructor(object, propertyName));
        }

        if (!this.propertiesTreeOutline.children.length) {
            var title = "<div class=\"info\">" + this.emptyPlaceholder + "</div>";
            var infoElement = new TreeElement(title, null, false);
            this.propertiesTreeOutline.appendChild(infoElement);
        }
    }
}

WebInspector.ObjectPropertiesSection.prototype.__proto__ = WebInspector.PropertiesSection.prototype;

WebInspector.ObjectPropertyTreeElement = function(parentObject, propertyName)
{
    this.parentObject = parentObject;
    this.propertyName = propertyName;

    // Pass an empty title, the title gets made later in onattach.
    TreeElement.call(this, "", null, false);
}

WebInspector.ObjectPropertyTreeElement.prototype = {
    safePropertyValue: function(object, propertyName)
    {
        if (object["__lookupGetter__"] && object.__lookupGetter__(propertyName))
            return;
        return object[propertyName];
    },

    onpopulate: function()
    {
        if (this.children.length && !this.shouldRefreshChildren)
            return;

        this.removeChildren();

        var childObject = this.safePropertyValue(this.parentObject, this.propertyName);
        var properties = Object.sortedProperties(childObject);
        for (var i = 0; i < properties.length; ++i) {
            var propertyName = properties[i];
            if (propertyName === "__treeElementIdentifier")
                continue;
            this.appendChild(new this.treeOutline.section.treeElementConstructor(childObject, propertyName));
        }
    },

    ondblclick: function(element, event)
    {
        this.startEditing();
    },

    onattach: function()
    {
        this.update();
    },

    update: function()
    {
        var childObject = this.safePropertyValue(this.parentObject, this.propertyName);
        var isGetter = ("__lookupGetter__" in this.parentObject && this.parentObject.__lookupGetter__(this.propertyName));

        var nameElement = document.createElement("span");
        nameElement.className = "name";
        nameElement.textContent = this.propertyName;

        this.valueElement = document.createElement("span");
        this.valueElement.className = "value";
        if (!isGetter) {
            this.valueElement.textContent = Object.describe(childObject, true);
        } else {
            // FIXME: this should show something like "getter" (bug 16734).
            this.valueElement.textContent = "\u2014"; // em dash
            this.valueElement.addStyleClass("dimmed");
        }

        this.listItemElement.removeChildren();

        this.listItemElement.appendChild(nameElement);
        this.listItemElement.appendChild(document.createTextNode(": "));
        this.listItemElement.appendChild(this.valueElement);

        var hasSubProperties = false;
        var type = typeof childObject;
        if (childObject && (type === "object" || type === "function")) {
            for (subPropertyName in childObject) {
                if (subPropertyName === "__treeElementIdentifier")
                    continue;
                hasSubProperties = true;
                break;
            }
        }

        this.hasChildren = hasSubProperties;
    },

    updateSiblings: function()
    {
        if (this.parent.root)
            this.treeOutline.section.update();
        else
            this.parent.shouldRefreshChildren = true;
    },

    startEditing: function()
    {
        if (WebInspector.isBeingEdited(this.valueElement) || !this.treeOutline.section.editable)
            return;

        var context = { expanded: this.expanded };

        // Lie about our children to prevent expanding on double click and to collapse subproperties.
        this.hasChildren = false;

        this.listItemElement.addStyleClass("editing-sub-part");

        WebInspector.startEditing(this.valueElement, this.editingCommitted.bind(this), this.editingCancelled.bind(this), context);
    },

    editingEnded: function(context)
    {
        this.listItemElement.scrollLeft = 0;
        this.listItemElement.removeStyleClass("editing-sub-part");
        if (context.expanded)
            this.expand();
    },

    editingCancelled: function(element, context)
    {
        this.update();
        this.editingEnded(context);
    },

    editingCommitted: function(element, userInput, previousContent, context)
    {
        if (userInput === previousContent)
            return this.editingCancelled(element, context); // nothing changed, so cancel

        this.applyExpression(userInput, true);

        this.editingEnded(context);
    },

    evaluateExpression: function(expression)
    {
        // Evaluate in the currently selected call frame if the debugger is paused.
        // Otherwise evaluate in against the inspected window.
        if (WebInspector.panels.scripts.paused && this.treeOutline.section.editInSelectedCallFrameWhenPaused)
            return WebInspector.panels.scripts.evaluateInSelectedCallFrame(expression, false);
        return InspectorController.inspectedWindow().eval(expression);
    },

    applyExpression: function(expression, updateInterface)
    {
        var expressionLength = expression.trimWhitespace().length;

        if (!expressionLength) {
            // The user deleted everything, so try to delete the property.
            delete this.parentObject[this.propertyName];

            if (updateInterface) {
                if (this.propertyName in this.parentObject) {
                    // The property was not deleted, so update.
                    this.update();
                } else {
                    // The property was deleted, so remove this tree element.
                    this.parent.removeChild(this);
                }
            }

            return;
        }

        try {
            // Surround the expression in parenthesis so the result of the eval is the result
            // of the whole expression not the last potential sub-expression.
            var result = this.evaluateExpression("(" + expression + ")");

            // Store the result in the property.
            this.parentObject[this.propertyName] = result;
        } catch(e) {
            try {
                // Try to update as a string
                var result = this.evaluateExpression("\"" + expression.escapeCharacters("\"") + "\"");

                // Store the result in the property.
                this.parentObject[this.propertyName] = result;
            } catch(e) {
                // The expression failed so don't change the value. So just update and return.
                if (updateInterface)
                    this.update();
                return;
            }
        }

        if (updateInterface) {
            // Call updateSiblings since their value might be based on the value that just changed.
            this.updateSiblings();
        }
    }
}

WebInspector.ObjectPropertyTreeElement.prototype.__proto__ = TreeElement.prototype;
/* BreakpointsSidebarPane.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.BreakpointsSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Breakpoints"));

    this.breakpoints = [];

    this.emptyElement = document.createElement("div");
    this.emptyElement.className = "info";
    this.emptyElement.textContent = WebInspector.UIString("No Breakpoints");

    this.bodyElement.appendChild(this.emptyElement);
}

WebInspector.BreakpointsSidebarPane.prototype = {
    addBreakpoint: function(breakpoint)
    {
        this.breakpoints.push(breakpoint);
        breakpoint.addEventListener("enabled", this._breakpointEnableChanged, this);
        breakpoint.addEventListener("disabled", this._breakpointEnableChanged, this);

        // FIXME: add to the breakpoints UI.

        if (!InspectorController.debuggerEnabled() || !breakpoint.sourceID)
            return;

        if (breakpoint.enabled)
            InspectorController.addBreakpoint(breakpoint.sourceID, breakpoint.line);
    },

    removeBreakpoint: function(breakpoint)
    {
        this.breakpoints.remove(breakpoint);
        breakpoint.removeEventListener("enabled", null, this);
        breakpoint.removeEventListener("disabled", null, this);

        // FIXME: remove from the breakpoints UI.

        if (!InspectorController.debuggerEnabled() || !breakpoint.sourceID)
            return;

        InspectorController.removeBreakpoint(breakpoint.sourceID, breakpoint.line);
    },

    _breakpointEnableChanged: function(event)
    {
        var breakpoint = event.target;

        // FIXME: change the breakpoint checkbox state in the UI.

        if (!InspectorController.debuggerEnabled() || !breakpoint.sourceID)
            return;

        if (breakpoint.enabled)
            InspectorController.addBreakpoint(breakpoint.sourceID, breakpoint.line);
        else
            InspectorController.removeBreakpoint(breakpoint.sourceID, breakpoint.line);
    }
}

WebInspector.BreakpointsSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;
/* CallStackSidebarPane.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.CallStackSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Call Stack"));
}

WebInspector.CallStackSidebarPane.prototype = {
    update: function(callFrame, sourceIDMap)
    {
        this.bodyElement.removeChildren();

        this.placards = [];
        delete this._selectedCallFrame;

        if (!callFrame) {
            var infoElement = document.createElement("div");
            infoElement.className = "info";
            infoElement.textContent = WebInspector.UIString("Not Paused");
            this.bodyElement.appendChild(infoElement);
            return;
        }

        var title;
        var subtitle;
        var scriptOrResource;

        do {
            switch (callFrame.type) {
            case "function":
                title = callFrame.functionName || WebInspector.UIString("(anonymous function)");
                break;
            case "program":
                title = WebInspector.UIString("(program)");
                break;
            }

            scriptOrResource = sourceIDMap[callFrame.sourceID];
            subtitle = WebInspector.displayNameForURL(scriptOrResource.sourceURL || scriptOrResource.url);

            if (callFrame.line > 0) {
                if (subtitle)
                    subtitle += ":" + callFrame.line;
                else
                    subtitle = WebInspector.UIString("line %d", callFrame.line);
            }

            var placard = new WebInspector.Placard(title, subtitle);
            placard.callFrame = callFrame;

            placard.element.addEventListener("click", this._placardSelected.bind(this), false);

            this.placards.push(placard);
            this.bodyElement.appendChild(placard.element);

            callFrame = callFrame.caller;
        } while (callFrame);
    },

    get selectedCallFrame()
    {
        return this._selectedCallFrame;
    },

    set selectedCallFrame(x)
    {
        if (this._selectedCallFrame === x)
            return;

        this._selectedCallFrame = x;

        for (var i = 0; i < this.placards.length; ++i) {
            var placard = this.placards[i];
            placard.selected = (placard.callFrame === this._selectedCallFrame);
        }

        this.dispatchEventToListeners("call frame selected");
    },

    _placardSelected: function(event)
    {
        var placardElement = event.target.enclosingNodeOrSelfWithClass("placard");
        this.selectedCallFrame = placardElement.placard.callFrame;
    }
}

WebInspector.CallStackSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;
/* ScopeChainSidebarPane.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ScopeChainSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Scope Variables"));
}

WebInspector.ScopeChainSidebarPane.prototype = {
    update: function(callFrame)
    {
        this.bodyElement.removeChildren();

        this.sections = [];
        this.callFrame = callFrame;

        if (!callFrame) {
            var infoElement = document.createElement("div");
            infoElement.className = "info";
            infoElement.textContent = WebInspector.UIString("Not Paused");
            this.bodyElement.appendChild(infoElement);
            return;
        }

        if (!callFrame._expandedProperties) {
            // FIXME: fix this when https://bugs.webkit.org/show_bug.cgi?id=19410 is fixed.
            // The callFrame is a JSInspectedObjectWrapper, so we are not allowed to assign
            // an object created in the Inspector's context to that object. So create an
            // Object from the inspectedWindow.
            var inspectedWindow = InspectorController.inspectedWindow();
            callFrame._expandedProperties = new inspectedWindow.Object;
        }

        var foundLocalScope = false;
        var scopeChain = callFrame.scopeChain;
        for (var i = 0; i < scopeChain.length; ++i) {
            var scopeObject = scopeChain[i];
            var title = null;
            var subtitle = Object.describe(scopeObject, true);
            var emptyPlaceholder = null;
            var localScope = false;
            var extraProperties = null;

            if (Object.prototype.toString.call(scopeObject) === "[object JSActivation]") {
                if (!foundLocalScope) {
                    extraProperties = { "this": callFrame.thisObject };
                    title = WebInspector.UIString("Local");
                } else
                    title = WebInspector.UIString("Closure");
                emptyPlaceholder = WebInspector.UIString("No Variables");
                subtitle = null;
                foundLocalScope = true;
                localScope = true;
            } else if (i === (scopeChain.length - 1))
                title = WebInspector.UIString("Global");
            else if (foundLocalScope && scopeObject instanceof InspectorController.inspectedWindow().Element)
                title = WebInspector.UIString("Event Target");
            else if (foundLocalScope && scopeObject instanceof InspectorController.inspectedWindow().Document)
                title = WebInspector.UIString("Event Document");
            else if (!foundLocalScope && !localScope)
                title = WebInspector.UIString("With Block");

            if (!title || title === subtitle)
                subtitle = null;

            var section = new WebInspector.ObjectPropertiesSection(scopeObject, title, subtitle, emptyPlaceholder, true, extraProperties, WebInspector.ScopeVariableTreeElement);
            section.editInSelectedCallFrameWhenPaused = true;
            section.pane = this;

            if (!foundLocalScope || localScope)
                section.expanded = true;

            this.sections.push(section);
            this.bodyElement.appendChild(section.element);
        }
    }
}

WebInspector.ScopeChainSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;

WebInspector.ScopeVariableTreeElement = function(parentObject, propertyName)
{
    WebInspector.ObjectPropertyTreeElement.call(this, parentObject, propertyName);
}

WebInspector.ScopeVariableTreeElement.prototype = {
    onattach: function()
    {
        WebInspector.ObjectPropertyTreeElement.prototype.onattach.call(this);
        if (this.hasChildren && this.propertyIdentifier in this.treeOutline.section.pane.callFrame._expandedProperties)
            this.expand();
    },

    onexpand: function()
    {
        this.treeOutline.section.pane.callFrame._expandedProperties[this.propertyIdentifier] = true;
    },

    oncollapse: function()
    {
        delete this.treeOutline.section.pane.callFrame._expandedProperties[this.propertyIdentifier];
    },

    get propertyIdentifier()
    {
        if ("_propertyIdentifier" in this)
            return this._propertyIdentifier;
        var section = this.treeOutline.section;
        this._propertyIdentifier = section.title + ":" + (section.subtitle ? section.subtitle + ":" : "") + this.propertyPath;
        return this._propertyIdentifier;
    },

    get propertyPath()
    {
        if ("_propertyPath" in this)
            return this._propertyPath;

        var current = this;
        var result;

        do {
            if (result)
                result = current.propertyName + "." + result;
            else
                result = current.propertyName;
            current = current.parent;
        } while (current && !current.root);

        this._propertyPath = result;
        return result;
    }
}

WebInspector.ScopeVariableTreeElement.prototype.__proto__ = WebInspector.ObjectPropertyTreeElement.prototype;
/* MetricsSidebarPane.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.MetricsSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Metrics"));
}

WebInspector.MetricsSidebarPane.prototype = {
    update: function(node)
    {
        var body = this.bodyElement;

        body.removeChildren();

        if (node)
            this.node = node;
        else
            node = this.node;

        if (!node || !node.ownerDocument.defaultView)
            return;

        var style;
        if (node.nodeType === Node.ELEMENT_NODE)
            style = node.ownerDocument.defaultView.getComputedStyle(node);
        if (!style)
            return;

        var metricsElement = document.createElement("div");
        metricsElement.className = "metrics";

        function createBoxPartElement(style, name, side, suffix)
        {
            var propertyName = (name !== "position" ? name + "-" : "") + side + suffix;
            var value = style.getPropertyValue(propertyName);
            if (value === "" || (name !== "position" && value === "0px"))
                value = "\u2012";
            else if (name === "position" && value === "auto")
                value = "\u2012";
            value = value.replace(/px$/, "");

            var element = document.createElement("div");
            element.className = side;
            element.textContent = value;
            element.addEventListener("dblclick", this.startEditing.bind(this, element, name, propertyName), false);
            return element;
        }

        // Display types for which margin is ignored.
        var noMarginDisplayType = {
            "table-cell": true,
            "table-column": true,
            "table-column-group": true,
            "table-footer-group": true,
            "table-header-group": true,
            "table-row": true,
            "table-row-group": true
        };

        // Display types for which padding is ignored.
        var noPaddingDisplayType = {
            "table-column": true,
            "table-column-group": true,
            "table-footer-group": true,
            "table-header-group": true,
            "table-row": true,
            "table-row-group": true
        };

        // Position types for which top, left, bottom and right are ignored.
        var noPositionType = {
            "static": true
        };

        var boxes = ["content", "padding", "border", "margin", "position"];
        var boxLabels = [WebInspector.UIString("content"), WebInspector.UIString("padding"), WebInspector.UIString("border"), WebInspector.UIString("margin"), WebInspector.UIString("position")];
        var previousBox;
        for (var i = 0; i < boxes.length; ++i) {
            var name = boxes[i];

            if (name === "margin" && noMarginDisplayType[style.display])
                continue;
            if (name === "padding" && noPaddingDisplayType[style.display])
                continue;
            if (name === "position" && noPositionType[style.position])
                continue;

            var boxElement = document.createElement("div");
            boxElement.className = name;

            if (name === "content") {
                var width = style.width.replace(/px$/, "");
                var widthElement = document.createElement("span");
                widthElement.textContent = width;
                widthElement.addEventListener("dblclick", this.startEditing.bind(this, widthElement, "width", "width"), false);

                var height = style.height.replace(/px$/, "");
                var heightElement = document.createElement("span");
                heightElement.textContent = height;
                heightElement.addEventListener("dblclick", this.startEditing.bind(this, heightElement, "height", "height"), false);

                boxElement.appendChild(widthElement);
                boxElement.appendChild(document.createTextNode(" \u00D7 "));
                boxElement.appendChild(heightElement);
            } else {
                var suffix = (name === "border" ? "-width" : "");

                var labelElement = document.createElement("div");
                labelElement.className = "label";
                labelElement.textContent = boxLabels[i];
                boxElement.appendChild(labelElement);

                boxElement.appendChild(createBoxPartElement.call(this, style, name, "top", suffix));
                boxElement.appendChild(document.createElement("br"));
                boxElement.appendChild(createBoxPartElement.call(this, style, name, "left", suffix));

                if (previousBox)
                    boxElement.appendChild(previousBox);

                boxElement.appendChild(createBoxPartElement.call(this, style, name, "right", suffix));
                boxElement.appendChild(document.createElement("br"));
                boxElement.appendChild(createBoxPartElement.call(this, style, name, "bottom", suffix));
            }

            previousBox = boxElement;
        }

        metricsElement.appendChild(previousBox);
        body.appendChild(metricsElement);
    },

    startEditing: function(targetElement, box, styleProperty)
    {
        if (WebInspector.isBeingEdited(targetElement))
            return;

        var context = { box: box, styleProperty: styleProperty };

        WebInspector.startEditing(targetElement, this.editingCommitted.bind(this), this.editingCancelled.bind(this), context);
    },

    editingCancelled: function(element, context)
    {
        this.update();
    },

    editingCommitted: function(element, userInput, previousContent, context)
    {
        if (userInput === previousContent)
            return this.editingCancelled(element, context); // nothing changed, so cancel

        if (context.box !== "position" && (!userInput || userInput === "\u2012"))
            userInput = "0px";
        else if (context.box === "position" && (!userInput || userInput === "\u2012"))
            userInput = "auto";

        // Append a "px" unit if the user input was just a number.
        if (/^\d+$/.test(userInput))
            userInput += "px";

        this.node.style.setProperty(context.styleProperty, userInput, "");

        this.dispatchEventToListeners("metrics edited");

        this.update();
    }
}

WebInspector.MetricsSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;
/* PropertiesSidebarPane.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.PropertiesSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Properties"));
}

WebInspector.PropertiesSidebarPane.prototype = {
    update: function(object)
    {
        var body = this.bodyElement;

        body.removeChildren();

        this.sections = [];

        if (!object)
            return;

        for (var prototype = object; prototype; prototype = prototype.__proto__) {
            var section = new WebInspector.ObjectPropertiesSection(prototype);
            this.sections.push(section);
            body.appendChild(section.element);
        }
    }
}

WebInspector.PropertiesSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;
/* StylesSidebarPane.js */

/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.StylesSidebarPane = function()
{
    WebInspector.SidebarPane.call(this, WebInspector.UIString("Styles"));
}

WebInspector.StylesSidebarPane.prototype = {
    update: function(node, editedSection, forceUpdate)
    {
        var refresh = false;

        if (forceUpdate)
            delete this.node;

        if (!forceUpdate && (!node || node === this.node))
            refresh = true;

        if (node && node.nodeType === Node.TEXT_NODE && node.parentNode)
            node = node.parentNode;

        if (node && node.nodeType !== Node.ELEMENT_NODE)
            node = null;

        if (node)
            this.node = node;
        else
            node = this.node;

        var body = this.bodyElement;
        if (!refresh || !node) {
            body.removeChildren();
            this.sections = [];
        }

        if (!node)
            return;

        var styleRules = [];

        if (refresh) {
            for (var i = 0; i < this.sections.length; ++i) {
                var section = this.sections[i];
                if (section.computedStyle)
                    section.styleRule.style = node.ownerDocument.defaultView.getComputedStyle(node);
                var styleRule = { section: section, style: section.styleRule.style, computedStyle: section.computedStyle };
                styleRules.push(styleRule);
            }
        } else {
            var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
            styleRules.push({ computedStyle: true, selectorText: WebInspector.UIString("Computed Style"), style: computedStyle, editable: false });

            var nodeName = node.nodeName.toLowerCase();
            for (var i = 0; i < node.attributes.length; ++i) {
                var attr = node.attributes[i];
                if (attr.style) {
                    var attrStyle = { style: attr.style, editable: false };
                    attrStyle.subtitle = WebInspector.UIString("element’s “%s” attribute", attr.name);
                    attrStyle.selectorText = nodeName + "[" + attr.name;
                    if (attr.value.length)
                        attrStyle.selectorText += "=" + attr.value;
                    attrStyle.selectorText += "]";
                    styleRules.push(attrStyle);
                }
            }

            if (node.style && (node.style.length || Object.hasProperties(node.style.__disabledProperties))) {
                var inlineStyle = { selectorText: WebInspector.UIString("Inline Style Attribute"), style: node.style };
                inlineStyle.subtitle = WebInspector.UIString("element’s “%s” attribute", "style");
                styleRules.push(inlineStyle);
            }

            var matchedStyleRules = node.ownerDocument.defaultView.getMatchedCSSRules(node, "", !Preferences.showUserAgentStyles);
            if (matchedStyleRules) {
                // Add rules in reverse order to match the cascade order.
                for (var i = (matchedStyleRules.length - 1); i >= 0; --i) {
                    var rule = matchedStyleRules[i];
                    styleRules.push({ style: rule.style, selectorText: rule.selectorText, parentStyleSheet: rule.parentStyleSheet });
                }
            }
        }

        function deleteDisabledProperty(style, name)
        {
            if (!style || !name)
                return;
            if (style.__disabledPropertyValues)
                delete style.__disabledPropertyValues[name];
            if (style.__disabledPropertyPriorities)
                delete style.__disabledPropertyPriorities[name];
            if (style.__disabledProperties)
                delete style.__disabledProperties[name];
        }

        var usedProperties = {};
        var disabledComputedProperties = {};
        var priorityUsed = false;

        // Walk the style rules and make a list of all used and overloaded properties.
        for (var i = 0; i < styleRules.length; ++i) {
            var styleRule = styleRules[i];
            if (styleRule.computedStyle)
                continue;

            styleRule.usedProperties = {};

            var style = styleRule.style;
            for (var j = 0; j < style.length; ++j) {
                var name = style[j];

                if (!priorityUsed && style.getPropertyPriority(name).length)
                    priorityUsed = true;

                // If the property name is already used by another rule then this rule's
                // property is overloaded, so don't add it to the rule's usedProperties.
                if (!(name in usedProperties))
                    styleRule.usedProperties[name] = true;

                if (name === "font") {
                    // The font property is not reported as a shorthand. Report finding the individual
                    // properties so they are visible in computed style.
                    // FIXME: remove this when http://bugs.webkit.org/show_bug.cgi?id=15598 is fixed.
                    styleRule.usedProperties["font-family"] = true;
                    styleRule.usedProperties["font-size"] = true;
                    styleRule.usedProperties["font-style"] = true;
                    styleRule.usedProperties["font-variant"] = true;
                    styleRule.usedProperties["font-weight"] = true;
                    styleRule.usedProperties["line-height"] = true;
                }

                // Delete any disabled properties, since the property does exist.
                // This prevents it from showing twice.
                deleteDisabledProperty(style, name);
                deleteDisabledProperty(style, style.getPropertyShorthand(name));
            }

            // Add all the properties found in this style to the used properties list.
            // Do this here so only future rules are affect by properties used in this rule.
            for (var name in styleRules[i].usedProperties)
                usedProperties[name] = true;

            // Remember all disabled properties so they show up in computed style.
            if (style.__disabledProperties)
                for (var name in style.__disabledProperties)
                    disabledComputedProperties[name] = true;
        }

        if (priorityUsed) {
            // Walk the properties again and account for !important.
            var foundPriorityProperties = [];

            // Walk in reverse to match the order !important overrides.
            for (var i = (styleRules.length - 1); i >= 0; --i) {
                if (styleRules[i].computedStyle)
                    continue;

                var style = styleRules[i].style;
                var uniqueProperties = getUniqueStyleProperties(style);
                for (var j = 0; j < uniqueProperties.length; ++j) {
                    var name = uniqueProperties[j];
                    if (style.getPropertyPriority(name).length) {
                        if (!(name in foundPriorityProperties))
                            styleRules[i].usedProperties[name] = true;
                        else
                            delete styleRules[i].usedProperties[name];
                        foundPriorityProperties[name] = true;
                    } else if (name in foundPriorityProperties)
                        delete styleRules[i].usedProperties[name];
                }
            }
        }

        if (refresh) {
            // Walk the style rules and update the sections with new overloaded and used properties.
            for (var i = 0; i < styleRules.length; ++i) {
                var styleRule = styleRules[i];
                var section = styleRule.section;
                if (styleRule.computedStyle)
                    section.disabledComputedProperties = disabledComputedProperties;
                section._usedProperties = (styleRule.usedProperties || usedProperties);
                section.update((section === editedSection) || styleRule.computedStyle);
            }
        } else {
            // Make a property section for each style rule.
            for (var i = 0; i < styleRules.length; ++i) {
                var styleRule = styleRules[i];
                var subtitle = styleRule.subtitle;
                delete styleRule.subtitle;

                var computedStyle = styleRule.computedStyle;
                delete styleRule.computedStyle;

                var ruleUsedProperties = styleRule.usedProperties;
                delete styleRule.usedProperties;

                var editable = styleRule.editable;
                delete styleRule.editable;

                // Default editable to true if it was omitted.
                if (typeof editable === "undefined")
                    editable = true;

                var section = new WebInspector.StylePropertiesSection(styleRule, subtitle, computedStyle, (ruleUsedProperties || usedProperties), editable);
                if (computedStyle)
                    section.disabledComputedProperties = disabledComputedProperties;
                section.pane = this;

                if (Preferences.styleRulesExpandedState && section.identifier in Preferences.styleRulesExpandedState)
                    section.expanded = Preferences.styleRulesExpandedState[section.identifier];
                else if (computedStyle)
                    section.collapse(true);
                else
                    section.expand(true);

                body.appendChild(section.element);
                this.sections.push(section);
            }
        }
    }
}

WebInspector.StylesSidebarPane.prototype.__proto__ = WebInspector.SidebarPane.prototype;

WebInspector.StylePropertiesSection = function(styleRule, subtitle, computedStyle, usedProperties, editable)
{
    WebInspector.PropertiesSection.call(this, styleRule.selectorText);

    this.styleRule = styleRule;
    this.computedStyle = computedStyle;
    this.editable = (editable && !computedStyle);

    // Prevent editing the user agent and user rules.
    var isUserAgent = this.styleRule.parentStyleSheet && !this.styleRule.parentStyleSheet.ownerNode && !this.styleRule.parentStyleSheet.href;
    var isUser = this.styleRule.parentStyleSheet && this.styleRule.parentStyleSheet.ownerNode && this.styleRule.parentStyleSheet.ownerNode.nodeName == '#document';
    if (isUserAgent || isUser)
        this.editable = false;

    this._usedProperties = usedProperties;

    if (computedStyle) {
        this.element.addStyleClass("computed-style");

        if (Preferences.showInheritedComputedStyleProperties)
            this.element.addStyleClass("show-inherited");

        var showInheritedLabel = document.createElement("label");
        var showInheritedInput = document.createElement("input");
        showInheritedInput.type = "checkbox";
        showInheritedInput.checked = Preferences.showInheritedComputedStyleProperties;

        var computedStyleSection = this;
        var showInheritedToggleFunction = function(event) {
            Preferences.showInheritedComputedStyleProperties = showInheritedInput.checked;
            if (Preferences.showInheritedComputedStyleProperties)
                computedStyleSection.element.addStyleClass("show-inherited");
            else
                computedStyleSection.element.removeStyleClass("show-inherited");
            event.stopPropagation();
        };

        showInheritedLabel.addEventListener("click", showInheritedToggleFunction, false);

        showInheritedLabel.appendChild(showInheritedInput);
        showInheritedLabel.appendChild(document.createTextNode(WebInspector.UIString("Show inherited")));
        this.subtitleElement.appendChild(showInheritedLabel);
    } else {
        if (!subtitle) {
            if (this.styleRule.parentStyleSheet && this.styleRule.parentStyleSheet.href) {
                var url = this.styleRule.parentStyleSheet.href;
                subtitle = WebInspector.linkifyURL(url, WebInspector.displayNameForURL(url));
                this.subtitleElement.addStyleClass("file");
            } else if (isUserAgent)
                subtitle = WebInspector.UIString("user agent stylesheet");
            else if (isUser)
                subtitle = WebInspector.UIString("user stylesheet");
            else
                subtitle = WebInspector.UIString("inline stylesheet");
        }

        this.subtitle = subtitle;
    }

    this.identifier = styleRule.selectorText;
    if (this.subtitle)
        this.identifier += ":" + this.subtitleElement.textContent;
}

WebInspector.StylePropertiesSection.prototype = {
    get usedProperties()
    {
        return this._usedProperties || {};
    },

    set usedProperties(x)
    {
        this._usedProperties = x;
        this.update();
    },

    expand: function(dontRememberState)
    {
        WebInspector.PropertiesSection.prototype.expand.call(this);
        if (dontRememberState)
            return;

        if (!Preferences.styleRulesExpandedState)
            Preferences.styleRulesExpandedState = {};
        Preferences.styleRulesExpandedState[this.identifier] = true;
    },

    collapse: function(dontRememberState)
    {
        WebInspector.PropertiesSection.prototype.collapse.call(this);
        if (dontRememberState)
            return;

        if (!Preferences.styleRulesExpandedState)
            Preferences.styleRulesExpandedState = {};
        Preferences.styleRulesExpandedState[this.identifier] = false;
    },

    isPropertyInherited: function(property)
    {
        if (!this.computedStyle || !this._usedProperties)
            return false;
        // These properties should always show for Computed Style.
        var alwaysShowComputedProperties = { "display": true, "height": true, "width": true };
        return !(property in this.usedProperties) && !(property in alwaysShowComputedProperties) && !(property in this.disabledComputedProperties);
    },

    isPropertyOverloaded: function(property, shorthand)
    {
        if (this.computedStyle || !this._usedProperties)
            return false;

        var used = (property in this.usedProperties);
        if (used || !shorthand)
            return !used;

        // Find out if any of the individual longhand properties of the shorthand
        // are used, if none are then the shorthand is overloaded too.
        var longhandProperties = getLonghandProperties(this.styleRule.style, property);
        for (var j = 0; j < longhandProperties.length; ++j) {
            var individualProperty = longhandProperties[j];
            if (individualProperty in this.usedProperties)
                return false;
        }

        return true;
    },

    update: function(full)
    {
        if (full || this.computedStyle) {
            this.propertiesTreeOutline.removeChildren();
            this.populated = false;
        } else {
            var child = this.propertiesTreeOutline.children[0];
            while (child) {
                child.overloaded = this.isPropertyOverloaded(child.name, child.shorthand);
                child = child.traverseNextTreeElement(false, null, true);
            }
        }
    },

    onpopulate: function()
    {
        var style = this.styleRule.style;

        var foundShorthands = {};
        var uniqueProperties = getUniqueStyleProperties(style);
        var disabledProperties = style.__disabledPropertyValues || {};

        for (var name in disabledProperties)
            uniqueProperties.push(name);

        uniqueProperties.sort();

        for (var i = 0; i < uniqueProperties.length; ++i) {
            var name = uniqueProperties[i];
            var disabled = name in disabledProperties;
            if (!disabled && this.disabledComputedProperties && !(name in this.usedProperties) && name in this.disabledComputedProperties)
                disabled = true;

            var shorthand = !disabled ? style.getPropertyShorthand(name) : null;

            if (shorthand && shorthand in foundShorthands)
                continue;

            if (shorthand) {
                foundShorthands[shorthand] = true;
                name = shorthand;
            }

            var isShorthand = (shorthand ? true : false);
            var inherited = this.isPropertyInherited(name);
            var overloaded = this.isPropertyOverloaded(name, isShorthand);

            var item = new WebInspector.StylePropertyTreeElement(style, name, isShorthand, inherited, overloaded, disabled);
            this.propertiesTreeOutline.appendChild(item);
        }
    }
}

WebInspector.StylePropertiesSection.prototype.__proto__ = WebInspector.PropertiesSection.prototype;

WebInspector.StylePropertyTreeElement = function(style, name, shorthand, inherited, overloaded, disabled)
{
    this.style = style;
    this.name = name;
    this.shorthand = shorthand;
    this._inherited = inherited;
    this._overloaded = overloaded;
    this._disabled = disabled;

    // Pass an empty title, the title gets made later in onattach.
    TreeElement.call(this, "", null, shorthand);
}

WebInspector.StylePropertyTreeElement.prototype = {
    get inherited()
    {
        return this._inherited;
    },

    set inherited(x)
    {
        if (x === this._inherited)
            return;
        this._inherited = x;
        this.updateState();
    },

    get overloaded()
    {
        return this._overloaded;
    },

    set overloaded(x)
    {
        if (x === this._overloaded)
            return;
        this._overloaded = x;
        this.updateState();
    },

    get disabled()
    {
        return this._disabled;
    },

    set disabled(x)
    {
        if (x === this._disabled)
            return;
        this._disabled = x;
        this.updateState();
    },

    get priority()
    {
        if (this.disabled && this.style.__disabledPropertyPriorities && this.name in this.style.__disabledPropertyPriorities)
            return this.style.__disabledPropertyPriorities[this.name];
        return (this.shorthand ? getShorthandPriority(this.style, this.name) : this.style.getPropertyPriority(this.name));
    },

    get value()
    {
        if (this.disabled && this.style.__disabledPropertyValues && this.name in this.style.__disabledPropertyValues)
            return this.style.__disabledPropertyValues[this.name];
        return (this.shorthand ? getShorthandValue(this.style, this.name) : this.style.getPropertyValue(this.name));
    },

    onattach: function()
    {
        this.updateTitle();
    },

    updateTitle: function()
    {
        // "Nicknames" for some common values that are easier to read.
        var valueNicknames = {
            "rgb(0, 0, 0)": "black",
            "#000": "black",
            "#000000": "black",
            "rgb(255, 255, 255)": "white",
            "#fff": "white",
            "#ffffff": "white",
            "#FFF": "white",
            "#FFFFFF": "white",
            "rgba(0, 0, 0, 0)": "transparent",
            "rgb(255, 0, 0)": "red",
            "rgb(0, 255, 0)": "lime",
            "rgb(0, 0, 255)": "blue",
            "rgb(255, 255, 0)": "yellow",
            "rgb(255, 0, 255)": "magenta",
            "rgb(0, 255, 255)": "cyan"
        };

        var priority = this.priority;
        var value = this.value;
        var htmlValue = value;

        if (priority && !priority.length)
            delete priority;
        if (priority)
            priority = "!" + priority;

        if (value) {
            var urls = value.match(/url\([^)]+\)/);
            if (urls) {
                for (var i = 0; i < urls.length; ++i) {
                    var url = urls[i].substring(4, urls[i].length - 1);
                    htmlValue = htmlValue.replace(urls[i], "url(" + WebInspector.linkifyURL(url) + ")");
                }
            } else {
                if (value in valueNicknames)
                    htmlValue = valueNicknames[value];
                htmlValue = htmlValue.escapeHTML();
            }
        } else
            htmlValue = value = "";

        this.updateState();

        var enabledCheckboxElement = document.createElement("input");
        enabledCheckboxElement.className = "enabled-button";
        enabledCheckboxElement.type = "checkbox";
        enabledCheckboxElement.checked = !this.disabled;
        enabledCheckboxElement.addEventListener("change", this.toggleEnabled.bind(this), false);

        var nameElement = document.createElement("span");
        nameElement.className = "name";
        nameElement.textContent = this.name;

        var valueElement = document.createElement("span");
        valueElement.className = "value";
        valueElement.innerHTML = htmlValue;

        if (priority) {
            var priorityElement = document.createElement("span");
            priorityElement.className = "priority";
            priorityElement.textContent = priority;
        }

        this.listItemElement.removeChildren();

        // Append the checkbox for root elements of an editable section.
        if (this.treeOutline.section && this.treeOutline.section.editable && this.parent.root)
            this.listItemElement.appendChild(enabledCheckboxElement);
        this.listItemElement.appendChild(nameElement);
        this.listItemElement.appendChild(document.createTextNode(": "));
        this.listItemElement.appendChild(valueElement);

        if (priorityElement) {
            this.listItemElement.appendChild(document.createTextNode(" "));
            this.listItemElement.appendChild(priorityElement);
        }

        this.listItemElement.appendChild(document.createTextNode(";"));

        if (value) {
            // FIXME: this dosen't catch keyword based colors like black and white
            var colors = value.match(/((rgb|hsl)a?\([^)]+\))|(#[0-9a-fA-F]{6})|(#[0-9a-fA-F]{3})/g);
            if (colors) {
                var colorsLength = colors.length;
                for (var i = 0; i < colorsLength; ++i) {
                    var swatchElement = document.createElement("span");
                    swatchElement.className = "swatch";
                    swatchElement.style.setProperty("background-color", colors[i]);
                    this.listItemElement.appendChild(swatchElement);
                }
            }
        }

        this.tooltip = this.name + ": " + (valueNicknames[value] || value) + (priority ? " " + priority : "");
    },

    updateAll: function(updateAllRules)
    {
        if (updateAllRules && this.treeOutline.section && this.treeOutline.section.pane)
            this.treeOutline.section.pane.update(null, this.treeOutline.section);
        else if (this.treeOutline.section)
            this.treeOutline.section.update(true);
        else
            this.updateTitle(); // FIXME: this will not show new properties. But we don't hit his case yet.
    },

    toggleEnabled: function(event)
    {
        var disabled = !event.target.checked;

        if (disabled) {
            if (!this.style.__disabledPropertyValues || !this.style.__disabledPropertyPriorities) {
                var inspectedWindow = InspectorController.inspectedWindow();
                this.style.__disabledProperties = new inspectedWindow.Object;
                this.style.__disabledPropertyValues = new inspectedWindow.Object;
                this.style.__disabledPropertyPriorities = new inspectedWindow.Object;
            }

            this.style.__disabledPropertyValues[this.name] = this.value;
            this.style.__disabledPropertyPriorities[this.name] = this.priority;

            if (this.shorthand) {
                var longhandProperties = getLonghandProperties(this.style, this.name);
                for (var i = 0; i < longhandProperties.length; ++i) {
                    this.style.__disabledProperties[longhandProperties[i]] = true;
                    this.style.removeProperty(longhandProperties[i]);
                }
            } else {
                this.style.__disabledProperties[this.name] = true;
                this.style.removeProperty(this.name);
            }
        } else {
            this.style.setProperty(this.name, this.value, this.priority);
            delete this.style.__disabledProperties[this.name];
            delete this.style.__disabledPropertyValues[this.name];
            delete this.style.__disabledPropertyPriorities[this.name];
        }

        // Set the disabled property here, since the code above replies on it not changing
        // until after the value and priority are retrieved.
        this.disabled = disabled;

        if (this.treeOutline.section && this.treeOutline.section.pane)
            this.treeOutline.section.pane.dispatchEventToListeners("style property toggled");

        this.updateAll(true);
    },

    updateState: function()
    {
        if (!this.listItemElement)
            return;

        if (this.style.isPropertyImplicit(this.name) || this.value === "initial")
            this.listItemElement.addStyleClass("implicit");
        else
            this.listItemElement.removeStyleClass("implicit");

        if (this.inherited)
            this.listItemElement.addStyleClass("inherited");
        else
            this.listItemElement.removeStyleClass("inherited");

        if (this.overloaded)
            this.listItemElement.addStyleClass("overloaded");
        else
            this.listItemElement.removeStyleClass("overloaded");

        if (this.disabled)
            this.listItemElement.addStyleClass("disabled");
        else
            this.listItemElement.removeStyleClass("disabled");
    },

    onpopulate: function()
    {
        // Only populate once and if this property is a shorthand.
        if (this.children.length || !this.shorthand)
            return;

        var longhandProperties = getLonghandProperties(this.style, this.name);
        for (var i = 0; i < longhandProperties.length; ++i) {
            var name = longhandProperties[i];

            if (this.treeOutline.section) {
                var inherited = this.treeOutline.section.isPropertyInherited(name);
                var overloaded = this.treeOutline.section.isPropertyOverloaded(name);
            }

            var item = new WebInspector.StylePropertyTreeElement(this.style, name, false, inherited, overloaded);
            this.appendChild(item);
        }
    },

    ondblclick: function(element, event)
    {
        this.startEditing(event.target);
    },

    startEditing: function(selectElement)
    {
        // FIXME: we don't allow editing of longhand properties under a shorthand right now.
        if (this.parent.shorthand)
            return;

        if (WebInspector.isBeingEdited(this.listItemElement) || (this.treeOutline.section && !this.treeOutline.section.editable))
            return;

        var context = { expanded: this.expanded, hasChildren: this.hasChildren };

        // Lie about our children to prevent expanding on double click and to collapse shorthands.
        this.hasChildren = false;

        if (!selectElement)
            selectElement = this.listItemElement;

        this.listItemElement.handleKeyEvent = this.editingKeyDown.bind(this);

        WebInspector.startEditing(this.listItemElement, this.editingCommitted.bind(this), this.editingCancelled.bind(this), context);
        window.getSelection().setBaseAndExtent(selectElement, 0, selectElement, 1);
    },

    editingKeyDown: function(event)
    {
        var arrowKeyPressed = (event.keyIdentifier === "Up" || event.keyIdentifier === "Down");
        var pageKeyPressed = (event.keyIdentifier === "PageUp" || event.keyIdentifier === "PageDown");
        if (!arrowKeyPressed && !pageKeyPressed)
            return;

        var selection = window.getSelection();
        if (!selection.rangeCount)
            return;

        var selectionRange = selection.getRangeAt(0);
        if (selectionRange.commonAncestorContainer !== this.listItemElement && !selectionRange.commonAncestorContainer.isDescendant(this.listItemElement))
            return;

        const styleValueDelimeters = " \t\n\"':;,/()";
        var wordRange = selectionRange.startContainer.rangeOfWord(selectionRange.startOffset, styleValueDelimeters, this.listItemElement);
        var wordString = wordRange.toString();
        var replacementString = wordString;

        var matches = /(.*?)(-?\d+(?:\.\d+)?)(.*)/.exec(wordString);
        if (matches && matches.length) {
            var prefix = matches[1];
            var number = parseFloat(matches[2]);
            var suffix = matches[3];

            // If the number is near zero or the number is one and the direction will take it near zero.
            var numberNearZero = (number < 1 && number > -1);
            if (number === 1 && event.keyIdentifier === "Down")
                numberNearZero = true;
            else if (number === -1 && event.keyIdentifier === "Up")
                numberNearZero = true;

            if (numberNearZero && event.altKey && arrowKeyPressed) {
                if (event.keyIdentifier === "Down")
                    number = Math.ceil(number - 1);
                else
                    number = Math.floor(number + 1);
            } else {
                // Jump by 10 when shift is down or jump by 0.1 when near zero or Alt/Option is down.
                // Also jump by 10 for page up and down, or by 100 if shift is held with a page key.
                var changeAmount = 1;
                if (event.shiftKey && pageKeyPressed)
                    changeAmount = 100;
                else if (event.shiftKey || pageKeyPressed)
                    changeAmount = 10;
                else if (event.altKey || numberNearZero)
                    changeAmount = 0.1;

                if (event.keyIdentifier === "Down" || event.keyIdentifier === "PageDown")
                    changeAmount *= -1;

                // Make the new number and constrain it to a precision of 6, this matches numbers the engine returns.
                // Use the Number constructor to forget the fixed precision, so 1.100000 will print as 1.1.
                number = Number((number + changeAmount).toFixed(6));
            }

            replacementString = prefix + number + suffix;
        } else {
            // FIXME: this should cycle through known keywords for the current property name.
            return;
        }

        var replacementTextNode = document.createTextNode(replacementString);

        wordRange.deleteContents();
        wordRange.insertNode(replacementTextNode);

        var finalSelectionRange = document.createRange();
        finalSelectionRange.setStart(replacementTextNode, 0);
        finalSelectionRange.setEnd(replacementTextNode, replacementString.length);

        selection.removeAllRanges();
        selection.addRange(finalSelectionRange);

        event.preventDefault();
        event.handled = true;

        if (!this.originalCSSText) {
            // Remember the rule's original CSS text, so it can be restored
            // if the editing is canceled and before each apply.
            this.originalCSSText = getStyleTextWithShorthands(this.style);
        } else {
            // Restore the original CSS text before applying user changes. This is needed to prevent
            // new properties from sticking around if the user adds one, then removes it.
            this.style.cssText = this.originalCSSText;
        }

        this.applyStyleText(this.listItemElement.textContent);
    },

    editingEnded: function(context)
    {
        this.hasChildren = context.hasChildren;
        if (context.expanded)
            this.expand();
        delete this.listItemElement.handleKeyEvent;
        delete this.originalCSSText;
    },

    editingCancelled: function(element, context)
    {
        if (this.originalCSSText) {
            this.style.cssText = this.originalCSSText;

            if (this.treeOutline.section && this.treeOutline.section.pane)
                this.treeOutline.section.pane.dispatchEventToListeners("style edited");

            this.updateAll();
        } else
            this.updateTitle();

        this.editingEnded(context);
    },

    editingCommitted: function(element, userInput, previousContent, context)
    {
        this.editingEnded(context);

        if (userInput === previousContent)
            return; // nothing changed, so do nothing else

        this.applyStyleText(userInput, true);
    },

    applyStyleText: function(styleText, updateInterface)
    {
        var styleTextLength = styleText.trimWhitespace().length;

        // Create a new element to parse the user input CSS.
        var parseElement = document.createElement("span");
        parseElement.setAttribute("style", styleText);

        var tempStyle = parseElement.style;
        if (tempStyle.length || !styleTextLength) {
            // The input was parsable or the user deleted everything, so remove the
            // original property from the real style declaration. If this represents
            // a shorthand remove all the longhand properties.
            if (this.shorthand) {
                var longhandProperties = getLonghandProperties(this.style, this.name);
                for (var i = 0; i < longhandProperties.length; ++i)
                    this.style.removeProperty(longhandProperties[i]);
            } else
                this.style.removeProperty(this.name);
        }

        if (!styleTextLength) {
            if (updateInterface) {
                // The user deleted the everything, so remove the tree element and update.
                if (this.treeOutline.section && this.treeOutline.section.pane)
                    this.treeOutline.section.pane.update();
                this.parent.removeChild(this);
            }
            return;
        }

        if (!tempStyle.length) {
            // The user typed something, but it didn't parse. Just abort and restore
            // the original title for this property.
            if (updateInterface)
                this.updateTitle();
            return;
        }

        // Iterate of the properties on the test element's style declaration and
        // add them to the real style declaration. We take care to move shorthands.
        var foundShorthands = {};
        var uniqueProperties = getUniqueStyleProperties(tempStyle);
        for (var i = 0; i < uniqueProperties.length; ++i) {
            var name = uniqueProperties[i];
            var shorthand = tempStyle.getPropertyShorthand(name);

            if (shorthand && shorthand in foundShorthands)
                continue;

            if (shorthand) {
                var value = getShorthandValue(tempStyle, shorthand);
                var priority = getShorthandPriority(tempStyle, shorthand);
                foundShorthands[shorthand] = true;
            } else {
                var value = tempStyle.getPropertyValue(name);
                var priority = tempStyle.getPropertyPriority(name);
            }

            // Set the property on the real style declaration.
            this.style.setProperty((shorthand || name), value, priority);
        }

        if (this.treeOutline.section && this.treeOutline.section.pane)
            this.treeOutline.section.pane.dispatchEventToListeners("style edited");

        if (updateInterface)
            this.updateAll(true);
    }
}

WebInspector.StylePropertyTreeElement.prototype.__proto__ = TreeElement.prototype;
/* Panel.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.Panel = function()
{
    WebInspector.View.call(this);

    this.element.addStyleClass("panel");
}

WebInspector.Panel.prototype = {
    get toolbarItem()
    {
        if (this._toolbarItem)
            return this._toolbarItem;

        // Sample toolbar item as markup:
        // <button class="toolbar-item resources toggleable">
        // <div class="toolbar-icon"></div>
        // <div class="toolbar-label">Resources</div>
        // </button>

        this._toolbarItem = document.createElement("button");
        this._toolbarItem.className = "toolbar-item toggleable";
        this._toolbarItem.panel = this;

        if ("toolbarItemClass" in this)
            this._toolbarItem.addStyleClass(this.toolbarItemClass);

        var iconElement = document.createElement("div");
        iconElement.className = "toolbar-icon";
        this._toolbarItem.appendChild(iconElement);

        if ("toolbarItemLabel" in this) {
            var labelElement = document.createElement("div");
            labelElement.className = "toolbar-label";
            labelElement.textContent = this.toolbarItemLabel;
            this._toolbarItem.appendChild(labelElement);
        }

        return this._toolbarItem;
    },

    show: function()
    {
        WebInspector.View.prototype.show.call(this);

        var statusBarItems = this.statusBarItems;
        if (statusBarItems) {
            this._statusBarItemContainer = document.createElement("div");
            for (var i = 0; i < statusBarItems.length; ++i)
                this._statusBarItemContainer.appendChild(statusBarItems[i]);
            document.getElementById("main-status-bar").appendChild(this._statusBarItemContainer);
        }

        if ("_toolbarItem" in this)
            this._toolbarItem.addStyleClass("toggled-on");

        WebInspector.currentFocusElement = document.getElementById("main-panels");
    },

    hide: function()
    {
        WebInspector.View.prototype.hide.call(this);

        if (this._statusBarItemContainer && this._statusBarItemContainer.parentNode)
            this._statusBarItemContainer.parentNode.removeChild(this._statusBarItemContainer);
        delete this._statusBarItemContainer;
        if ("_toolbarItem" in this)
            this._toolbarItem.removeStyleClass("toggled-on");
    },

    attach: function()
    {
        if (!this.element.parentNode)
            document.getElementById("main-panels").appendChild(this.element);
    },

    searchCanceled: function(startingNewSearch)
    {
        if (this._searchResults) {
            for (var i = 0; i < this._searchResults.length; ++i) {
                var view = this._searchResults[i];
                if (view.searchCanceled)
                    view.searchCanceled();
                delete view.currentQuery;
            }
        }

        WebInspector.updateSearchMatchesCount(0, this);

        if (this._currentSearchChunkIntervalIdentifier) {
            clearInterval(this._currentSearchChunkIntervalIdentifier);
            delete this._currentSearchChunkIntervalIdentifier;
        }

        this._totalSearchMatches = 0;
        this._currentSearchResultIndex = 0;
        this._searchResults = [];
    },

    performSearch: function(query)
    {
        // Call searchCanceled since it will reset everything we need before doing a new search.
        this.searchCanceled(true);

        var searchableViews = this.searchableViews;
        if (!searchableViews || !searchableViews.length)
            return;

        var parentElement = this.viewsContainerElement;
        var visibleView = this.visibleView;
        var sortFuction = this.searchResultsSortFunction;

        var matchesCountUpdateTimeout = null;

        function updateMatchesCount()
        {
            WebInspector.updateSearchMatchesCount(this._totalSearchMatches, this);
            matchesCountUpdateTimeout = null;
        }

        function updateMatchesCountSoon()
        {
            if (matchesCountUpdateTimeout)
                return;
            // Update the matches count every half-second so it doesn't feel twitchy.
            matchesCountUpdateTimeout = setTimeout(updateMatchesCount.bind(this), 500);
        }

        function finishedCallback(view, searchMatches)
        {
            if (!searchMatches)
                return;

            this._totalSearchMatches += searchMatches;
            this._searchResults.push(view);

            if (sortFuction)
                this._searchResults.sort(sortFuction);

            if (this.searchMatchFound)
                this.searchMatchFound(view, searchMatches);

            updateMatchesCountSoon.call(this);

            if (view === visibleView)
                view.jumpToFirstSearchResult();
        }

        var i = 0;
        var panel = this;
        var boundFinishedCallback = finishedCallback.bind(this);
        var chunkIntervalIdentifier = null;

        // Split up the work into chunks so we don't block the
        // UI thread while processing.

        function processChunk()
        {
            var view = searchableViews[i];

            if (++i >= searchableViews.length) {
                if (panel._currentSearchChunkIntervalIdentifier === chunkIntervalIdentifier)
                    delete panel._currentSearchChunkIntervalIdentifier;
                clearInterval(chunkIntervalIdentifier);
            }

            if (!view)
                return;

            if (view.element.parentNode !== parentElement && view.element.parentNode && parentElement)
                view.detach();

            view.currentQuery = query;
            view.performSearch(query, boundFinishedCallback);
        }

        processChunk();

        chunkIntervalIdentifier = setInterval(processChunk, 25);
        this._currentSearchChunkIntervalIdentifier = chunkIntervalIdentifier;
    },

    jumpToNextSearchResult: function()
    {
        if (!this.showView || !this._searchResults || !this._searchResults.length)
            return;

        var showFirstResult = false;

        this._currentSearchResultIndex = this._searchResults.indexOf(this.visibleView);
        if (this._currentSearchResultIndex === -1) {
            this._currentSearchResultIndex = 0;
            showFirstResult = true;
        }

        var currentView = this._searchResults[this._currentSearchResultIndex];

        if (currentView.showingLastSearchResult()) {
            if (++this._currentSearchResultIndex >= this._searchResults.length)
                this._currentSearchResultIndex = 0;
            currentView = this._searchResults[this._currentSearchResultIndex];
            showFirstResult = true;
        }

        if (currentView !== this.visibleView)
            this.showView(currentView);

        if (showFirstResult)
            currentView.jumpToFirstSearchResult();
        else
            currentView.jumpToNextSearchResult();
    },

    jumpToPreviousSearchResult: function()
    {
        if (!this.showView || !this._searchResults || !this._searchResults.length)
            return;

        var showLastResult = false;

        this._currentSearchResultIndex = this._searchResults.indexOf(this.visibleView);
        if (this._currentSearchResultIndex === -1) {
            this._currentSearchResultIndex = 0;
            showLastResult = true;
        }

        var currentView = this._searchResults[this._currentSearchResultIndex];

        if (currentView.showingFirstSearchResult()) {
            if (--this._currentSearchResultIndex < 0)
                this._currentSearchResultIndex = (this._searchResults.length - 1);
            currentView = this._searchResults[this._currentSearchResultIndex];
            showLastResult = true;
        }

        if (currentView !== this.visibleView)
            this.showView(currentView);

        if (showLastResult)
            currentView.jumpToLastSearchResult();
        else
            currentView.jumpToPreviousSearchResult();
    }
}

WebInspector.Panel.prototype.__proto__ = WebInspector.View.prototype;
/* PanelEnablerView.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.PanelEnablerView = function(identifier, headingText, disclaimerText, buttonTitle)
{
    WebInspector.View.call(this);

    this.element.addStyleClass("panel-enabler-view");
    this.element.addStyleClass(identifier);

    this.contentElement = document.createElement("div");
    this.contentElement.className = "panel-enabler-view-content";
    this.element.appendChild(this.contentElement);

    this.imageElement = document.createElement("img");
    this.contentElement.appendChild(this.imageElement);

    this.choicesForm = document.createElement("form");
    this.contentElement.appendChild(this.choicesForm);

    this.headerElement = document.createElement("h1");
    this.headerElement.textContent = headingText;
    this.choicesForm.appendChild(this.headerElement);

    this.disclaimerElement = document.createElement("div");
    this.disclaimerElement.className = "panel-enabler-disclaimer";
    this.disclaimerElement.textContent = disclaimerText;
    this.choicesForm.appendChild(this.disclaimerElement);

    this.enableButton = document.createElement("button");
    this.enableButton.setAttribute("type", "button");
    this.enableButton.textContent = buttonTitle;
    this.enableButton.addEventListener("click", this._enableButtonCicked.bind(this), false);
    this.choicesForm.appendChild(this.enableButton);

    window.addEventListener("resize", this._windowResized.bind(this), true);
}

WebInspector.PanelEnablerView.prototype = {
    _enableButtonCicked: function()
    {
        this.dispatchEventToListeners("enable clicked");
    },

    _windowResized: function()
    {
        this.imageElement.removeStyleClass("hidden");

        if (this.element.offsetWidth < (this.choicesForm.offsetWidth + this.imageElement.offsetWidth))
            this.imageElement.addStyleClass("hidden");
    }
}

WebInspector.PanelEnablerView.prototype.__proto__ = WebInspector.View.prototype;
/* ElementsPanel.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008 Matt Lilek <webkit@mattlilek.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ElementsPanel = function()
{
    WebInspector.Panel.call(this);

    this.element.addStyleClass("elements");

    this.contentElement = document.createElement("div");
    this.contentElement.id = "elements-content";
    this.contentElement.className = "outline-disclosure";

    this.treeOutline = new WebInspector.ElementsTreeOutline();
    this.treeOutline.panel = this;
    this.treeOutline.includeRootDOMNode = false;
    this.treeOutline.selectEnabled = true;

    this.treeOutline.focusedNodeChanged = function(forceUpdate)
    {
        if (this.panel.visible && WebInspector.currentFocusElement !== document.getElementById("search"))
            WebInspector.currentFocusElement = document.getElementById("main-panels");

        this.panel.updateBreadcrumb(forceUpdate);

        for (var pane in this.panel.sidebarPanes)
           this.panel.sidebarPanes[pane].needsUpdate = true;

        this.panel.updateStyles(true);
        this.panel.updateMetrics();
        this.panel.updateProperties();

        if (InspectorController.searchingForNode()) {
            InspectorController.toggleNodeSearch();
            this.panel.nodeSearchButton.removeStyleClass("toggled-on");
        }
    };

    this.contentElement.appendChild(this.treeOutline.element);

    this.crumbsElement = document.createElement("div");
    this.crumbsElement.className = "crumbs";
    this.crumbsElement.addEventListener("mousemove", this._mouseMovedInCrumbs.bind(this), false);
    this.crumbsElement.addEventListener("mouseout", this._mouseMovedOutOfCrumbs.bind(this), false);

    this.sidebarPanes = {};
    this.sidebarPanes.styles = new WebInspector.StylesSidebarPane();
    this.sidebarPanes.metrics = new WebInspector.MetricsSidebarPane();
    this.sidebarPanes.properties = new WebInspector.PropertiesSidebarPane();

    this.sidebarPanes.styles.onexpand = this.updateStyles.bind(this);
    this.sidebarPanes.metrics.onexpand = this.updateMetrics.bind(this);
    this.sidebarPanes.properties.onexpand = this.updateProperties.bind(this);

    this.sidebarPanes.styles.expanded = true;

    this.sidebarPanes.styles.addEventListener("style edited", this._stylesPaneEdited, this);
    this.sidebarPanes.styles.addEventListener("style property toggled", this._stylesPaneEdited, this);
    this.sidebarPanes.metrics.addEventListener("metrics edited", this._metricsPaneEdited, this);

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "elements-sidebar";

    this.sidebarElement.appendChild(this.sidebarPanes.styles.element);
    this.sidebarElement.appendChild(this.sidebarPanes.metrics.element);
    this.sidebarElement.appendChild(this.sidebarPanes.properties.element);

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this.rightSidebarResizerDragStart.bind(this), false);

    this.nodeSearchButton = document.createElement("button");
    this.nodeSearchButton.title = WebInspector.UIString("Select an element in the page to inspect it.");
    this.nodeSearchButton.id = "node-search-status-bar-item";
    this.nodeSearchButton.className = "status-bar-item";
    this.nodeSearchButton.addEventListener("click", this._nodeSearchButtonClicked.bind(this), false);

    this.searchingForNode = false;

    this.element.appendChild(this.contentElement);
    this.element.appendChild(this.sidebarElement);
    this.element.appendChild(this.sidebarResizeElement);

    this._mutationMonitoredWindows = [];
    this._nodeInsertedEventListener = InspectorController.wrapCallback(this._nodeInserted.bind(this));
    this._nodeRemovedEventListener = InspectorController.wrapCallback(this._nodeRemoved.bind(this));
    this._contentLoadedEventListener = InspectorController.wrapCallback(this._contentLoaded.bind(this));

    this.reset();
}

WebInspector.ElementsPanel.prototype = {
    toolbarItemClass: "elements",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Elements");
    },

    get statusBarItems()
    {
        return [this.nodeSearchButton, this.crumbsElement];
    },

    updateStatusBarItems: function()
    {
        this.updateBreadcrumbSizes();
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);
        this.sidebarResizeElement.style.right = (this.sidebarElement.offsetWidth - 3) + "px";
        this.updateBreadcrumb();
        this.treeOutline.updateSelection();
        if (this.recentlyModifiedNodes.length)
            this._updateModifiedNodes();
    },

    hide: function()
    {
        WebInspector.Panel.prototype.hide.call(this);

        WebInspector.hoveredDOMNode = null;

        if (InspectorController.searchingForNode()) {
            InspectorController.toggleNodeSearch();
            this.nodeSearchButton.removeStyleClass("toggled-on");
        }
    },

    resize: function()
    {
        this.treeOutline.updateSelection();
        this.updateBreadcrumbSizes();
    },

    reset: function()
    {
        this.rootDOMNode = null;
        this.focusedDOMNode = null;

        WebInspector.hoveredDOMNode = null;

        if (InspectorController.searchingForNode()) {
            InspectorController.toggleNodeSearch();
            this.nodeSearchButton.removeStyleClass("toggled-on");
        }

        this.recentlyModifiedNodes = [];
        this.unregisterAllMutationEventListeners();

        delete this.currentQuery;
        this.searchCanceled();

        var inspectedWindow = InspectorController.inspectedWindow();
        if (!inspectedWindow || !inspectedWindow.document)
            return;

        if (!inspectedWindow.document.firstChild) {
            function contentLoaded()
            {
                inspectedWindow.document.removeEventListener("DOMContentLoaded", contentLoadedCallback, false);

                this.reset();
            }

            var contentLoadedCallback = InspectorController.wrapCallback(contentLoaded.bind(this));
            inspectedWindow.document.addEventListener("DOMContentLoaded", contentLoadedCallback, false);
            return;
        }

        // If the window isn't visible, return early so the DOM tree isn't built
        // and mutation event listeners are not added.
        if (!InspectorController.isWindowVisible())
            return;

        this.registerMutationEventListeners(inspectedWindow);

        var inspectedRootDocument = inspectedWindow.document;
        this.rootDOMNode = inspectedRootDocument;

        var canidateFocusNode = inspectedRootDocument.body || inspectedRootDocument.documentElement;
        if (canidateFocusNode) {
            this.treeOutline.suppressSelectHighlight = true;
            this.focusedDOMNode = canidateFocusNode;
            this.treeOutline.suppressSelectHighlight = false;

            if (this.treeOutline.selectedTreeElement)
                this.treeOutline.selectedTreeElement.expand();
        }
    },

    includedInSearchResultsPropertyName: "__includedInInspectorSearchResults",

    searchCanceled: function()
    {
        if (this._searchResults) {
            const searchResultsProperty = this.includedInSearchResultsPropertyName;
            for (var i = 0; i < this._searchResults.length; ++i) {
                var node = this._searchResults[i];

                // Remove the searchResultsProperty since there might be an unfinished search.
                delete node[searchResultsProperty];

                var treeElement = this.treeOutline.findTreeElement(node);
                if (treeElement)
                    treeElement.highlighted = false;
            }
        }

        WebInspector.updateSearchMatchesCount(0, this);

        if (this._currentSearchChunkIntervalIdentifier) {
            clearInterval(this._currentSearchChunkIntervalIdentifier);
            delete this._currentSearchChunkIntervalIdentifier;
        }

        this._currentSearchResultIndex = 0;
        this._searchResults = [];
    },

    performSearch: function(query)
    {
        // Call searchCanceled since it will reset everything we need before doing a new search.
        this.searchCanceled();

        const whitespaceTrimmedQuery = query.trimWhitespace();
        if (!whitespaceTrimmedQuery.length)
            return;

        var tagNameQuery = whitespaceTrimmedQuery;
        var attributeNameQuery = whitespaceTrimmedQuery;
        var startTagFound = (tagNameQuery.indexOf("<") === 0);
        var endTagFound = (tagNameQuery.lastIndexOf(">") === (tagNameQuery.length - 1));

        if (startTagFound || endTagFound) {
            var tagNameQueryLength = tagNameQuery.length;
            tagNameQuery = tagNameQuery.substring((startTagFound ? 1 : 0), (endTagFound ? (tagNameQueryLength - 1) : tagNameQueryLength));
        }

        // Check the tagNameQuery is it is a possibly valid tag name.
        if (!/^[a-zA-Z0-9\-_:]+$/.test(tagNameQuery))
            tagNameQuery = null;

        // Check the attributeNameQuery is it is a possibly valid tag name.
        if (!/^[a-zA-Z0-9\-_:]+$/.test(attributeNameQuery))
            attributeNameQuery = null;

        const escapedQuery = query.escapeCharacters("'");
        const escapedTagNameQuery = (tagNameQuery ? tagNameQuery.escapeCharacters("'") : null);
        const escapedWhitespaceTrimmedQuery = whitespaceTrimmedQuery.escapeCharacters("'");
        const searchResultsProperty = this.includedInSearchResultsPropertyName;

        var updatedMatchCountOnce = false;
        var matchesCountUpdateTimeout = null;

        function updateMatchesCount()
        {
            WebInspector.updateSearchMatchesCount(this._searchResults.length, this);
            matchesCountUpdateTimeout = null;
            updatedMatchCountOnce = true;
        }

        function updateMatchesCountSoon()
        {
            if (!updatedMatchCountOnce)
                return updateMatchesCount.call(this);
            if (matchesCountUpdateTimeout)
                return;
            // Update the matches count every half-second so it doesn't feel twitchy.
            matchesCountUpdateTimeout = setTimeout(updateMatchesCount.bind(this), 500);
        }

        function addNodesToResults(nodes, length, getItem)
        {
            if (!length)
                return;

            for (var i = 0; i < length; ++i) {
                var node = getItem.call(nodes, i);
                // Skip this node if it already has the property.
                if (searchResultsProperty in node)
                    continue;

                if (!this._searchResults.length) {
                    this._currentSearchResultIndex = 0;
                    this.focusedDOMNode = node;
                }

                node[searchResultsProperty] = true;
                this._searchResults.push(node);

                // Highlight the tree element to show it matched the search.
                // FIXME: highlight the substrings in text nodes and attributes.
                var treeElement = this.treeOutline.findTreeElement(node);
                if (treeElement)
                    treeElement.highlighted = true;
            }

            updateMatchesCountSoon.call(this);
        }

        function matchExactItems(doc)
        {
            matchExactId.call(this, doc);
            matchExactClassNames.call(this, doc);
            matchExactTagNames.call(this, doc);
            matchExactAttributeNames.call(this, doc);
        }

        function matchExactId(doc)
        {
            const result = doc.__proto__.getElementById.call(doc, whitespaceTrimmedQuery);
            addNodesToResults.call(this, result, (result ? 1 : 0), function() { return this });
        }

        function matchExactClassNames(doc)
        {
            const result = doc.__proto__.getElementsByClassName.call(doc, whitespaceTrimmedQuery);
            addNodesToResults.call(this, result, result.length, result.item);
        }

        function matchExactTagNames(doc)
        {
            if (!tagNameQuery)
                return;
            const result = doc.__proto__.getElementsByTagName.call(doc, tagNameQuery);
            addNodesToResults.call(this, result, result.length, result.item);
        }

        function matchExactAttributeNames(doc)
        {
            if (!attributeNameQuery)
                return;
            const result = doc.__proto__.querySelectorAll.call(doc, "[" + attributeNameQuery + "]");
            addNodesToResults.call(this, result, result.length, result.item);
        }

        function matchPartialTagNames(doc)
        {
            if (!tagNameQuery)
                return;
            const result = doc.__proto__.evaluate.call(doc, "//*[contains(name(), '" + escapedTagNameQuery + "')]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function matchStartOfTagNames(doc)
        {
            if (!tagNameQuery)
                return;
            const result = doc.__proto__.evaluate.call(doc, "//*[starts-with(name(), '" + escapedTagNameQuery + "')]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function matchPartialTagNamesAndAttributeValues(doc)
        {
            if (!tagNameQuery) {
                matchPartialAttributeValues.call(this, doc);
                return;
            }

            const result = doc.__proto__.evaluate.call(doc, "//*[contains(name(), '" + escapedTagNameQuery + "') or contains(@*, '" + escapedQuery + "')]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function matchPartialAttributeValues(doc)
        {
            const result = doc.__proto__.evaluate.call(doc, "//*[contains(@*, '" + escapedQuery + "')]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function matchStyleSelector(doc)
        {
            const result = doc.__proto__.querySelectorAll.call(doc, whitespaceTrimmedQuery);
            addNodesToResults.call(this, result, result.length, result.item);
        }

        function matchPlainText(doc)
        {
            const result = doc.__proto__.evaluate.call(doc, "//text()[contains(., '" + escapedQuery + "')] | //comment()[contains(., '" + escapedQuery + "')]", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function matchXPathQuery(doc)
        {
            const result = doc.__proto__.evaluate.call(doc, whitespaceTrimmedQuery, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            addNodesToResults.call(this, result, result.snapshotLength, result.snapshotItem);
        }

        function finishedSearching()
        {
            // Remove the searchResultsProperty now that the search is finished.
            for (var i = 0; i < this._searchResults.length; ++i)
                delete this._searchResults[i][searchResultsProperty];
        }

        const mainFrameDocument = InspectorController.inspectedWindow().document;
        const searchDocuments = [mainFrameDocument];

        if (tagNameQuery && startTagFound && endTagFound)
            const searchFunctions = [matchExactTagNames, matchPlainText];
        else if (tagNameQuery && startTagFound)
            const searchFunctions = [matchStartOfTagNames, matchPlainText];
        else if (tagNameQuery && endTagFound) {
            // FIXME: we should have a matchEndOfTagNames search function if endTagFound is true but not startTagFound.
            // This requires ends-with() support in XPath, WebKit only supports starts-with() and contains().
            const searchFunctions = [matchPartialTagNames, matchPlainText];
        } else if (whitespaceTrimmedQuery === "//*" || whitespaceTrimmedQuery === "*") {
            // These queries will match every node. Matching everything isn't useful and can be slow for large pages,
            // so limit the search functions list to plain text and attribute matching.
            const searchFunctions = [matchPartialAttributeValues, matchPlainText];
        } else
            const searchFunctions = [matchExactItems, matchStyleSelector, matchPartialTagNamesAndAttributeValues, matchPlainText, matchXPathQuery];

        // Find all frames, iframes and object elements to search their documents.
        const querySelectorAllFunction = InspectorController.inspectedWindow().Document.prototype.querySelectorAll;
        const subdocumentResult = querySelectorAllFunction.call(mainFrameDocument, "iframe, frame, object");

        for (var i = 0; i < subdocumentResult.length; ++i) {
            var element = subdocumentResult.item(i);
            if (element.contentDocument)
                searchDocuments.push(element.contentDocument);
        }

        const panel = this;
        var documentIndex = 0;
        var searchFunctionIndex = 0;
        var chunkIntervalIdentifier = null;

        // Split up the work into chunks so we don't block the UI thread while processing.

        function processChunk()
        {
            var searchDocument = searchDocuments[documentIndex];
            var searchFunction = searchFunctions[searchFunctionIndex];

            if (++searchFunctionIndex > searchFunctions.length) {
                searchFunction = searchFunctions[0];
                searchFunctionIndex = 0;

                if (++documentIndex > searchDocuments.length) {
                    if (panel._currentSearchChunkIntervalIdentifier === chunkIntervalIdentifier)
                        delete panel._currentSearchChunkIntervalIdentifier;
                    clearInterval(chunkIntervalIdentifier);
                    finishedSearching.call(panel);
                    return;
                }

                searchDocument = searchDocuments[documentIndex];
            }

            if (!searchDocument || !searchFunction)
                return;

            try {
                searchFunction.call(panel, searchDocument);
            } catch(err) {
                // ignore any exceptions. the query might be malformed, but we allow that.
            }
        }

        processChunk();

        chunkIntervalIdentifier = setInterval(processChunk, 25);
        this._currentSearchChunkIntervalIdentifier = chunkIntervalIdentifier;
    },

    jumpToNextSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (++this._currentSearchResultIndex >= this._searchResults.length)
            this._currentSearchResultIndex = 0;
        this.focusedDOMNode = this._searchResults[this._currentSearchResultIndex];
    },

    jumpToPreviousSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (--this._currentSearchResultIndex < 0)
            this._currentSearchResultIndex = (this._searchResults.length - 1);
        this.focusedDOMNode = this._searchResults[this._currentSearchResultIndex];
    },

    inspectedWindowCleared: function(window)
    {
        if (InspectorController.isWindowVisible())
            this.updateMutationEventListeners(window);
    },

    _addMutationEventListeners: function(monitoredWindow)
    {
        monitoredWindow.document.addEventListener("DOMNodeInserted", this._nodeInsertedEventListener, true);
        monitoredWindow.document.addEventListener("DOMNodeRemoved", this._nodeRemovedEventListener, true);
        if (monitoredWindow.frameElement)
            monitoredWindow.addEventListener("DOMContentLoaded", this._contentLoadedEventListener, true);
    },

    _removeMutationEventListeners: function(monitoredWindow)
    {
        if (monitoredWindow.frameElement)
            monitoredWindow.removeEventListener("DOMContentLoaded", this._contentLoadedEventListener, true);
        if (!monitoredWindow.document)
            return;
        monitoredWindow.document.removeEventListener("DOMNodeInserted", this._nodeInsertedEventListener, true);
        monitoredWindow.document.removeEventListener("DOMNodeRemoved", this._nodeRemovedEventListener, true);
    },

    updateMutationEventListeners: function(monitoredWindow)
    {
        this._addMutationEventListeners(monitoredWindow);
    },

    registerMutationEventListeners: function(monitoredWindow)
    {
        if (!monitoredWindow || this._mutationMonitoredWindows.indexOf(monitoredWindow) !== -1)
            return;
        this._mutationMonitoredWindows.push(monitoredWindow);
        if (InspectorController.isWindowVisible())
            this._addMutationEventListeners(monitoredWindow);
    },

    unregisterMutationEventListeners: function(monitoredWindow)
    {
        if (!monitoredWindow || this._mutationMonitoredWindows.indexOf(monitoredWindow) === -1)
            return;
        this._mutationMonitoredWindows.remove(monitoredWindow);
        this._removeMutationEventListeners(monitoredWindow);
    },

    unregisterAllMutationEventListeners: function()
    {
        for (var i = 0; i < this._mutationMonitoredWindows.length; ++i)
            this._removeMutationEventListeners(this._mutationMonitoredWindows[i]);
        this._mutationMonitoredWindows = [];
    },

    get rootDOMNode()
    {
        return this.treeOutline.rootDOMNode;
    },

    set rootDOMNode(x)
    {
        this.treeOutline.rootDOMNode = x;
    },

    get focusedDOMNode()
    {
        return this.treeOutline.focusedDOMNode;
    },

    set focusedDOMNode(x)
    {
        this.treeOutline.focusedDOMNode = x;
    },

    _contentLoaded: function(event)
    {
        this.recentlyModifiedNodes.push({node: event.target, parent: event.target.defaultView.frameElement, replaced: true});
        if (this.visible)
            this._updateModifiedNodesSoon();
    },

    _nodeInserted: function(event)
    {
        this.recentlyModifiedNodes.push({node: event.target, parent: event.relatedNode, inserted: true});
        if (this.visible)
            this._updateModifiedNodesSoon();
    },

    _nodeRemoved: function(event)
    {
        this.recentlyModifiedNodes.push({node: event.target, parent: event.relatedNode, removed: true});
        if (this.visible)
            this._updateModifiedNodesSoon();
    },

    _updateModifiedNodesSoon: function()
    {
        if ("_updateModifiedNodesTimeout" in this)
            return;
        this._updateModifiedNodesTimeout = setTimeout(this._updateModifiedNodes.bind(this), 0);
    },

    _updateModifiedNodes: function()
    {
        if ("_updateModifiedNodesTimeout" in this) {
            clearTimeout(this._updateModifiedNodesTimeout);
            delete this._updateModifiedNodesTimeout;
        }

        var updatedParentTreeElements = [];
        var updateBreadcrumbs = false;

        for (var i = 0; i < this.recentlyModifiedNodes.length; ++i) {
            var replaced = this.recentlyModifiedNodes[i].replaced;
            var parent = this.recentlyModifiedNodes[i].parent;
            if (!parent)
                continue;

            var parentNodeItem = this.treeOutline.findTreeElement(parent, null, null, objectsAreSame);
            if (parentNodeItem && !parentNodeItem.alreadyUpdatedChildren) {
                parentNodeItem.updateChildren(replaced);
                parentNodeItem.alreadyUpdatedChildren = true;
                updatedParentTreeElements.push(parentNodeItem);
            }

            if (!updateBreadcrumbs && (objectsAreSame(this.focusedDOMNode, parent) || isAncestorIncludingParentFrames(this.focusedDOMNode, parent)))
                updateBreadcrumbs = true;
        }

        for (var i = 0; i < updatedParentTreeElements.length; ++i)
            delete updatedParentTreeElements[i].alreadyUpdatedChildren;

        this.recentlyModifiedNodes = [];

        if (updateBreadcrumbs)
            this.updateBreadcrumb(true);
    },

    _stylesPaneEdited: function()
    {
        this.sidebarPanes.metrics.needsUpdate = true;
        this.updateMetrics();
    },

    _metricsPaneEdited: function()
    {
        this.sidebarPanes.styles.needsUpdate = true;
        this.updateStyles(true);
    },

    _mouseMovedInCrumbs: function(event)
    {
        var nodeUnderMouse = document.elementFromPoint(event.pageX, event.pageY);
        var crumbElement = nodeUnderMouse.enclosingNodeOrSelfWithClass("crumb");

        WebInspector.hoveredDOMNode = (crumbElement ? crumbElement.representedObject : null);

        if ("_mouseOutOfCrumbsTimeout" in this) {
            clearTimeout(this._mouseOutOfCrumbsTimeout);
            delete this._mouseOutOfCrumbsTimeout;
        }
    },

    _mouseMovedOutOfCrumbs: function(event)
    {
        var nodeUnderMouse = document.elementFromPoint(event.pageX, event.pageY);
        if (nodeUnderMouse.isDescendant(this.crumbsElement))
            return;

        WebInspector.hoveredDOMNode = null;

        this._mouseOutOfCrumbsTimeout = setTimeout(this.updateBreadcrumbSizes.bind(this), 1000);
    },

    updateBreadcrumb: function(forceUpdate)
    {
        if (!this.visible)
            return;

        var crumbs = this.crumbsElement;

        var handled = false;
        var foundRoot = false;
        var crumb = crumbs.firstChild;
        while (crumb) {
            if (objectsAreSame(crumb.representedObject, this.rootDOMNode))
                foundRoot = true;

            if (foundRoot)
                crumb.addStyleClass("dimmed");
            else
                crumb.removeStyleClass("dimmed");

            if (objectsAreSame(crumb.representedObject, this.focusedDOMNode)) {
                crumb.addStyleClass("selected");
                handled = true;
            } else {
                crumb.removeStyleClass("selected");
            }

            crumb = crumb.nextSibling;
        }

        if (handled && !forceUpdate) {
            // We don't need to rebuild the crumbs, but we need to adjust sizes
            // to reflect the new focused or root node.
            this.updateBreadcrumbSizes();
            return;
        }

        crumbs.removeChildren();

        var panel = this;

        function selectCrumbFunction(event)
        {
            var crumb = event.currentTarget;
            if (crumb.hasStyleClass("collapsed")) {
                // Clicking a collapsed crumb will expose the hidden crumbs.
                if (crumb === panel.crumbsElement.firstChild) {
                    // If the focused crumb is the first child, pick the farthest crumb
                    // that is still hidden. This allows the user to expose every crumb.
                    var currentCrumb = crumb;
                    while (currentCrumb) {
                        var hidden = currentCrumb.hasStyleClass("hidden");
                        var collapsed = currentCrumb.hasStyleClass("collapsed");
                        if (!hidden && !collapsed)
                            break;
                        crumb = currentCrumb;
                        currentCrumb = currentCrumb.nextSibling;
                    }
                }

                panel.updateBreadcrumbSizes(crumb);
            } else {
                // Clicking a dimmed crumb or double clicking (event.detail >= 2)
                // will change the root node in addition to the focused node.
                if (event.detail >= 2 || crumb.hasStyleClass("dimmed"))
                    panel.rootDOMNode = crumb.representedObject.parentNode;
                panel.focusedDOMNode = crumb.representedObject;
            }

            event.preventDefault();
        }

        foundRoot = false;
        for (var current = this.focusedDOMNode; current; current = parentNodeOrFrameElement(current)) {
            if (current.nodeType === Node.DOCUMENT_NODE)
                continue;

            if (objectsAreSame(current, this.rootDOMNode))
                foundRoot = true;

            var crumb = document.createElement("span");
            crumb.className = "crumb";
            crumb.representedObject = current;
            crumb.addEventListener("mousedown", selectCrumbFunction, false);

            var crumbTitle;
            switch (current.nodeType) {
                case Node.ELEMENT_NODE:
                    crumbTitle = current.nodeName.toLowerCase();

                    var nameElement = document.createElement("span");
                    nameElement.textContent = crumbTitle;
                    crumb.appendChild(nameElement);

                    var idAttribute = current.getAttribute("id");
                    if (idAttribute) {
                        var idElement = document.createElement("span");
                        crumb.appendChild(idElement);

                        var part = "#" + idAttribute;
                        crumbTitle += part;
                        idElement.appendChild(document.createTextNode(part));

                        // Mark the name as extra, since the ID is more important.
                        nameElement.className = "extra";
                    }

                    var classAttribute = current.getAttribute("class");
                    if (classAttribute) {
                        var classes = classAttribute.split(/\s+/);
                        var foundClasses = {};

                        if (classes.length) {
                            var classesElement = document.createElement("span");
                            classesElement.className = "extra";
                            crumb.appendChild(classesElement);

                            for (var i = 0; i < classes.length; ++i) {
                                var className = classes[i];
                                if (className && !(className in foundClasses)) {
                                    var part = "." + className;
                                    crumbTitle += part;
                                    classesElement.appendChild(document.createTextNode(part));
                                    foundClasses[className] = true;
                                }
                            }
                        }
                    }

                    break;

                case Node.TEXT_NODE:
                    if (isNodeWhitespace.call(current))
                        crumbTitle = WebInspector.UIString("(whitespace)");
                    else
                        crumbTitle = WebInspector.UIString("(text)");
                    break

                case Node.COMMENT_NODE:
                    crumbTitle = "<!-->";
                    break;

                case Node.DOCUMENT_TYPE_NODE:
                    crumbTitle = "<!DOCTYPE>";
                    break;

                default:
                    crumbTitle = current.nodeName.toLowerCase();
            }

            if (!crumb.childNodes.length) {
                var nameElement = document.createElement("span");
                nameElement.textContent = crumbTitle;
                crumb.appendChild(nameElement);
            }

            crumb.title = crumbTitle;

            if (foundRoot)
                crumb.addStyleClass("dimmed");
            if (objectsAreSame(current, this.focusedDOMNode))
                crumb.addStyleClass("selected");
            if (!crumbs.childNodes.length)
                crumb.addStyleClass("end");

            crumbs.appendChild(crumb);
        }

        if (crumbs.hasChildNodes())
            crumbs.lastChild.addStyleClass("start");

        this.updateBreadcrumbSizes();
    },

    updateBreadcrumbSizes: function(focusedCrumb)
    {
        if (!this.visible)
            return;

        if (document.body.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        var crumbs = this.crumbsElement;
        if (!crumbs.childNodes.length || crumbs.offsetWidth <= 0)
            return; // No crumbs, do nothing.

        // A Zero index is the right most child crumb in the breadcrumb.
        var selectedIndex = 0;
        var focusedIndex = 0;
        var selectedCrumb;

        var i = 0;
        var crumb = crumbs.firstChild;
        while (crumb) {
            // Find the selected crumb and index. 
            if (!selectedCrumb && crumb.hasStyleClass("selected")) {
                selectedCrumb = crumb;
                selectedIndex = i;
            }

            // Find the focused crumb index. 
            if (crumb === focusedCrumb)
                focusedIndex = i;

            // Remove any styles that affect size before
            // deciding to shorten any crumbs.
            if (crumb !== crumbs.lastChild)
                crumb.removeStyleClass("start");
            if (crumb !== crumbs.firstChild)
                crumb.removeStyleClass("end");

            crumb.removeStyleClass("compact");
            crumb.removeStyleClass("collapsed");
            crumb.removeStyleClass("hidden");

            crumb = crumb.nextSibling;
            ++i;
        }

        // Restore the start and end crumb classes in case they got removed in coalesceCollapsedCrumbs().
        // The order of the crumbs in the document is opposite of the visual order.
        crumbs.firstChild.addStyleClass("end");
        crumbs.lastChild.addStyleClass("start");

        function crumbsAreSmallerThanContainer()
        {
            var rightPadding = 20;
            var errorWarningElement = document.getElementById("error-warning-count");
            if (!WebInspector.console.visible && errorWarningElement)
                rightPadding += errorWarningElement.offsetWidth;
            return ((crumbs.totalOffsetLeft + crumbs.offsetWidth + rightPadding) < window.innerWidth);
        }

        if (crumbsAreSmallerThanContainer())
            return; // No need to compact the crumbs, they all fit at full size.

        var BothSides = 0;
        var AncestorSide = -1;
        var ChildSide = 1;

        function makeCrumbsSmaller(shrinkingFunction, direction, significantCrumb)
        {
            if (!significantCrumb)
                significantCrumb = (focusedCrumb || selectedCrumb);

            if (significantCrumb === selectedCrumb)
                var significantIndex = selectedIndex;
            else if (significantCrumb === focusedCrumb)
                var significantIndex = focusedIndex;
            else {
                var significantIndex = 0;
                for (var i = 0; i < crumbs.childNodes.length; ++i) {
                    if (crumbs.childNodes[i] === significantCrumb) {
                        significantIndex = i;
                        break;
                    }
                }
            }

            function shrinkCrumbAtIndex(index)
            {
                var shrinkCrumb = crumbs.childNodes[index];
                if (shrinkCrumb && shrinkCrumb !== significantCrumb)
                    shrinkingFunction(shrinkCrumb);
                if (crumbsAreSmallerThanContainer())
                    return true; // No need to compact the crumbs more.
                return false;
            }

            // Shrink crumbs one at a time by applying the shrinkingFunction until the crumbs
            // fit in the container or we run out of crumbs to shrink.
            if (direction) {
                // Crumbs are shrunk on only one side (based on direction) of the signifcant crumb.
                var index = (direction > 0 ? 0 : crumbs.childNodes.length - 1);
                while (index !== significantIndex) {
                    if (shrinkCrumbAtIndex(index))
                        return true;
                    index += (direction > 0 ? 1 : -1);
                }
            } else {
                // Crumbs are shrunk in order of descending distance from the signifcant crumb,
                // with a tie going to child crumbs.
                var startIndex = 0;
                var endIndex = crumbs.childNodes.length - 1;
                while (startIndex != significantIndex || endIndex != significantIndex) {
                    var startDistance = significantIndex - startIndex;
                    var endDistance = endIndex - significantIndex;
                    if (startDistance >= endDistance)
                        var index = startIndex++;
                    else
                        var index = endIndex--;
                    if (shrinkCrumbAtIndex(index))
                        return true;
                }
            }

            // We are not small enough yet, return false so the caller knows.
            return false;
        }

        function coalesceCollapsedCrumbs()
        {
            var crumb = crumbs.firstChild;
            var collapsedRun = false;
            var newStartNeeded = false;
            var newEndNeeded = false;
            while (crumb) {
                var hidden = crumb.hasStyleClass("hidden");
                if (!hidden) {
                    var collapsed = crumb.hasStyleClass("collapsed"); 
                    if (collapsedRun && collapsed) {
                        crumb.addStyleClass("hidden");
                        crumb.removeStyleClass("compact");
                        crumb.removeStyleClass("collapsed");

                        if (crumb.hasStyleClass("start")) {
                            crumb.removeStyleClass("start");
                            newStartNeeded = true;
                        }

                        if (crumb.hasStyleClass("end")) {
                            crumb.removeStyleClass("end");
                            newEndNeeded = true;
                        }

                        continue;
                    }

                    collapsedRun = collapsed;

                    if (newEndNeeded) {
                        newEndNeeded = false;
                        crumb.addStyleClass("end");
                    }
                } else
                    collapsedRun = true;
                crumb = crumb.nextSibling;
            }

            if (newStartNeeded) {
                crumb = crumbs.lastChild;
                while (crumb) {
                    if (!crumb.hasStyleClass("hidden")) {
                        crumb.addStyleClass("start");
                        break;
                    }
                    crumb = crumb.previousSibling;
                }
            }
        }

        function compact(crumb)
        {
            if (crumb.hasStyleClass("hidden"))
                return;
            crumb.addStyleClass("compact");
        }

        function collapse(crumb, dontCoalesce)
        {
            if (crumb.hasStyleClass("hidden"))
                return;
            crumb.addStyleClass("collapsed");
            crumb.removeStyleClass("compact");
            if (!dontCoalesce)
                coalesceCollapsedCrumbs();
        }

        function compactDimmed(crumb)
        {
            if (crumb.hasStyleClass("dimmed"))
                compact(crumb);
        }

        function collapseDimmed(crumb)
        {
            if (crumb.hasStyleClass("dimmed"))
                collapse(crumb);
        }

        if (!focusedCrumb) {
            // When not focused on a crumb we can be biased and collapse less important
            // crumbs that the user might not care much about.

            // Compact child crumbs.
            if (makeCrumbsSmaller(compact, ChildSide))
                return;

            // Collapse child crumbs.
            if (makeCrumbsSmaller(collapse, ChildSide))
                return;

            // Compact dimmed ancestor crumbs.
            if (makeCrumbsSmaller(compactDimmed, AncestorSide))
                return;

            // Collapse dimmed ancestor crumbs.
            if (makeCrumbsSmaller(collapseDimmed, AncestorSide))
                return;
        }

        // Compact ancestor crumbs, or from both sides if focused.
        if (makeCrumbsSmaller(compact, (focusedCrumb ? BothSides : AncestorSide)))
            return;

        // Collapse ancestor crumbs, or from both sides if focused.
        if (makeCrumbsSmaller(collapse, (focusedCrumb ? BothSides : AncestorSide)))
            return;

        if (!selectedCrumb)
            return;

        // Compact the selected crumb.
        compact(selectedCrumb);
        if (crumbsAreSmallerThanContainer())
            return;

        // Collapse the selected crumb as a last resort. Pass true to prevent coalescing.
        collapse(selectedCrumb, true);
    },

    updateStyles: function(forceUpdate)
    {
        var stylesSidebarPane = this.sidebarPanes.styles;
        if (!stylesSidebarPane.expanded || !stylesSidebarPane.needsUpdate)
            return;

        stylesSidebarPane.update(this.focusedDOMNode, null, forceUpdate);
        stylesSidebarPane.needsUpdate = false;
    },

    updateMetrics: function()
    {
        var metricsSidebarPane = this.sidebarPanes.metrics;
        if (!metricsSidebarPane.expanded || !metricsSidebarPane.needsUpdate)
            return;

        metricsSidebarPane.update(this.focusedDOMNode);
        metricsSidebarPane.needsUpdate = false;
    },

    updateProperties: function()
    {
        var propertiesSidebarPane = this.sidebarPanes.properties;
        if (!propertiesSidebarPane.expanded || !propertiesSidebarPane.needsUpdate)
            return;

        propertiesSidebarPane.update(this.focusedDOMNode);
        propertiesSidebarPane.needsUpdate = false;
    },

    handleKeyEvent: function(event)
    {
        this.treeOutline.handleKeyEvent(event);
    },

    handleCopyEvent: function(event)
    {
        // Don't prevent the normal copy if the user has a selection.
        if (!window.getSelection().isCollapsed)
            return;

        switch (this.focusedDOMNode.nodeType) {
            case Node.ELEMENT_NODE:
                var data = this.focusedDOMNode.outerHTML;
                break;

            case Node.COMMENT_NODE:
                var data = "<!--" + this.focusedDOMNode.nodeValue + "-->";
                break;

            default:
            case Node.TEXT_NODE:
                var data = this.focusedDOMNode.nodeValue;
        }

        event.clipboardData.clearData();
        event.preventDefault();

        if (data)
            event.clipboardData.setData("text/plain", data);
    },

    rightSidebarResizerDragStart: function(event)
    {
        WebInspector.elementDragStart(this.sidebarElement, this.rightSidebarResizerDrag.bind(this), this.rightSidebarResizerDragEnd.bind(this), event, "col-resize");
    },

    rightSidebarResizerDragEnd: function(event)
    {
        WebInspector.elementDragEnd(event);
    },

    rightSidebarResizerDrag: function(event)
    {
        var x = event.pageX;
        var newWidth = Number.constrain(window.innerWidth - x, Preferences.minElementsSidebarWidth, window.innerWidth * 0.66);

        this.sidebarElement.style.width = newWidth + "px";
        this.contentElement.style.right = newWidth + "px";
        this.sidebarResizeElement.style.right = (newWidth - 3) + "px";

        this.treeOutline.updateSelection();

        event.preventDefault();
    },

    _nodeSearchButtonClicked: function(event)
    {
        InspectorController.toggleNodeSearch();

        if (InspectorController.searchingForNode())
            this.nodeSearchButton.addStyleClass("toggled-on");
        else
            this.nodeSearchButton.removeStyleClass("toggled-on");
    }
}

WebInspector.ElementsPanel.prototype.__proto__ = WebInspector.Panel.prototype;
/* ResourcesPanel.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008 Anthony Ricaud (rik24d@gmail.com)
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ResourcesPanel = function()
{
    WebInspector.Panel.call(this);

    this.element.addStyleClass("resources");

    this.viewsContainerElement = document.createElement("div");
    this.viewsContainerElement.id = "resource-views";
    this.element.appendChild(this.viewsContainerElement);

    this.containerElement = document.createElement("div");
    this.containerElement.id = "resources-container";
    this.containerElement.addEventListener("scroll", this._updateDividersLabelBarPosition.bind(this), false);
    this.element.appendChild(this.containerElement);

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "resources-sidebar";
    this.sidebarElement.className = "sidebar";
    this.containerElement.appendChild(this.sidebarElement);

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this._startSidebarDragging.bind(this), false);
    this.element.appendChild(this.sidebarResizeElement);

    this.containerContentElement = document.createElement("div");
    this.containerContentElement.id = "resources-container-content";
    this.containerElement.appendChild(this.containerContentElement);

    this.summaryElement = document.createElement("div");
    this.summaryElement.id = "resources-summary";
    this.containerContentElement.appendChild(this.summaryElement);

    this.resourcesGraphsElement = document.createElement("div");
    this.resourcesGraphsElement.id = "resources-graphs";
    this.containerContentElement.appendChild(this.resourcesGraphsElement);

    this.dividersElement = document.createElement("div");
    this.dividersElement.id = "resources-dividers";
    this.containerContentElement.appendChild(this.dividersElement);

    this.dividersLabelBarElement = document.createElement("div");
    this.dividersLabelBarElement.id = "resources-dividers-label-bar";
    this.containerContentElement.appendChild(this.dividersLabelBarElement);

    this.summaryGraphElement = document.createElement("canvas");
    this.summaryGraphElement.setAttribute("width", "450");
    this.summaryGraphElement.setAttribute("height", "38");
    this.summaryGraphElement.id = "resources-summary-graph";
    this.summaryElement.appendChild(this.summaryGraphElement);

    this.legendElement = document.createElement("div");
    this.legendElement.id = "resources-graph-legend";
    this.summaryElement.appendChild(this.legendElement);

    this.sidebarTreeElement = document.createElement("ol");
    this.sidebarTreeElement.className = "sidebar-tree";
    this.sidebarElement.appendChild(this.sidebarTreeElement);

    this.sidebarTree = new TreeOutline(this.sidebarTreeElement);

    var timeGraphItem = new WebInspector.SidebarTreeElement("resources-time-graph-sidebar-item", WebInspector.UIString("Time"));
    timeGraphItem.onselect = this._graphSelected.bind(this);

    var transferTimeCalculator = new WebInspector.ResourceTransferTimeCalculator();
    var transferDurationCalculator = new WebInspector.ResourceTransferDurationCalculator();

    timeGraphItem.sortingOptions = [
        { name: WebInspector.UIString("Sort by Start Time"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByAscendingStartTime, calculator: transferTimeCalculator },
        { name: WebInspector.UIString("Sort by Response Time"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByAscendingResponseReceivedTime, calculator: transferTimeCalculator },
        { name: WebInspector.UIString("Sort by End Time"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByAscendingEndTime, calculator: transferTimeCalculator },
        { name: WebInspector.UIString("Sort by Duration"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByDescendingDuration, calculator: transferDurationCalculator },
        { name: WebInspector.UIString("Sort by Latency"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByDescendingLatency, calculator: transferDurationCalculator },
    ];

    timeGraphItem.selectedSortingOptionIndex = 1;

    var sizeGraphItem = new WebInspector.SidebarTreeElement("resources-size-graph-sidebar-item", WebInspector.UIString("Size"));
    sizeGraphItem.onselect = this._graphSelected.bind(this);

    var transferSizeCalculator = new WebInspector.ResourceTransferSizeCalculator();
    sizeGraphItem.sortingOptions = [
        { name: WebInspector.UIString("Sort by Size"), sortingFunction: WebInspector.ResourceSidebarTreeElement.CompareByDescendingSize, calculator: transferSizeCalculator },
    ];

    sizeGraphItem.selectedSortingOptionIndex = 0;

    this.graphsTreeElement = new WebInspector.SidebarSectionTreeElement(WebInspector.UIString("GRAPHS"), {}, true);
    this.sidebarTree.appendChild(this.graphsTreeElement);

    this.graphsTreeElement.appendChild(timeGraphItem);
    this.graphsTreeElement.appendChild(sizeGraphItem);
    this.graphsTreeElement.expand();

    this.resourcesTreeElement = new WebInspector.SidebarSectionTreeElement(WebInspector.UIString("RESOURCES"), {}, true);
    this.sidebarTree.appendChild(this.resourcesTreeElement);

    this.resourcesTreeElement.expand();

    this.largerResourcesButton = document.createElement("button");
    this.largerResourcesButton.id = "resources-larger-resources-status-bar-item";
    this.largerResourcesButton.className = "status-bar-item toggled-on";
    this.largerResourcesButton.title = WebInspector.UIString("Use small resource rows.");
    this.largerResourcesButton.addEventListener("click", this._toggleLargerResources.bind(this), false);

    this.sortingSelectElement = document.createElement("select");
    this.sortingSelectElement.className = "status-bar-item";
    this.sortingSelectElement.addEventListener("change", this._changeSortingFunction.bind(this), false);

    this.reset();

    timeGraphItem.select();
}

WebInspector.ResourcesPanel.prototype = {
    toolbarItemClass: "resources",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Resources");
    },

    get statusBarItems()
    {
        return [this.largerResourcesButton, this.sortingSelectElement];
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);

        this._updateDividersLabelBarPosition();
        this._updateSidebarWidth();
        this.refreshIfNeeded();

        var visibleView = this.visibleView;
        if (visibleView) {
            visibleView.headersVisible = true;
            visibleView.show(this.viewsContainerElement);
        }

        // Hide any views that are visible that are not this panel's current visible view.
        // This can happen when a ResourceView is visible in the Scripts panel then switched
        // to the this panel.
        var resourcesLength = this._resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var resource = this._resources[i];
            var view = resource._resourcesView;
            if (!view || view === visibleView)
                continue;
            view.visible = false;
        }
    },

    resize: function()
    {
        this._updateGraphDividersIfNeeded();

        var visibleView = this.visibleView;
        if (visibleView && "resize" in visibleView)
            visibleView.resize();
    },

    get searchableViews()
    {
        var views = [];

        const visibleView = this.visibleView;
        if (visibleView && visibleView.performSearch)
            views.push(visibleView);

        var resourcesLength = this._resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var resource = this._resources[i];
            if (!resource._resourcesTreeElement)
                continue;
            var resourceView = this.resourceViewForResource(resource);
            if (!resourceView.performSearch || resourceView === visibleView)
                continue;
            views.push(resourceView);
        }

        return views;
    },

    get searchResultsSortFunction()
    {
        const resourceTreeElementSortFunction = this.sortingFunction;

        function sortFuction(a, b)
        {
            return resourceTreeElementSortFunction(a.resource._resourcesTreeElement, b.resource._resourcesTreeElement);
        }

        return sortFuction;
    },

    searchMatchFound: function(view, matches)
    {
        view.resource._resourcesTreeElement.searchMatches = matches;
    },

    searchCanceled: function(startingNewSearch)
    {
        WebInspector.Panel.prototype.searchCanceled.call(this, startingNewSearch);

        if (startingNewSearch || !this._resources)
            return;

        for (var i = 0; i < this._resources.length; ++i) {
            var resource = this._resources[i];
            if (resource._resourcesTreeElement)
                resource._resourcesTreeElement.updateErrorsAndWarnings();
        }
    },

    performSearch: function(query)
    {
        for (var i = 0; i < this._resources.length; ++i) {
            var resource = this._resources[i];
            if (resource._resourcesTreeElement)
                resource._resourcesTreeElement.resetBubble();
        }

        WebInspector.Panel.prototype.performSearch.call(this, query);
    },

    get visibleView()
    {
        if (this.visibleResource)
            return this.visibleResource._resourcesView;
        return null;
    },

    get calculator()
    {
        return this._calculator;
    },

    set calculator(x)
    {
        if (!x || this._calculator === x)
            return;

        this._calculator = x;
        this._calculator.reset();

        this._staleResources = this._resources;
        this.refresh();
    },

    get sortingFunction()
    {
        return this._sortingFunction;
    },

    set sortingFunction(x)
    {
        this._sortingFunction = x;
        this._sortResourcesIfNeeded();
    },

    get needsRefresh()
    {
        return this._needsRefresh;
    },

    set needsRefresh(x)
    {
        if (this._needsRefresh === x)
            return;

        this._needsRefresh = x;

        if (x) {
            if (this.visible && !("_refreshTimeout" in this))
                this._refreshTimeout = setTimeout(this.refresh.bind(this), 500);
        } else {
            if ("_refreshTimeout" in this) {
                clearTimeout(this._refreshTimeout);
                delete this._refreshTimeout;
            }
        }
    },

    refreshIfNeeded: function()
    {
        if (this.needsRefresh)
            this.refresh();
    },

    refresh: function()
    {
        this.needsRefresh = false;

        var staleResourcesLength = this._staleResources.length;
        var boundariesChanged = false;

        for (var i = 0; i < staleResourcesLength; ++i) {
            var resource = this._staleResources[i];
            if (!resource._resourcesTreeElement) {
                // Create the resource tree element and graph.
                resource._resourcesTreeElement = new WebInspector.ResourceSidebarTreeElement(resource);
                resource._resourcesTreeElement._resourceGraph = new WebInspector.ResourceGraph(resource);

                this.resourcesTreeElement.appendChild(resource._resourcesTreeElement);
                this.resourcesGraphsElement.appendChild(resource._resourcesTreeElement._resourceGraph.graphElement);
            }

            resource._resourcesTreeElement.refresh();

            if (this.calculator.updateBoundaries(resource))
                boundariesChanged = true;
        }

        if (boundariesChanged) {
            // The boundaries changed, so all resource graphs are stale.
            this._staleResources = this._resources;
            staleResourcesLength = this._staleResources.length;
        }

        for (var i = 0; i < staleResourcesLength; ++i)
            this._staleResources[i]._resourcesTreeElement._resourceGraph.refresh(this.calculator);

        this._staleResources = [];

        this._updateGraphDividersIfNeeded();
        this._sortResourcesIfNeeded();
        this._updateSummaryGraph();
    },

    reset: function()
    {
        this.closeVisibleResource();

        this.containerElement.scrollTop = 0;

        delete this.currentQuery;
        this.searchCanceled();

        if (this._calculator)
            this._calculator.reset();

        if (this._resources) {
            var resourcesLength = this._resources.length;
            for (var i = 0; i < resourcesLength; ++i) {
                var resource = this._resources[i];

                resource.warnings = 0;
                resource.errors = 0;

                delete resource._resourcesTreeElement;
                delete resource._resourcesView;
            }
        }

        this._resources = [];
        this._staleResources = [];

        this.resourcesTreeElement.removeChildren();
        this.viewsContainerElement.removeChildren();
        this.resourcesGraphsElement.removeChildren();
        this.legendElement.removeChildren();

        this._updateGraphDividersIfNeeded(true);

        this._drawSummaryGraph(); // draws an empty graph
    },

    addResource: function(resource)
    {
        this._resources.push(resource);
        this.refreshResource(resource);
    },

    removeResource: function(resource)
    {
        if (this.visibleView === resource._resourcesView)
            this.closeVisibleResource();

        this._resources.remove(resource, true);

        if (resource._resourcesTreeElement) {
            this.resourcesTreeElement.removeChild(resource._resourcesTreeElement);
            this.resourcesGraphsElement.removeChild(resource._resourcesTreeElement._resourceGraph.graphElement);
        }

        resource.warnings = 0;
        resource.errors = 0;

        delete resource._resourcesTreeElement;
        delete resource._resourcesView;

        this._adjustScrollPosition();
    },

    addMessageToResource: function(resource, msg)
    {
        if (!resource)
            return;

        switch (msg.level) {
        case WebInspector.ConsoleMessage.MessageLevel.Warning:
            resource.warnings += msg.repeatDelta;
            break;
        case WebInspector.ConsoleMessage.MessageLevel.Error:
            resource.errors += msg.repeatDelta;
            break;
        }

        if (!this.currentQuery && resource._resourcesTreeElement)
            resource._resourcesTreeElement.updateErrorsAndWarnings();

        var view = this.resourceViewForResource(resource);
        if (view.addMessage)
            view.addMessage(msg);
    },

    clearMessages: function()
    {
        var resourcesLength = this._resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var resource = this._resources[i];
            resource.warnings = 0;
            resource.errors = 0;

            if (!this.currentQuery && resource._resourcesTreeElement)
                resource._resourcesTreeElement.updateErrorsAndWarnings();

            var view = resource._resourcesView;
            if (!view || !view.clearMessages)
                continue;
            view.clearMessages();
        }
    },

    refreshResource: function(resource)
    {
        this._staleResources.push(resource);
        this.needsRefresh = true;
    },

    recreateViewForResourceIfNeeded: function(resource)
    {
        if (!resource || !resource._resourcesView)
            return;

        var newView = this._createResourceView(resource);
        if (newView.prototype === resource._resourcesView.prototype)
            return;

        resource.warnings = 0;
        resource.errors = 0;

        if (!this.currentQuery && resource._resourcesTreeElement)
            resource._resourcesTreeElement.updateErrorsAndWarnings();

        var oldView = resource._resourcesView;

        resource._resourcesView.detach();
        delete resource._resourcesView;

        resource._resourcesView = newView;

        newView.headersVisible = oldView.headersVisible;

        if (oldView.visible && oldView.element.parentNode)
            newView.show(oldView.element.parentNode);
    },

    showResource: function(resource, line)
    {
        if (!resource)
            return;

        this.containerElement.addStyleClass("viewing-resource");

        if (this.visibleResource && this.visibleResource._resourcesView)
            this.visibleResource._resourcesView.hide();

        var view = this.resourceViewForResource(resource);
        view.headersVisible = true;
        view.show(this.viewsContainerElement);

        if (line) {
            if (view.revealLine)
                view.revealLine(line);
            if (view.highlightLine)
                view.highlightLine(line);
        }

        if (resource._resourcesTreeElement) {
            resource._resourcesTreeElement.reveal();
            resource._resourcesTreeElement.select(true);
        }

        this.visibleResource = resource;

        this._updateSidebarWidth();
    },

    showView: function(view)
    {
        if (!view)
            return;
        this.showResource(view.resource);
    },

    closeVisibleResource: function()
    {
        this.containerElement.removeStyleClass("viewing-resource");
        this._updateDividersLabelBarPosition();

        if (this.visibleResource && this.visibleResource._resourcesView)
            this.visibleResource._resourcesView.hide();
        delete this.visibleResource;

        if (this._lastSelectedGraphTreeElement)
            this._lastSelectedGraphTreeElement.select(true);

        this._updateSidebarWidth();
    },

    resourceViewForResource: function(resource)
    {
        if (!resource)
            return null;
        if (!resource._resourcesView)
            resource._resourcesView = this._createResourceView(resource);
        return resource._resourcesView;
    },

    sourceFrameForResource: function(resource)
    {
        var view = this.resourceViewForResource(resource);
        if (!view)
            return null;

        if (!view.setupSourceFrameIfNeeded)
            return null;

        // Setting up the source frame requires that we be attached.
        if (!this.element.parentNode)
            this.attach();

        view.setupSourceFrameIfNeeded();
        return view.sourceFrame;
    },

    handleKeyEvent: function(event)
    {
        this.sidebarTree.handleKeyEvent(event);
    },

    _makeLegendElement: function(label, value, color)
    {
        var legendElement = document.createElement("label");
        legendElement.className = "resources-graph-legend-item";

        if (color) {
            var swatch = document.createElement("canvas");
            swatch.className = "resources-graph-legend-swatch";
            swatch.setAttribute("width", "13");
            swatch.setAttribute("height", "24");

            legendElement.appendChild(swatch);

            this._drawSwatch(swatch, color);
        }

        var labelElement = document.createElement("div");
        labelElement.className = "resources-graph-legend-label";
        legendElement.appendChild(labelElement);

        var headerElement = document.createElement("div");
        var headerElement = document.createElement("div");
        headerElement.className = "resources-graph-legend-header";
        headerElement.textContent = label;
        labelElement.appendChild(headerElement);

        var valueElement = document.createElement("div");
        valueElement.className = "resources-graph-legend-value";
        valueElement.textContent = value;
        labelElement.appendChild(valueElement);

        return legendElement;
    },

    _sortResourcesIfNeeded: function()
    {
        var sortedElements = [].concat(this.resourcesTreeElement.children);
        sortedElements.sort(this.sortingFunction);

        var sortedElementsLength = sortedElements.length;
        for (var i = 0; i < sortedElementsLength; ++i) {
            var treeElement = sortedElements[i];
            if (treeElement === this.resourcesTreeElement.children[i])
                continue;

            var wasSelected = treeElement.selected;
            this.resourcesTreeElement.removeChild(treeElement);
            this.resourcesTreeElement.insertChild(treeElement, i);
            if (wasSelected)
                treeElement.select(true);

            var graphElement = treeElement._resourceGraph.graphElement;
            this.resourcesGraphsElement.insertBefore(graphElement, this.resourcesGraphsElement.children[i]);
        }
    },

    _updateGraphDividersIfNeeded: function(force)
    {
        if (!this.visible) {
            this.needsRefresh = true;
            return;
        }

        if (document.body.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        var dividerCount = Math.round(this.dividersElement.offsetWidth / 64);
        var slice = this.calculator.boundarySpan / dividerCount;
        if (!force && this._currentDividerSlice === slice)
            return;

        this._currentDividerSlice = slice;

        this.dividersElement.removeChildren();
        this.dividersLabelBarElement.removeChildren();

        for (var i = 1; i <= dividerCount; ++i) {
            var divider = document.createElement("div");
            divider.className = "resources-divider";
            if (i === dividerCount)
                divider.addStyleClass("last");
            divider.style.left = ((i / dividerCount) * 100) + "%";

            this.dividersElement.appendChild(divider.cloneNode());

            var label = document.createElement("div");
            label.className = "resources-divider-label";
            if (!isNaN(slice))
                label.textContent = this.calculator.formatValue(slice * i);
            divider.appendChild(label);

            this.dividersLabelBarElement.appendChild(divider);
        }
    },

    _fadeOutRect: function(ctx, x, y, w, h, a1, a2)
    {
        ctx.save();

        var gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0.0, "rgba(0, 0, 0, " + (1.0 - a1) + ")");
        gradient.addColorStop(0.8, "rgba(0, 0, 0, " + (1.0 - a2) + ")");
        gradient.addColorStop(1.0, "rgba(0, 0, 0, 1.0)");

        ctx.globalCompositeOperation = "destination-out";

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);

        ctx.restore();
    },

    _drawSwatch: function(canvas, color)
    {
        var ctx = canvas.getContext("2d");

        function drawSwatchSquare() {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 13, 13);

            var gradient = ctx.createLinearGradient(0, 0, 13, 13);
            gradient.addColorStop(0.0, "rgba(255, 255, 255, 0.2)");
            gradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 13, 13);

            gradient = ctx.createLinearGradient(13, 13, 0, 0);
            gradient.addColorStop(0.0, "rgba(0, 0, 0, 0.2)");
            gradient.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 13, 13);

            ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
            ctx.strokeRect(0.5, 0.5, 12, 12);
        }

        ctx.clearRect(0, 0, 13, 24);

        drawSwatchSquare();

        ctx.save();

        ctx.translate(0, 25);
        ctx.scale(1, -1);

        drawSwatchSquare();

        ctx.restore();

        this._fadeOutRect(ctx, 0, 13, 13, 13, 0.5, 0.0);
    },

    _drawSummaryGraph: function(segments)
    {
        if (!this.summaryGraphElement)
            return;

        if (!segments || !segments.length) {
            segments = [{color: "white", value: 1}];
            this._showingEmptySummaryGraph = true;
        } else
            delete this._showingEmptySummaryGraph;

        // Calculate the total of all segments.
        var total = 0;
        for (var i = 0; i < segments.length; ++i)
            total += segments[i].value;

        // Calculate the percentage of each segment, rounded to the nearest percent.
        var percents = segments.map(function(s) { return Math.max(Math.round(100 * s.value / total), 1) });

        // Calculate the total percentage.
        var percentTotal = 0;
        for (var i = 0; i < percents.length; ++i)
            percentTotal += percents[i];

        // Make sure our percentage total is not greater-than 100, it can be greater
        // if we rounded up for a few segments.
        while (percentTotal > 100) {
            for (var i = 0; i < percents.length && percentTotal > 100; ++i) {
                if (percents[i] > 1) {
                    --percents[i];
                    --percentTotal;
                }
            }
        }

        // Make sure our percentage total is not less-than 100, it can be less
        // if we rounded down for a few segments.
        while (percentTotal < 100) {
            for (var i = 0; i < percents.length && percentTotal < 100; ++i) {
                ++percents[i];
                ++percentTotal;
            }
        }

        var ctx = this.summaryGraphElement.getContext("2d");

        var x = 0;
        var y = 0;
        var w = 450;
        var h = 19;
        var r = (h / 2);

        function drawPillShadow()
        {
            // This draws a line with a shadow that is offset away from the line. The line is stroked
            // twice with different X shadow offsets to give more feathered edges. Later we erase the
            // line with destination-out 100% transparent black, leaving only the shadow. This only
            // works if nothing has been drawn into the canvas yet.

            ctx.beginPath();
            ctx.moveTo(x + 4, y + h - 3 - 0.5);
            ctx.lineTo(x + w - 4, y + h - 3 - 0.5);
            ctx.closePath();

            ctx.save();

            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 5;

            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;

            ctx.stroke();

            ctx.shadowOffsetX = -3;

            ctx.stroke();

            ctx.restore();

            ctx.save();

            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.lineWidth = 1;

            ctx.stroke();

            ctx.restore();
        }

        function drawPill()
        {
            // Make a rounded rect path.
            ctx.beginPath();
            ctx.moveTo(x, y + r);
            ctx.lineTo(x, y + h - r);
            ctx.quadraticCurveTo(x, y + h, x + r, y + h);
            ctx.lineTo(x + w - r, y + h);
            ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
            ctx.lineTo(x + w, y + r);
            ctx.quadraticCurveTo(x + w, y, x + w - r, y);
            ctx.lineTo(x + r, y);
            ctx.quadraticCurveTo(x, y, x, y + r);
            ctx.closePath();

            // Clip to the rounded rect path.
            ctx.save();
            ctx.clip();

            // Fill the segments with the associated color.
            var previousSegmentsWidth = 0;
            for (var i = 0; i < segments.length; ++i) {
                var segmentWidth = Math.round(w * percents[i] / 100);
                ctx.fillStyle = segments[i].color;
                ctx.fillRect(x + previousSegmentsWidth, y, segmentWidth, h);
                previousSegmentsWidth += segmentWidth;
            }

            // Draw the segment divider lines.
            ctx.lineWidth = 1;
            for (var i = 1; i < 20; ++i) {
                ctx.beginPath();
                ctx.moveTo(x + (i * Math.round(w / 20)) + 0.5, y);
                ctx.lineTo(x + (i * Math.round(w / 20)) + 0.5, y + h);
                ctx.closePath();

                ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x + (i * Math.round(w / 20)) + 1.5, y);
                ctx.lineTo(x + (i * Math.round(w / 20)) + 1.5, y + h);
                ctx.closePath();

                ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                ctx.stroke();
            }

            // Draw the pill shading.
            var lightGradient = ctx.createLinearGradient(x, y, x, y + (h / 1.5));
            lightGradient.addColorStop(0.0, "rgba(220, 220, 220, 0.6)");
            lightGradient.addColorStop(0.4, "rgba(220, 220, 220, 0.2)");
            lightGradient.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

            var darkGradient = ctx.createLinearGradient(x, y + (h / 3), x, y + h);
            darkGradient.addColorStop(0.0, "rgba(0, 0, 0, 0.0)");
            darkGradient.addColorStop(0.8, "rgba(0, 0, 0, 0.2)");
            darkGradient.addColorStop(1.0, "rgba(0, 0, 0, 0.5)");

            ctx.fillStyle = darkGradient;
            ctx.fillRect(x, y, w, h);

            ctx.fillStyle = lightGradient;
            ctx.fillRect(x, y, w, h);

            ctx.restore();
        }

        ctx.clearRect(x, y, w, (h * 2));

        drawPillShadow();
        drawPill();

        ctx.save();

        ctx.translate(0, (h * 2) + 1);
        ctx.scale(1, -1);

        drawPill();

        ctx.restore();

        this._fadeOutRect(ctx, x, y + h + 1, w, h, 0.5, 0.0);
    },

    _updateSummaryGraph: function()
    {
        var graphInfo = this.calculator.computeSummaryValues(this._resources);

        var categoryOrder = ["documents", "stylesheets", "images", "scripts", "xhr", "fonts", "other"];
        var categoryColors = {documents: {r: 47, g: 102, b: 236}, stylesheets: {r: 157, g: 231, b: 119}, images: {r: 164, g: 60, b: 255}, scripts: {r: 255, g: 121, b: 0}, xhr: {r: 231, g: 231, b: 10}, fonts: {r: 255, g: 82, b: 62}, other: {r: 186, g: 186, b: 186}};
        var fillSegments = [];

        this.legendElement.removeChildren();

        for (var i = 0; i < categoryOrder.length; ++i) {
            var category = categoryOrder[i];
            var size = graphInfo.categoryValues[category];
            if (!size)
                continue;

            var color = categoryColors[category];
            var colorString = "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";

            var fillSegment = {color: colorString, value: size};
            fillSegments.push(fillSegment);

            var legendLabel = this._makeLegendElement(WebInspector.resourceCategories[category].title, this.calculator.formatValue(size), colorString);
            this.legendElement.appendChild(legendLabel);
        }

        if (graphInfo.total) {
            var totalLegendLabel = this._makeLegendElement(WebInspector.UIString("Total"), this.calculator.formatValue(graphInfo.total));
            totalLegendLabel.addStyleClass("total");
            this.legendElement.appendChild(totalLegendLabel);
        }

        this._drawSummaryGraph(fillSegments);
    },

    _updateDividersLabelBarPosition: function()
    {
        var scrollTop = this.containerElement.scrollTop;
        var dividersTop = (scrollTop < this.summaryElement.offsetHeight ? this.summaryElement.offsetHeight : scrollTop);
        this.dividersElement.style.top = scrollTop + "px";
        this.dividersLabelBarElement.style.top = dividersTop + "px";
    },

    _graphSelected: function(treeElement)
    {
        if (this._lastSelectedGraphTreeElement)
            this._lastSelectedGraphTreeElement.selectedSortingOptionIndex = this.sortingSelectElement.selectedIndex;

        this._lastSelectedGraphTreeElement = treeElement;

        this.sortingSelectElement.removeChildren();
        for (var i = 0; i < treeElement.sortingOptions.length; ++i) {
            var sortingOption = treeElement.sortingOptions[i];
            var option = document.createElement("option");
            option.label = sortingOption.name;
            option.sortingFunction = sortingOption.sortingFunction;
            option.calculator = sortingOption.calculator;
            this.sortingSelectElement.appendChild(option);
        }

        this.sortingSelectElement.selectedIndex = treeElement.selectedSortingOptionIndex;
        this._changeSortingFunction();

        this.closeVisibleResource();
        this.containerElement.scrollTop = 0;
    },

    _toggleLargerResources: function()
    {
        if (!this.resourcesTreeElement._childrenListNode)
            return;

        this.resourcesTreeElement.smallChildren = !this.resourcesTreeElement.smallChildren;

        if (this.resourcesTreeElement.smallChildren) {
            this.resourcesGraphsElement.addStyleClass("small");
            this.largerResourcesButton.title = WebInspector.UIString("Use large resource rows.");
            this.largerResourcesButton.removeStyleClass("toggled-on");
            this._adjustScrollPosition();
        } else {
            this.resourcesGraphsElement.removeStyleClass("small");
            this.largerResourcesButton.title = WebInspector.UIString("Use small resource rows.");
            this.largerResourcesButton.addStyleClass("toggled-on");
        }
    },

    _adjustScrollPosition: function()
    {
        // Prevent the container from being scrolled off the end.
        if ((this.containerElement.scrollTop + this.containerElement.offsetHeight) > this.sidebarElement.offsetHeight)
            this.containerElement.scrollTop = (this.sidebarElement.offsetHeight - this.containerElement.offsetHeight);
    },

    _changeSortingFunction: function()
    {
        var selectedOption = this.sortingSelectElement[this.sortingSelectElement.selectedIndex];
        this.sortingFunction = selectedOption.sortingFunction;
        this.calculator = selectedOption.calculator;
    },

    _createResourceView: function(resource)
    {
        switch (resource.category) {
            case WebInspector.resourceCategories.documents:
            case WebInspector.resourceCategories.stylesheets:
            case WebInspector.resourceCategories.scripts:
            case WebInspector.resourceCategories.xhr:
                return new WebInspector.SourceView(resource);
            case WebInspector.resourceCategories.images:
                return new WebInspector.ImageView(resource);
            case WebInspector.resourceCategories.fonts:
                return new WebInspector.FontView(resource);
            default:
                return new WebInspector.ResourceView(resource);
        }
    },

    _startSidebarDragging: function(event)
    {
        WebInspector.elementDragStart(this.sidebarResizeElement, this._sidebarDragging.bind(this), this._endSidebarDragging.bind(this), event, "col-resize");
    },

    _sidebarDragging: function(event)
    {
        this._updateSidebarWidth(event.pageX);

        event.preventDefault();
    },

    _endSidebarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);
    },

    _updateSidebarWidth: function(width)
    {
        if (this.sidebarElement.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        if (!("_currentSidebarWidth" in this))
            this._currentSidebarWidth = this.sidebarElement.offsetWidth;

        if (typeof width === "undefined")
            width = this._currentSidebarWidth;

        width = Number.constrain(width, Preferences.minSidebarWidth, window.innerWidth / 2);

        this._currentSidebarWidth = width;

        if (this.visibleResource) {
            this.containerElement.style.width = width + "px";
            this.sidebarElement.style.removeProperty("width");
        } else {
            this.sidebarElement.style.width = width + "px";
            this.containerElement.style.removeProperty("width");
        }

        this.containerContentElement.style.left = width + "px";
        this.viewsContainerElement.style.left = width + "px";
        this.sidebarResizeElement.style.left = (width - 3) + "px";

        this._updateGraphDividersIfNeeded();

        var visibleView = this.visibleView;
        if (visibleView && "resize" in visibleView)
            visibleView.resize();
    }
}

WebInspector.ResourcesPanel.prototype.__proto__ = WebInspector.Panel.prototype;

WebInspector.ResourceCalculator = function()
{
}

WebInspector.ResourceCalculator.prototype = {
    computeSummaryValues: function(resources)
    {
        var total = 0;
        var categoryValues = {};

        var resourcesLength = resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var resource = resources[i];
            var value = this._value(resource);
            if (typeof value === "undefined")
                continue;
            if (!(resource.category.name in categoryValues))
                categoryValues[resource.category.name] = 0;
            categoryValues[resource.category.name] += value;
            total += value;
        }

        return {categoryValues: categoryValues, total: total};
    },

    computeBarGraphPercentages: function(resource)
    {
        return {start: 0, middle: 0, end: (this._value(resource) / this.boundarySpan) * 100};
    },

    computeBarGraphLabels: function(resource)
    {
        const label = this.formatValue(this._value(resource));
        var tooltip = label;
        if (resource.cached)
            tooltip = WebInspector.UIString("%s (from cache)", tooltip);
        return {left: label, right: label, tooltip: tooltip};
    },

    get boundarySpan()
    {
        return this.maximumBoundary - this.minimumBoundary;
    },

    updateBoundaries: function(resource)
    {
        this.minimumBoundary = 0;

        var value = this._value(resource);
        if (typeof this.maximumBoundary === "undefined" || value > this.maximumBoundary) {
            this.maximumBoundary = value;
            return true;
        }

        return false;
    },

    reset: function()
    {
        delete this.minimumBoundary;
        delete this.maximumBoundary;
    },

    _value: function(resource)
    {
        return 0;
    },

    formatValue: function(value)
    {
        return value.toString();
    }
}

WebInspector.ResourceTimeCalculator = function(startAtZero)
{
    WebInspector.ResourceCalculator.call(this);
    this.startAtZero = startAtZero;
}

WebInspector.ResourceTimeCalculator.prototype = {
    computeSummaryValues: function(resources)
    {
        var resourcesByCategory = {};
        var resourcesLength = resources.length;
        for (var i = 0; i < resourcesLength; ++i) {
            var resource = resources[i];
            if (!(resource.category.name in resourcesByCategory))
                resourcesByCategory[resource.category.name] = [];
            resourcesByCategory[resource.category.name].push(resource);
        }

        var earliestStart;
        var latestEnd;
        var categoryValues = {};
        for (var category in resourcesByCategory) {
            resourcesByCategory[category].sort(WebInspector.Resource.CompareByTime);
            categoryValues[category] = 0;

            var segment = {start: -1, end: -1};

            var categoryResources = resourcesByCategory[category];
            var resourcesLength = categoryResources.length;
            for (var i = 0; i < resourcesLength; ++i) {
                var resource = categoryResources[i];
                if (resource.startTime === -1 || resource.endTime === -1)
                    continue;

                if (typeof earliestStart === "undefined")
                    earliestStart = resource.startTime;
                else
                    earliestStart = Math.min(earliestStart, resource.startTime);

                if (typeof latestEnd === "undefined")
                    latestEnd = resource.endTime;
                else
                    latestEnd = Math.max(latestEnd, resource.endTime);

                if (resource.startTime <= segment.end) {
                    segment.end = Math.max(segment.end, resource.endTime);
                    continue;
                }

                categoryValues[category] += segment.end - segment.start;

                segment.start = resource.startTime;
                segment.end = resource.endTime;
            }

            // Add the last segment
            categoryValues[category] += segment.end - segment.start;
        }

        return {categoryValues: categoryValues, total: latestEnd - earliestStart};
    },

    computeBarGraphPercentages: function(resource)
    {
        if (resource.startTime !== -1)
            var start = ((resource.startTime - this.minimumBoundary) / this.boundarySpan) * 100;
        else
            var start = 0;

        if (resource.responseReceivedTime !== -1)
            var middle = ((resource.responseReceivedTime - this.minimumBoundary) / this.boundarySpan) * 100;
        else
            var middle = (this.startAtZero ? start : 100);

        if (resource.endTime !== -1)
            var end = ((resource.endTime - this.minimumBoundary) / this.boundarySpan) * 100;
        else
            var end = (this.startAtZero ? middle : 100);

        if (this.startAtZero) {
            end -= start;
            middle -= start;
            start = 0;
        }

        return {start: start, middle: middle, end: end};
    },

    computeBarGraphLabels: function(resource)
    {
        var leftLabel = "";
        if (resource.latency > 0)
            leftLabel = this.formatValue(resource.latency);

        var rightLabel = "";
        if (resource.responseReceivedTime !== -1 && resource.endTime !== -1)
            rightLabel = this.formatValue(resource.endTime - resource.responseReceivedTime);

        if (leftLabel && rightLabel) {
            var total = this.formatValue(resource.duration);
            var tooltip = WebInspector.UIString("%s latency, %s download (%s total)", leftLabel, rightLabel, total);
        } else if (leftLabel)
            var tooltip = WebInspector.UIString("%s latency", leftLabel);
        else if (rightLabel)
            var tooltip = WebInspector.UIString("%s download", rightLabel);

        if (resource.cached)
            tooltip = WebInspector.UIString("%s (from cache)", tooltip);

        return {left: leftLabel, right: rightLabel, tooltip: tooltip};
    },

    updateBoundaries: function(resource)
    {
        var didChange = false;

        var lowerBound;
        if (this.startAtZero)
            lowerBound = 0;
        else
            lowerBound = this._lowerBound(resource);

        if (lowerBound !== -1 && (typeof this.minimumBoundary === "undefined" || lowerBound < this.minimumBoundary)) {
            this.minimumBoundary = lowerBound;
            didChange = true;
        }

        var upperBound = this._upperBound(resource);
        if (upperBound !== -1 && (typeof this.maximumBoundary === "undefined" || upperBound > this.maximumBoundary)) {
            this.maximumBoundary = upperBound;
            didChange = true;
        }

        return didChange;
    },

    formatValue: function(value)
    {
        return Number.secondsToString(value, WebInspector.UIString.bind(WebInspector));
    },

    _lowerBound: function(resource)
    {
        return 0;
    },

    _upperBound: function(resource)
    {
        return 0;
    },
}

WebInspector.ResourceTimeCalculator.prototype.__proto__ = WebInspector.ResourceCalculator.prototype;

WebInspector.ResourceTransferTimeCalculator = function()
{
    WebInspector.ResourceTimeCalculator.call(this, false);
}

WebInspector.ResourceTransferTimeCalculator.prototype = {
    formatValue: function(value)
    {
        return Number.secondsToString(value, WebInspector.UIString.bind(WebInspector));
    },

    _lowerBound: function(resource)
    {
        return resource.startTime;
    },

    _upperBound: function(resource)
    {
        return resource.endTime;
    }
}

WebInspector.ResourceTransferTimeCalculator.prototype.__proto__ = WebInspector.ResourceTimeCalculator.prototype;

WebInspector.ResourceTransferDurationCalculator = function()
{
    WebInspector.ResourceTimeCalculator.call(this, true);
}

WebInspector.ResourceTransferDurationCalculator.prototype = {
    formatValue: function(value)
    {
        return Number.secondsToString(value, WebInspector.UIString.bind(WebInspector));
    },

    _upperBound: function(resource)
    {
        return resource.duration;
    }
}

WebInspector.ResourceTransferDurationCalculator.prototype.__proto__ = WebInspector.ResourceTimeCalculator.prototype;

WebInspector.ResourceTransferSizeCalculator = function()
{
    WebInspector.ResourceCalculator.call(this);
}

WebInspector.ResourceTransferSizeCalculator.prototype = {
    _value: function(resource)
    {
        return resource.contentLength;
    },

    formatValue: function(value)
    {
        return Number.bytesToString(value, WebInspector.UIString.bind(WebInspector));
    }
}

WebInspector.ResourceTransferSizeCalculator.prototype.__proto__ = WebInspector.ResourceCalculator.prototype;

WebInspector.ResourceSidebarTreeElement = function(resource)
{
    this.resource = resource;

    this.createIconElement();

    WebInspector.SidebarTreeElement.call(this, "resource-sidebar-tree-item", "", "", resource);

    this.refreshTitles();
}

WebInspector.ResourceSidebarTreeElement.prototype = {
    onattach: function()
    {
        WebInspector.SidebarTreeElement.prototype.onattach.call(this);

        this._listItemNode.addStyleClass("resources-category-" + this.resource.category.name);
    },

    onselect: function()
    {
        WebInspector.panels.resources.showResource(this.resource);
    },

    get mainTitle()
    {
        return this.resource.displayName;
    },

    set mainTitle(x)
    {
        // Do nothing.
    },

    get subtitle()
    {
        var subtitle = this.resource.displayDomain;

        if (this.resource.path && this.resource.lastPathComponent) {
            var lastPathComponentIndex = this.resource.path.lastIndexOf("/" + this.resource.lastPathComponent);
            if (lastPathComponentIndex != -1)
                subtitle += this.resource.path.substring(0, lastPathComponentIndex);
        }

        return subtitle;
    },

    set subtitle(x)
    {
        // Do nothing.
    },

    createIconElement: function()
    {
        var previousIconElement = this.iconElement;

        if (this.resource.category === WebInspector.resourceCategories.images) {
            var previewImage = document.createElement("img");
            previewImage.className = "image-resource-icon-preview";
            previewImage.src = this.resource.url;

            this.iconElement = document.createElement("div");
            this.iconElement.className = "icon";
            this.iconElement.appendChild(previewImage);
        } else {
            this.iconElement = document.createElement("img");
            this.iconElement.className = "icon";
        }

        if (previousIconElement)
            previousIconElement.parentNode.replaceChild(this.iconElement, previousIconElement);
    },

    refresh: function()
    {
        this.refreshTitles();

        if (!this._listItemNode.hasStyleClass("resources-category-" + this.resource.category.name)) {
            this._listItemNode.removeMatchingStyleClasses("resources-category-\\w+");
            this._listItemNode.addStyleClass("resources-category-" + this.resource.category.name);

            this.createIconElement();
        }
    },

    resetBubble: function()
    {
        this.bubbleText = "";
        this.bubbleElement.removeStyleClass("search-matches");
        this.bubbleElement.removeStyleClass("warning");
        this.bubbleElement.removeStyleClass("error");
    },

    set searchMatches(matches)
    {
        this.resetBubble();

        if (!matches)
            return;

        this.bubbleText = matches;
        this.bubbleElement.addStyleClass("search-matches");
    },

    updateErrorsAndWarnings: function()
    {
        this.resetBubble();

        if (this.resource.warnings || this.resource.errors)
            this.bubbleText = (this.resource.warnings + this.resource.errors);

        if (this.resource.warnings)
            this.bubbleElement.addStyleClass("warning");

        if (this.resource.errors)
            this.bubbleElement.addStyleClass("error");
    }
}

WebInspector.ResourceSidebarTreeElement.CompareByAscendingStartTime = function(a, b)
{
    return WebInspector.Resource.CompareByStartTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByEndTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByResponseReceivedTime(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.CompareByAscendingResponseReceivedTime = function(a, b)
{
    return WebInspector.Resource.CompareByResponseReceivedTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByStartTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByEndTime(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.CompareByAscendingEndTime = function(a, b)
{
    return WebInspector.Resource.CompareByEndTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByStartTime(a.resource, b.resource)
        || WebInspector.Resource.CompareByResponseReceivedTime(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.CompareByDescendingDuration = function(a, b)
{
    return -1 * WebInspector.Resource.CompareByDuration(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.CompareByDescendingLatency = function(a, b)
{
    return -1 * WebInspector.Resource.CompareByLatency(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.CompareByDescendingSize = function(a, b)
{
    return -1 * WebInspector.Resource.CompareBySize(a.resource, b.resource);
}

WebInspector.ResourceSidebarTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;

WebInspector.ResourceGraph = function(resource)
{
    this.resource = resource;

    this._graphElement = document.createElement("div");
    this._graphElement.className = "resources-graph-side";
    this._graphElement.addEventListener("mouseover", this.refreshLabelPositions.bind(this), false);

    if (resource.cached)
        this._graphElement.addStyleClass("resource-cached");

    this._barAreaElement = document.createElement("div");
    this._barAreaElement.className = "resources-graph-bar-area hidden";
    this._graphElement.appendChild(this._barAreaElement);

    this._barLeftElement = document.createElement("div");
    this._barLeftElement.className = "resources-graph-bar waiting";
    this._barAreaElement.appendChild(this._barLeftElement);

    this._barRightElement = document.createElement("div");
    this._barRightElement.className = "resources-graph-bar";
    this._barAreaElement.appendChild(this._barRightElement);

    this._labelLeftElement = document.createElement("div");
    this._labelLeftElement.className = "resources-graph-label waiting";
    this._barAreaElement.appendChild(this._labelLeftElement);

    this._labelRightElement = document.createElement("div");
    this._labelRightElement.className = "resources-graph-label";
    this._barAreaElement.appendChild(this._labelRightElement);

    this._graphElement.addStyleClass("resources-category-" + resource.category.name);
}

WebInspector.ResourceGraph.prototype = {
    get graphElement()
    {
        return this._graphElement;
    },

    refreshLabelPositions: function()
    {
        this._labelLeftElement.style.removeProperty("left");
        this._labelLeftElement.style.removeProperty("right");
        this._labelLeftElement.removeStyleClass("before");
        this._labelLeftElement.removeStyleClass("hidden");

        this._labelRightElement.style.removeProperty("left");
        this._labelRightElement.style.removeProperty("right");
        this._labelRightElement.removeStyleClass("after");
        this._labelRightElement.removeStyleClass("hidden");

        const labelPadding = 10;
        const rightBarWidth = (this._barRightElement.offsetWidth - labelPadding);
        const leftBarWidth = ((this._barLeftElement.offsetWidth - this._barRightElement.offsetWidth) - labelPadding);

        var labelBefore = (this._labelLeftElement.offsetWidth > leftBarWidth);
        var labelAfter = (this._labelRightElement.offsetWidth > rightBarWidth);

        if (labelBefore) {
            if ((this._graphElement.offsetWidth * (this._percentages.start / 100)) < (this._labelLeftElement.offsetWidth + 10))
                this._labelLeftElement.addStyleClass("hidden");
            this._labelLeftElement.style.setProperty("right", (100 - this._percentages.start) + "%");
            this._labelLeftElement.addStyleClass("before");
        } else {
            this._labelLeftElement.style.setProperty("left", this._percentages.start + "%");
            this._labelLeftElement.style.setProperty("right", (100 - this._percentages.middle) + "%");
        }

        if (labelAfter) {
            if ((this._graphElement.offsetWidth * ((100 - this._percentages.end) / 100)) < (this._labelRightElement.offsetWidth + 10))
                this._labelRightElement.addStyleClass("hidden");
            this._labelRightElement.style.setProperty("left", this._percentages.end + "%");
            this._labelRightElement.addStyleClass("after");
        } else {
            this._labelRightElement.style.setProperty("left", this._percentages.middle + "%");
            this._labelRightElement.style.setProperty("right", (100 - this._percentages.end) + "%");
        }
    },

    refresh: function(calculator)
    {
        var percentages = calculator.computeBarGraphPercentages(this.resource);
        var labels = calculator.computeBarGraphLabels(this.resource);

        this._percentages = percentages;

        this._barAreaElement.removeStyleClass("hidden");

        if (!this._graphElement.hasStyleClass("resources-category-" + this.resource.category.name)) {
            this._graphElement.removeMatchingStyleClasses("resources-category-\\w+");
            this._graphElement.addStyleClass("resources-category-" + this.resource.category.name);
        }

        this._barLeftElement.style.setProperty("left", percentages.start + "%");
        this._barLeftElement.style.setProperty("right", (100 - percentages.end) + "%");

        this._barRightElement.style.setProperty("left", percentages.middle + "%");
        this._barRightElement.style.setProperty("right", (100 - percentages.end) + "%");

        this._labelLeftElement.textContent = labels.left;
        this._labelRightElement.textContent = labels.right;

        var tooltip = (labels.tooltip || "");
        this._barLeftElement.title = tooltip;
        this._labelLeftElement.title = tooltip;
        this._labelRightElement.title = tooltip;
        this._barRightElement.title = tooltip;
    }
}
/* ScriptsPanel.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ScriptsPanel = function()
{
    WebInspector.Panel.call(this);

    this.element.addStyleClass("scripts");

    this.topStatusBar = document.createElement("div");
    this.topStatusBar.className = "status-bar";
    this.topStatusBar.id = "scripts-status-bar";
    this.element.appendChild(this.topStatusBar);

    this.backButton = document.createElement("button");
    this.backButton.className = "status-bar-item";
    this.backButton.id = "scripts-back";
    this.backButton.title = WebInspector.UIString("Show the previous script resource.");
    this.backButton.disabled = true;
    this.backButton.appendChild(document.createElement("img"));
    this.backButton.addEventListener("click", this._goBack.bind(this), false);
    this.topStatusBar.appendChild(this.backButton);

    this.forwardButton = document.createElement("button");
    this.forwardButton.className = "status-bar-item";
    this.forwardButton.id = "scripts-forward";
    this.forwardButton.title = WebInspector.UIString("Show the next script resource.");
    this.forwardButton.disabled = true;
    this.forwardButton.appendChild(document.createElement("img"));
    this.forwardButton.addEventListener("click", this._goForward.bind(this), false);
    this.topStatusBar.appendChild(this.forwardButton);

    this.filesSelectElement = document.createElement("select");
    this.filesSelectElement.className = "status-bar-item";
    this.filesSelectElement.id = "scripts-files";
    this.filesSelectElement.addEventListener("change", this._changeVisibleFile.bind(this), false);
    this.topStatusBar.appendChild(this.filesSelectElement);

    this.functionsSelectElement = document.createElement("select");
    this.functionsSelectElement.className = "status-bar-item";
    this.functionsSelectElement.id = "scripts-functions";

    // FIXME: append the functions select element to the top status bar when it is implemented.
    // this.topStatusBar.appendChild(this.functionsSelectElement);

    this.sidebarButtonsElement = document.createElement("div");
    this.sidebarButtonsElement.id = "scripts-sidebar-buttons";
    this.topStatusBar.appendChild(this.sidebarButtonsElement);

    this.pauseButton = document.createElement("button");
    this.pauseButton.className = "status-bar-item";
    this.pauseButton.id = "scripts-pause";
    this.pauseButton.title = WebInspector.UIString("Pause script execution.");
    this.pauseButton.disabled = true;
    this.pauseButton.appendChild(document.createElement("img"));
    this.pauseButton.addEventListener("click", this._togglePause.bind(this), false);
    this.sidebarButtonsElement.appendChild(this.pauseButton);

    this.stepOverButton = document.createElement("button");
    this.stepOverButton.className = "status-bar-item";
    this.stepOverButton.id = "scripts-step-over";
    this.stepOverButton.title = WebInspector.UIString("Step over next function call.");
    this.stepOverButton.disabled = true;
    this.stepOverButton.addEventListener("click", this._stepOverClicked.bind(this), false);
    this.stepOverButton.appendChild(document.createElement("img"));
    this.sidebarButtonsElement.appendChild(this.stepOverButton);

    this.stepIntoButton = document.createElement("button");
    this.stepIntoButton.className = "status-bar-item";
    this.stepIntoButton.id = "scripts-step-into";
    this.stepIntoButton.title = WebInspector.UIString("Step into next function call.");
    this.stepIntoButton.disabled = true;
    this.stepIntoButton.addEventListener("click", this._stepIntoClicked.bind(this), false);
    this.stepIntoButton.appendChild(document.createElement("img"));
    this.sidebarButtonsElement.appendChild(this.stepIntoButton);

    this.stepOutButton = document.createElement("button");
    this.stepOutButton.className = "status-bar-item";
    this.stepOutButton.id = "scripts-step-out";
    this.stepOutButton.title = WebInspector.UIString("Step out of current function.");
    this.stepOutButton.disabled = true;
    this.stepOutButton.addEventListener("click", this._stepOutClicked.bind(this), false);
    this.stepOutButton.appendChild(document.createElement("img"));
    this.sidebarButtonsElement.appendChild(this.stepOutButton);

    this.debuggerStatusElement = document.createElement("div");
    this.debuggerStatusElement.id = "scripts-debugger-status";
    this.sidebarButtonsElement.appendChild(this.debuggerStatusElement);

    this.viewsContainerElement = document.createElement("div");
    this.viewsContainerElement.id = "script-resource-views";

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "scripts-sidebar";

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this._startSidebarResizeDrag.bind(this), false);

    this.sidebarResizeWidgetElement = document.createElement("div");
    this.sidebarResizeWidgetElement.id = "scripts-sidebar-resizer-widget";
    this.sidebarResizeWidgetElement.addEventListener("mousedown", this._startSidebarResizeDrag.bind(this), false);
    this.topStatusBar.appendChild(this.sidebarResizeWidgetElement);

    this.sidebarPanes = {};
    this.sidebarPanes.callstack = new WebInspector.CallStackSidebarPane();
    this.sidebarPanes.scopechain = new WebInspector.ScopeChainSidebarPane();
    this.sidebarPanes.breakpoints = new WebInspector.BreakpointsSidebarPane();

    for (var pane in this.sidebarPanes)
        this.sidebarElement.appendChild(this.sidebarPanes[pane].element);

    // FIXME: remove the following line of code when the Breakpoints pane has content.
    this.sidebarElement.removeChild(this.sidebarPanes.breakpoints.element);

    this.sidebarPanes.callstack.expanded = true;
    this.sidebarPanes.callstack.addEventListener("call frame selected", this._callFrameSelected, this);

    this.sidebarPanes.scopechain.expanded = true;

    var panelEnablerHeading = WebInspector.UIString("You need to enable debugging before you can use the Scripts panel.");
    var panelEnablerDisclaimer = WebInspector.UIString("Enabling debugging will make scripts run slower.");
    var panelEnablerButton = WebInspector.UIString("Enable Debugging");

    this.panelEnablerView = new WebInspector.PanelEnablerView("scripts", panelEnablerHeading, panelEnablerDisclaimer, panelEnablerButton);
    this.panelEnablerView.addEventListener("enable clicked", this._enableDebugging, this);

    this.element.appendChild(this.panelEnablerView.element);
    this.element.appendChild(this.viewsContainerElement);
    this.element.appendChild(this.sidebarElement);
    this.element.appendChild(this.sidebarResizeElement);

    this.enableToggleButton = document.createElement("button");
    this.enableToggleButton.className = "enable-toggle-status-bar-item status-bar-item";
    this.enableToggleButton.addEventListener("click", this._toggleDebugging.bind(this), false);

    this.pauseOnExceptionButton = document.createElement("button");
    this.pauseOnExceptionButton.id = "scripts-pause-on-exceptions-status-bar-item";
    this.pauseOnExceptionButton.className = "status-bar-item";
    this.pauseOnExceptionButton.addEventListener("click", this._togglePauseOnExceptions.bind(this), false);

    this._breakpointsURLMap = {};

    this.reset();
}

WebInspector.ScriptsPanel.prototype = {
    toolbarItemClass: "scripts",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Scripts");
    },

    get statusBarItems()
    {
        return [this.enableToggleButton, this.pauseOnExceptionButton];
    },

    get paused()
    {
        return this._paused;
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);
        this.sidebarResizeElement.style.right = (this.sidebarElement.offsetWidth - 3) + "px";

        if (this.visibleView) {
            if (this.visibleView instanceof WebInspector.ResourceView)
                this.visibleView.headersVisible = false;
            this.visibleView.show(this.viewsContainerElement);
        }

        // Hide any views that are visible that are not this panel's current visible view.
        // This can happen when a ResourceView is visible in the Resources panel then switched
        // to the this panel.
        for (var sourceID in this._sourceIDMap) {
            var scriptOrResource = this._sourceIDMap[sourceID];
            var view = this._sourceViewForScriptOrResource(scriptOrResource);
            if (!view || view === this.visibleView)
                continue;
            view.visible = false;
        }
    },

    get searchableViews()
    {
        var views = [];

        const visibleView = this.visibleView;
        if (visibleView && visibleView.performSearch) {
            visibleView.alreadySearching = true;
            views.push(visibleView);
        }

        for (var sourceID in this._sourceIDMap) {
            var scriptOrResource = this._sourceIDMap[sourceID];
            var view = this._sourceViewForScriptOrResource(scriptOrResource);
            if (!view.performSearch || view.alreadySearching)
                continue;

            view.alreadySearching = true;
            views.push(view);
        }

        for (var i = 0; i < views.length; ++i)
            delete views[i].alreadySearching;

        return views;
    },

    addScript: function(sourceID, sourceURL, source, startingLine, errorLine, errorMessage)
    {
        var script = new WebInspector.Script(sourceID, sourceURL, source, startingLine, errorLine, errorMessage);

        if (sourceURL in WebInspector.resourceURLMap) {
            var resource = WebInspector.resourceURLMap[sourceURL];
            resource.addScript(script);
        }

        if (sourceURL in this._breakpointsURLMap && sourceID) {
            var breakpoints = this._breakpointsURLMap[sourceURL];
            var breakpointsLength = breakpoints.length;
            for (var i = 0; i < breakpointsLength; ++i) {
                var breakpoint = breakpoints[i];
                if (startingLine <= breakpoint.line) {
                    breakpoint.sourceID = sourceID;
                    if (breakpoint.enabled)
                        InspectorController.addBreakpoint(breakpoint.sourceID, breakpoint.line);
                }
            }
        }

        if (sourceID)
            this._sourceIDMap[sourceID] = (resource || script);

        this._addScriptToFilesMenu(script);
    },

    addBreakpoint: function(breakpoint)
    {
        this.sidebarPanes.breakpoints.addBreakpoint(breakpoint);

        var sourceFrame;
        if (breakpoint.url) {
            if (!(breakpoint.url in this._breakpointsURLMap))
                this._breakpointsURLMap[breakpoint.url] = [];
            this._breakpointsURLMap[breakpoint.url].unshift(breakpoint);

            if (breakpoint.url in WebInspector.resourceURLMap) {
                var resource = WebInspector.resourceURLMap[breakpoint.url];
                sourceFrame = this._sourceFrameForScriptOrResource(resource);
            }
        }

        if (breakpoint.sourceID && !sourceFrame) {
            var object = this._sourceIDMap[breakpoint.sourceID]
            sourceFrame = this._sourceFrameForScriptOrResource(object);
        }

        if (sourceFrame)
            sourceFrame.addBreakpoint(breakpoint);
    },

    removeBreakpoint: function(breakpoint)
    {
        this.sidebarPanes.breakpoints.removeBreakpoint(breakpoint);

        var sourceFrame;
        if (breakpoint.url && breakpoint.url in this._breakpointsURLMap) {
            var breakpoints = this._breakpointsURLMap[breakpoint.url];
            breakpoints.remove(breakpoint);
            if (!breakpoints.length)
                delete this._breakpointsURLMap[breakpoint.url];

            if (breakpoint.url in WebInspector.resourceURLMap) {
                var resource = WebInspector.resourceURLMap[breakpoint.url];
                sourceFrame = this._sourceFrameForScriptOrResource(resource);
            }
        }

        if (breakpoint.sourceID && !sourceFrame) {
            var object = this._sourceIDMap[breakpoint.sourceID]
            sourceFrame = this._sourceFrameForScriptOrResource(object);
        }

        if (sourceFrame)
            sourceFrame.removeBreakpoint(breakpoint);
    },

    evaluateInSelectedCallFrame: function(code, updateInterface)
    {
        var selectedCallFrame = this.sidebarPanes.callstack.selectedCallFrame;
        if (!this._paused || !selectedCallFrame)
            return;
        if (typeof updateInterface === "undefined")
            updateInterface = true;
        var result = selectedCallFrame.evaluate(code);
        if (updateInterface)
            this.sidebarPanes.scopechain.update(selectedCallFrame);
        return result;
    },

    variablesInScopeForSelectedCallFrame: function()
    {
        var selectedCallFrame = this.sidebarPanes.callstack.selectedCallFrame;
        if (!this._paused || !selectedCallFrame)
            return {};

        var result = {};
        var scopeChain = selectedCallFrame.scopeChain;
        for (var i = 0; i < scopeChain.length; ++i) {
            var scopeObject = scopeChain[i];
            for (var property in scopeObject)
                result[property] = true;
        }

        return result;
    },

    debuggerPaused: function()
    {
        this._paused = true;
        this._waitingToPause = false;
        this._stepping = false;

        this._updateDebuggerButtons();

        var callStackPane = this.sidebarPanes.callstack;
        var currentFrame = InspectorController.currentCallFrame();
        callStackPane.update(currentFrame, this._sourceIDMap);
        callStackPane.selectedCallFrame = currentFrame;

        WebInspector.currentPanel = this;
        window.focus();
    },

    debuggerWasEnabled: function()
    {
        this.reset();
    },

    debuggerWasDisabled: function()
    {
        this.reset();
    },

    reset: function()
    {
        this.visibleView = null;

        delete this.currentQuery;
        this.searchCanceled();

        if (!InspectorController.debuggerEnabled()) {
            this._paused = false;
            this._waitingToPause = false;
            this._stepping = false;
        }

        this._clearInterface();

        this._backForwardList = [];
        this._currentBackForwardIndex = -1;
        this._updateBackAndForwardButtons();

        this._scriptsForURLsInFilesSelect = {};
        this.filesSelectElement.removeChildren();
        this.functionsSelectElement.removeChildren();
        this.viewsContainerElement.removeChildren();

        if (this._sourceIDMap) {
            for (var sourceID in this._sourceIDMap) {
                var object = this._sourceIDMap[sourceID];
                if (object instanceof WebInspector.Resource)
                    object.removeAllScripts();
            }
        }

        this._sourceIDMap = {};
    },

    get visibleView()
    {
        return this._visibleView;
    },

    set visibleView(x)
    {
        if (this._visibleView === x)
            return;

        if (this._visibleView)
            this._visibleView.hide();

        this._visibleView = x;

        if (x)
            x.show(this.viewsContainerElement);
    },

    canShowResource: function(resource)
    {
        return resource && resource.scripts.length && InspectorController.debuggerEnabled();
    },

    showScript: function(script, line)
    {
        this._showScriptOrResource(script, line, true);
    },

    showResource: function(resource, line)
    {
        this._showScriptOrResource(resource, line, true);
    },

    showView: function(view)
    {
        if (!view)
            return;
        this._showScriptOrResource((view.resource || view.script));
    },

    scriptViewForScript: function(script)
    {
        if (!script)
            return null;
        if (!script._scriptView)
            script._scriptView = new WebInspector.ScriptView(script);
        return script._scriptView;
    },

    sourceFrameForScript: function(script)
    {
        var view = this.scriptViewForScript(script);
        if (!view)
            return null;

        // Setting up the source frame requires that we be attached.
        if (!this.element.parentNode)
            this.attach();

        view.setupSourceFrameIfNeeded();
        return view.sourceFrame;
    },

    _sourceViewForScriptOrResource: function(scriptOrResource)
    {
        if (scriptOrResource instanceof WebInspector.Resource)
            return WebInspector.panels.resources.resourceViewForResource(scriptOrResource);
        if (scriptOrResource instanceof WebInspector.Script)
            return this.scriptViewForScript(scriptOrResource);
    },

    _sourceFrameForScriptOrResource: function(scriptOrResource)
    {
        if (scriptOrResource instanceof WebInspector.Resource)
            return WebInspector.panels.resources.sourceFrameForResource(scriptOrResource);
        if (scriptOrResource instanceof WebInspector.Script)
            return this.sourceFrameForScript(scriptOrResource);
    },

    _showScriptOrResource: function(scriptOrResource, line, shouldHighlightLine, fromBackForwardAction)
    {
        if (!scriptOrResource)
            return;

        var view;
        if (scriptOrResource instanceof WebInspector.Resource) {
            view = WebInspector.panels.resources.resourceViewForResource(scriptOrResource);
            view.headersVisible = false;

            if (scriptOrResource.url in this._breakpointsURLMap) {
                var sourceFrame = this._sourceFrameForScriptOrResource(scriptOrResource);
                if (sourceFrame && !sourceFrame.breakpoints.length) {
                    var breakpoints = this._breakpointsURLMap[scriptOrResource.url];
                    var breakpointsLength = breakpoints.length;
                    for (var i = 0; i < breakpointsLength; ++i)
                        sourceFrame.addBreakpoint(breakpoints[i]);
                }
            }
        } else if (scriptOrResource instanceof WebInspector.Script)
            view = this.scriptViewForScript(scriptOrResource);

        if (!view)
            return;

        if (!fromBackForwardAction) {
            var oldIndex = this._currentBackForwardIndex;
            if (oldIndex >= 0)
                this._backForwardList.splice(oldIndex + 1, this._backForwardList.length - oldIndex);

            // Check for a previous entry of the same object in _backForwardList.
            // If one is found, remove it and update _currentBackForwardIndex to match.
            var previousEntryIndex = this._backForwardList.indexOf(scriptOrResource);
            if (previousEntryIndex !== -1) {
                this._backForwardList.splice(previousEntryIndex, 1);
                --this._currentBackForwardIndex;
            }

            this._backForwardList.push(scriptOrResource);
            ++this._currentBackForwardIndex;

            this._updateBackAndForwardButtons();
        }

        this.visibleView = view;

        if (line) {
            if (view.revealLine)
                view.revealLine(line);
            if (view.highlightLine && shouldHighlightLine)
                view.highlightLine(line);
        }

        var option;
        if (scriptOrResource instanceof WebInspector.Script) {
            option = scriptOrResource.filesSelectOption;
            console.assert(option);
        } else {
            var url = scriptOrResource.url;
            var script = this._scriptsForURLsInFilesSelect[url];
            if (script)
               option = script.filesSelectOption;
        }

        if (option)
            this.filesSelectElement.selectedIndex = option.index;
    },

    _addScriptToFilesMenu: function(script)
    {
        if (script.resource && this._scriptsForURLsInFilesSelect[script.sourceURL])
            return;

        this._scriptsForURLsInFilesSelect[script.sourceURL] = script;

        var select = this.filesSelectElement;

        // FIXME: Append in some meaningful order.
        var option = document.createElement("option");
        option.representedObject = (script.resource || script);
        option.text = (script.sourceURL ? WebInspector.displayNameForURL(script.sourceURL) : WebInspector.UIString("(program)"));
        select.appendChild(option);

        script.filesSelectOption = option;

        // Call _showScriptOrResource if the option we just appended ended up being selected.
        // This will happen for the first item added to the menu.
        if (select.options[select.selectedIndex] === option)
            this._showScriptOrResource(option.representedObject);
    },

    _clearCurrentExecutionLine: function()
    {
        if (this._executionSourceFrame)
            this._executionSourceFrame.executionLine = 0;
        delete this._executionSourceFrame;
    },

    _callFrameSelected: function()
    {
        this._clearCurrentExecutionLine();

        var callStackPane = this.sidebarPanes.callstack;
        var currentFrame = callStackPane.selectedCallFrame;
        if (!currentFrame)
            return;

        this.sidebarPanes.scopechain.update(currentFrame);

        var scriptOrResource = this._sourceIDMap[currentFrame.sourceID];
        this._showScriptOrResource(scriptOrResource, currentFrame.line);

        this._executionSourceFrame = this._sourceFrameForScriptOrResource(scriptOrResource);
        if (this._executionSourceFrame)
            this._executionSourceFrame.executionLine = currentFrame.line;
    },

    _changeVisibleFile: function(event)
    {
        var select = this.filesSelectElement;
        this._showScriptOrResource(select.options[select.selectedIndex].representedObject);
    },

    _startSidebarResizeDrag: function(event)
    {
        WebInspector.elementDragStart(this.sidebarElement, this._sidebarResizeDrag.bind(this), this._endSidebarResizeDrag.bind(this), event, "col-resize");

        if (event.target === this.sidebarResizeWidgetElement)
            this._dragOffset = (event.target.offsetWidth - (event.pageX - event.target.totalOffsetLeft));
        else
            this._dragOffset = 0;
    },

    _endSidebarResizeDrag: function(event)
    {
        WebInspector.elementDragEnd(event);

        delete this._dragOffset;
    },

    _sidebarResizeDrag: function(event)
    {
        var x = event.pageX + this._dragOffset;
        var newWidth = Number.constrain(window.innerWidth - x, Preferences.minScriptsSidebarWidth, window.innerWidth * 0.66);

        this.sidebarElement.style.width = newWidth + "px";
        this.sidebarButtonsElement.style.width = newWidth + "px";
        this.viewsContainerElement.style.right = newWidth + "px";
        this.sidebarResizeWidgetElement.style.right = newWidth + "px";
        this.sidebarResizeElement.style.right = (newWidth - 3) + "px";

        event.preventDefault();
    },

    _updatePauseOnExceptionsButton: function()
    {
        if (InspectorController.pauseOnExceptions()) {
            this.pauseOnExceptionButton.title = WebInspector.UIString("Don't pause on exceptions.");
            this.pauseOnExceptionButton.addStyleClass("toggled-on");
        } else {
            this.pauseOnExceptionButton.title = WebInspector.UIString("Pause on exceptions.");
            this.pauseOnExceptionButton.removeStyleClass("toggled-on");
        }
    },

    _updateDebuggerButtons: function()
    {
        if (InspectorController.debuggerEnabled()) {
            this.enableToggleButton.title = WebInspector.UIString("Debugging enabled. Click to disable.");
            this.enableToggleButton.addStyleClass("toggled-on");
            this.pauseOnExceptionButton.removeStyleClass("hidden");
            this.panelEnablerView.visible = false;
        } else {
            this.enableToggleButton.title = WebInspector.UIString("Debugging disabled. Click to enable.");
            this.enableToggleButton.removeStyleClass("toggled-on");
            this.pauseOnExceptionButton.addStyleClass("hidden");
            this.panelEnablerView.visible = true;
        }

        this._updatePauseOnExceptionsButton();

        if (this._paused) {
            this.pauseButton.addStyleClass("paused");

            this.pauseButton.disabled = false;
            this.stepOverButton.disabled = false;
            this.stepIntoButton.disabled = false;
            this.stepOutButton.disabled = false;

            this.debuggerStatusElement.textContent = WebInspector.UIString("Paused");
        } else {
            this.pauseButton.removeStyleClass("paused");

            this.pauseButton.disabled = this._waitingToPause;
            this.stepOverButton.disabled = true;
            this.stepIntoButton.disabled = true;
            this.stepOutButton.disabled = true;

            if (this._waitingToPause)
                this.debuggerStatusElement.textContent = WebInspector.UIString("Pausing");
            else if (this._stepping)
                this.debuggerStatusElement.textContent = WebInspector.UIString("Stepping");
            else
                this.debuggerStatusElement.textContent = "";
        }
    },

    _updateBackAndForwardButtons: function()
    {
        this.backButton.disabled = this._currentBackForwardIndex <= 0;
        this.forwardButton.disabled = this._currentBackForwardIndex >= (this._backForwardList.length - 1);
    },

    _clearInterface: function()
    {
        this.sidebarPanes.callstack.update(null);
        this.sidebarPanes.scopechain.update(null);

        this._clearCurrentExecutionLine();
        this._updateDebuggerButtons();
    },

    _goBack: function()
    {
        if (this._currentBackForwardIndex <= 0) {
            console.error("Can't go back from index " + this._currentBackForwardIndex);
            return;
        }

        this._showScriptOrResource(this._backForwardList[--this._currentBackForwardIndex], null, false, true);
        this._updateBackAndForwardButtons();
    },

    _goForward: function()
    {
        if (this._currentBackForwardIndex >= this._backForwardList.length - 1) {
            console.error("Can't go forward from index " + this._currentBackForwardIndex);
            return;
        }

        this._showScriptOrResource(this._backForwardList[++this._currentBackForwardIndex], null, false, true);
        this._updateBackAndForwardButtons();
    },

    _enableDebugging: function()
    {
        if (InspectorController.debuggerEnabled())
            return;
        this._toggleDebugging();
    },

    _toggleDebugging: function()
    {
        this._paused = false;
        this._waitingToPause = false;
        this._stepping = false;

        if (InspectorController.debuggerEnabled())
            InspectorController.disableDebugger();
        else
            InspectorController.enableDebugger();
    },

    _togglePauseOnExceptions: function()
    {
        InspectorController.setPauseOnExceptions(!InspectorController.pauseOnExceptions());
        this._updatePauseOnExceptionsButton();
    },

    _togglePause: function()
    {
        if (this._paused) {
            this._paused = false;
            this._waitingToPause = false;
            InspectorController.resumeDebugger();
        } else {
            this._stepping = false;
            this._waitingToPause = true;
            InspectorController.pauseInDebugger();
        }

        this._clearInterface();
    },

    _stepOverClicked: function()
    {
        this._paused = false;
        this._stepping = true;

        this._clearInterface();

        InspectorController.stepOverStatementInDebugger();
    },

    _stepIntoClicked: function()
    {
        this._paused = false;
        this._stepping = true;

        this._clearInterface();

        InspectorController.stepIntoStatementInDebugger();
    },

    _stepOutClicked: function()
    {
        this._paused = false;
        this._stepping = true;

        this._clearInterface();

        InspectorController.stepOutOfFunctionInDebugger();
    }
}

WebInspector.ScriptsPanel.prototype.__proto__ = WebInspector.Panel.prototype;
/* DatabasesPanel.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DatabasesPanel = function(database)
{
    WebInspector.Panel.call(this);

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "databases-sidebar";
    this.sidebarElement.className = "sidebar";
    this.element.appendChild(this.sidebarElement);

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this._startSidebarDragging.bind(this), false);
    this.element.appendChild(this.sidebarResizeElement);

    this.sidebarTreeElement = document.createElement("ol");
    this.sidebarTreeElement.className = "sidebar-tree";
    this.sidebarElement.appendChild(this.sidebarTreeElement);

    this.sidebarTree = new TreeOutline(this.sidebarTreeElement);

    this.databaseViews = document.createElement("div");
    this.databaseViews.id = "database-views";
    this.element.appendChild(this.databaseViews);

    this.reset();
}

WebInspector.DatabasesPanel.prototype = {
    toolbarItemClass: "databases",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Databases");
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);
        this._updateSidebarWidth();
    },

    reset: function()
    {
        if (this._databases) {
            var databasesLength = this._databases.length;
            for (var i = 0; i < databasesLength; ++i) {
                var database = this._databases[i];

                delete database._tableViews;
                delete database._queryView;
            }
        }

        this._databases = [];

        this.sidebarTree.removeChildren();
        this.databaseViews.removeChildren();
    },

    handleKeyEvent: function(event)
    {
        this.sidebarTree.handleKeyEvent(event);
    },

    addDatabase: function(database)
    {
        this._databases.push(database);

        var databaseTreeElement = new WebInspector.DatabaseSidebarTreeElement(database);
        database._databasesTreeElement = databaseTreeElement;

        this.sidebarTree.appendChild(databaseTreeElement);
    },

    showDatabase: function(database, tableName)
    {
        if (!database)
            return;

        if (this.visibleDatabaseView)
            this.visibleDatabaseView.hide();

        var view;
        if (tableName) {
            if (!("_tableViews" in database))
                database._tableViews = {};
            view = database._tableViews[tableName];
            if (!view) {
                view = new WebInspector.DatabaseTableView(database, tableName);
                database._tableViews[tableName] = view;
            }
        } else {
            view = database._queryView;
            if (!view) {
                view = new WebInspector.DatabaseQueryView(database);
                database._queryView = view;
            }
        }

        view.show(this.databaseViews);

        this.visibleDatabaseView = view;
    },

    closeVisibleView: function()
    {
        if (this.visibleDatabaseView)
            this.visibleDatabaseView.hide();
        delete this.visibleDatabaseView;
    },

    updateDatabaseTables: function(database)
    {
        if (!database || !database._databasesTreeElement)
            return;

        database._databasesTreeElement.shouldRefreshChildren = true;

        if (!("_tableViews" in database))
            return;

        var tableNamesHash = {};
        var tableNames = database.tableNames;
        var tableNamesLength = tableNames.length;
        for (var i = 0; i < tableNamesLength; ++i)
            tableNamesHash[tableNames[i]] = true;

        for (var tableName in database._tableViews) {
            if (!(tableName in tableNamesHash)) {
                if (this.visibleDatabaseView === database._tableViews[tableName])
                    this.closeVisibleView();
                delete database._tableViews[tableName];
            }
        }
    },

    dataGridForResult: function(result)
    {
        if (!result.rows.length)
            return null;

        var columns = {};

        var rows = result.rows;
        for (var columnIdentifier in rows.item(0)) {
            var column = {};
            column.width = columnIdentifier.length;
            column.title = columnIdentifier;

            columns[columnIdentifier] = column;
        }

        var nodes = [];
        var length = rows.length;
        for (var i = 0; i < length; ++i) {
            var data = {};

            var row = rows.item(i);
            for (var columnIdentifier in row) {
                // FIXME: (Bug 19439) We should specially format SQL NULL here
                // (which is represented by JavaScript null here, and turned
                // into the string "null" by the String() function).
                var text = String(row[columnIdentifier]);
                data[columnIdentifier] = text;
                if (text.length > columns[columnIdentifier].width)
                    columns[columnIdentifier].width = text.length;
            }

            var node = new WebInspector.DataGridNode(data, false);
            node.selectable = false;
            nodes.push(node);
        }

        var totalColumnWidths = 0;
        for (var columnIdentifier in columns)
            totalColumnWidths += columns[columnIdentifier].width;

        // Calculate the percentage width for the columns.
        const minimumPrecent = 5;
        var recoupPercent = 0;
        for (var columnIdentifier in columns) {
            var width = columns[columnIdentifier].width;
            width = Math.round((width / totalColumnWidths) * 100);
            if (width < minimumPrecent) {
                recoupPercent += (minimumPrecent - width);
                width = minimumPrecent;
            }

            columns[columnIdentifier].width = width;
        }

        // Enforce the minimum percentage width.
        while (recoupPercent > 0) {
            for (var columnIdentifier in columns) {
                if (columns[columnIdentifier].width > minimumPrecent) {
                    --columns[columnIdentifier].width;
                    --recoupPercent;
                    if (!recoupPercent)
                        break;
                }
            }
        }

        // Change the width property to a string suitable for a style width.
        for (var columnIdentifier in columns)
            columns[columnIdentifier].width += "%";

        var dataGrid = new WebInspector.DataGrid(columns);
        var length = nodes.length;
        for (var i = 0; i < length; ++i)
            dataGrid.appendChild(nodes[i]);

        return dataGrid;
    },

    _startSidebarDragging: function(event)
    {
        WebInspector.elementDragStart(this.sidebarResizeElement, this._sidebarDragging.bind(this), this._endSidebarDragging.bind(this), event, "col-resize");
    },

    _sidebarDragging: function(event)
    {
        this._updateSidebarWidth(event.pageX);

        event.preventDefault();
    },

    _endSidebarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);
    },

    _updateSidebarWidth: function(width)
    {
        if (this.sidebarElement.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        if (!("_currentSidebarWidth" in this))
            this._currentSidebarWidth = this.sidebarElement.offsetWidth;

        if (typeof width === "undefined")
            width = this._currentSidebarWidth;

        width = Number.constrain(width, Preferences.minSidebarWidth, window.innerWidth / 2);

        this._currentSidebarWidth = width;

        this.sidebarElement.style.width = width + "px";
        this.databaseViews.style.left = width + "px";
        this.sidebarResizeElement.style.left = (width - 3) + "px";
    }
}

WebInspector.DatabasesPanel.prototype.__proto__ = WebInspector.Panel.prototype;

WebInspector.DatabaseSidebarTreeElement = function(database)
{
    this.database = database;

    WebInspector.SidebarTreeElement.call(this, "database-sidebar-tree-item", "", "", database, true);

    this.refreshTitles();
}

WebInspector.DatabaseSidebarTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.databases.showDatabase(this.database);
    },

    oncollapse: function()
    {
        // Request a refresh after every collapse so the next
        // expand will have an updated table list.
        this.shouldRefreshChildren = true;
    },

    onpopulate: function()
    {
        this.removeChildren();

        var tableNames = this.database.tableNames;
        var tableNamesLength = tableNames.length;
        for (var i = 0; i < tableNamesLength; ++i)
            this.appendChild(new WebInspector.SidebarDatabaseTableTreeElement(this.database, tableNames[i]));
    },

    get mainTitle()
    {
        return this.database.name;
    },

    set mainTitle(x)
    {
        // Do nothing.
    },

    get subtitle()
    {
        return this.database.displayDomain;
    },

    set subtitle(x)
    {
        // Do nothing.
    }
}

WebInspector.DatabaseSidebarTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;

WebInspector.SidebarDatabaseTableTreeElement = function(database, tableName)
{
    this.database = database;
    this.tableName = tableName;

    WebInspector.SidebarTreeElement.call(this, "database-table-sidebar-tree-item small", tableName, "", null, false);
}

WebInspector.SidebarDatabaseTableTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.databases.showDatabase(this.database, this.tableName);
    }
}

WebInspector.SidebarDatabaseTableTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;
/* ProfilesPanel.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const UserInitiatedProfileName = "org.webkit.profiles.user-initiated";

WebInspector.ProfilesPanel = function()
{
    WebInspector.Panel.call(this);

    this.element.addStyleClass("profiles");

    var panelEnablerHeading = WebInspector.UIString("You need to enable profiling before you can use the Profiles panel.");
    var panelEnablerDisclaimer = WebInspector.UIString("Enabling profiling will make scripts run slower.");
    var panelEnablerButton = WebInspector.UIString("Enable Profiling");
    this.panelEnablerView = new WebInspector.PanelEnablerView("profiles", panelEnablerHeading, panelEnablerDisclaimer, panelEnablerButton);
    this.panelEnablerView.addEventListener("enable clicked", this._enableProfiling, this);

    this.element.appendChild(this.panelEnablerView.element);

    this.sidebarElement = document.createElement("div");
    this.sidebarElement.id = "profiles-sidebar";
    this.sidebarElement.className = "sidebar";
    this.element.appendChild(this.sidebarElement);

    this.sidebarResizeElement = document.createElement("div");
    this.sidebarResizeElement.className = "sidebar-resizer-vertical";
    this.sidebarResizeElement.addEventListener("mousedown", this._startSidebarDragging.bind(this), false);
    this.element.appendChild(this.sidebarResizeElement);

    this.sidebarTreeElement = document.createElement("ol");
    this.sidebarTreeElement.className = "sidebar-tree";
    this.sidebarElement.appendChild(this.sidebarTreeElement);

    this.sidebarTree = new TreeOutline(this.sidebarTreeElement);

    this.profileViews = document.createElement("div");
    this.profileViews.id = "profile-views";
    this.element.appendChild(this.profileViews);

    this.enableToggleButton = document.createElement("button");
    this.enableToggleButton.className = "enable-toggle-status-bar-item status-bar-item";
    this.enableToggleButton.addEventListener("click", this._toggleProfiling.bind(this), false);

    this.recordButton = document.createElement("button");
    this.recordButton.title = WebInspector.UIString("Start profiling.");
    this.recordButton.id = "record-profile-status-bar-item";
    this.recordButton.className = "status-bar-item";
    this.recordButton.addEventListener("click", this._recordClicked.bind(this), false);

    this.recording = false;

    this.profileViewStatusBarItemsContainer = document.createElement("div");
    this.profileViewStatusBarItemsContainer.id = "profile-view-status-bar-items";

    this.reset();
}

WebInspector.ProfilesPanel.prototype = {
    toolbarItemClass: "profiles",

    get toolbarItemLabel()
    {
        return WebInspector.UIString("Profiles");
    },

    get statusBarItems()
    {
        return [this.enableToggleButton, this.recordButton, this.profileViewStatusBarItemsContainer];
    },

    show: function()
    {
        WebInspector.Panel.prototype.show.call(this);
        this._updateSidebarWidth();
        if (this._shouldPopulateProfiles)
            this._populateProfiles();
    },

    populateInterface: function()
    {
        if (this.visible)
            this._populateProfiles();
        else
            this._shouldPopulateProfiles = true;
    },

    profilerWasEnabled: function()
    {
        this.reset();
        this.populateInterface();
    },

    profilerWasDisabled: function()
    {
        this.reset();
    },

    reset: function()
    {
        if (this._profiles) {
            var profiledLength = this._profiles.length;
            for (var i = 0; i < profiledLength; ++i) {
                var profile = this._profiles[i];
                delete profile._profileView;
            }
        }

        delete this.currentQuery;
        this.searchCanceled();

        this._profiles = [];
        this._profilesIdMap = {};
        this._profileGroups = {};
        this._profileGroupsForLinks = {}

        this.sidebarTreeElement.removeStyleClass("some-expandable");

        this.sidebarTree.removeChildren();
        this.profileViews.removeChildren();

        this.profileViewStatusBarItemsContainer.removeChildren();

        this._updateInterface();
    },

    handleKeyEvent: function(event)
    {
        this.sidebarTree.handleKeyEvent(event);
    },

    addProfile: function(profile)
    {
        this._profiles.push(profile);
        this._profilesIdMap[profile.uid] = profile;

        var sidebarParent = this.sidebarTree;
        var small = false;
        var alternateTitle;

        if (profile.title.indexOf(UserInitiatedProfileName) !== 0) {
            if (!(profile.title in this._profileGroups))
                this._profileGroups[profile.title] = [];

            var group = this._profileGroups[profile.title];
            group.push(profile);

            if (group.length === 2) {
                // Make a group TreeElement now that there are 2 profiles.
                group._profilesTreeElement = new WebInspector.ProfileGroupSidebarTreeElement(profile.title);

                // Insert at the same index for the first profile of the group.
                var index = this.sidebarTree.children.indexOf(group[0]._profilesTreeElement);
                this.sidebarTree.insertChild(group._profilesTreeElement, index);

                // Move the first profile to the group.
                var selected = group[0]._profilesTreeElement.selected;
                this.sidebarTree.removeChild(group[0]._profilesTreeElement);
                group._profilesTreeElement.appendChild(group[0]._profilesTreeElement);
                if (selected) {
                    group[0]._profilesTreeElement.select();
                    group[0]._profilesTreeElement.reveal();
                }

                group[0]._profilesTreeElement.small = true;
                group[0]._profilesTreeElement.mainTitle = WebInspector.UIString("Run %d", 1);

                this.sidebarTreeElement.addStyleClass("some-expandable");
            }

            if (group.length >= 2) {
                sidebarParent = group._profilesTreeElement;
                alternateTitle = WebInspector.UIString("Run %d", group.length);
                small = true;
            }
        }

        var profileTreeElement = new WebInspector.ProfileSidebarTreeElement(profile);
        profileTreeElement.small = small;
        if (alternateTitle)
            profileTreeElement.mainTitle = alternateTitle;
        profile._profilesTreeElement = profileTreeElement;

        sidebarParent.appendChild(profileTreeElement);
    },

    showProfile: function(profile)
    {
        if (!profile)
            return;

        if (this.visibleView)
            this.visibleView.hide();

        var view = this.profileViewForProfile(profile);

        view.show(this.profileViews);

        profile._profilesTreeElement.select(true);
        profile._profilesTreeElement.reveal()

        this.visibleView = view;

        this.profileViewStatusBarItemsContainer.removeChildren();

        var statusBarItems = view.statusBarItems;
        for (var i = 0; i < statusBarItems.length; ++i)
            this.profileViewStatusBarItemsContainer.appendChild(statusBarItems[i]);
    },

    showView: function(view)
    {
        // Always use the treeProfile, since the heavy profile might be showing.
        this.showProfile(view.profile.treeProfile);
    },

    profileViewForProfile: function(profile)
    {
        if (!profile)
            return null;
        if (!profile._profileView)
            profile._profileView = new WebInspector.ProfileView(profile);
        return profile._profileView;
    },

    showProfileById: function(uid)
    {
        this.showProfile(this._profilesIdMap[uid]);
    },

    closeVisibleView: function()
    {
        if (this.visibleView)
            this.visibleView.hide();
        delete this.visibleView;
    },

    displayTitleForProfileLink: function(title)
    {
        title = unescape(title);
        if (title.indexOf(UserInitiatedProfileName) === 0) {
            title = WebInspector.UIString("Profile %d", title.substring(UserInitiatedProfileName.length + 1));
        } else {
            if (!(title in this._profileGroupsForLinks))
                this._profileGroupsForLinks[title] = 0;

            groupNumber = ++this._profileGroupsForLinks[title];

            if (groupNumber >= 2)
                title += " " + WebInspector.UIString("Run %d", groupNumber);
        }
        
        return title;
    },

    get searchableViews()
    {
        var views = [];

        const visibleView = this.visibleView;
        if (visibleView && visibleView.performSearch)
            views.push(visibleView);

        var profilesLength = this._profiles.length;
        for (var i = 0; i < profilesLength; ++i) {
            var view = this.profileViewForProfile(this._profiles[i]);
            if (!view.performSearch || view === visibleView)
                continue;
            views.push(view);
        }

        return views;
    },

    searchMatchFound: function(view, matches)
    {
        // Always use the treeProfile, since the heavy profile might be showing.
        view.profile.treeProfile._profilesTreeElement.searchMatches = matches;
    },

    searchCanceled: function(startingNewSearch)
    {
        WebInspector.Panel.prototype.searchCanceled.call(this, startingNewSearch);

        if (!this._profiles)
            return;

        for (var i = 0; i < this._profiles.length; ++i) {
            var profile = this._profiles[i];
            profile._profilesTreeElement.searchMatches = 0;
        }
    },

    setRecordingProfile: function(isProfiling)
    {
        this.recording = isProfiling;

        if (isProfiling) {
            this.recordButton.addStyleClass("toggled-on");
            this.recordButton.title = WebInspector.UIString("Stop profiling.");
        } else {
            this.recordButton.removeStyleClass("toggled-on");
            this.recordButton.title = WebInspector.UIString("Start profiling.");
        }
    },

    _updateInterface: function()
    {
        if (InspectorController.profilerEnabled()) {
            this.enableToggleButton.title = WebInspector.UIString("Profiling enabled. Click to disable.");
            this.enableToggleButton.addStyleClass("toggled-on");
            this.recordButton.removeStyleClass("hidden");
            this.profileViewStatusBarItemsContainer.removeStyleClass("hidden");
            this.panelEnablerView.visible = false;
        } else {
            this.enableToggleButton.title = WebInspector.UIString("Profiling disabled. Click to enable.");
            this.enableToggleButton.removeStyleClass("toggled-on");
            this.recordButton.addStyleClass("hidden");
            this.profileViewStatusBarItemsContainer.addStyleClass("hidden");
            this.panelEnablerView.visible = true;
        }
    },

    _recordClicked: function()
    {
        this.recording = !this.recording;

        if (this.recording)
            InspectorController.startProfiling();
        else
            InspectorController.stopProfiling();
    },

    _enableProfiling: function()
    {
        if (InspectorController.profilerEnabled())
            return;
        this._toggleProfiling();
    },

    _toggleProfiling: function()
    {
        if (InspectorController.profilerEnabled())
            InspectorController.disableProfiler();
        else
            InspectorController.enableProfiler();
    },

    _populateProfiles: function()
    {
        if (this.sidebarTree.children.length)
            return;

        var profiles = InspectorController.profiles();
        var profilesLength = profiles.length;
        for (var i = 0; i < profilesLength; ++i) {
            var profile = profiles[i];
            this.addProfile(profile);
        }

        if (this.sidebarTree.children[0])
            this.sidebarTree.children[0].select();

        delete this._shouldPopulateProfiles;
    },

    _startSidebarDragging: function(event)
    {
        WebInspector.elementDragStart(this.sidebarResizeElement, this._sidebarDragging.bind(this), this._endSidebarDragging.bind(this), event, "col-resize");
    },

    _sidebarDragging: function(event)
    {
        this._updateSidebarWidth(event.pageX);

        event.preventDefault();
    },

    _endSidebarDragging: function(event)
    {
        WebInspector.elementDragEnd(event);
    },

    _updateSidebarWidth: function(width)
    {
        if (this.sidebarElement.offsetWidth <= 0) {
            // The stylesheet hasn't loaded yet or the window is closed,
            // so we can't calculate what is need. Return early.
            return;
        }

        if (!("_currentSidebarWidth" in this))
            this._currentSidebarWidth = this.sidebarElement.offsetWidth;

        if (typeof width === "undefined")
            width = this._currentSidebarWidth;

        width = Number.constrain(width, Preferences.minSidebarWidth, window.innerWidth / 2);

        this._currentSidebarWidth = width;

        this.sidebarElement.style.width = width + "px";
        this.profileViews.style.left = width + "px";
        this.profileViewStatusBarItemsContainer.style.left = width + "px";
        this.sidebarResizeElement.style.left = (width - 3) + "px";
    }
}

WebInspector.ProfilesPanel.prototype.__proto__ = WebInspector.Panel.prototype;

WebInspector.ProfileSidebarTreeElement = function(profile)
{
    this.profile = profile;

    if (this.profile.title.indexOf(UserInitiatedProfileName) === 0)
        this._profileNumber = this.profile.title.substring(UserInitiatedProfileName.length + 1);

    WebInspector.SidebarTreeElement.call(this, "profile-sidebar-tree-item", "", "", profile, false);

    this.refreshTitles();
}

WebInspector.ProfileSidebarTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.profiles.showProfile(this.profile);
    },

    get mainTitle()
    {
        if (this._mainTitle)
            return this._mainTitle;
        if (this.profile.title.indexOf(UserInitiatedProfileName) === 0)
            return WebInspector.UIString("Profile %d", this._profileNumber);
        return this.profile.title;
    },

    set mainTitle(x)
    {
        this._mainTitle = x;
        this.refreshTitles();
    },

    get subtitle()
    {
        // There is no subtitle.
    },

    set subtitle(x)
    {
        // Can't change subtitle.
    },

    set searchMatches(matches)
    {
        if (!matches) {
            if (!this.bubbleElement)
                return;
            this.bubbleElement.removeStyleClass("search-matches");
            this.bubbleText = "";
            return;
        }

        this.bubbleText = matches;
        this.bubbleElement.addStyleClass("search-matches");
    }
}

WebInspector.ProfileSidebarTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;

WebInspector.ProfileGroupSidebarTreeElement = function(title, subtitle)
{
    WebInspector.SidebarTreeElement.call(this, "profile-group-sidebar-tree-item", title, subtitle, null, true);
}

WebInspector.ProfileGroupSidebarTreeElement.prototype = {
    onselect: function()
    {
        WebInspector.panels.profiles.showProfile(this.children[this.children.length - 1].profile);
    }
}

WebInspector.ProfileGroupSidebarTreeElement.prototype.__proto__ = WebInspector.SidebarTreeElement.prototype;
/* ResourceView.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ResourceView = function(resource)
{
    WebInspector.View.call(this);

    this.element.addStyleClass("resource-view");

    this.resource = resource;

    this.headersElement = document.createElement("div");
    this.headersElement.className = "resource-view-headers";
    this.element.appendChild(this.headersElement);

    this.contentElement = document.createElement("div");
    this.contentElement.className = "resource-view-content";
    this.element.appendChild(this.contentElement);

    this.headersListElement = document.createElement("ol");
    this.headersListElement.className = "outline-disclosure";
    this.headersElement.appendChild(this.headersListElement);

    this.headersTreeOutline = new TreeOutline(this.headersListElement);
    this.headersTreeOutline.expandTreeElementsWhenArrowing = true;

    this.urlTreeElement = new TreeElement("", null, false);
    this.urlTreeElement.selectable = false;
    this.headersTreeOutline.appendChild(this.urlTreeElement);

    this.requestHeadersTreeElement = new TreeElement("", null, true);
    this.requestHeadersTreeElement.expanded = false;
    this.requestHeadersTreeElement.selectable = false;
    this.headersTreeOutline.appendChild(this.requestHeadersTreeElement);

    this.responseHeadersTreeElement = new TreeElement("", null, true);
    this.responseHeadersTreeElement.expanded = false;
    this.responseHeadersTreeElement.selectable = false;
    this.headersTreeOutline.appendChild(this.responseHeadersTreeElement);

    this.headersVisible = true;

    resource.addEventListener("url changed", this._refreshURL, this);
    resource.addEventListener("requestHeaders changed", this._refreshRequestHeaders, this);
    resource.addEventListener("responseHeaders changed", this._refreshResponseHeaders, this);

    this._refreshURL();
    this._refreshRequestHeaders();
    this._refreshResponseHeaders();
}

WebInspector.ResourceView.prototype = {
    get headersVisible()
    {
        return this._headersVisible;
    },

    set headersVisible(x)
    {
        if (x === this._headersVisible)
            return;

        this._headersVisible = x;

        if (x)
            this.element.addStyleClass("headers-visible");
        else
            this.element.removeStyleClass("headers-visible");
    },

    attach: function()
    {
        if (!this.element.parentNode) {
            var parentElement = (document.getElementById("resource-views") || document.getElementById("script-resource-views"));
            if (parentElement)
                parentElement.appendChild(this.element);
        }
    },

    _refreshURL: function()
    {
        this.urlTreeElement.title = this.resource.url.escapeHTML();
    },

    _refreshRequestHeaders: function()
    {
        this._refreshHeaders(WebInspector.UIString("Request Headers"), this.resource.sortedRequestHeaders, this.requestHeadersTreeElement);
    },

    _refreshResponseHeaders: function()
    {
        this._refreshHeaders(WebInspector.UIString("Response Headers"), this.resource.sortedResponseHeaders, this.responseHeadersTreeElement);
    },

    _refreshHeaders: function(title, headers, headersTreeElement)
    {
        headersTreeElement.removeChildren();

        var length = headers.length;
        headersTreeElement.title = title.escapeHTML() + "<span class=\"header-count\">" + WebInspector.UIString(" (%d)", length) + "</span>";
        headersTreeElement.hidden = !length;

        var length = headers.length;
        for (var i = 0; i < length; ++i) {
            var title = "<div class=\"header-name\">" + headers[i].header.escapeHTML() + ":</div>";
            title += "<div class=\"header-value\">" + headers[i].value.escapeHTML() + "</div>"

            var headerTreeElement = new TreeElement(title, null, false);
            headerTreeElement.selectable = false;
            headersTreeElement.appendChild(headerTreeElement);
        }
    }
}

WebInspector.ResourceView.prototype.__proto__ = WebInspector.View.prototype;
/* SourceFrame.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.SourceFrame = function(element, addBreakpointDelegate)
{
    this.messages = [];
    this.breakpoints = [];

    this.addBreakpointDelegate = addBreakpointDelegate;

    this.element = element || document.createElement("iframe");
    this.element.addStyleClass("source-view-frame");
    this.element.setAttribute("viewsource", "true");

    this.element.addEventListener("load", this._loaded.bind(this), false);
}

WebInspector.SourceFrame.prototype = {
    get executionLine()
    {
        return this._executionLine;
    },

    set executionLine(x)
    {
        if (this._executionLine === x)
            return;

        var previousLine = this._executionLine;
        this._executionLine = x;

        this._updateExecutionLine(previousLine);
    },

    get autoSizesToFitContentHeight()
    {
        return this._autoSizesToFitContentHeight;
    },

    set autoSizesToFitContentHeight(x)
    {
        if (this._autoSizesToFitContentHeight === x)
            return;

        this._autoSizesToFitContentHeight = x;

        if (this._autoSizesToFitContentHeight) {
            this._windowResizeListener = this._windowResized.bind(this);
            window.addEventListener("resize", this._windowResizeListener, false);
            this.sizeToFitContentHeight();
        } else {
            this.element.style.removeProperty("height");
            if (this.element.contentDocument)
                this.element.contentDocument.body.removeStyleClass("webkit-height-sized-to-fit");
            window.removeEventListener("resize", this._windowResizeListener, false);
            delete this._windowResizeListener;
        }
    },

    sourceRow: function(lineNumber)
    {
        if (!lineNumber || !this.element.contentDocument)
            return;

        var table = this.element.contentDocument.getElementsByTagName("table")[0];
        if (!table)
            return;

        var rows = table.rows;

        // Line numbers are a 1-based index, but the rows collection is 0-based.
        --lineNumber;

        return rows[lineNumber];
    },

    lineNumberForSourceRow: function(sourceRow)
    {
        // Line numbers are a 1-based index, but the rows collection is 0-based.
        var lineNumber = 0;
        while (sourceRow) {
            ++lineNumber;
            sourceRow = sourceRow.previousSibling;
        }

        return lineNumber;
    },

    revealLine: function(lineNumber)
    {
        var row = this.sourceRow(lineNumber);
        if (row)
            row.scrollIntoViewIfNeeded(true);
    },

    addBreakpoint: function(breakpoint)
    {
        this.breakpoints.push(breakpoint);
        breakpoint.addEventListener("enabled", this._breakpointEnableChanged, this);
        breakpoint.addEventListener("disabled", this._breakpointEnableChanged, this);
        this._addBreakpointToSource(breakpoint);
    },

    removeBreakpoint: function(breakpoint)
    {
        this.breakpoints.remove(breakpoint);
        breakpoint.removeEventListener("enabled", null, this);
        breakpoint.removeEventListener("disabled", null, this);
        this._removeBreakpointFromSource(breakpoint);
    },

    addMessage: function(msg)
    {
        // Don't add the message if there is no message or valid line or if the msg isn't an error or warning.
        if (!msg.message || msg.line <= 0 || !msg.isErrorOrWarning())
            return;
        this.messages.push(msg);
        this._addMessageToSource(msg);
    },

    clearMessages: function()
    {
        this.messages = [];

        if (!this.element.contentDocument)
            return;

        var bubbles = this.element.contentDocument.querySelectorAll(".webkit-html-message-bubble");
        if (!bubbles)
            return;

        for (var i = 0; i < bubbles.length; ++i) {
            var bubble = bubbles[i];
            bubble.parentNode.removeChild(bubble);
        }
    },

    sizeToFitContentHeight: function()
    {
        if (this.element.contentDocument) {
            this.element.style.setProperty("height", this.element.contentDocument.body.offsetHeight + "px");
            this.element.contentDocument.body.addStyleClass("webkit-height-sized-to-fit");
        }
    },

    _highlightLineEnds: function(event)
    {
        event.target.parentNode.removeStyleClass("webkit-highlighted-line");
    },

    highlightLine: function(lineNumber)
    {
        var sourceRow = this.sourceRow(lineNumber);
        if (!sourceRow)
            return;
        var line = sourceRow.getElementsByClassName('webkit-line-content')[0];
        // Trick to reset the animation if the user clicks on the same link
        // Using a timeout to avoid coalesced style updates
        line.style.setProperty("-webkit-animation-name", "none");
        setTimeout(function () {
            line.style.removeProperty("-webkit-animation-name");
            sourceRow.addStyleClass("webkit-highlighted-line");
        }, 0);
    },

    _loaded: function()
    {
        WebInspector.addMainEventListeners(this.element.contentDocument);
        this.element.contentDocument.addEventListener("mousedown", this._documentMouseDown.bind(this), true);
        this.element.contentDocument.addEventListener("webkitAnimationEnd", this._highlightLineEnds.bind(this), false);

        var headElement = this.element.contentDocument.getElementsByTagName("head")[0];
        if (!headElement) {
            headElement = this.element.contentDocument.createElement("head");
            this.element.contentDocument.documentElement.insertBefore(headElement, this.element.contentDocument.documentElement.firstChild);
        }

        var styleElement = this.element.contentDocument.createElement("style");
        headElement.appendChild(styleElement);

        // Add these style rules here since they are specific to the Inspector. They also behave oddly and not
        // all properties apply if added to view-source.css (becuase it is a user agent sheet.)
        var styleText = ".webkit-line-number { background-repeat: no-repeat; background-position: right 1px; }\n";
        styleText += ".webkit-breakpoint .webkit-line-number { color: white; background-image: -webkit-canvas(breakpoint); }\n";
        styleText += ".webkit-breakpoint-disabled .webkit-line-number { color: white; background-image: -webkit-canvas(breakpoint-disabled); }\n";
        styleText += ".webkit-execution-line .webkit-line-number { color: transparent; background-image: -webkit-canvas(program-counter); }\n";
        styleText += ".webkit-breakpoint.webkit-execution-line .webkit-line-number { color: transparent; background-image: -webkit-canvas(breakpoint-program-counter); }\n";
        styleText += ".webkit-breakpoint-disabled.webkit-execution-line .webkit-line-number { color: transparent; background-image: -webkit-canvas(breakpoint-disabled-program-counter); }\n";
        styleText += ".webkit-execution-line .webkit-line-content { background-color: rgb(171, 191, 254); outline: 1px solid rgb(64, 115, 244); }\n";
        styleText += ".webkit-height-sized-to-fit { overflow-y: hidden }\n";
        styleText += ".webkit-line-content { background-color: white; }\n";
        styleText += "@-webkit-keyframes fadeout {from {background-color: rgb(255, 255, 120);} to { background-color: white;}}\n";
        styleText += ".webkit-highlighted-line .webkit-line-content { background-color: rgb(255, 255, 120); -webkit-animation: 'fadeout' 2s 500ms}\n";
        styleText += ".webkit-javascript-comment { color: rgb(0, 116, 0); }\n";
        styleText += ".webkit-javascript-keyword { color: rgb(170, 13, 145); }\n";
        styleText += ".webkit-javascript-number { color: rgb(28, 0, 207); }\n";
        styleText += ".webkit-javascript-string, .webkit-javascript-regexp { color: rgb(196, 26, 22); }\n";

        styleElement.textContent = styleText;

        this._needsProgramCounterImage = true;
        this._needsBreakpointImages = true;

        this.element.contentWindow.Element.prototype.addStyleClass = Element.prototype.addStyleClass;
        this.element.contentWindow.Element.prototype.removeStyleClass = Element.prototype.removeStyleClass;
        this.element.contentWindow.Element.prototype.hasStyleClass = Element.prototype.hasStyleClass;
        this.element.contentWindow.Node.prototype.enclosingNodeOrSelfWithNodeName = Node.prototype.enclosingNodeOrSelfWithNodeName;

        this._addExistingMessagesToSource();
        this._addExistingBreakpointsToSource();
        this._updateExecutionLine();

        if (this.autoSizesToFitContentHeight)
            this.sizeToFitContentHeight();
    },

    _windowResized: function(event)
    {
        if (!this._autoSizesToFitContentHeight)
            return;
        this.sizeToFitContentHeight();
    },

    _documentMouseDown: function(event)
    {
        if (!event.target.hasStyleClass("webkit-line-number"))
            return;

        var sourceRow = event.target.enclosingNodeOrSelfWithNodeName("tr");
        if (sourceRow._breakpointObject)
            sourceRow._breakpointObject.enabled = !sourceRow._breakpointObject.enabled;
        else if (this.addBreakpointDelegate)
            this.addBreakpointDelegate(this.lineNumberForSourceRow(sourceRow));
    },

    _breakpointEnableChanged: function(event)
    {
        var breakpoint = event.target;
        var sourceRow = this.sourceRow(breakpoint.line);
        if (!sourceRow)
            return;

        sourceRow.addStyleClass("webkit-breakpoint");

        if (breakpoint.enabled)
            sourceRow.removeStyleClass("webkit-breakpoint-disabled");
        else
            sourceRow.addStyleClass("webkit-breakpoint-disabled");
    },

    _updateExecutionLine: function(previousLine)
    {
        if (previousLine) {
            var sourceRow = this.sourceRow(previousLine);
            if (sourceRow)
                sourceRow.removeStyleClass("webkit-execution-line");
        }

        if (!this._executionLine)
            return;

        this._drawProgramCounterImageIfNeeded();

        var sourceRow = this.sourceRow(this._executionLine);
        if (sourceRow)
            sourceRow.addStyleClass("webkit-execution-line");
    },

    _addExistingBreakpointsToSource: function()
    {
        var length = this.breakpoints.length;
        for (var i = 0; i < length; ++i)
            this._addBreakpointToSource(this.breakpoints[i]);
    },

    _addBreakpointToSource: function(breakpoint)
    {
        var sourceRow = this.sourceRow(breakpoint.line);
        if (!sourceRow)
            return;

        this._drawBreakpointImagesIfNeeded();

        sourceRow._breakpointObject = breakpoint;

        sourceRow.addStyleClass("webkit-breakpoint");
        if (!breakpoint.enabled)
            sourceRow.addStyleClass("webkit-breakpoint-disabled");
    },

    _removeBreakpointFromSource: function(breakpoint)
    {
        var sourceRow = this.sourceRow(breakpoint.line);
        if (!sourceRow)
            return;

        delete sourceRow._breakpointObject;

        sourceRow.removeStyleClass("webkit-breakpoint");
        sourceRow.removeStyleClass("webkit-breakpoint-disabled");
    },
    
    _incrementMessageRepeatCount: function(msg, repeatDelta)
    {
        if (!msg._resourceMessageLineElement)
            return;

        if (!msg._resourceMessageRepeatCountElement) {
            var repeatedElement = document.createElement("span");
            msg._resourceMessageLineElement.appendChild(repeatedElement);
            msg._resourceMessageRepeatCountElement = repeatedElement;
        }

        msg.repeatCount += repeatDelta;
        msg._resourceMessageRepeatCountElement.textContent = WebInspector.UIString(" (repeated %d times)", msg.repeatCount);
    },

    _addExistingMessagesToSource: function()
    {
        var length = this.messages.length;
        for (var i = 0; i < length; ++i)
            this._addMessageToSource(this.messages[i]);
    },

    _addMessageToSource: function(msg)
    {
        var row = this.sourceRow(msg.line);
        if (!row)
            return;

        var cell = row.cells[1];
        if (!cell)
            return;

        var messageBubbleElement = cell.lastChild;
        if (!messageBubbleElement || messageBubbleElement.nodeType !== Node.ELEMENT_NODE || !messageBubbleElement.hasStyleClass("webkit-html-message-bubble")) {
            messageBubbleElement = this.element.contentDocument.createElement("div");
            messageBubbleElement.className = "webkit-html-message-bubble";
            cell.appendChild(messageBubbleElement);
        }

        if (!row.messages)
            row.messages = [];

        for (var i = 0; i < row.messages.length; ++i) {
            if (row.messages[i].isEqual(msg, true)) {
                this._incrementMessageRepeatCount(row.messages[i], msg.repeatDelta);
                return;
            }
        }

        row.messages.push(msg);

        var imageURL;
        switch (msg.level) {
            case WebInspector.ConsoleMessage.MessageLevel.Error:
                messageBubbleElement.addStyleClass("webkit-html-error-message");
                imageURL = "Images/errorIcon.png";
                break;
            case WebInspector.ConsoleMessage.MessageLevel.Warning:
                messageBubbleElement.addStyleClass("webkit-html-warning-message");
                imageURL = "Images/warningIcon.png";
                break;
        }

        var messageLineElement = this.element.contentDocument.createElement("div");
        messageLineElement.className = "webkit-html-message-line";
        messageBubbleElement.appendChild(messageLineElement);

        // Create the image element in the Inspector's document so we can use relative image URLs.
        var image = document.createElement("img");
        image.src = imageURL;
        image.className = "webkit-html-message-icon";

        // Adopt the image element since it wasn't created in element's contentDocument.
        image = this.element.contentDocument.adoptNode(image);
        messageLineElement.appendChild(image);
        messageLineElement.appendChild(this.element.contentDocument.createTextNode(msg.message));

        msg._resourceMessageLineElement = messageLineElement;
    },

    _drawProgramCounterInContext: function(ctx, glow)
    {
        if (glow)
            ctx.save();

        ctx.beginPath();
        ctx.moveTo(17, 2);
        ctx.lineTo(19, 2);
        ctx.lineTo(19, 0);
        ctx.lineTo(21, 0);
        ctx.lineTo(26, 5.5);
        ctx.lineTo(21, 11);
        ctx.lineTo(19, 11);
        ctx.lineTo(19, 9);
        ctx.lineTo(17, 9);
        ctx.closePath();
        ctx.fillStyle = "rgb(142, 5, 4)";

        if (glow) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgb(255, 255, 255)";
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = 0;
        }

        ctx.fill();
        ctx.fill(); // Fill twice to get a good shadow and darker anti-aliased pixels.

        if (glow)
            ctx.restore();
    },

    _drawProgramCounterImageIfNeeded: function()
    {
        if (!this._needsProgramCounterImage || !this.element.contentDocument)
            return;

        var ctx = this.element.contentDocument.getCSSCanvasContext("2d", "program-counter", 26, 11);
        ctx.clearRect(0, 0, 26, 11);
        this._drawProgramCounterInContext(ctx, true);

        delete this._needsProgramCounterImage;
    },

    _drawBreakpointImagesIfNeeded: function()
    {
        if (!this._needsBreakpointImages || !this.element.contentDocument)
            return;

        function drawBreakpoint(ctx, disabled)
        {
            ctx.beginPath();
            ctx.moveTo(0, 2);
            ctx.lineTo(2, 0);
            ctx.lineTo(21, 0);
            ctx.lineTo(26, 5.5);
            ctx.lineTo(21, 11);
            ctx.lineTo(2, 11);
            ctx.lineTo(0, 9);
            ctx.closePath();
            ctx.fillStyle = "rgb(1, 142, 217)";
            ctx.strokeStyle = "rgb(0, 103, 205)";
            ctx.lineWidth = 3;
            ctx.fill();
            ctx.save();
            ctx.clip();
            ctx.stroke();
            ctx.restore();

            if (!disabled)
                return;

            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, 26, 11);
            ctx.restore();
        }

        var ctx = this.element.contentDocument.getCSSCanvasContext("2d", "breakpoint", 26, 11);
        ctx.clearRect(0, 0, 26, 11);
        drawBreakpoint(ctx);

        var ctx = this.element.contentDocument.getCSSCanvasContext("2d", "breakpoint-program-counter", 26, 11);
        ctx.clearRect(0, 0, 26, 11);
        drawBreakpoint(ctx);
        ctx.clearRect(20, 0, 6, 11);
        this._drawProgramCounterInContext(ctx, true);

        var ctx = this.element.contentDocument.getCSSCanvasContext("2d", "breakpoint-disabled", 26, 11);
        ctx.clearRect(0, 0, 26, 11);
        drawBreakpoint(ctx, true);

        var ctx = this.element.contentDocument.getCSSCanvasContext("2d", "breakpoint-disabled-program-counter", 26, 11);
        ctx.clearRect(0, 0, 26, 11);
        drawBreakpoint(ctx, true);
        ctx.clearRect(20, 0, 6, 11);
        this._drawProgramCounterInContext(ctx, true);

        delete this._needsBreakpointImages;
    },

    syntaxHighlightJavascript: function()
    {
        var table = this.element.contentDocument.getElementsByTagName("table")[0];
        if (!table)
            return;

        function deleteContinueFlags(cell)
        {
            if (!cell)
                return;
            delete cell._commentContinues;
            delete cell._singleQuoteStringContinues;
            delete cell._doubleQuoteStringContinues;
            delete cell._regexpContinues;
        }

        function createSpan(content, className)
        {
            var span = document.createElement("span");
            span.className = className;
            span.appendChild(document.createTextNode(content));
            return span;
        }

        function generateFinder(regex, matchNumber, className)
        {
            return function(str) {
                var match = regex.exec(str);
                if (!match)
                    return null;
                previousMatchLength = match[matchNumber].length;
                return createSpan(match[matchNumber], className);
            };
        }

        var findNumber = generateFinder(/^(-?(\d+\.?\d*([eE][+-]\d+)?|0[xX]\h+|Infinity)|NaN)(?:\W|$)/, 1, "webkit-javascript-number");
        var findKeyword = generateFinder(/^(null|true|false|break|case|catch|const|default|finally|for|instanceof|new|var|continue|function|return|void|delete|if|this|do|while|else|in|switch|throw|try|typeof|with|debugger|class|enum|export|extends|import|super|get|set)(?:\W|$)/, 1, "webkit-javascript-keyword");
        var findSingleLineString = generateFinder(/^"(?:[^"\\]|\\.)*"|^'([^'\\]|\\.)*'/, 0, "webkit-javascript-string"); // " this quote keeps Xcode happy
        var findMultilineCommentStart = generateFinder(/^\/\*.*$/, 0, "webkit-javascript-comment");
        var findMultilineCommentEnd = generateFinder(/^.*?\*\//, 0, "webkit-javascript-comment");
        var findMultilineSingleQuoteStringStart = generateFinder(/^'(?:[^'\\]|\\.)*\\$/, 0, "webkit-javascript-string");
        var findMultilineSingleQuoteStringEnd = generateFinder(/^(?:[^'\\]|\\.)*?'/, 0, "webkit-javascript-string");
        var findMultilineDoubleQuoteStringStart = generateFinder(/^"(?:[^"\\]|\\.)*\\$/, 0, "webkit-javascript-string");
        var findMultilineDoubleQuoteStringEnd = generateFinder(/^(?:[^"\\]|\\.)*?"/, 0, "webkit-javascript-string");
        var findMultilineRegExpEnd = generateFinder(/^(?:[^\/\\]|\\.)*?\/([gim]{0,3})/, 0, "webkit-javascript-regexp");
        var findSingleLineComment = generateFinder(/^\/\/.*|^\/\*.*?\*\//, 0, "webkit-javascript-comment");

        function findMultilineRegExpStart(str)
        {
            var match = /^\/(?:[^\/\\]|\\.)*\\$/.exec(str);
            if (!match || !/\\|\$|\.[\?\*\+]|[^\|]\|[^\|]/.test(match[0]))
                return null;
            var node = createSpan(match[0], "webkit-javascript-regexp");
            previousMatchLength = match[0].length;
            return node;
        }

        function findSingleLineRegExp(str)
        {
            var match = /^(\/(?:[^\/\\]|\\.)*\/([gim]{0,3}))(.?)/.exec(str);
            if (!match || !(match[2].length > 0 || /\\|\$|\.[\?\*\+]|[^\|]\|[^\|]/.test(match[1]) || /\.|;|,/.test(match[3])))
                return null;
            var node = createSpan(match[1], "webkit-javascript-regexp");
            previousMatchLength = match[1].length;
            return node;
        }

        function syntaxHighlightJavascriptLine(line, prevLine)
        {
            var messageBubble = line.lastChild;
            if (messageBubble && messageBubble.nodeType === Node.ELEMENT_NODE && messageBubble.hasStyleClass("webkit-html-message-bubble"))
                line.removeChild(messageBubble);
            else
                messageBubble = null;

            var code = line.textContent;

            while (line.firstChild)
                line.removeChild(line.firstChild);

            var token;
            var tmp = 0;
            var i = 0;
            previousMatchLength = 0;

            if (prevLine) {
                if (prevLine._commentContinues) {
                    if (!(token = findMultilineCommentEnd(code))) {
                        token = createSpan(code, "webkit-javascript-comment");
                        line._commentContinues = true;
                    }
                } else if (prevLine._singleQuoteStringContinues) {
                    if (!(token = findMultilineSingleQuoteStringEnd(code))) {
                        token = createSpan(code, "webkit-javascript-string");
                        line._singleQuoteStringContinues = true;
                    }
                } else if (prevLine._doubleQuoteStringContinues) {
                    if (!(token = findMultilineDoubleQuoteStringEnd(code))) {
                        token = createSpan(code, "webkit-javascript-string");
                        line._doubleQuoteStringContinues = true;
                    }
                } else if (prevLine._regexpContinues) {
                    if (!(token = findMultilineRegExpEnd(code))) {
                        token = createSpan(code, "webkit-javascript-regexp");
                        line._regexpContinues = true;
                    }
                }
                if (token) {
                    i += previousMatchLength ? previousMatchLength : code.length;
                    tmp = i;
                    line.appendChild(token);
                }
            }

            for ( ; i < code.length; ++i) {
                var codeFragment = code.substr(i);
                var prevChar = code[i - 1];
                token = findSingleLineComment(codeFragment);
                if (!token) {
                    if ((token = findMultilineCommentStart(codeFragment)))
                        line._commentContinues = true;
                    else if (!prevChar || /^\W/.test(prevChar)) {
                        token = findNumber(codeFragment, code[i - 1]) ||
                                findKeyword(codeFragment, code[i - 1]) ||
                                findSingleLineString(codeFragment) ||
                                findSingleLineRegExp(codeFragment);
                        if (!token) {
                            if (token = findMultilineSingleQuoteStringStart(codeFragment))
                                line._singleQuoteStringContinues = true;
                            else if (token = findMultilineDoubleQuoteStringStart(codeFragment))
                                line._doubleQuoteStringContinues = true;
                            else if (token = findMultilineRegExpStart(codeFragment))
                                line._regexpContinues = true;
                        }
                    }
                }

                if (token) {
                    if (tmp !== i)
                        line.appendChild(document.createTextNode(code.substring(tmp, i)));
                    line.appendChild(token);
                    i += previousMatchLength - 1;
                    tmp = i + 1;
                }
            }

            if (tmp < code.length)
                line.appendChild(document.createTextNode(code.substring(tmp, i)));

            if (messageBubble)
                line.appendChild(messageBubble);
        }

        var i = 0;
        var rows = table.rows;
        var rowsLength = rows.length;
        var previousCell = null;
        var previousMatchLength = 0;
        var sourceFrame = this;

        // Split up the work into chunks so we don't block the
        // UI thread while processing.

        function processChunk()
        {
            for (var end = Math.min(i + 10, rowsLength); i < end; ++i) {
                var row = rows[i];
                if (!row)
                    continue;
                var cell = row.cells[1];
                if (!cell)
                    continue;
                syntaxHighlightJavascriptLine(cell, previousCell);
                if (i < (end - 1))
                    deleteContinueFlags(previousCell);
                previousCell = cell;
            }

            if (i >= rowsLength && processChunkInterval) {
                deleteContinueFlags(previousCell);
                clearInterval(processChunkInterval);

                sourceFrame.dispatchEventToListeners("syntax highlighting complete");
            }
        }

        processChunk();

        var processChunkInterval = setInterval(processChunk, 25);
    }
}

WebInspector.SourceFrame.prototype.__proto__ = WebInspector.Object.prototype;
/* SourceView.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.SourceView = function(resource)
{
    // Set the sourceFrame first since WebInspector.ResourceView will set headersVisible
    // and our override of headersVisible needs the sourceFrame.
    this.sourceFrame = new WebInspector.SourceFrame(null, this._addBreakpoint.bind(this));

    WebInspector.ResourceView.call(this, resource);

    resource.addEventListener("finished", this._resourceLoadingFinished, this);

    this.element.addStyleClass("source");

    this._frameNeedsSetup = true;

    this.contentElement.appendChild(this.sourceFrame.element);

    var gutterElement = document.createElement("div");
    gutterElement.className = "webkit-line-gutter-backdrop";
    this.element.appendChild(gutterElement);
}

WebInspector.SourceView.prototype = {
    set headersVisible(x)
    {
        if (x === this._headersVisible)
            return;

        var superSetter = WebInspector.ResourceView.prototype.__lookupSetter__("headersVisible");
        if (superSetter)
            superSetter.call(this, x);

        this.sourceFrame.autoSizesToFitContentHeight = x;
    },

    show: function(parentElement)
    {
        WebInspector.ResourceView.prototype.show.call(this, parentElement);
        this.setupSourceFrameIfNeeded();
    },

    hide: function()
    {
        WebInspector.View.prototype.hide.call(this);
        this._currentSearchResultIndex = -1;
    },

    resize: function()
    {
        if (this.sourceFrame.autoSizesToFitContentHeight)
            this.sourceFrame.sizeToFitContentHeight();
    },

    detach: function()
    {
        WebInspector.ResourceView.prototype.detach.call(this);

        // FIXME: We need to mark the frame for setup on detach because the frame DOM is cleared
        // when it is removed from the document. Is this a bug?
        this._frameNeedsSetup = true;
        this._sourceFrameSetup = false;
    },

    setupSourceFrameIfNeeded: function()
    {
        if (!this._frameNeedsSetup)
            return;

        this.attach();

        if (!InspectorController.addResourceSourceToFrame(this.resource.identifier, this.sourceFrame.element))
            return;

        delete this._frameNeedsSetup;

        if (this.resource.type === WebInspector.Resource.Type.Script) {
            this.sourceFrame.addEventListener("syntax highlighting complete", this._syntaxHighlightingComplete, this);
            this.sourceFrame.syntaxHighlightJavascript();
        } else
            this._sourceFrameSetupFinished();
    },

    _resourceLoadingFinished: function(event)
    {
        this._frameNeedsSetup = true;
        this._sourceFrameSetup = false;
        if (this.visible)
            this.setupSourceFrameIfNeeded();
        this.resource.removeEventListener("finished", this._resourceLoadingFinished, this);
    },

    _addBreakpoint: function(line)
    {
        var sourceID = null;
        var closestStartingLine = 0;
        var scripts = this.resource.scripts;
        for (var i = 0; i < scripts.length; ++i) {
            var script = scripts[i];
            if (script.startingLine <= line && script.startingLine >= closestStartingLine) {
                closestStartingLine = script.startingLine;
                sourceID = script.sourceID;
            }
        }

        var breakpoint = new WebInspector.Breakpoint(this.resource.url, line, sourceID);
        WebInspector.panels.scripts.addBreakpoint(breakpoint);
    },

    // The rest of the methods in this prototype need to be generic enough to work with a ScriptView.
    // The ScriptView prototype pulls these methods into it's prototype to avoid duplicate code.

    searchCanceled: function()
    {
        this._currentSearchResultIndex = -1;
        this._searchResults = [];
        delete this._delayedFindSearchMatches;
    },

    performSearch: function(query, finishedCallback)
    {
        // Call searchCanceled since it will reset everything we need before doing a new search.
        this.searchCanceled();

        var lineQueryRegex = /(^|\s)(?:#|line:\s*)(\d+)(\s|$)/i;
        var lineQueryMatch = query.match(lineQueryRegex);
        if (lineQueryMatch) {
            var lineToSearch = parseInt(lineQueryMatch[2]);

            // If there was a space before and after the line query part, replace with a space.
            // Otherwise replace with an empty string to eat the prefix or postfix space.
            var lineQueryReplacement = (lineQueryMatch[1] && lineQueryMatch[3] ? " " : "");
            var filterlessQuery = query.replace(lineQueryRegex, lineQueryReplacement);
        }

        this._searchFinishedCallback = finishedCallback;

        function findSearchMatches(query, finishedCallback)
        {
            if (isNaN(lineToSearch)) {
                // Search the whole document since there was no line to search.
                this._searchResults = (InspectorController.search(this.sourceFrame.element.contentDocument, query) || []);
            } else {
                var sourceRow = this.sourceFrame.sourceRow(lineToSearch);
                if (sourceRow) {
                    if (filterlessQuery) {
                        // There is still a query string, so search for that string in the line.
                        this._searchResults = (InspectorController.search(sourceRow, filterlessQuery) || []);
                    } else {
                        // Match the whole line, since there was no remaining query string to match.
                        var rowRange = this.sourceFrame.element.contentDocument.createRange();
                        rowRange.selectNodeContents(sourceRow);
                        this._searchResults = [rowRange];
                    }
                }

                // Attempt to search for the whole query, just incase it matches a color like "#333".
                var wholeQueryMatches = InspectorController.search(this.sourceFrame.element.contentDocument, query);
                if (wholeQueryMatches)
                    this._searchResults = this._searchResults.concat(wholeQueryMatches);
            }

            if (this._searchResults)
                finishedCallback(this, this._searchResults.length);
        }

        if (!this._sourceFrameSetup) {
            // The search is performed in _sourceFrameSetupFinished by calling _delayedFindSearchMatches.
            this._delayedFindSearchMatches = findSearchMatches.bind(this, query, finishedCallback);
            this.setupSourceFrameIfNeeded();
            return;
        }

        findSearchMatches.call(this, query, finishedCallback);
    },

    jumpToFirstSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._currentSearchResultIndex = 0;
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToLastSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._currentSearchResultIndex = (this._searchResults.length - 1);
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToNextSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (++this._currentSearchResultIndex >= this._searchResults.length)
            this._currentSearchResultIndex = 0;
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToPreviousSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (--this._currentSearchResultIndex < 0)
            this._currentSearchResultIndex = (this._searchResults.length - 1);
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    showingFirstSearchResult: function()
    {
        return (this._currentSearchResultIndex === 0);
    },

    showingLastSearchResult: function()
    {
        return (this._searchResults && this._currentSearchResultIndex === (this._searchResults.length - 1));
    },

    revealLine: function(lineNumber)
    {
        this.setupSourceFrameIfNeeded();
        this.sourceFrame.revealLine(lineNumber);
    },

    highlightLine: function(lineNumber)
    {
        this.setupSourceFrameIfNeeded();
        this.sourceFrame.highlightLine(lineNumber);
    },

    addMessage: function(msg)
    {
        this.sourceFrame.addMessage(msg);
    },

    clearMessages: function()
    {
        this.sourceFrame.clearMessages();
    },

    _jumpToSearchResult: function(index)
    {
        var foundRange = this._searchResults[index];
        if (!foundRange)
            return;

        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(foundRange);

        if (foundRange.startContainer.scrollIntoViewIfNeeded)
            foundRange.startContainer.scrollIntoViewIfNeeded(true);
        else if (foundRange.startContainer.parentNode)
            foundRange.startContainer.parentNode.scrollIntoViewIfNeeded(true);
    },

    _sourceFrameSetupFinished: function()
    {
        this._sourceFrameSetup = true;
        if (this._delayedFindSearchMatches) {
            this._delayedFindSearchMatches();
            delete this._delayedFindSearchMatches;
        }
    },

    _syntaxHighlightingComplete: function(event)
    {
        this._sourceFrameSetupFinished();
        this.sourceFrame.removeEventListener("syntax highlighting complete", null, this);
    }
}

WebInspector.SourceView.prototype.__proto__ = WebInspector.ResourceView.prototype;
/* FontView.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.FontView = function(resource)
{
    WebInspector.ResourceView.call(this, resource);

    this.element.addStyleClass("font");

    var uniqueFontName = "WebInspectorFontPreview" + this.resource.identifier;

    this.fontStyleElement = document.createElement("style");
    this.fontStyleElement.textContent = "@font-face { font-family: \"" + uniqueFontName + "\"; src: url(" + this.resource.url + "); }";
    document.getElementsByTagName("head").item(0).appendChild(this.fontStyleElement);

    this.fontPreviewElement = document.createElement("div");
    this.fontPreviewElement.className = "preview";
    this.contentElement.appendChild(this.fontPreviewElement);

    this.fontPreviewElement.style.setProperty("font-family", uniqueFontName, null);
    this.fontPreviewElement.innerHTML = "ABCDEFGHIJKLM<br>NOPQRSTUVWXYZ<br>abcdefghijklm<br>nopqrstuvwxyz<br>1234567890";

    this.updateFontPreviewSize();
}

WebInspector.FontView.prototype = {
    show: function(parentElement)
    {
        WebInspector.ResourceView.prototype.show.call(this, parentElement);
        this.updateFontPreviewSize();
    },

    resize: function()
    {
        this.updateFontPreviewSize();
    },

    updateFontPreviewSize: function ()
    {
        if (!this.fontPreviewElement || !this.visible)
            return;

        this.fontPreviewElement.removeStyleClass("preview");

        var measureFontSize = 50;
        this.fontPreviewElement.style.setProperty("position", "absolute", null);
        this.fontPreviewElement.style.setProperty("font-size", measureFontSize + "px", null);
        this.fontPreviewElement.style.removeProperty("height");

        var height = this.fontPreviewElement.offsetHeight;
        var width = this.fontPreviewElement.offsetWidth;

        var containerWidth = this.contentElement.offsetWidth;

        // Subtract some padding. This should match the padding in the CSS plus room for the scrollbar.
        containerWidth -= 40;

        if (!height || !width || !containerWidth) {
            this.fontPreviewElement.style.removeProperty("font-size");
            this.fontPreviewElement.style.removeProperty("position");
            this.fontPreviewElement.addStyleClass("preview");
            return;
        }

        var lineCount = this.fontPreviewElement.getElementsByTagName("br").length + 1;
        var realLineHeight = Math.floor(height / lineCount);
        var fontSizeLineRatio = measureFontSize / realLineHeight;
        var widthRatio = containerWidth / width;
        var finalFontSize = Math.floor(realLineHeight * widthRatio * fontSizeLineRatio) - 1;

        this.fontPreviewElement.style.setProperty("font-size", finalFontSize + "px", null);
        this.fontPreviewElement.style.setProperty("height", this.fontPreviewElement.offsetHeight + "px", null);
        this.fontPreviewElement.style.removeProperty("position");

        this.fontPreviewElement.addStyleClass("preview");
    }
}

WebInspector.FontView.prototype.__proto__ = WebInspector.ResourceView.prototype;
/* ImageView.js */

/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ImageView = function(resource)
{
    WebInspector.ResourceView.call(this, resource);

    this.element.addStyleClass("image");

    var container = document.createElement("div");
    container.className = "image";
    this.contentElement.appendChild(container);

    this.imagePreviewElement = document.createElement("img");
    this.imagePreviewElement.setAttribute("src", this.resource.url);

    container.appendChild(this.imagePreviewElement);

    container = document.createElement("div");
    container.className = "info";
    this.contentElement.appendChild(container);

    var imageNameElement = document.createElement("h1");
    imageNameElement.className = "title";
    imageNameElement.textContent = this.resource.displayName;
    container.appendChild(imageNameElement);

    var infoListElement = document.createElement("dl");
    infoListElement.className = "infoList";

    var imageProperties = [
        { name: WebInspector.UIString("Dimensions"), value: WebInspector.UIString("%d × %d", this.imagePreviewElement.naturalWidth, this.imagePreviewElement.height) },
        { name: WebInspector.UIString("File size"), value: Number.bytesToString(this.resource.contentLength, WebInspector.UIString.bind(WebInspector)) },
        { name: WebInspector.UIString("MIME type"), value: this.resource.mimeType }
    ];

    var listHTML = '';
    for (var i = 0; i < imageProperties.length; ++i)
        listHTML += "<dt>" + imageProperties[i].name + "</dt><dd>" + imageProperties[i].value + "</dd>";

    infoListElement.innerHTML = listHTML;
    container.appendChild(infoListElement);
}

WebInspector.ImageView.prototype = {
    
}

WebInspector.ImageView.prototype.__proto__ = WebInspector.ResourceView.prototype;
/* DatabaseTableView.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DatabaseTableView = function(database, tableName)
{
    WebInspector.View.call(this);

    this.database = database;
    this.tableName = tableName;

    this.element.addStyleClass("database-view");
    this.element.addStyleClass("table");
}

WebInspector.DatabaseTableView.prototype = {
    show: function(parentElement)
    {
        WebInspector.View.prototype.show.call(this, parentElement);
        this.update();
    },

    update: function()
    {
        function queryTransaction(tx)
        {
            tx.executeSql("SELECT * FROM " + this.tableName, null, InspectorController.wrapCallback(this._queryFinished.bind(this)), InspectorController.wrapCallback(this._queryError.bind(this)));
        }

        this.database.database.transaction(InspectorController.wrapCallback(queryTransaction.bind(this)), InspectorController.wrapCallback(this._queryError.bind(this)));
    },

    _queryFinished: function(tx, result)
    {
        this.element.removeChildren();

        var dataGrid = WebInspector.panels.databases.dataGridForResult(result);
        if (!dataGrid) {
            var emptyMsgElement = document.createElement("div");
            emptyMsgElement.className = "database-table-empty";
            emptyMsgElement.textContent = WebInspector.UIString("The “%s”\ntable is empty.", this.tableName);
            this.element.appendChild(emptyMsgElement);
            return;
        }

        this.element.appendChild(dataGrid.element);
    },

    _queryError: function(tx, error)
    {
        this.element.removeChildren();

        var errorMsgElement = document.createElement("div");
        errorMsgElement.className = "database-table-error";
        errorMsgElement.textContent = WebInspector.UIString("An error occurred trying to\nread the “%s” table.", this.tableName);
        this.element.appendChild(errorMsgElement);
    },

}

WebInspector.DatabaseTableView.prototype.__proto__ = WebInspector.View.prototype;
/* DatabaseQueryView.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DatabaseQueryView = function(database)
{
    WebInspector.View.call(this);

    this.database = database;

    this.element.addStyleClass("database-view");
    this.element.addStyleClass("query");
    this.element.tabIndex = 0;

    this.element.addEventListener("selectstart", this._selectStart.bind(this), false);

    this.promptElement = document.createElement("div");
    this.promptElement.className = "database-query-prompt";
    this.promptElement.appendChild(document.createElement("br"));
    this.promptElement.handleKeyEvent = this._promptKeyDown.bind(this);
    this.element.appendChild(this.promptElement);

    this.prompt = new WebInspector.TextPrompt(this.promptElement, this.completions.bind(this), " ");
}

WebInspector.DatabaseQueryView.prototype = {
    show: function(parentElement)
    {
        WebInspector.View.prototype.show.call(this, parentElement);

        function moveBackIfOutside()
        {
            if (!this.prompt.isCaretInsidePrompt() && window.getSelection().isCollapsed)
                this.prompt.moveCaretToEndOfPrompt();
        }

        setTimeout(moveBackIfOutside.bind(this), 0);
    },

    completions: function(wordRange, bestMatchOnly)
    {
        var prefix = wordRange.toString().toLowerCase();
        if (!prefix.length)
            return;

        var results = [];

        function accumulateMatches(textArray)
        {
            if (bestMatchOnly && results.length)
                return;
            for (var i = 0; i < textArray.length; ++i) {
                var text = textArray[i].toLowerCase();
                if (text.length < prefix.length)
                    continue;
                if (text.indexOf(prefix) !== 0)
                    continue;
                results.push(textArray[i]);
                if (bestMatchOnly)
                    return;
            }
        }

        accumulateMatches(this.database.tableNames.map(function(name) { return name + " " }));
        accumulateMatches(["SELECT ", "FROM ", "WHERE ", "LIMIT ", "DELETE FROM ", "CREATE ", "DROP ", "TABLE ", "INDEX ", "UPDATE ", "INSERT INTO ", "VALUES ("]);

        return results;
    },

    _promptKeyDown: function(event)
    {
        switch (event.keyIdentifier) {
            case "Enter":
                this._enterKeyPressed(event);
                return;
        }

        this.prompt.handleKeyEvent(event);
    },

    _selectStart: function(event)
    {
        if (this._selectionTimeout)
            clearTimeout(this._selectionTimeout);

        this.prompt.clearAutoComplete();

        function moveBackIfOutside()
        {
            delete this._selectionTimeout;
            if (!this.prompt.isCaretInsidePrompt() && window.getSelection().isCollapsed)
                this.prompt.moveCaretToEndOfPrompt();
            this.prompt.autoCompleteSoon();
        }

        this._selectionTimeout = setTimeout(moveBackIfOutside.bind(this), 100);
    },

    _enterKeyPressed: function(event)
    {
        event.preventDefault();
        event.stopPropagation();

        this.prompt.clearAutoComplete(true);

        var query = this.prompt.text;
        if (!query.length)
            return;

        this.prompt.history.push(query);
        this.prompt.historyOffset = 0;
        this.prompt.text = "";

        function queryTransaction(tx)
        {
            tx.executeSql(query, null, InspectorController.wrapCallback(this._queryFinished.bind(this, query)), InspectorController.wrapCallback(this._executeSqlError.bind(this, query)));
        }

        this.database.database.transaction(InspectorController.wrapCallback(queryTransaction.bind(this)), InspectorController.wrapCallback(this._queryError.bind(this, query)));
    },

    _queryFinished: function(query, tx, result)
    {
        var dataGrid = WebInspector.panels.databases.dataGridForResult(result);
        dataGrid.element.addStyleClass("inline");
        this._appendQueryResult(query, dataGrid.element);

        if (query.match(/^create /i) || query.match(/^drop table /i))
            WebInspector.panels.databases.updateDatabaseTables(this.database);
    },

    _queryError: function(query, error)
    {
        if (error.code == 1)
            var message = error.message;
        else if (error.code == 2)
            var message = WebInspector.UIString("Database no longer has expected version.");
        else
            var message = WebInspector.UIString("An unexpected error %s occured.", error.code);

        this._appendQueryResult(query, message, "error");
    },

    _executeSqlError: function(query, tx, error)
    {
        this._queryError(query, error);
    },

    _appendQueryResult: function(query, result, resultClassName)
    {
        var element = document.createElement("div");
        element.className = "database-user-query";

        var commandTextElement = document.createElement("span");
        commandTextElement.className = "database-query-text";
        commandTextElement.textContent = query;
        element.appendChild(commandTextElement);

        var resultElement = document.createElement("div");
        resultElement.className = "database-query-result";

        if (resultClassName)
            resultElement.addStyleClass(resultClassName);

        if (typeof result === "string" || result instanceof String)
            resultElement.textContent = result;
        else if (result && result.nodeName)
            resultElement.appendChild(result);

        if (resultElement.childNodes.length)
            element.appendChild(resultElement);

        this.element.insertBefore(element, this.promptElement);
        this.promptElement.scrollIntoView(false);
    }
}

WebInspector.DatabaseQueryView.prototype.__proto__ = WebInspector.View.prototype;
/* ScriptView.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ScriptView = function(script)
{
    WebInspector.View.call(this);

    this.element.addStyleClass("script-view");

    this.script = script;

    this._frameNeedsSetup = true;
    this._sourceFrameSetup = false;

    this.sourceFrame = new WebInspector.SourceFrame(null, this._addBreakpoint.bind(this));

    this.element.appendChild(this.sourceFrame.element);
}

WebInspector.ScriptView.prototype = {
    show: function(parentElement)
    {
        WebInspector.View.prototype.show.call(this, parentElement);
        this.setupSourceFrameIfNeeded();
    },

    hide: function()
    {
        WebInspector.View.prototype.hide.call(this);
        this._currentSearchResultIndex = -1;
    },

    setupSourceFrameIfNeeded: function()
    {
        if (!this._frameNeedsSetup)
            return;

        this.attach();

        if (!InspectorController.addSourceToFrame("text/javascript", this.script.source, this.sourceFrame.element))
            return;

        delete this._frameNeedsSetup;

        this.sourceFrame.addEventListener("syntax highlighting complete", this._syntaxHighlightingComplete, this);
        this.sourceFrame.syntaxHighlightJavascript();
    },

    attach: function()
    {
        if (!this.element.parentNode)
            document.getElementById("script-resource-views").appendChild(this.element);
    },

    _addBreakpoint: function(line)
    {
        var breakpoint = new WebInspector.Breakpoint(this.script.sourceURL, line, this.script.sourceID);
        WebInspector.panels.scripts.addBreakpoint(breakpoint);
    },

    // The follow methods are pulled from SourceView, since they are
    // generic and work with ScriptView just fine.

    revealLine: WebInspector.SourceView.prototype.revealLine,
    highlightLine: WebInspector.SourceView.prototype.highlightLine,
    addMessage: WebInspector.SourceView.prototype.addMessage,
    clearMessages: WebInspector.SourceView.prototype.clearMessages,
    searchCanceled: WebInspector.SourceView.prototype.searchCanceled,
    performSearch: WebInspector.SourceView.prototype.performSearch,
    jumpToFirstSearchResult: WebInspector.SourceView.prototype.jumpToFirstSearchResult,
    jumpToLastSearchResult: WebInspector.SourceView.prototype.jumpToLastSearchResult,
    jumpToNextSearchResult: WebInspector.SourceView.prototype.jumpToNextSearchResult,
    jumpToPreviousSearchResult: WebInspector.SourceView.prototype.jumpToPreviousSearchResult,
    showingFirstSearchResult: WebInspector.SourceView.prototype.showingFirstSearchResult,
    showingLastSearchResult: WebInspector.SourceView.prototype.showingLastSearchResult,
    _jumpToSearchResult: WebInspector.SourceView.prototype._jumpToSearchResult,
    _sourceFrameSetupFinished: WebInspector.SourceView.prototype._sourceFrameSetupFinished,
    _syntaxHighlightingComplete: WebInspector.SourceView.prototype._syntaxHighlightingComplete
}

WebInspector.ScriptView.prototype.__proto__ = WebInspector.View.prototype;
/* ProfileView.js */

/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ProfileView = function(profile)
{
    WebInspector.View.call(this);

    this.element.addStyleClass("profile-view");

    this.showSelfTimeAsPercent = true;
    this.showTotalTimeAsPercent = true;

    var columns = { "self": { title: WebInspector.UIString("Self"), width: "72px", sort: "descending", sortable: true },
                    "total": { title: WebInspector.UIString("Total"), width: "72px", sortable: true },
                    "calls": { title: WebInspector.UIString("Calls"), width: "54px", sortable: true },
                    "function": { title: WebInspector.UIString("Function"), disclosure: true, sortable: true } };

    this.dataGrid = new WebInspector.DataGrid(columns);
    this.dataGrid.addEventListener("sorting changed", this._sortData, this);
    this.dataGrid.element.addEventListener("mousedown", this._mouseDownInDataGrid.bind(this), true);
    this.element.appendChild(this.dataGrid.element);

    this.viewSelectElement = document.createElement("select");
    this.viewSelectElement.className = "status-bar-item";
    this.viewSelectElement.addEventListener("change", this._changeView.bind(this), false);
    this.view = "Heavy";

    var heavyViewOption = document.createElement("option");
    heavyViewOption.label = WebInspector.UIString("Heavy (Bottom Up)");
    var treeViewOption = document.createElement("option");
    treeViewOption.label = WebInspector.UIString("Tree (Top Down)");
    this.viewSelectElement.appendChild(heavyViewOption);
    this.viewSelectElement.appendChild(treeViewOption);

    this.percentButton = document.createElement("button");
    this.percentButton.className = "percent-time-status-bar-item status-bar-item";
    this.percentButton.addEventListener("click", this._percentClicked.bind(this), false);

    this.focusButton = document.createElement("button");
    this.focusButton.title = WebInspector.UIString("Focus selected function.");
    this.focusButton.className = "focus-profile-node-status-bar-item status-bar-item";
    this.focusButton.disabled = true;
    this.focusButton.addEventListener("click", this._focusClicked.bind(this), false);

    this.excludeButton = document.createElement("button");
    this.excludeButton.title = WebInspector.UIString("Exclude selected function.");
    this.excludeButton.className = "exclude-profile-node-status-bar-item status-bar-item";
    this.excludeButton.disabled = true;
    this.excludeButton.addEventListener("click", this._excludeClicked.bind(this), false);

    this.resetButton = document.createElement("button");
    this.resetButton.title = WebInspector.UIString("Restore all functions.");
    this.resetButton.className = "reset-profile-status-bar-item status-bar-item hidden";
    this.resetButton.addEventListener("click", this._resetClicked.bind(this), false);

    // Default to the heavy profile.
    profile = profile.heavyProfile;

    // By default the profile isn't sorted, so sort based on our default sort
    // column and direction added to the DataGrid columns above.
    profile.sortSelfTimeDescending();

    this._updatePercentButton();

    this.profile = profile;
}

WebInspector.ProfileView.prototype = {
    get statusBarItems()
    {
        return [this.viewSelectElement, this.percentButton, this.focusButton, this.excludeButton, this.resetButton];
    },

    get profile()
    {
        return this._profile;
    },

    set profile(profile)
    {
        this._profile = profile;
        this.refresh();
    },

    hide: function()
    {
        WebInspector.View.prototype.hide.call(this);
        this._currentSearchResultIndex = -1;
    },

    refresh: function()
    {
        var selectedProfileNode = this.dataGrid.selectedNode ? this.dataGrid.selectedNode.profileNode : null;

        this.dataGrid.removeChildren();

        var children = this.profile.head.children;
        var childrenLength = children.length;
        for (var i = 0; i < childrenLength; ++i)
            if (children[i].visible)
                this.dataGrid.appendChild(new WebInspector.ProfileDataGridNode(this, children[i]));

        if (selectedProfileNode && selectedProfileNode._dataGridNode)
            selectedProfileNode._dataGridNode.selected = true;
    },

    refreshShowAsPercents: function()
    {
        this._updatePercentButton();

        var child = this.dataGrid.children[0];
        while (child) {
            child.refresh();
            child = child.traverseNextNode(false, null, true);
        }
    },

    searchCanceled: function()
    {
        if (this._searchResults) {
            for (var i = 0; i < this._searchResults.length; ++i) {
                var profileNode = this._searchResults[i].profileNode;

                delete profileNode._searchMatchedSelfColumn;
                delete profileNode._searchMatchedTotalColumn;
                delete profileNode._searchMatchedCallsColumn;
                delete profileNode._searchMatchedFunctionColumn;

                if (profileNode._dataGridNode)
                    profileNode._dataGridNode.refresh();
            }
        }

        delete this._searchFinishedCallback;
        this._currentSearchResultIndex = -1;
        this._searchResults = [];
    },

    performSearch: function(query, finishedCallback)
    {
        // Call searchCanceled since it will reset everything we need before doing a new search.
        this.searchCanceled();

        query = query.trimWhitespace();

        if (!query.length)
            return;

        this._searchFinishedCallback = finishedCallback;

        var greaterThan = (query.indexOf(">") === 0);
        var lessThan = (query.indexOf("<") === 0);
        var equalTo = (query.indexOf("=") === 0 || ((greaterThan || lessThan) && query.indexOf("=") === 1));
        var percentUnits = (query.lastIndexOf("%") === (query.length - 1));
        var millisecondsUnits = (query.length > 2 && query.lastIndexOf("ms") === (query.length - 2));
        var secondsUnits = (!millisecondsUnits && query.lastIndexOf("s") === (query.length - 1));

        var queryNumber = parseFloat(query);
        if (greaterThan || lessThan || equalTo) {
            if (equalTo && (greaterThan || lessThan))
                queryNumber = parseFloat(query.substring(2));
            else
                queryNumber = parseFloat(query.substring(1));
        }

        var queryNumberMilliseconds = (secondsUnits ? (queryNumber * 1000) : queryNumber);

        // Make equalTo implicitly true if it wasn't specified there is no other operator.
        if (!isNaN(queryNumber) && !(greaterThan || lessThan))
            equalTo = true;

        function matchesQuery(profileNode)
        {
            delete profileNode._searchMatchedSelfColumn;
            delete profileNode._searchMatchedTotalColumn;
            delete profileNode._searchMatchedCallsColumn;
            delete profileNode._searchMatchedFunctionColumn;

            if (percentUnits) {
                if (lessThan) {
                    if (profileNode.selfPercent < queryNumber)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalPercent < queryNumber)
                        profileNode._searchMatchedTotalColumn = true;
                } else if (greaterThan) {
                    if (profileNode.selfPercent > queryNumber)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalPercent > queryNumber)
                        profileNode._searchMatchedTotalColumn = true;
                }

                if (equalTo) {
                    if (profileNode.selfPercent == queryNumber)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalPercent == queryNumber)
                        profileNode._searchMatchedTotalColumn = true;
                }
            } else if (millisecondsUnits || secondsUnits) {
                if (lessThan) {
                    if (profileNode.selfTime < queryNumberMilliseconds)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalTime < queryNumberMilliseconds)
                        profileNode._searchMatchedTotalColumn = true;
                } else if (greaterThan) {
                    if (profileNode.selfTime > queryNumberMilliseconds)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalTime > queryNumberMilliseconds)
                        profileNode._searchMatchedTotalColumn = true;
                }

                if (equalTo) {
                    if (profileNode.selfTime == queryNumberMilliseconds)
                        profileNode._searchMatchedSelfColumn = true;
                    if (profileNode.totalTime == queryNumberMilliseconds)
                        profileNode._searchMatchedTotalColumn = true;
                }
            } else {
                if (equalTo && profileNode.numberOfCalls == queryNumber)
                    profileNode._searchMatchedCallsColumn = true;
                if (greaterThan && profileNode.numberOfCalls > queryNumber)
                    profileNode._searchMatchedCallsColumn = true;
                if (lessThan && profileNode.numberOfCalls < queryNumber)
                    profileNode._searchMatchedCallsColumn = true;
            }

            if (profileNode.functionName.hasSubstring(query, true) || profileNode.url.hasSubstring(query, true))
                profileNode._searchMatchedFunctionColumn = true;

            var matched = (profileNode._searchMatchedSelfColumn || profileNode._searchMatchedTotalColumn || profileNode._searchMatchedCallsColumn || profileNode._searchMatchedFunctionColumn);
            if (matched && profileNode._dataGridNode)
                profileNode._dataGridNode.refresh();

            return matched;
        }

        var current = this.profile.head;
        var ancestors = [];
        var nextIndexes = [];
        var startIndex = 0;

        while (current) {
            var children = current.children;
            var childrenLength = children.length;

            if (startIndex >= childrenLength) {
                current = ancestors.pop();
                startIndex = nextIndexes.pop();
                continue;
            }

            for (var i = startIndex; i < childrenLength; ++i) {
                var child = children[i];

                if (matchesQuery(child)) {
                    if (child._dataGridNode) {
                        // The child has a data grid node already, no need to remember the ancestors.
                        this._searchResults.push({ profileNode: child });
                    } else {
                        var ancestorsCopy = [].concat(ancestors);
                        ancestorsCopy.push(current);
                        this._searchResults.push({ profileNode: child, ancestors: ancestorsCopy });
                    }
                }

                if (child.children.length) {
                    ancestors.push(current);
                    nextIndexes.push(i + 1);
                    current = child;
                    startIndex = 0;
                    break;
                }

                if (i === (childrenLength - 1)) {
                    current = ancestors.pop();
                    startIndex = nextIndexes.pop();
                }
            }
        }

        finishedCallback(this, this._searchResults.length);
    },

    jumpToFirstSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._currentSearchResultIndex = 0;
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToLastSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._currentSearchResultIndex = (this._searchResults.length - 1);
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToNextSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (++this._currentSearchResultIndex >= this._searchResults.length)
            this._currentSearchResultIndex = 0;
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    jumpToPreviousSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        if (--this._currentSearchResultIndex < 0)
            this._currentSearchResultIndex = (this._searchResults.length - 1);
        this._jumpToSearchResult(this._currentSearchResultIndex);
    },

    showingFirstSearchResult: function()
    {
        return (this._currentSearchResultIndex === 0);
    },

    showingLastSearchResult: function()
    {
        return (this._searchResults && this._currentSearchResultIndex === (this._searchResults.length - 1));
    },

    _jumpToSearchResult: function(index)
    {
        var searchResult = this._searchResults[index];
        if (!searchResult)
            return;

        var profileNode = this._searchResults[index].profileNode;
        if (!profileNode._dataGridNode && searchResult.ancestors) {
            var ancestors = searchResult.ancestors;
            for (var i = 0; i < ancestors.length; ++i) {
                var ancestorProfileNode = ancestors[i];
                var gridNode = ancestorProfileNode._dataGridNode;
                if (gridNode)
                    gridNode.expand();
            }

            // No need to keep the ancestors around.
            delete searchResult.ancestors;
        }

        gridNode = profileNode._dataGridNode;
        if (!gridNode)
            return;

        gridNode.reveal();
        gridNode.select();
    },

    _changeView: function(event)
    {
        if (!event || !this.profile)
            return;

        if (event.target.selectedIndex == 1 && this.view == "Heavy") {
            this._sortProfile(this.profile.treeProfile);
            this.profile = this.profile.treeProfile;
            this.view = "Tree";
        } else if (event.target.selectedIndex == 0 && this.view == "Tree") {
            this._sortProfile(this.profile.heavyProfile);
            this.profile = this.profile.heavyProfile;
            this.view = "Heavy";
        }

        if (!this.currentQuery || !this._searchFinishedCallback || !this._searchResults)
            return;

        // The current search needs to be performed again. First negate out previous match
        // count by calling the search finished callback with a negative number of matches.
        // Then perform the search again the with same query and callback.
        this._searchFinishedCallback(this, -this._searchResults.length);
        this.performSearch(this.currentQuery, this._searchFinishedCallback);
    },

    _percentClicked: function(event)
    {
        var currentState = this.showSelfTimeAsPercent && this.showTotalTimeAsPercent;
        this.showSelfTimeAsPercent = !currentState;
        this.showTotalTimeAsPercent = !currentState;
        this.refreshShowAsPercents();
    },

    _updatePercentButton: function()
    {
        if (this.showSelfTimeAsPercent && this.showTotalTimeAsPercent) {
            this.percentButton.title = WebInspector.UIString("Show absolute total and self times.");
            this.percentButton.addStyleClass("toggled-on");
        } else {
            this.percentButton.title = WebInspector.UIString("Show total and self times as percentages.");
            this.percentButton.removeStyleClass("toggled-on");
        }
    },

    _focusClicked: function(event)
    {
        if (!this.dataGrid.selectedNode || !this.dataGrid.selectedNode.profileNode)
            return;
        this.resetButton.removeStyleClass("hidden");
        this.profile.focus(this.dataGrid.selectedNode.profileNode);
        this.refresh();
    },

    _excludeClicked: function(event)
    {
        if (!this.dataGrid.selectedNode || !this.dataGrid.selectedNode.profileNode)
            return;
        this.resetButton.removeStyleClass("hidden");
        this.profile.exclude(this.dataGrid.selectedNode.profileNode);
        this.dataGrid.selectedNode.deselect();
        this.refresh();
    },

    _resetClicked: function(event)
    {
        this.resetButton.addStyleClass("hidden");
        this.profile.restoreAll();
        this.refresh();
    },

    _dataGridNodeSelected: function(node)
    {
        this.focusButton.disabled = false;
        this.excludeButton.disabled = false;
    },

    _dataGridNodeDeselected: function(node)
    {
        this.focusButton.disabled = true;
        this.excludeButton.disabled = true;
    },

    _sortData: function(event)
    {
        this._sortProfile(this.profile);
    },

    _sortProfile: function(profile)
    {
        if (!profile)
            return;

        var sortOrder = this.dataGrid.sortOrder;
        var sortColumnIdentifier = this.dataGrid.sortColumnIdentifier;

        var sortingFunctionName = "sort";

        if (sortColumnIdentifier === "self")
            sortingFunctionName += "SelfTime";
        else if (sortColumnIdentifier === "total")
            sortingFunctionName += "TotalTime";
        else if (sortColumnIdentifier === "calls")
            sortingFunctionName += "Calls";
        else if (sortColumnIdentifier === "function")
            sortingFunctionName += "FunctionName";

        if (sortOrder === "ascending")
            sortingFunctionName += "Ascending";
        else
            sortingFunctionName += "Descending";

        if (!(sortingFunctionName in this.profile))
            return;

        profile[sortingFunctionName]();

        if (profile === this.profile)
            this.refresh();
    },

    _mouseDownInDataGrid: function(event)
    {
        if (event.detail < 2)
            return;

        var cell = event.target.enclosingNodeOrSelfWithNodeName("td");
        if (!cell || (!cell.hasStyleClass("total-column") && !cell.hasStyleClass("self-column")))
            return;

        if (cell.hasStyleClass("total-column"))
            this.showTotalTimeAsPercent = !this.showTotalTimeAsPercent;
        else if (cell.hasStyleClass("self-column"))
            this.showSelfTimeAsPercent = !this.showSelfTimeAsPercent;

        this.refreshShowAsPercents();

        event.preventDefault();
        event.stopPropagation();
    }
}

WebInspector.ProfileView.prototype.__proto__ = WebInspector.View.prototype;

WebInspector.ProfileDataGridNode = function(profileView, profileNode)
{
    this.profileView = profileView;

    this.profileNode = profileNode;
    profileNode._dataGridNode = this;

    // Find the first child that is visible. Since we don't want to claim
    // we have children if all the children are invisible.
    var hasChildren = false;
    var children = this.profileNode.children;
    var childrenLength = children.length;
    for (var i = 0; i < childrenLength; ++i) {
        if (children[i].visible) {
            hasChildren = true;
            break;
        }
    }

    WebInspector.DataGridNode.call(this, null, hasChildren);

    this.addEventListener("populate", this._populate, this);

    this.expanded = profileNode._expanded;
}

WebInspector.ProfileDataGridNode.prototype = {
    get data()
    {
        function formatMilliseconds(time)
        {
            return Number.secondsToString(time / 1000, WebInspector.UIString.bind(WebInspector), true);
        }

        var data = {};
        data["function"] = this.profileNode.functionName;
        data["calls"] = this.profileNode.numberOfCalls;

        if (this.profileView.showSelfTimeAsPercent)
            data["self"] = WebInspector.UIString("%.2f%%", this.profileNode.selfPercent);
        else
            data["self"] = formatMilliseconds(this.profileNode.selfTime);

        if (this.profileView.showTotalTimeAsPercent)
            data["total"] = WebInspector.UIString("%.2f%%", this.profileNode.totalPercent);
        else
            data["total"] = formatMilliseconds(this.profileNode.totalTime);

        return data;
    },

    createCell: function(columnIdentifier)
    {
        var cell = WebInspector.DataGridNode.prototype.createCell.call(this, columnIdentifier);

        if (columnIdentifier === "self" && this.profileNode._searchMatchedSelfColumn)
            cell.addStyleClass("highlight");
        else if (columnIdentifier === "total" && this.profileNode._searchMatchedTotalColumn)
            cell.addStyleClass("highlight");
        else if (columnIdentifier === "calls" && this.profileNode._searchMatchedCallsColumn)
            cell.addStyleClass("highlight");

        if (columnIdentifier !== "function")
            return cell;

        if (this.profileNode._searchMatchedFunctionColumn)
            cell.addStyleClass("highlight");

        if (this.profileNode.url) {
            var fileName = WebInspector.displayNameForURL(this.profileNode.url);

            var urlElement = document.createElement("a");
            urlElement.className = "profile-node-file webkit-html-resource-link";
            urlElement.href = this.profileNode.url;
            urlElement.lineNumber = this.profileNode.lineNumber;

            if (this.profileNode.lineNumber > 0)
                urlElement.textContent = fileName + ":" + this.profileNode.lineNumber;
            else
                urlElement.textContent = fileName;

            cell.insertBefore(urlElement, cell.firstChild);
        }

        return cell;
    },

    select: function(supressSelectedEvent)
    {
        WebInspector.DataGridNode.prototype.select.call(this, supressSelectedEvent);
        this.profileView._dataGridNodeSelected(this);
    },

    deselect: function(supressDeselectedEvent)
    {
        WebInspector.DataGridNode.prototype.deselect.call(this, supressDeselectedEvent);
        this.profileView._dataGridNodeDeselected(this);
    },

    expand: function()
    {
        WebInspector.DataGridNode.prototype.expand.call(this);
        this.profileNode._expanded = true;
    },

    collapse: function()
    {
        WebInspector.DataGridNode.prototype.collapse.call(this);
        this.profileNode._expanded = false;
    },

    _populate: function(event)
    {
        var children = this.profileNode.children;
        var childrenLength = children.length;
        for (var i = 0; i < childrenLength; ++i)
            if (children[i].visible)
                this.appendChild(new WebInspector.ProfileDataGridNode(this.profileView, children[i]));
        this.removeEventListener("populate", this._populate, this);
    }
}

WebInspector.ProfileDataGridNode.prototype.__proto__ = WebInspector.DataGridNode.prototype;
