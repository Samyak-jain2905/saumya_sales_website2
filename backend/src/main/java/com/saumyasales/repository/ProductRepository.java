package com.saumyasales.repository;

import com.saumyasales.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.priceTiers WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.priceNumeric >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.priceNumeric <= :maxPrice) AND " +
           "(CAST(:size AS string) IS NULL OR p.size LIKE CONCAT('%', CAST(:size AS string), '%'))")
    List<Product> findFilteredProducts(
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("size") String size
    );
}
