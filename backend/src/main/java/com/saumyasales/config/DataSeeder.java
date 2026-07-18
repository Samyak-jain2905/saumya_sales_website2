package com.saumyasales.config;

import com.saumyasales.model.PriceTier;
import com.saumyasales.model.Product;
import com.saumyasales.model.User;
import com.saumyasales.repository.ProductRepository;
import com.saumyasales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository, UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("saumyasales2020@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("saumyasales2020@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setName("Admin");
                admin.setBusinessName("Saumya Sales HQ");
                admin.setPhone("7489470244");
                admin.setRole("ADMIN");
                admin.setVerified(true);
                userRepository.save(admin);
            }
        };
    }
}
