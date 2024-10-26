import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { jest } from '@jest/globals';

class MockAuthService {
  register() {
    return of({});
  }
}

const mockRouter = { navigate: jest.fn() };

const formValue = {
  email: 'john-doe@mail.me',
  firstName: 'John',
  lastName: 'Doe',
  password: '********',
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // <-> 
  it('should call register and navigate on successful registration', () => {
    const registerSpy = jest.spyOn(authService, 'register');

    component.form.setValue(formValue);
    component.submit();

    expect(registerSpy).toHaveBeenCalledWith(formValue);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // <-> 
  it('should set onError to true on registration failure', () => {
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('error')));

    component.form.setValue(formValue);
    component.submit();

    expect(component.onError).toBeTruthy();
  });
});
