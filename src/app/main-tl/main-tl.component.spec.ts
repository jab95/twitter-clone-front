import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTlComponent } from './main-tl.component';

describe('MainTlComponent', () => {
  let component: MainTlComponent;
  let fixture: ComponentFixture<MainTlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MainTlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainTlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
