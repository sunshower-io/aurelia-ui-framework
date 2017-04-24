//
// @description :
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT
import {autoinject, customElement, bindable, bindingMode, children, inlineView, useView, containerless, View, DOM, Container, ViewCompiler, ViewSlot} from 'aurelia-framework';
import {UIFormat} from "../../utils/ui-format";
import {UIEvent} from "../../utils/ui-event";
import {UIUtils} from "../../utils/ui-utils";
import {BaseDataSource, UILocalDS} from "../../data/ui-data-source";
import * as _ from "lodash";

@autoinject()
@inlineView(`<template></template>`)
@customElement('ui-dg-cell')
export class UIDgCell {
  constructor(public element: Element, private container: Container, private compiler: ViewCompiler) { }

  @bindable() col;
  @bindable() type;
  @bindable() record;
  @bindable() parent;

  attached() {
    if (this.element.innerHTML) return;
    let template = '';
    if (this.type == 'subview') {
      if (isFunction(this.parent.subview)) template = this.parent.subview({ record: this.record });
      else template = this.parent.subview;
    }
    else if (this.col.type == 'normal')
      template = `<div><span class="\${col.class}" innerhtml.bind='col.getValue(record[col.dataId],record)'></span></div>`
    else if (this.col.type == 'glyph')
      template = `<div title.bind="col.getTooltip(record[col.dataId],record)">
        <ui-glyph class="\${col.class} \${col.getGlyph(record[col.dataId],record)}" glyph.bind="col.getGlyph(record[col.dataId],record)"></ui-glyph>
        </div>`
    else if (this.col.type == 'link')
      template = `<div>
        <a class="ui-link \${col.class} \${col.isDisabled(record[col.dataId],record)?'ui-disabled':''}" click.trigger="col.fireClick($event,record[col.dataId],record)">
          <ui-glyph glyph.bind="col.getGlyph(record[col.dataId],record)" if.bind="col.glyph"></ui-glyph>
          <span innerhtml.bind="col.getLabel(record[col.dataId],record)"></span>
        </a>
        </div>`
    else if (this.col.type == 'button')
      template = `<div class="btn-fix">
        <ui-button click.trigger="col.fireClick($event,record[col.dataId],record)" theme.bind="col.getTheme(record[col.dataId],record)" small square glyph.bind="col.getGlyph(record[col.dataId],record)" disabled.bind="col.isDisabled(record[col.dataId],record)" dropdown.bind="col.dropdown" menuopen.trigger="col.fireMenuOpen($event, record)">
          <span innerhtml.bind="col.getLabel(record[col.dataId],record)"></span>
        </ui-button>
        </div>`

    let viewFactory = this.compiler.compile(`<template>${template}</template>`);
    let view = viewFactory.create(this.container);
    view.bind(this);
    // DOM.appendNode(div, this.element);
    let slot = new ViewSlot(this.element, true);
    slot.add(view);
    slot.attached();
  }

  /*
  <div if.bind="col.type=='glyph'" title.bind="col.getTooltip(record[col.dataId],record)"><ui-glyph class="\${col.class} \${col.getGlyph(record[col.dataId],record)}" glyph.bind="col.getGlyph(record[col.dataId],record)"></ui-glyph></div>
  <div if.bind="col.type=='link'"><a class="ui-link \${col.class} \${col.isDisabled(record[col.dataId],record)?'ui-disabled':''}" click.trigger="col.fireClick($event,record[col.dataId],record)"><ui-glyph glyph.bind="col.getGlyph(record[col.dataId],record)" if.bind="col.glyph"></ui-glyph> <span innerhtml.bind="col.getLabel(record[col.dataId],record)"></span></a></div>
  <div if.bind="col.type=='button'" class="btn-fix"><ui-button click.trigger="col.fireClick($event,record[col.dataId],record)" theme.bind="col.getTheme(record[col.dataId],record)" small square glyph.bind="col.getGlyph(record[col.dataId],record)" disabled.bind="col.isDisabled(record[col.dataId],record)" dropdown.bind="col.dropdown" menuopen.trigger="col.fireMenuOpen($event, record)"><span innerhtml.bind="col.getLabel(record[col.dataId],record)"></span></ui-button></div>
  */
}

