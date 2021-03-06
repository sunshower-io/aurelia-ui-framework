/**
 * @author    : Adarsh Pastakia
 * @version   : 5.0.0
 * @copyright : 2018
 * @license   : MIT
 */

import {
  autoinject,
  bindable,
  child,
  containerless,
  customElement,
  inlineView
} from "aurelia-framework";
import { UIDrop } from "../core/ui-drop";
import { UIInternal } from "../utils/ui-internal";

@autoinject()
@customElement("ui-menu")
@inlineView(`<template class="ui-menu"><slot></slot></template>`)
export class UIMenu {
  constructor(protected element: Element) {}

  protected attached(): void {
    const active = this.element.querySelector(".ui-menu__item__link[data-active='true']");
    if (active) {
      active.scrollIntoView({ block: "center", inline: "nearest" });
    }
  }
}

@autoinject()
@containerless()
@customElement("ui-menu-group")
@inlineView(
  `<template><fieldset class="ui-menu__group" data-collapsed.bind="collapsed" ref="vmElement">
    <legend class="ui-menu__group__label" if.bind="label" innerhtml.bind="label" click.trigger="collapsed = !collapsed"></legend>
    <div class="ui-menu__group__container"><slot></slot></div>
  </fieldset></template>`
)
export class UIMenuGroup {
  @bindable()
  public label: string = "";
  @bindable()
  public collapsed: boolean = false;

  private vmElement: Element;

  constructor(protected element: Element) {}

  protected attached(): void {
    if (this.element.hasAttribute("collapsible")) {
      this.vmElement.classList.add("ui-menu__group--collapsible");
    }
  }
}

@autoinject()
@customElement("ui-menu-item")
export class UIMenuItem {
  @bindable()
  public label: string = "";
  @bindable()
  public href: string = "";
  @bindable()
  public icon: string = "";
  @bindable()
  public value: AnyObject;

  @bindable()
  public active: boolean = false;
  @bindable()
  public disabled: boolean = false;

  protected split: boolean;

  @child("div.ui-drop")
  protected elDropdown: Element;
  protected hasDrop: boolean = false;
  protected dropEl: UIDrop;

  protected badgeEl: HTMLAnchorElement;

  constructor(protected element: Element) {
    this.split = element.hasAttribute("split");
  }

  protected attached() {
    this.hasDrop = !!this.elDropdown;
    if (this.hasDrop) {
      this.dropEl = getSlotViewModel(this.elDropdown) as UIDrop;
      this.dropEl.tether(this.element);
    }
    this.hrefChanged();
  }

  protected hrefChanged(): void {
    if (this.badgeEl) {
      if (this.href) {
        this.badgeEl.href = this.href;
      } else if (this.badgeEl.attributes.getNamedItem("href")) {
        this.badgeEl.attributes.removeNamedItem("href");
      }
    }
  }

  protected fireClick($event: MouseEvent): boolean {
    if (!this.href) {
      $event.stopEvent();

      if (this.hasDrop && !this.split) {
        this.toggleDrop();
        return false;
      }
      return this.element.dispatchEvent(UIInternal.createEvent("click", this.value));
    }
  }

  private toggleDrop(): void {
    const beforeEvent = this.dropEl.isOpen ? "beforeopen" : "beforeclose";
    const afterEvent = this.dropEl.isOpen ? "close" : "open";
    if (this.element.dispatchEvent(UIInternal.createEvent(beforeEvent)) !== false) {
      this.dropEl.toggleDrop();
      this.element.dispatchEvent(UIInternal.createEvent(afterEvent));
    }
  }
}
