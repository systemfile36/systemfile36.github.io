---
title: Customize Log - 본문 내의 목차(TOC) 레이아웃
date: 2024-08-25 20:00:00 +0900
categories: [Blogging, Customize log]
tags: [js, css, customize, javascript, toc]
description: 오른쪽에 표시되는 TOC와 별도로, 본문에 포함할 TOC를 만드는 과정 기록
media_subpath: /assets/img/toc_example/
---

## 목적 

본 블로그에는 각 헤딩 태그(`h2`, `h3`, `h4`...)를 기반으로 마크다운 `##`으로 생성된 
문단 제목등을 모아서 링크로 정리해놓은 TOC가 존재한다. 

![toc_example](toc_example.png){: width="251" height="228"}
_우측 사이드바에 존재하는 TOC의 모습_

이는 해당 post가 어떤 내용으로 구성되어 있는지 한눈에 볼 수 있게 해줄 뿐만 아니라, 
링크를 통해 원하는 항목으로 바로 이동할 수 있게 해주는 아주 편리한 기능이다.

하지만 해당 TOC는 우측 사이드 바에 존재하기 때문에, 브라우저 창의 폭을 좁히거나 
모바일 환경과 같이 화면 크기 자체가 좁다면 표시되지 않는다. 즉, **모바일 환경에서는 사용할 수 없다.**
이는 모바일 환경에서의 post 탐색을 불편하게 한다.

이를 해결하기위해 우측 사이드바에 있는 TOC와는 별도로 본문에 포함될 TOC를 별도로 만들고자 하는 것이 목적이다.

## 구현

이미 있는 레이아웃에 JavaScript로 스타일만 추가/제거하면 되던 이전 글과는 달리, 
이것은 새로운 HTML을 만들어야 한다. 하지만 `default.html`이나 `post.html`과 같은 레이아웃 파일에 
직접 HTML코드를 작성하고 JavaScript를 포함시키는 것은 모듈화가 이루어지지 않아 관리가 어렵기에 좋지 않은 선택이다. 
따라서 Liquid의 `include`를 사용하여 필요한 곳에서 추가할 레이아웃 형태로 만들고자 한다. 
각 헤딩 태그를 인식하여 목록에 추가하는 것은 JavaScript의 `querySelectorAll`과 같은 함수를 활용한다. 
이를 위해 진행할 과정은 아래와 같다. 

1. `include`로 포함될 `html`파일 작성.
2. 해당 레이아웃에 헤딩 항목들을 동적으로 추가해줄 `js`파일 작성.
3. 스타일을 정의할 `scss` 파일 작성.
4. 작성한 레이아웃을 `post.html`에 추가하여 적용

단계별로 알아보자. 

### 레이아웃으로 사용할 HTML 파일 작성

TOC의 기본 틀이 될 HTML 파일이다. 먼저 파일 내용을 보자. 

{% raw %}
```html
<!-- In page TOC. -->
<!-- Check '/assets/js/in_page_toc.js' for logic -->
<section id="in_page_toc-wrapper" class="ps-0 pe-4">
	<!--Flex box for align elements(heading, toggle). check in_page_toc.scss -->
	<div class="in_page_toc-header">
		<h2 data-toc-skip id="in_page_toc-title" class="panel-heading ps-3 mb-2">Contents</h2>
		<!-- Toggle button for toggle in_page_toc. check btnToggle.scss -->
		{% include btnToggle.html %}
	</div>
   <nav id="in_page_toc">
	<ul id="in_page_toc-list" class="toc-list"></ul> <!-- <li> elements will be added by script -->
   </nav>
 </section>
 
 <script src="{{ '/assets/js/in_page_toc.js' | relative_url }}"></script>
```
{: file='in_page_html' }
{% endraw %}

(`<div class="in_page_toc-header">`와 `btnToggle.html`을 `include`하는 부분은 일단 해당 글에서는 무시한다. 
해당 내용은 다음 글에서 다룬다.) 

기본적으로 이미 존재하는 `toc.html`의 구조를 참고하여 작성하였다. 기본 틀은 거의 그대로 가져왔다.
충돌을 피하기위해 id나 class는 조금씩 다르게 설정한 부분도 있다. 