@inlineView(`<template><tr class="level-\${level} \${record.isOpen?'ui-expanded':''} \${parent.selected==record?'ui-selected':''}" click.delegate="parent.fireSelect(parent.selected=record)">
  <td class="ui-expander" if.bind="parent.handleSize>0">
    <div><a if.bind="record.subdata || parent.subview" click.trigger="expand($event)"><ui-glyph glyph.bind="record.isOpen?'glyph-icon-minus':'glyph-icon-plus'"></ui-glyph></a></div>
  </td>
  <td repeat.for="col of parent.cols" class="\${col.locked==0?'ui-locked':''} \${col.align}" css.bind="{left: col.left+'px'}"
    col.bind="col" parent.bind="parent" record.bind="record" as-element="ui-dg-cell">
  </td>
  <td class="filler"><div>&nbsp;</div></td></tr>

  <ui-dg-row containerless if.bind="!parent.subview && record.subdata && record.isOpen" level.bind="level+1" parent.bind="parent"
    record.bind="rec" repeat.for="rec of getSubdata()" class="\${$last?'ui-last-inner':''}">
  </ui-dg-row>

  <tr if.bind="parent.subview && record.isOpen" class="filler">
  <td class="ui-expander" if.bind="parent.handleSize>0"><div></div></td>
  <td colspan="\${parent.cols.length}"><div parent.bind="parent"
    record.bind="record" type="subview" as-element="ui-dg-cell"></div></td>
  <td class="filler"><div>&nbsp;</div></td></tr>
</template>`)
@customElement('ui-dg-row')
export class UIDgRow {
  @bindable() level = 0;
  @bindable() record;
  @bindable() parent;

  expand(evt) {
    this.record.isOpen = !this.record.isOpen;
    evt.stopPropagation();
    evt.preventDefault();
    return false;
  }
  getSubdata() {
    if (isFunction(this.record.subdata)) return this.record.subdata(this.record);
    return this.record.subdata;
  }
}

