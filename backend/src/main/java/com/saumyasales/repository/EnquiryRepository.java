package com.saumyasales.repository;

import com.saumyasales.model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT e FROM Enquiry e LEFT JOIN FETCH e.items ORDER BY e.createdAt DESC")
    java.util.List<Enquiry> findAllWithItems();
}