주요 로직은 JavaScript로 구현하므로 해당 파일의 구조는 심플하다. 
- `#in_page_toc-wrapper section`는 단순 구획 요소로 TOC를 담는 컨테이너 역할을 한다. 
- `#in_page_toc-title h2`는 단순히 목차의 제목이다. 
- `#in_page_toc nav`는 페이지 내의 링크를 보여주는 구획을 나타내는 구획 요소이다. 
- `#in_page_toc-list ul`은 JavaScript를 통해 실제 목차 요소가 추가될 영역이다. 

그리고 `<script>` 태그로 로직을 구현할 JavaScript 파일을 포함시킨다. 

이제 해당 HTML파일을 `_includes`디렉터리에 위치시킨다.

### 주요 로직을 담은 JavaScript 파일 작성

이제 실제로 각 문단의 제목을 인식하여 목록에 추가하는 코드를 작성한다. 먼저 파일의 내용을 보자.

```javascript
/*
* Add EventListener for in_page_toc
* in_page_toc: TOC that will be included in post
* layout : go to '_includes' directory and find 'in_page_toc.html'
*/

//if number of toc items more than this, collapse toc
const TOC_EXPAND_THRESHOLD = 10;

document.addEventListener('DOMContentLoaded', function() {
	
	//Find content container for limit range of searching headings
	var content = document.querySelector('.content');
	
	//Find TOC elements
	var toc = document.querySelector('#in_page_toc-list');
	
	//Find toggle button that located at toc-header
	var tocToggle = document.querySelector('.in_page_toc-header .toggle input');
	
	//if statement for null check
	if (content && toc) {
		//Find all headings by querySelectorAllgit 
		//if some heading has 'data-toc-skip' attribute, skip them
		var headings = content.querySelectorAll('h2:not([data-toc-skip]), h3:not([data-toc-skip]), h4:not([data-toc-skip]), h5:not([data-toc-skip])');

	headings.forEach((heading) => {
		//Set level by tagName. 
		var level = parseInt(heading.tagName.charAt(1));
		
		//create <li> tag for add to toc(<ul>)
		var tocItemParent = document.createElement('li');
	  
		//create <a> tag for link and headings text
		var tocItem = document.createElement('a');
		tocItem.textContent = heading.textContent;
		
		//replace whitespace and '%20' to '-'. for match to headings id
		var href = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/%20/g, '-');
		
		//set href, and display to 'block'
		tocItem.href = `#${href}`;
		tocItem.style.display = 'block';
		
		//indent by level
		tocItem.style.marginLeft = `${(level - 2) * 20}px`;
		
		//add to layout
		tocItemParent.appendChild(tocItem);
		toc.appendChild(tocItemParent);
	});
	
	//if height of toc is too long, collapse toc when loaded
	if(headings.length > TOC_EXPAND_THRESHOLD) {
		toc.style.display = 'none';
		tocToggle.checked = false;
	}
	
	//add toggle event to tocToggle
	//when checkbox input changed, change display
    tocToggle.addEventListener('change', function() {
		//check checkbox is checked and toggle ('none' <-> 'block')
		if (tocToggle.checked) {
			toc.style.display = 'block';
		} else {
			toc.style.display = 'none';
		}
    });
	
  }
});
```
{: file='in_page_toc.js' }

(마찬가지로, `tocToggle`변수와 관련된 부분은 해당 글에서는 무시한다. 해당 내용은 다음 글에서 다룬다.)

이전 글에서와 마찬가지로 `DOMContentLoaded` 이벤트에 리스너를 추가하여 로드 시점에 필요한 초기화 작업을 수행하게 하였다. 
이제 하나하나 살펴보자. 아래의 코드는 필요한 변수를 할당하는 과정이다. 

```javascript
......
//Find content container for limit range of searching headings
var content = document.querySelector('.content');
	
//Find TOC elements
var toc = document.querySelector('#in_page_toc-list');
	