@autoinject()
@inlineView(`<template class="ui-datagrid"><div class="ui-hidden"><slot></slot></div>
<div show.bind="resizing" ref="ghost" class="ui-dg-ghost"></div>
<div ref="dgHead">
<table width.bind="tableWidth" css.bind="{'table-layout': tableWidth?'fixed':'auto' }">
  <colgroup>
    <col width="\${handleSize}" if.bind="handleSize>0"/>
    <col repeat.for="col of cols" data-index.bind="$index" width.bind="col.width"/>
    <col/>
  </colgroup>
  <thead><tr>
    <td class="ui-expander" if.bind="handleSize>0" rowspan.bind="headCols2.length?2:''"><div>&nbsp;</div></td>
    <td repeat.for="col of headCols" mouseup.trigger="doSort(col)" class="\${col.sortable?'ui-sortable':''} \${col.locked==0?'ui-locked':''}" css.bind="{left: col.left+'px'}" rowspan.bind="headCols2.length?(col.isGroup?1:2):''" colspan.bind="col.isGroup?col.columns.length:1">
    <div if.bind="!col.isGroup">
      <span class="ui-dg-header" innerhtml.bind='col.getTitle()'></span>
      <span class="ui-filter" if.bind="col.filter"><ui-glyph glyph="glyph-funnel"></ui-glyph></span>
      <span class="ui-sort \${col.dataId==store.sortBy ? store.orderBy:''}" if.bind="col.sortable"></span>
      <span class="ui-resizer" if.bind="col.resize" mousedown.trigger="resizeColumn($event,col,cols[$index+1])"></span>
    </div><div if.bind="col.isGroup" class="ui-dg-group"><span class="ui-dg-header" innerhtml.bind='col.getTitle()'></span></div></td>
    <td class="filler" rowspan.bind="headCols2.length?2:''"><div><span class="ui-dg-header">&nbsp;</span></div></td>
  </tr><tr show.bind="headCols2.length"><td repeat.for="col of headCols2" mouseup.trigger="doSort(col)" class="\${col.sortable?'ui-sortable':''} \${col.locked==0?'ui-locked':''}" css.bind="{left: col.left+'px'}" if.bind="col"><div>
    <span class="ui-dg-header" innerhtml.bind='col.getTitle()'></span>
    <span class="ui-filter" if.bind="col.filter"><ui-glyph glyph="glyph-funnel"></ui-glyph></span>
    <span class="ui-sort \${col.dataId==store.sortBy ? store.orderBy:''}" if.bind="col.sortable"></span>
    <span class="ui-resizer" if.bind="col.resize" mousedown.trigger="resizeColumn($event,col,cols[$index+1])"></span>
  </div></td></tr></thead>
</table>
</div>
<div show.bind="store.isEmpty" class="ui-dg-empty"><slot name="dg-empty"></slot></div>
<div class="ui-dg-wrapper" ref="scroller" scroll.trigger="scrolling() & debounce:1">
<table width.bind="calculateWidth(cols,resizing)" css.bind="{'table-layout': tableWidth?'fixed':'auto' }" ref="mainTable">
  <colgroup>
    <col width="\${handleSize}" if.bind="handleSize>0"/>
    <col repeat.for="col of cols" data-index.bind="$index" width.bind="col.width"/>
    <col/>
  </colgroup>
  <tbody if.bind="!virtual" class="\${$even?'even':'odd'}" parent.bind="$parent"
    as-element="ui-dg-row" record.bind="record" repeat.for="record of store.data">
  </tbody>
  <tbody if.bind="virtual" class="\${$even?'even':'odd'}" parent.bind="$parent"
    as-element="ui-dg-row" record.bind="record" virtual-repeat.for="record of store.data">
  </tbody>
</table>
<table width.bind="tableWidth" class="filler" css.bind="{'table-layout': tableWidth?'fixed':'auto', height:((scroller.offsetHeight<mainTable.offsetHeight?0:scroller.offsetHeight-mainTable.offsetHeight)+'px') }">
  <colgroup>
    <col width="\${handleSize}" if.bind="handleSize>0"/>
    <col repeat.for="col of cols" data-index.bind="$index" width.bind="col.width"/>
    <col/>
  </colgroup>
  <tbody class="odd"><tr class="filler">
    <td class="ui-expander" if.bind="handleSize>0"><div>&nbsp;</div></td>
    <td repeat.for="col of cols" class="\${col.locked==0?'ui-locked':''}" css.bind="{left: col.left+'px'}"><div>&nbsp;</div></td>
    <td class="filler"><div>&nbsp;</div></td>
  </tr></tbody>
</table></div>
<div>
<table ref="dgFoot" width.bind="tableWidth" css.bind="{'table-layout': tableWidth?'fixed':'auto' }">
  <colgroup>
    <col width="\${handleSize}" if.bind="handleSize>0"/>
    <col repeat.for="col of cols" data-index.bind="$index" width.bind="col.width"/>
    <col/>
  </colgroup>
  <tfoot if.bind="summaryRow"><tr>
    <td class="ui-expander" if.bind="handleSize>0"><div>&nbsp;</div></td>
    <td repeat.for="col of cols" class="\${col.locked==0?'ui-locked':''} \${col.align}" css.bind="{left: col.left+'px'}"><div innerhtml.bind='col.getSummary(summaryRow, store.data)'></div></td>
    <td class="filler"><div>&nbsp;</div></td>
  </tr></tfoot>
</table>
</div>
<div class="ui-dg-loader" if.bind="store.isLoading">
  <div class="ui-loader-div">
    <ui-glyph class="ui-anim-loader" glyph="glyph-loader"></ui-glyph>
  </div>
</div></template>`)
@customElement('ui-datagrid')
export class UIDatagrid {
  constructor(public element: Element) {
    this.virtual = element.hasAttribute('virtual');
    if (!element.hasAttribute('scroll')) this.element.classList.add('ui-auto-size');
    if (!element.hasAttribute('row-expander')) this.handleSize = 0;
  }

