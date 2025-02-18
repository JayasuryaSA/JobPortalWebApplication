package com.example.springRest.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;


@Data
@Table(name = "users")
@Entity
public class User {

    @Id
    private String username;
    private String password;
    @Getter
    private String role;


    public void setRole(String role) {
        if (!role.startsWith("ROLE_")) {
            this.role = "ROLE_" + role.toUpperCase();
        } else {
            this.role = role;
        }
    }

}
