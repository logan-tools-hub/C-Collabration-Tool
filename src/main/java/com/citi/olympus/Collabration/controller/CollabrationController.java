package com.citi.olympus.Collabration.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.citi.olympus.Collabration.entity.PageContent;
import com.citi.olympus.Collabration.model.SearchResult;
import com.citi.olympus.Collabration.repository.PageContentRepo;
import com.citi.olympus.Collabration.service.SearchContentService;


@RestController
public class CollabrationController {

	public static String COLL_HOME = "pages/home";
	public static String CONTENT_PAGE = "pages/contentPage";
	public static String PAGE = "pages/page";
	
	
	@Autowired
	private PageContentRepo pageRepo;
	
	@Autowired
	private SearchContentService searchContentService;
	
	@GetMapping("ping")
	public String ping() {
		return "Collabration site responding properly : " + System.currentTimeMillis() ;
	}
	
	@GetMapping(value = {"/","/home"})
	public ModelAndView home() {
		ModelAndView view = new ModelAndView();
		view.setViewName(CollabrationController.COLL_HOME);
		return view;
	}
	
	@GetMapping("page/content")
	public ModelAndView contentPage() {
		ModelAndView view = new ModelAndView();
		view.setViewName(CollabrationController.CONTENT_PAGE);
		return view;
	}
	
	@PostMapping("/page/save")
	public Object createPage(@RequestBody PageContent content) {
		String header = content.getHeader();
		PageContent isExist = pageRepo.findByHeader(header);
		if(isExist == null) {
			long count = pageRepo.count();
			content.set_id(count+1);
			PageContent toRet  = pageRepo.save(content);
			return toRet;
		}
		
		return "Page already exist!";
	}
	
	@PostMapping("/page/update/{id}")
	public String updatePage(@RequestBody PageContent newContent,
							@PathVariable(name = "id") long id) {		
		
		Optional<PageContent> pageContent = pageRepo.findById(id);
		PageContent content =  pageContent.get();
		content.setAuthor(newContent.getAuthor());
		content.setContent(newContent.getContent());
		content.setHeader(newContent.getHeader());
		pageRepo.save(content);
		
		return "success";
	}
	
	@GetMapping("/page/{id}")
	public ModelAndView getPage(@PathVariable(name = "id") String id) {		
		
		ModelAndView view = new ModelAndView();
		view.setViewName(CollabrationController.PAGE);
		view.addObject("pageId", id);
		return view;
	}
	
	@GetMapping("/page/render/{header}")
	public PageContent getPageContent(@PathVariable(name = "header") String header) {		

		System.out.println("Header: "+ header);
		PageContent content = pageRepo.findByHeader(header);
		return content;
	}
	
	@GetMapping("/search")
	@CrossOrigin
	public ResponseEntity<SearchResult> searchItem(@RequestParam(value = "search") String searchTxt) {
		
		SearchResult toRet = null;
		toRet = searchContentService.searchContent(searchTxt);
		return new ResponseEntity<>(toRet, HttpStatus.OK);
	}
}
