/*
* Add EventListener for Sticky Header
* class 'fixed-header' defined at 'assets/css/jekyll-theme-chirpy.scss'
*/
document.addEventListener('DOMContentLoaded', function() {
	//Find topbar by id
	var header = document.getElementById('topbar-wrapper');
	
	//Find parent of header. (for dynamic width)
	var container = null;
	
	if(header != null) {
		container = header.parentElement;
	}
	
	//update header's width. 
	//for limit header's width to parent container's width
	function updateWidth() {
		var con_width = container.offsetWidth;
		header.style.width = con_width + 'px';
	}
	
	//add scroll event. 
	//if yoffset of page is more than 100, add fixed-header class for fix header
	window.addEventListener('scroll', function() {
		if(window.pageYOffset > 100) {
			header.classList.add('fixed-header');
			updateWidth(); //update width when add class
		} else {
			header.classList.remove('fixed-header');
		}
	});
	
	//add resize event.
	//when resize, update header's width
	window.addEventListener('resize', updateWidth);
});