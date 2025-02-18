package com.example.springRest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.springRest.model.User;
import com.example.springRest.repo.UserRepo;

import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepo repo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User saveUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        //System.out.println(user.getPassword());
        return repo.save(user) ;

    }

    public boolean authenticateUser(String username, String password) {
        User user = repo.findByUsername(username);

        if (user != null && encoder.matches(password, user.getPassword())) {
            return true;
        }
        return false;


    }
    public User getUserByUsername(String username) {
        return repo.findByUsername(username);
    }

    public String createAdmin(User user) {
        User existingUser = repo.findByUsername(user.getUsername());

        if (existingUser != null) {
            return "Admin username already exists!";
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ADMIN");

        repo.save(user);
        return "success";
    }

}
