package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private User user;
    private Teacher teacher;
    private List<Session> sessions;

    @BeforeEach
    public void init() {
        user = new User(1L, "john.doe@mail.me", "Doe", "John", "******", false, LocalDateTime.now(), LocalDateTime.now());
        teacher = new Teacher(2L, "White", "Walter", LocalDateTime.now(), LocalDateTime.now());
        sessions = Arrays.asList(
                new Session(1L, "Session 1", new Date(), "Description 1", teacher, new ArrayList<>(), LocalDateTime.now(), LocalDateTime.now()),
                new Session(2L, "Session 2", new Date(), "Description 2", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now())
        );
    }

    @Test
    public void testCreateSession() {
        Session session = sessions.get(0);

        when(sessionRepository.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        verify(sessionRepository, times(1)).save(session);
        assertNotNull(createdSession);
        assertEquals(session, createdSession);
    }

    @Test
    public void testDeleteSession() {
        Long sessionId = 1L;


        doNothing().when(sessionRepository).deleteById(sessionId);

        sessionService.delete(sessionId);

        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    public void testFindAllSessions() {
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> foundSessions = sessionService.findAll();

        verify(sessionRepository, times(1)).findAll();
        assertNotNull(foundSessions);
        assertEquals(sessions, foundSessions);
    }

    @Test
    public void testGetSessionById() {
        Long sessionId = 1L;
        Session session = sessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(sessionId);

        verify(sessionRepository, times(1)).findById(sessionId);
        assertNotNull(foundSession);
        assertEquals(session, foundSession);
    }

    @Test
    public void testUpdateSession() {
        Long sessionId = 1L;
        Session session = sessions.get(0);
        session.setName("Updated session 1");
        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(sessionId, session);

        verify(sessionRepository, times(1)).save(session);
        assertNotNull(updatedSession);
        assertEquals(updatedSession.getName(), "Updated session 1");
    }

    @Test
    public void testParticipate() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = sessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        sessionService.participate(sessionId, userId);

        verify(sessionRepository, times(1)).save(session);
        assertTrue(session.getUsers().contains(user));
    }

    @Test
    public void testAlreadyParticipate() {
        Long sessionId = 2L;
        Long userId = 1L;
        Session session = sessions.get(1);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    public void testNoLongerParticipate() {
        Long sessionId = 2L;
        Long userId = 1L;
        Session session = sessions.get(1);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);

        verify(sessionRepository, times(1)).save(session);
        assertFalse(session.getUsers().contains(user));
    }

    @Test
    public void testNotParticipating() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = sessions.get(0);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }
}