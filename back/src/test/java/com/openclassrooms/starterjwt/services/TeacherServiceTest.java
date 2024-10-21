package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    public void testFindAll() {
        List<Teacher> expectedTeachers = Arrays.asList(
                new Teacher(1L, "Xavier", "Charles", LocalDateTime.now(), LocalDateTime.now()),
                new Teacher(2L, "White", "Walter", LocalDateTime.now(), LocalDateTime.now())
        );

        when(teacherRepository.findAll()).thenReturn(expectedTeachers);

        List<Teacher> teachers = teacherService.findAll();

        verify(teacherRepository, times(1)).findAll();
        assertNotNull(teachers);
        assertEquals(expectedTeachers, teachers);
    }

    @Test
    public void testFindById() {
        long teacherId = 1L;
        Teacher expectedTeacher = new Teacher(teacherId, "Xavier", "Charles", LocalDateTime.now(), LocalDateTime.now());

        when(teacherRepository.findById(teacherId)).thenReturn(java.util.Optional.of(expectedTeacher));

        Teacher teacher = teacherService.findById(teacherId);

        verify(teacherRepository, times(1)).findById(teacherId);
        assertNotNull(teacher);
        assertEquals(expectedTeacher, teacher);
    }

}