//Find toggle button that located at toc-header
var tocToggle = document.querySelector('.in_page_toc-header .toggle input');
......
```

`querySelector`와 CSS 선택자를 통해 필요한 요소들을 찾는다. 이때 각 변수의 목적은 아래와 같다.

- `content` : 검색 범위를 본문에 한정하기 위한 부분이다. 개발자 도구등을 통해 분석해보면, 본문은 `<div class="content">` 구획으로 정의된 것을 알 수 있다.
- `toc` : `<li>` 요소를 추가하여 실제 목록을 만들기 위한 요소이다. 
- `tocToggle` : 토글 버튼이다. 이에 대한 내용은 해당 글에서는 생략하고, 다음 글에서 다룬다.

아래의 코드는 `querySelectorAll`을 통해 모든 해딩 태그를 찾아서 `headings`에 할당하는 코드이다.

```javascript
//Find all headings by querySelectorAllgit 
//if some heading has 'data-toc-skip' attribute, skip them
var headings = content.querySelectorAll('h2:not([data-toc-skip]), h3:not([data-toc-skip]), h4:not([data-toc-skip]), h5:not([data-toc-skip])');
```

모든 `h2, h3, h4, h5` 요소를 찾지만, `data-toc-skip` 속성을 가진 요소는 제외하고 선택하는 코드이다. 
이는 IAL이나 사전 정의를 통해 TOC에 포함되지 않길 원하는 요소(예를 들어, 목차의 제목)가 TOC에 포함되는 것을 막기 위함이다.

아래의 코드는 위에서 할당한 `headings` 리스트를 순회하며 요소를 추가하는 과정이다. 

```javascript
headings.forEach((heading) => {
	//Set level by tagName. 
	var level = parseInt(heading.tagName.charAt(1));
		
	//create <li> tag for add to toc(<ul>)
	var tocItemParent = document.createElement('li');
	  
	//create <a> tag for link and headings text
	var tocItem = document.createElement('a');
	tocItem.textContent = heading.textContent;
		
	//replace whitespace and '%20' to '-'. for match to headings id
	var href = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/%20/g, '-');
		
	//set href, and display to 'block'
	tocItem.href = `#${href}`;
	tocItem.style.display = 'block';
		
	//indent by level
	tocItem.style.marginLeft = `${(level - 2) * 20}px`;
		
	//add to layout
	tocItemParent.appendChild(tocItem);
	toc.appendChild(tocItemParent);
});
```

`forEach`와 람다식을 통해 순회한다. 

`level`에는 `parseInt()`를 통해 `h2`, `h3`와 같은 헤딩 태그에서 숫자 부분만을 정수로 변환하여 할당한다. 
이는 뒤의 코드에서 헤딩 태그의 숫자를 기반으로 계층화된 목차를 만들기 위함이다. 

그리고 `tocItemParent`에 `createElement()`를 통해 `<li>`요소를 추가한다. 
이는 `<ul>`요소 아래에 추가되는 리스트 내용 요소이다. 

`tocItem`은 `<li>`요소의 child로 추가되어 실제 텍스트를 포함한 링크가 될 `<a>`요소이다. 
제목을 표시하기 위해 `textContent`를 헤딩의 `textContent`와 일치 시킨다.

아래의 코드는 `href`변수에 링크로 사용하기 위해 헤딩의 `textContent`를 할당하는 부분이다.

```javascript
//replace whitespace and '%20' to '-'. for match to headings id
var href = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/%20/g, '-');
```

이때, `toLowerCase()`를 통해 소문자로 만드는 것을 볼 수 있다. 
또한, `replace`와 정규표현식을 사용하여 하나 이상의 공백(`\s`, `%20`)을 `-`로 치환하는 것도 볼 수 있다.
이는 기존의 TOC가 각 헤딩 태그에 추가하는 `<a>`태그의 링크 생성 규칙에 맞추기 위함이다. 

이후 할당한 링크를 `$`표현식을 사용해 `tocItem.href`에 `#`을 앞에 붙인 채 할당한다.
그리고 `display`속성을 `block`으로 하여 블록 형태로 표시가 되도록 스타일을 설정한다. 

아래 코드는 위에서 헤딩 태그의 숫자 부분만을 추출한 `level`변수를 이용해 계층화된 목차를 만들기 위해, 
`marginLeft`를 설정하여 indent하는 과정이다.

```javascript
//indent by level
tocItem.style.marginLeft = `${(level - 2) * 20}px`;
```

