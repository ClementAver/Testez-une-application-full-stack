package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import com.jayway.jsonpath.JsonPath;

import java.util.Date;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long createdSessionId;

    private String obtainAccessToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("jean-dupont@mail.me");
        loginRequest.setPassword("test!1234");

        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequestJson))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        return JsonPath.read(response, "$.token");
    }

    @Test
    @Order(1)
    public void testCreateSession() throws Exception {
        String token = obtainAccessToken();

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Session de découverte");
        sessionDto.setDescription("Portes ouvertes toute la journée.");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);

        String sessionDtoJson = objectMapper.writeValueAsString(sessionDto);

        MvcResult result = mockMvc.perform(post("/api/session")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionDtoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session de découverte"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        createdSessionId =  ((Number) JsonPath.read(response, "$.id")).longValue();
    }

    @Test
    @Order(2)
    public void testFindAllSessions() throws Exception {
        String token = obtainAccessToken();

        mockMvc.perform(get("/api/session")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(createdSessionId));
    }

    @Test
    @Order(3)
    public void testGetSessionById() throws Exception {
        String token = obtainAccessToken();

        mockMvc.perform(get("/api/session/" + createdSessionId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdSessionId));

        mockMvc.perform(get("/api/session/" + 2)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());

        mockMvc.perform(get("/api/session/" + 'a')
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(4)
    public void testUpdateSession() throws Exception {
        String token = obtainAccessToken();

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Après-midi découverte.");
        sessionDto.setDescription("Portes ouvertes à partir de 13 h 30.");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);


        String sessionDtoJson = objectMapper.writeValueAsString(sessionDto);


        mockMvc.perform(put("/api/session/" + createdSessionId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionDtoJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name")
                        .value("Après-midi découverte."));

        mockMvc.perform(put("/api/session/" + 'a')
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionDtoJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(5)
    public void testParticipateInSession() throws Exception {
        String token = obtainAccessToken();

        mockMvc.perform(post("/api/session/" + createdSessionId + "/participate/2")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/session/" + createdSessionId + "/participate/a")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(6)
    public void testNoLongerParticipateInSession() throws Exception {
        String token = obtainAccessToken();

        mockMvc.perform(delete("/api/session/"  + createdSessionId + "/participate/2")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/session/"  + createdSessionId + "/participate/a")
                        .header("Authorization", "Bearer " + token))
         .andExpect(status().isBadRequest());
    }

    @Test
    @Order(7)
    public void testDeleteSession() throws Exception {
        String token = obtainAccessToken();

        mockMvc.perform(delete("/api/session/" + createdSessionId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/session/" + 2)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/session/" + 'a')
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }
}