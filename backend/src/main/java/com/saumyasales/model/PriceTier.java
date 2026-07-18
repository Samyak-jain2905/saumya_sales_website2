package com.saumyasales.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "price_tiers")
@NoArgsConstructor
@AllArgsConstructor
public class PriceTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer minQuantity;
    private String price; // Tiered price as string e.g. "₹350"

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getMinQuantity() { return minQuantity; }
    public void setMinQuantity(Integer minQuantity) { this.minQuantity = minQuantity; }
    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
