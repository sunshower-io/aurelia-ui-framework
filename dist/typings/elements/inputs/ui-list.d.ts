export declare class BaseList {
    model: any;
    value: string;
    options: any[];
    clear: boolean;
    readonly: boolean;
    disabled: boolean;
    allowSearch: boolean;
    forceSelect: boolean;
    valueProperty: string;
    iconProperty: string;
    displayProperty: string;
    protected inputEl: any;
    protected elValue: any;
    protected element: any;
    protected dropdown: any;
    protected tether: any;
    protected obMouseup: any;
    protected original: any[];
    protected filtered: any[];
    protected isDisabled: boolean;
    protected isTagInput: boolean;
    protected showDropdown: boolean;
    protected hilight: any;
    protected floating: any;
    bind(bindingContext: Object, overrideContext: Object): void;
    attached(): void;
    detached(): void;
    disabledChanged(newValue: any): void;
    readonlyChanged(newValue: any): void;
    disable(b: any): void;
    clearInput(): void;
    focus(): void;
    valueChanged(newValue: any, oldValue?: any): void;
    optionsChanged(newValue: any): void;
    hilightItem(evt: any): void;
    unhilightItem(evt?: any): void;
    scrollIntoView(): void;
    openDropdown(): boolean;
    closeDropdown(): void;
    toggleDropdown(evt: any): void;
    fireEvent(evt: any): void;
    keyDown(evt: any): any;
    search(): void;
    fireSelect(model?: any): void;
    fireChange(): void;
    addValue(val: any): void;
    removeValue(val: any): void;
}
export declare class UICombo extends BaseList {
    element: Element;
    constructor(element: Element);
    value: string;
    model: any;
    errors: any;
    disabled: boolean;
    readonly: boolean;
    helpText: string;
    placeholder: string;
    emptyText: string;
    options: any;
    iconClass: string;
    valueProperty: string;
    displayProperty: string;
    iconProperty: string;
    forceSelect: boolean;
}
export declare class UITags extends BaseList {
    element: Element;
    constructor(element: Element);
    value: string;
    errors: any;
    disabled: boolean;
    readonly: boolean;
    helpText: string;
    placeholder: string;
    emptyText: string;
    options: any;
    iconClass: string;
    valueProperty: string;
    displayProperty: string;
    iconProperty: string;
    forceSelect: boolean;
    getDisplay(tag: any): any;
    addValue(val: any): void;
    removeValue(val: any): void;
    fireSelect(model?: any): void;
}
export declare class UIList extends BaseList {
    element: Element;
    constructor(element: Element);
    value: string;
    model: any;
    errors: any;
    disabled: boolean;
    readonly: boolean;
    helpText: string;
    placeholder: string;
    emptyText: string;
    options: any;
    iconClass: string;
    valueProperty: string;
    displayProperty: string;
    iconProperty: string;
    forceSelect: boolean;
}
