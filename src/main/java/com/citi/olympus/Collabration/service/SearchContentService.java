package com.citi.olympus.Collabration.service;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.citi.olympus.Collabration.entity.PageContent;
import com.citi.olympus.Collabration.model.SearchResult;

@Service
public class SearchContentService {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	
	public SearchResult searchContent(String searchTxt) {
		SearchResult toRet = new SearchResult();
		
		Query query = contructQuery(searchTxt);
		List<PageContent> pageContent = mongoTemplate.find(query, PageContent.class);
		toRet.setResult(pageContent);
		toRet.setSearchTxt(searchTxt);

		return toRet;
		
	}
	
	public Query contructQuery(String searchTxt) {
		
		//query.addCriteria(new Criteria().orOperator(Criteria.where("header").regex(".*"+search+".*","i"),Criteria.where("content").regex(".*"+search+".*","i"),Criteria.where("author").regex(".*"+search+".*","i")));
		Query query = new Query();	
		String[] queryString = searchTxt.split(" ");
		List<Criteria> criteria = new ArrayList<Criteria>();
		for(String search: queryString) {
			if(search.length() >=3 ) {				
				criteria.add(Criteria.where("header").regex(".*"+search+".*","i"));
				criteria.add(Criteria.where("content").regex(".*"+search+".*","i"));
				criteria.add(Criteria.where("author").regex(".*"+search+".*","i"));
			}
		}
		query.addCriteria(new Criteria().orOperator(criteria.toArray(new Criteria[criteria.size()])));
		return query;
	}
}
