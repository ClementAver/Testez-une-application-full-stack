import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jest } from '@jest/globals';

const mockActivatedRoute = {
  snapshot: {
    paramMap: convertToParamMap({ id: '1' }),
  },
};

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1,
  },
};

const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(
    of({
      id: 1,
      name: 'Session de découverte',
      users: [1, 2],
      teacher_id: 1,
      date: new Date(),
      description: 'Portes ouvertes toute la journée.',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  ),
  create: jest.fn().mockReturnValue(of({})),
  update: jest.fn().mockReturnValue(of({})),
};

const mockRouter = { navigate: jest.fn(), url: '/sessions/update/1' };

const mockMatSnackBar = { open: jest.fn() };

const createdSession = {
  name: 'Stage postnatal',
  date: '2024-09-28',
  teacher_id: '1',
  description:
    'Basé sur des postures douces, non traumatisantes pour le plancher pelvien et les abdominaux, le yoga postnatal est parfaitement adapté à la période du post partum, même après avoir subi une césarienne.',
};

const updatedSession = {
  name: 'Après-midi découverte.',
  date: new Date(),
  teacher_id: '1',
  description: 'Portes ouvertes à partir de 13 h 30.',
};

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  let router: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    sessionService.sessionInformation!.admin = false;
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form for update', () => {
    component.ngOnInit();
    expect(component.onUpdate).toBe(true);
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
  });

  it('should initialize form for create', () => {
    mockRouter.url = '/sessions/create';
    component.ngOnInit();
    expect(component.sessionForm).toBeDefined();
    // Reset (before each seamed too much for one test.)
    mockRouter.url = '/sessions/update/1';
  });

  it('should submit create form', () => {
    component.onUpdate = false;
    component.sessionForm?.setValue(createdSession);
    component.submit();
    expect(sessionApiService.create).toHaveBeenCalledWith(createdSession);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit update form', () => {
    component.onUpdate = true;
    component.sessionForm?.setValue(updatedSession);
    component.submit();
    expect(sessionApiService.update).toHaveBeenCalledWith('1', updatedSession);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
