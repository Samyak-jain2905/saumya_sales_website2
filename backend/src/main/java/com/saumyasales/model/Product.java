package com.saumyasales.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
    @jakarta.persistence.Index(name = "idx_product_category", columnList = "category"),
    @jakarta.persistence.Index(name = "idx_product_price_numeric", columnList = "priceNumeric")
})
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nameHi;
    private String category; // Crockery, Plastic
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String imageUrl;
    private String price; // Retail Price
    private String wholesalePrice; // Base Wholesale
    private Double priceNumeric;
    private String moq;
    private String size;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PriceTier> priceTiers = new ArrayList<>();

    private String description;
    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String descriptionHi;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getNameHi() { return nameHi; }
    public void setNameHi(String nameHi) { this.nameHi = nameHi; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    public String getWholesalePrice() { return wholesalePrice; }
    public void setWholesalePrice(String wholesalePrice) { this.wholesalePrice = wholesalePrice; }
    public Double getPriceNumeric() { return priceNumeric; }
    public void setPriceNumeric(Double priceNumeric) { this.priceNumeric = priceNumeric; }
    public String getMoq() { return moq; }
    public void setMoq(String moq) { this.moq = moq; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public List<PriceTier> getPriceTiers() { return priceTiers; }
    public void setPriceTiers(List<PriceTier> priceTiers) { this.priceTiers = priceTiers; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDescriptionHi() { return descriptionHi; }
    public void setDescriptionHi(String descriptionHi) { this.descriptionHi = descriptionHi; }
}
