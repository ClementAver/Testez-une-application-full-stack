package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testFindById() {
        long userId = 1L;
        User expectedUser = new User(userId, "john.doe@mail.me", "Doe", "John", "******", false, LocalDateTime.now(), LocalDateTime.now());
        when(userRepository.findById(userId)).thenReturn(java.util.Optional.of(expectedUser));

        User user = userService.findById(userId);

        verify(userRepository, times(1)).findById(userId);
        assertNotNull(user);
        assertEquals(expectedUser, user);
    }

    @Test
    public void testDelete() {
        long userId = 1L;

        doNothing().when(userRepository).deleteById(userId);

        userService.delete(userId);

        verify(userRepository, times(1)).deleteById(userId);
    }

}
