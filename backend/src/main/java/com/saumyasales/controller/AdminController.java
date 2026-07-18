package com.saumyasales.controller;

import com.saumyasales.model.Enquiry;
import com.saumyasales.model.Product;
import com.saumyasales.model.User;
import com.saumyasales.repository.EnquiryRepository;
import com.saumyasales.repository.ProductRepository;
import com.saumyasales.model.ShopPhoto;
import com.saumyasales.repository.ShopPhotoRepository;
import com.saumyasales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopPhotoRepository shopPhotoRepository;

    // Product Management
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productRepository.findFilteredProducts(null, null, null, null);
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        if (product.getPriceTiers() != null) {
            product.getPriceTiers().forEach(tier -> tier.setProduct(product));
        }
        return productRepository.save(product);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setCategory(productDetails.getCategory());
            product.setPrice(productDetails.getPrice());
            product.setWholesalePrice(productDetails.getWholesalePrice());
            product.setMoq(productDetails.getMoq());
            product.setSize(productDetails.getSize());
            product.setDescription(productDetails.getDescription());
            product.setImageUrl(productDetails.getImageUrl());
            
            if (productDetails.getPriceTiers() != null) {
                product.getPriceTiers().clear();
                productDetails.getPriceTiers().forEach(tier -> {
                    tier.setProduct(product);
                    product.getPriceTiers().add(tier);
                });
            }
            
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            productRepository.delete(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Inquiry Management
    @GetMapping("/enquiries")
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAllWithItems();
    }

    @DeleteMapping("/enquiries/{id}")
    public ResponseEntity<?> deleteEnquiry(@PathVariable Long id) {
        return enquiryRepository.findById(id).map(enquiry -> {
            enquiryRepository.delete(enquiry);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Shop Photo Management
    @GetMapping("/shop-photos")
    public List<ShopPhoto> getAllShopPhotos() {
        return shopPhotoRepository.findAll();
    }

    @PostMapping("/shop-photos")
    public ShopPhoto addShopPhoto(@RequestBody ShopPhoto photo) {
        return shopPhotoRepository.save(photo);
    }

    @DeleteMapping("/shop-photos/{id}")
    public ResponseEntity<?> deleteShopPhoto(@PathVariable Long id) {
        return shopPhotoRepository.findById(id).map(photo -> {
            shopPhotoRepository.delete(photo);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // User Management
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
