/*
* Add EventListener for in_page_toc
* in_page_toc: TOC that will be included in post
* layout : go to '_includes' directory and find 'in_page_toc.html'
*/

document.addEventListener('DOMContentLoaded', function() {
	
	//Find content container for limit range of searching headings
	var content = document.querySelector('.content');
	
	//Find TOC elements
	var toc = document.querySelector('#in_page_toc-list');
	var tocToggle = document.querySelector('#in_page_toc-toggle');
	
	//if statement for null check
	if (content && toc) {
		//Find all headings by querySelectorAllgit 
		//if some heading has 'data-toc-skip' attribute, skip them
		var headings = content.querySelectorAll('h2:not([data-toc-skip]), h3:not([data-toc-skip]), h4:not([data-toc-skip]), h5:not([data-toc-skip])');
		
		//For headings level
		var tocTree = {};

	headings.forEach((heading, index) => {
		//Set level by tagName. 
		var level = parseInt(heading.tagName.charAt(1));
		
		//create <li> tag for add to toc(<ul>)
		var tocItemParent = document.createElement('li');
	  
		//create <a> tag for link and headings text
		var tocItem = document.createElement('a');
		tocItem.textContent = heading.textContent;
		
		//replace whitespace and '%20' to '-'. for match to headings id
		var href = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/%20/g, '-');
		tocItem.href = `#${href}`;
		tocItem.style.display = 'block';
		
		//indent by level
		tocItem.style.marginLeft = `${(level - 2) * 20}px`;
		
		//add to layout
		tocItemParent.appendChild(tocItem);
		toc.appendChild(tocItemParent);
	});
	
	//add toggle event to tocToggle
    tocToggle.addEventListener('click', function() {
		//check display and toggle ('none' <-> 'block')
		if (toc.style.display === 'none') {
			tocToggle.textContent = 'Contents-ON'
			toc.style.display = 'block';
		} else {
			tocToggle.textContent = 'Contents-OFF'
			toc.style.display = 'none';
		}
    });
	
  }
});