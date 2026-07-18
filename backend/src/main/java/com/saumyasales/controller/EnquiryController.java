package com.saumyasales.controller;

import com.saumyasales.model.Enquiry;
import com.saumyasales.repository.EnquiryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    @Autowired
    private EnquiryRepository enquiryRepository;

    @PostMapping
    public ResponseEntity<Enquiry> createEnquiry(@Valid @RequestBody Enquiry enquiry) {
        if (enquiry.getItems() != null) {
            enquiry.getItems().forEach(item -> item.setEnquiry(enquiry));
        }
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);
        // TODO: Trigger email notification here
        return ResponseEntity.ok(savedEnquiry);
    }
}
