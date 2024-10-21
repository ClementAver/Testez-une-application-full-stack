package com.openclassrooms.starterjwt.controllers;import com.fasterxml.jackson.databind.ObjectMapper;import com.openclassrooms.starterjwt.payload.request.LoginRequest;import com.openclassrooms.starterjwt.payload.request.SignupRequest;import org.junit.jupiter.api.Order;import org.junit.jupiter.api.Test;import org.springframework.beans.factory.annotation.Autowired;import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;import org.springframework.boot.test.context.SpringBootTest;import org.springframework.http.MediaType;import org.springframework.test.context.ActiveProfiles;import org.springframework.test.context.TestPropertySource;import org.springframework.test.web.servlet.MockMvc;import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;@SpringBootTest@AutoConfigureMockMvc@ActiveProfiles("test")@TestPropertySource(locations = "classpath:application.properties")public class AuthControllerTest {    @Autowired    private MockMvc mockMvc;    @Autowired    private ObjectMapper objectMapper;    @Test    @Order(1)    public void testRegister() throws Exception {        SignupRequest signupRequest = new SignupRequest();        signupRequest.setEmail("john.doe@mail.me");        signupRequest.setFirstName("John");        signupRequest.setLastName("Doe");        signupRequest.setPassword("devine");        String signupRequestJson = objectMapper.writeValueAsString(signupRequest);        mockMvc.perform(post("/api/auth/register")                        .contentType(MediaType.APPLICATION_JSON)                        .content(signupRequestJson))                .andExpect(status().isOk())                .andExpect(jsonPath("$.message").value("User registered successfully!"));        mockMvc.perform(post("/api/auth/register")                        .contentType(MediaType.APPLICATION_JSON)                        .content(signupRequestJson))                .andExpect(status().isBadRequest())                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));    }    @Test    @Order(2)    public void testLogin() throws Exception {        LoginRequest loginRequest = new LoginRequest();        loginRequest.setEmail("yoga@studio.com");        loginRequest.setPassword("test!1234");        String loginRequestJson = objectMapper.writeValueAsString(loginRequest);        mockMvc.perform(post("/api/auth/login")                        .contentType(MediaType.APPLICATION_JSON)                        .content(loginRequestJson))                .andExpect(status().isOk())                .andExpect(jsonPath("$.username").value("yoga@studio.com"))                .andExpect(jsonPath("$.admin").value(true));        loginRequest.setEmail("john-doe@mail.me");        loginRequestJson = objectMapper.writeValueAsString(loginRequest);        mockMvc.perform(post("/api/auth/login")                        .contentType(MediaType.APPLICATION_JSON)                        .content(loginRequestJson))                .andExpect(status().isUnauthorized())                .andExpect(jsonPath("$.message").value("Bad credentials"));    }}