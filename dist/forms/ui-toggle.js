/**
 * @author    : Adarsh Pastakia
 * @version   : 5.0.0
 * @copyright : 2018
 * @license   : MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { autoinject, bindable, bindingMode, customElement, inlineView } from "aurelia-framework";
import { UIInternal } from "../utils/ui-internal";
var UIToggle = /** @class */ (function () {
    function UIToggle(element) {
        this.element = element;
        this.disabled = false;
        this.isDisabled = false;
    }
    UIToggle.prototype.disable = function (b) {
        this.isDisabled = b;
    };
    UIToggle.prototype.bind = function () {
        if (isTrue(this.checked)) {
            this.checked = true;
        }
    };
    UIToggle.prototype.checkChanged = function ($event) {
        $event.stopPropagation();
        this.element.dispatchEvent(UIInternal.createEvent("change", this));
    };
    __decorate([
        bindable({ defaultBindingMode: bindingMode.twoWay }),
        __metadata("design:type", Object)
    ], UIToggle.prototype, "checked", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Object)
    ], UIToggle.prototype, "model", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Function)
    ], UIToggle.prototype, "matcher", void 0);
    __decorate([
        bindable(),
        __metadata("design:type", Boolean)
    ], UIToggle.prototype, "disabled", void 0);
    UIToggle = __decorate([
        autoinject(),
        customElement("ui-toggle"),
        inlineView("<template class=\"ui-option\" data-disabled.bind=\"disabled || isDisabled\"><label class=\"ui-option__control\">\n    <input size=\"1\" type=\"checkbox\" checked.bind=\"checked\" model.bind=\"model\" matcher.bind=\"matcher\" disabled.bind=\"disabled\" change.trigger=\"checkChanged($event)\" />\n    <div class=\"ui-option__toggle\"></div>\n    <span><slot></slot></span>\n  </label></template>"),
        __metadata("design:paramtypes", [Element])
    ], UIToggle);
    return UIToggle;
}());
export { UIToggle };
