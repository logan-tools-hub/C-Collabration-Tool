package com.citi.olympus.Collabration.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.citi.olympus.Collabration.entity.PageContent;

@Repository
public interface PageContentRepo extends MongoRepository<PageContent, Long>{

	public PageContent findByHeader(String header);
}