  // aurelia hooks
  // created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    if (this.pager) {
      if (!(this.pager instanceof UIPager)) throw new Error('Pager must be instance of UIPager');
      this.obPageChange = UIEvent.observe(this.pager, 'page', pg => this.store.loadPage(pg));
    }
    if (!(this.store instanceof BaseDataSource))
      this.store = new UILocalDS(this.store);

    if (this.subview) this.handleSize = 30;

    // this.obDataChange = UIEvent.observe(this.store, 'data').subscribe(data => this.store.loadPage(pg));
  }
  attached() {
    UIEvent.queueTask(() => {
      this.columnsChanged(this.columns);
      this.scrolling();
    });
    // UIEvent.queueTask(() => (!this.store.isLoaded ? this.store.fetchData() : null));
  }
  detached() {
    if (this.obPageChange) this.obPageChange.dispose();
  }
  // unbind() { }
  // end aurelia hooks

  @children('ui-dg-column-group,ui-dg-column,ui-dg-button,ui-dg-link,ui-dg-glyph') columns;
  // @children('ui-dg-column,ui-dg-button,ui-dg-link,ui-dg-glyph,' +
  //   'ui-dg-column-group>ui-dg-column,ui-dg-column-group ui-dg-button,ui-dg-column-group ui-dg-link,ui-dg-column-group>ui-dg-glyph') columns;

  @bindable() store;
  @bindable() pager;
  @bindable() subview;
  @bindable() summaryRow = false;

  private cols = [];
  private headCols = [];
  private headCols2 = [];
  private tableWidth = '20px';

  private virtual = false;
  private isBusy = false;
  private obDataChange;
  private obPageChange;

  private handleSize = 30;

  columnsChanged(newValue) {
    this.headCols = _.sortBy(this.columns, 'locked');
    this.headCols2 = _.flatMap(this.headCols, c => c.columns || []);
    this.cols = _.sortBy(_.flatMap(this.columns, c => c.columns || [c]), 'locked');
  }

  storeChanged(newValue) {
    if (!(newValue instanceof BaseDataSource))
      this.store = new UILocalDS(newValue);
    else
      this.store = newValue;
    if (!this.store.isLoaded) UIEvent.queueTask(() => (this.pager ? this.store.loadPage(this.pager.page = 0) : this.store.fetchData()));
  }

  dgHead;
  dgFoot;
  scroller;
  selected;
  private scrolling() {
    this.dgHead.style.transform = `translateX(-${this.scroller.scrollLeft}px)`;
    if (this.dgFoot) this.dgFoot.style.transform = this.dgHead.style.transform;
  }
  private doSort(col) {
    if (!col.sortable) return;
    let sortOrder = 'asc';
    if (this.store.sortBy == col.dataId) sortOrder = this.store.orderBy == 'asc' ? 'desc' : 'asc';
    this.store.sort(col.dataId, sortOrder);
  }

  private calculateWidth(cols) {
    let w = this.handleSize;
    _.forEach(cols, c => { c.left = w; w += c.getWidth(); });
    return (this.tableWidth = (w + 20) + 'px');
  }

  private fireSelect(record) {
    this.selected = record;
    UIEvent.fireEvent('rowselect', this.element, ({ record }));
  }

  isRtl = false;
  move;
  stop;
  diff;
  startX;
  ghost;
  colNext;
  colResize;
  resizing = false;
  resizeColumn(evt, col, next) {
    if (evt.button != 0) return true;
    this.isRtl = window.isRtl(this.element);
    this.diff = 0;
    this.colResize = col;
    this.colNext = next;
    this.resizing = true;
    this.startX = (evt.x || evt.clientX);
    this.ghost.style[this.isRtl ? 'right' : 'left'] = (col.left + parseInt(col.width) - (col.locked == 0 ? 0 : this.scroller.scrollLeft)) + 'px';
    document.addEventListener('mouseup', this.stop = evt => this.resizeEnd(evt));
    document.addEventListener('mousemove', this.move = evt => this.resize(evt));
  }
  resize(evt) {
    var x = (evt.x || evt.clientX) - this.startX;
    x = (this.isRtl ? -1 : 1) * x;
    if (x < 0 && (parseInt(this.colResize.width) + this.diff) <= (this.colResize.minWidth || 80)) return;
    if (x > 0 && (parseInt(this.colResize.width) + this.diff) >= (500)) return;

    this.startX = (evt.x || evt.clientX);
    this.diff += x;
    this.ghost.style[this.isRtl ? 'right' : 'left'] = (parseInt(this.ghost.style[this.isRtl ? 'right' : 'left']) + x) + 'px';
  }
  resizeEnd(evt) {
    this.resizing = false;
    if (this.colNext) this.colNext.left += this.diff;
    this.colResize.width = (parseInt(this.colResize.width) + this.diff);
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.stop);
    evt.stopPropagation();
    return false;
  }
}

