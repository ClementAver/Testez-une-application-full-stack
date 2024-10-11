import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { jest } from '@jest/globals';

class MockAuthService {
  login() {
    return of({ token: 'mock-token' });
  }
}

const mockSessionService = {
  logIn: jest.fn(),
  sessionInformation: {
    admin: true,
    id: 1,
  },
};

const mockRouter = { navigate: jest.fn() };

const formValue = {
  email: 'john-doe@mail.me',
  password: '********',
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: any;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on successful login', () => {
    const loginSpy = jest.spyOn(authService, 'login');
    const logInSpy = jest.spyOn(sessionService, 'logIn');

    component.form.setValue(formValue);
    component.submit();

    expect(loginSpy).toHaveBeenCalledWith(formValue);
    expect(logInSpy).toHaveBeenCalledWith({ token: 'mock-token' });
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true on login failure', () => {
    jest
      .spyOn(authService, 'login')
      .mockReturnValue(throwError(() => new Error('error')));

    component.form.setValue(formValue);
    component.submit();

    expect(component.onError).toBeTruthy();
  });
});
