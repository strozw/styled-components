// @flow
/* eslint-disable no-use-before-define */

import { makeStyleTag, getSheet } from './dom';
import type { SheetOptions, Tag } from './types';

/** Create a CSSStyleSheet-like tag depending on the environment */
export const makeTag = ({ isServer, useCSSOMInjection, target }: SheetOptions): Tag => {
  if (isServer) {
    return new VirtualTag(target);
  } else if (useCSSOMInjection) {
    return new CSSOMTag(target);
  } else {
    return new TextTag(target);
  }
};

export class CSSOMTag implements Tag {
  element: HTMLStyleElement;

  sheet: CSSStyleSheet;

  length: number;

  constructor(target?: HTMLElement) {
    const element = (this.element = makeStyleTag(target));

    // Avoid Edge bug where empty style elements don't create sheets
    element.appendChild(document.createTextNode(''));

    this.sheet = getSheet(element);
    this.length = 0;
  }

  insertRule(index: number, rule: string): boolean {
    try {
      this.sheet.insertRule(rule, index);
      this.length++;
      return true;
    } catch (_error) {
      return false;
    }
  }

  insertRules(startRuleIndex: number, rules: string[]): number {
    let insertCount = 0
    let ruleIndex = startRuleIndex

    for (let i = 0, l = rules.length; i < l; i++) {
      if (this.insertRule(ruleIndex, rules[i])) {
        insertCount++
        ruleIndex++;
      }
    }

    return insertCount
  }

  deleteRule(index: number): void {
    this.sheet.deleteRule(index);
    this.length--;
  }

  getRule(index: number): string {
    const rule = this.sheet.cssRules[index];
    // Avoid IE11 quirk where cssText is inaccessible on some invalid rules
    if (rule !== undefined && typeof rule.cssText === 'string') {
      return rule.cssText;
    } else {
      return '';
    }
  }
}

/** A Tag that emulates the CSSStyleSheet API but uses text nodes */
export class TextTag implements Tag {
  element: HTMLStyleElement;

  nodes: NodeList<Node>;

  length: number;

  constructor(target?: HTMLElement) {
    const element = (this.element = makeStyleTag(target));
    this.nodes = element.childNodes;
    this.length = 0;
  }

  insertRule(index: number, rule: string): boolean {
    if (index <= this.length && index >= 0) {
      const node = document.createTextNode(rule);
      const refNode = this.nodes[index];
      this.element.insertBefore(node, refNode || null);
      this.length++;
      return true;
    } else {
      return false;
    }
  }

  insertRules(startRuleIndex: number, rules: string[]): number {
    const fragment = document.createDocumentFragment();
    const fragmentNodes = fragment.childNodes;

    for (let i = 0, l = rules.length; i < l; i++) {
      const node = document.createTextNode(rules[i]);
      const refNode = fragmentNodes[i];
      fragment.insertBefore(node, refNode || null);
    }

    const elementRefNode = this.nodes[startRuleIndex]
    const insertCount = fragmentNodes.length

    this.element.insertBefore(fragment, elementRefNode)
    this.length += insertCount;

    return insertCount
  }

  deleteRule(index: number): void {
    this.element.removeChild(this.nodes[index]);
    this.length--;
  }

  getRule(index: number): string {
    if (index < this.length) {
      return this.nodes[index].textContent;
    } else {
      return '';
    }
  }
}

/** A completely virtual (server-side) Tag that doesn't manipulate the DOM */
export class VirtualTag implements Tag {
  rules: string[];

  length: number;

  constructor(_target?: HTMLElement) {
    this.rules = [];
    this.length = 0;
  }

  insertRule(index: number, rule: string): boolean {
    if (index <= this.length) {
      this.rules.splice(index, 0, rule);
      this.length++;
      return true;
    } else {
      return false;
    }
  }

  insertRules(startRuleIndex: number, rules: string[]): number {
    let insertCount = 0
    let ruleIndex = startRuleIndex

    for (let i = 0, l = rules.length; i < l; i++) {
      if (this.insertRule(ruleIndex, rules[i])) {
        insertCount++
        ruleIndex++;
      }
    }

    return insertCount
  }

  deleteRule(index: number): void {
    this.rules.splice(index, 1);
    this.length--;
  }

  getRule(index: number): string {
    if (index < this.length) {
      return this.rules[index];
    } else {
      return '';
    }
  }
}
