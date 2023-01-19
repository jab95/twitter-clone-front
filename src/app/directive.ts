import {
    Directive, HostListener
}
    from '@angular/core';

@Directive({
    selector: '[scrollTracker]'
})
export class ScrollTrackerDirective {
    @HostListener('scroll', ['$event'])
    onScroll(event) {
        // do tracking
        // Listen to click events in the component
        let tracker = event.target;

        let limit = tracker.scrollHeight - tracker.clientHeight;
        if (event.target.scrollTop === limit) {
            alert('end reached');
        }
    }

    constructor() { }
}