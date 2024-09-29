import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

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
  delete: jest.fn().mockReturnValue(of({})),
  participate: jest.fn().mockReturnValue(of({})),
  unParticipate: jest.fn().mockReturnValue(of({})),
};

const mockTeacherService = {
  detail: jest.fn().mockReturnValue(
    of({
      firstName: 'John',
      lastName: 'Doe',
    })
  ),
};

const mockRouter = { navigate: jest.fn() };

const mockMatSnackBar = { open: jest.fn() };

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
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
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    teacherService = TestBed.inject(TeacherService);
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on init', () => {
    component.ngOnInit();
    expect(sessionApiService.detail).toHaveBeenCalledWith(component.sessionId);
    expect(component.session).toBeDefined();
    expect(component.isParticipate).toBe(true);
  });

  it('should call back method', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete session', () => {
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith(component.sessionId);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in session', () => {
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
  });

  it('should unParticipate from session', () => {
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
  });
});
