/*
 * Copyright (C) 2004, 2005, 2006, 2007, 2008 Apple Inc. All rights reserved.
 * Copyright (C) 2006 Samuel Weinig <sam.weinig@gmail.com>
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
 * THIS SOFTWARE IS PROVIDED BY APPLE COMPUTER, INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE COMPUTER, INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */

#import <WebKit/DOMDocument.h>

#if WEBKIT_VERSION_MAX_ALLOWED >= WEBKIT_VERSION_1_3

@class NSString;

@interface DOMDocument (DOMDocumentPrivate)
@property(readonly, copy) NSString *inputEncoding;
@property(readonly, copy) NSString *xmlEncoding;
@property(copy) NSString *xmlVersion;
@property BOOL xmlStandalone;
@property(copy) NSString *documentURI;
@property(readonly, copy) NSString *lastModified;
@property(copy) NSString *charset;
@property(readonly, copy) NSString *defaultCharset;
@property(readonly, copy) NSString *readyState;
@property(readonly, copy) NSString *characterSet;
@property(readonly, copy) NSString *preferredStylesheetSet;
@property(copy) NSString *selectedStylesheetSet;

- (BOOL)execCommand:(NSString *)command userInterface:(BOOL)userInterface value:(NSString *)value;
- (BOOL)execCommand:(NSString *)command userInterface:(BOOL)userInterface;
- (BOOL)execCommand:(NSString *)command;
- (BOOL)queryCommandEnabled:(NSString *)command;
- (BOOL)queryCommandIndeterm:(NSString *)command;
- (BOOL)queryCommandState:(NSString *)command;
- (BOOL)queryCommandSupported:(NSString *)command;
- (NSString *)queryCommandValue:(NSString *)command;
- (DOMElement *)elementFromPoint:(int)x y:(int)y;
- (DOMNodeList *)getElementsByClassName:(NSString *)tagname;
- (DOMElement *)querySelector:(NSString *)selectors;
- (DOMNodeList *)querySelectorAll:(NSString *)selectors;
@end

#endif