연산식을 보면 알 수 있듯이, `h2`일 때 0이 되고, 이후 `h3`, `h4`로 갈 수록 `20px`씩 밀려서 
레벨에 따라 들여쓰기를 한 것처럼 보이게 하는 과정이다.

마지막으로 생성한 요소를 `appendChild()`를 통해 실제 TOC에 `<li><a/></li>`구조로 추가하는 것으로, 
반복문 내의 람다식 내용은 끝이다. 이후 반복을 통해 모든 항목들이 TOC에 추가될 것이다.

아래의 코드는 로드 시 TOC가 펼처진 상태로 로드될지, TOC가 접힌 상태로 로드될지를 판단하는 부분이다. 

```javascript
//if height of toc is too long, collapse toc when loaded
if(headings.length > TOC_EXPAND_THRESHOLD) {
	toc.style.display = 'none';
	tocToggle.checked = false;
}
```

`TOC_EXPAND_THRESHOLD` 상수를 통해 정의한 임계값을 기준으로, 
해당 값을 넘으면 접힌 상태로, 그렇지 않으면 기본적으로 펼쳐진 상태로 로드되게 하였다.

이는 항목이 너무 많아서 TOC가 길어지면 가독성이 떨어질 것을 우려한 조치이다. 


### 스타일을 정의할 SCSS 파일 작성

스타일을 정의하기 위한 별도의 scss파일을 작성하였다. 사실, 이정도 양이면 별도의 파일 대신, 
직접 커스터마이징 scss 파일에 작성하여도 되지만 후에 좀 더 추가하거나 수정할 때를 대비하여 별도로 작성하였다. 

```css
/* in_page_toc style */
#in_page_toc-list li {
	list-style: none;
}

#in_page_toc-list li a {
	color: currentColor;
}
```
{: file='in_page_toc.scss' }

`#in_page_toc-list`의 하위에 있는 `li` 요소에 `list-style: none;`으로 함으로서, 
`ul`, `li`에 기본적으로 표시되는 불릿 포인트와 같은 것들을 제거하고 단순히 블록으로 표시되게 한다. 

또한 `li`아래에 있는 `a`태그의 텍스트 생상을 `color: currentColor;`로 함으로서, 
부모 요소에 정의된 색상을 상속받아 사용한다. 즉, 페이지의 기본 글 색과 통일하겠다는 뜻이다. 
기본적인 링크 텍스트의 색상인 푸른색이 마음에 들지 않아서 이렇게 했다.

이제 이렇게 작성한 scss파일을 적용하기 위해 `/assets/css/jekyll-theme-chirpy.scss`에 
`@import`로 포함시킨다. 

```css
......
/* import in_page_toc for styling in_page_toc */
@import 'in_page_toc';
......
```
{: file='jekyll-theme-chirpy.scss' .nolineno }

### 작성한 레이아웃 적용하기

이제 작성한 레이아웃을 실제로 업로드될 post에 포함시킬 차례이다. 
post를 작성할 때마다 `include`태그를 통해 포함시킬 수도 있지만, 그건 너무 귀찮고 누락될 수도 있다. 
그래서 post의 레이아웃 파일 자체에 포함시킴으로서 모든 post에 적용되게 할 것이다. 

단순히 `include`태그로 `in_page_toc.html`을 포함시키는 코드를 적절한 위치에 삽입하면 된다.


{% raw %}
```html
......
<div class="content">
	<!-- in_page_toc -->
	{% include in_page_toc.html %}
	
	{{ content }}
</div>
......
```
{: file='post.html' .nolineno }
{% endraw %}

`.content div`에 본문이 포함될 것이므로 맨 위에 포함시켰다. 

## 결과

(버튼은 다음 글에서 다룬다. 일단 무시하자.)

아래와 같이 적절하게 표시되는 것을 알 수 있다.

![in_page_toc_example_expand](in_page_toc_example_expand.png){: width="690" height="460"}
_TOC가 펼쳐진 상태로 로드된 모습_

또한 항목 개수가 10개를 넘으면 아래와 같이 접힌 상태로 로드되는 것을 알 수 있다.

![in_page_toc_example_collapse](in_page_toc_example_collapse.png){: width="690" height="460"}
_TOC가 접힌 상태로 로드된 모습_

