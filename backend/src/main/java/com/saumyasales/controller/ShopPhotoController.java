package com.saumyasales.controller;

import com.saumyasales.model.ShopPhoto;
import com.saumyasales.repository.ShopPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shop-photos")
public class ShopPhotoController {

    @Autowired
    private ShopPhotoRepository shopPhotoRepository;

    @GetMapping
    public List<ShopPhoto> getShopPhotos() {
        return shopPhotoRepository.findAll();
    }
}
