import {Directive, Input, Output, ElementRef, Renderer, EventEmitter} from '@angular/core'

@Directive({
    selector: '[focus]'
})

export class FocusDirective {
    @Input() focus: boolean;
    @Output() onFocus: EventEmitter<void> = new EventEmitter<void>();

    constructor(private el: ElementRef, private renderer: Renderer) {
    } 

    ngOnChanges() {
        if (!!this.focus) {
            this.renderer.invokeElementMethod(this.el.nativeElement, 'focus');
            if (!!this.onFocus) {
                this.onFocus.emit();
            }
        }
    }
}