@containerless()
@customElement('ui-dg-empty')
@inlineView(`<template><div slot="dg-empty"><slot></slot></div></template>`)
export class UIDGEmpty { }

@autoinject()
@inlineView(`<template class="ui-pager">
  <a class="pg-first \${page==0?'disabled':''}" click.trigger="fireChange(page=0)"><ui-glyph glyph="glyph-\${style}-double-left"></ui-glyph></a>
  <a class="pg-prev \${page==0?'disabled':''}" click.trigger="fireChange(page=page-1)" click.trigger="fireChange(page=totalPages)"><ui-glyph glyph="glyph-\${style}-left"></ui-glyph></a>
  <span class="pg-input">\${page+1} of \${totalPages}</span>
  <a class="pg-next \${page+1>=totalPages?'disabled':''}" click.trigger="fireChange(page=page+1)"><ui-glyph glyph="glyph-\${style}-right"></ui-glyph></a>
  <a class="pg-last \${page+1>=totalPages?'disabled':''}" click.trigger="fireChange(page=totalPages-1)"><ui-glyph glyph="glyph-\${style}-double-right"></ui-glyph></a>
</template>`)
@customElement('ui-pager')
export class UIPager {
  constructor(public element: Element) { }

  // aurelia hooks
  // created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    if (this.store)
      this.totalPages = this.store.totalPages;
  }
  attached() {
    if (this.store && !this.store.isLoaded) UIEvent.queueTask(() => this.store.loadPage(this.page));
  }
  // detached() { }
  // unbind() { }
  // end aurelia hooks

  @bindable({ defaultBindingMode: bindingMode.twoWay }) page = 0;

  @bindable() style = "chevron";
  @bindable() store;
  @bindable() totalPages = 1;

  fireChange() {
    if (this.store) this.store.loadPage(this.page);
    UIEvent.fireEvent('change', this.element, this.page);
  }
}

@autoinject()
@inlineView(`<template class="ui-filter"></template>`)
@customElement('ui-dg-filter')
export class UIDGFilter {
  constructor(public element: Element) { }

  // aurelia hooks
  // created(owningView: View, myView: View) { }
  // bind(bindingContext: Object, overrideContext: Object) { }
  // attached() { }
  // detached() { }
  // unbind() { }
  // end aurelia hooks
}
