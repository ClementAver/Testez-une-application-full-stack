import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';
import { User } from 'src/app/interfaces/user.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MeComponent } from './me.component';
import { Observable, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { jest } from '@jest/globals';

const mockUserService = {
  getById: (): Observable<User> => {
    const user: User = {
      id: 1,
      email: 'john.doe@mail.me',
      lastName: 'Doe',
      firstName: 'John',
      admin: true,
      password: '********',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return of(user);
  },
  delete: (): Observable<any> => {
    return of({});
  },
};

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1,
  },
  logOut: jest.fn(),
};

const mockMatSnackBar = { open: jest.fn() };
const mockRouter = { navigate: jest.fn() };

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user', () => {
    expect(component.user).toBeTruthy();
    expect(component.user?.email).toBe('john.doe@mail.me');
  });

  it('should go back', () => {
    const backSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should call delete and navigate away', () => {
    const deleteSpy = jest.spyOn(mockUserService, 'delete');
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');
    component.delete();
    expect(deleteSpy).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
