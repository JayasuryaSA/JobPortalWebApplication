package com.example.springRest;

import com.example.springRest.model.User;
import com.example.springRest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {


    @Autowired
    private UserService service;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        } else if (!user.getRole().startsWith("ROLE_")) {
            user.setRole("ROLE_" + user.getRole().toUpperCase());
        }
        return service.saveUser(user);
    }


    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        if (service.authenticateUser(user.getUsername(), user.getPassword())) {
            User loggedInUser = service.getUserByUsername(user.getUsername());
            return Map.of(
                    "message", "Login successful!",
                    "username", loggedInUser.getUsername(),
                    "role", loggedInUser.getRole()
            );
        }
        return Map.of("error", "Invalid credentials!");
    }




    @PostMapping("/createAdmin")
    public String createAdmin(@RequestBody User user) {
        return service.createAdmin(user);

    }


    @GetMapping("/whoami")
    public ResponseEntity<String> whoAmI(Authentication authentication) {
        return ResponseEntity.ok("User: " + authentication.getName() + ", Roles: " + authentication.getAuthorities());
    }
}
