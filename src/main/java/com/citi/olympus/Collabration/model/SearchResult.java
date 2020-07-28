package com.citi.olympus.Collabration.model;

import java.util.List;

import com.citi.olympus.Collabration.entity.PageContent;

public class SearchResult {
	
	List<PageContent> result;
	private String searchTxt;
	
	public List<PageContent> getResult() {
		return result;
	}
	
	public void setResult(List<PageContent> result) {
		this.result = result;
	}
	
	public String getSearchTxt() {
		return searchTxt;
	}
	
	public void setSearchTxt(String searchTxt) {
		this.searchTxt = searchTxt;
	}
	
	
	
}
