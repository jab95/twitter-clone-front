import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscribirTweetComponent } from './escribir-tweet.component';

describe('EscribirTweetComponent', () => {
  let component: EscribirTweetComponent;
  let fixture: ComponentFixture<EscribirTweetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EscribirTweetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscribirTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
