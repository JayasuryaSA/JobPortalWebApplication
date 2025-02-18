package com.example.springRest.config;


import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public AuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        return provider;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/register", "/login", "/createAdmin").permitAll()
                        .requestMatchers(HttpMethod.GET, "/jobPosts").authenticated()
                        .requestMatchers(HttpMethod.POST, "/jobPost").hasRole("ADMIN")  // ✅ FIXED: Use hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/jobPost/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/jobPost/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }



}
















//@Configuration
//    @EnableWebSecurity
//    public class SecurityConfig {
//
//        @Autowired
//        private UserDetailsService userDetailsService;
//
//
//        @Bean
//        public AuthenticationProvider authProvider() {
//            DaoAuthenticationProvider provider=new DaoAuthenticationProvider();
//            provider.setUserDetailsService(userDetailsService);
//            provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
//            return provider;
//        }
//
//
//
//
//
//        @Bean
//        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//            http.csrf(customizer -> customizer.disable())
//                    .authorizeHttpRequests(request -> request.anyRequest().authenticated())
//                    .httpBasic(Customizer.withDefaults())
//                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
//
//            return http.build();
//        }
//
//
//
//
//
//
//
//
//}