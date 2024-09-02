---
title: Customize Log - 상단바 고정
date: 2024-08-25 20:00:00 +0900
categories: [Blogging, Customize log]
tags: [js, css, customize, javascript]
description: 스크롤 시, 상단바를 화면 상단으로 고정시키기 위해 사용한 방법들 기록
---

## 목적

다양한 사이트에서, 메뉴나 검색버튼과 같은 것들을 포함한 헤더를 찾아볼 수 있다. 

해당 블로그에도 그러한 헤더가 존재한다. 화면의 크기에 반응하여 폭이 일정이상이라면 
아래와 같이 현재 post의 타이틀과 검색 창을 보여준다. 


![example_wide](/assets/img/topbar_example/topbar_example_wide.png){: width='816' height='58' }
_폭이 넓을 때의 상단바_

폭이 일정 이하라면, 아래와 같이 사이드바 토글 버튼과 검색 버튼만 남는다. 


![example_non_wide](/assets/img/topbar_example/topbar_example_non_wide.png){: width='816' height='58' }
_폭이 좁을 때의 상단바_

하지만 아래와 같이 스크롤을 내리면 상단바는 따라오지 않고 그자리에 있기 때문에 보이지 않게 된다.

![example_non_fixed](/assets/img/topbar_example/topbar_example_non_fixed.png){: width='816' height='58' }
_스크롤을 내려서 보이지 않게 된 상단바_

이렇게 되면 검색 버튼과 같은 상단바의 기능을 사용하기 위해서는 문서 최상단으로 이동해야 하는 불편함이 생긴다. 

화면이 넓은 PC나 태블릿이라면 왼편의 사이드바와 오른편의 TOC가 문서 탐색을 도와주어 조금 덜 불편하겠지만, 
화면이 좁은 모바일 환경이라면 사이드바 토글 키를 사용할 수 없어 탐색이 어렵고 귀찮아진다. 

이를 위해 상단바를 상단에 고정시키는 기능을 추가하기로 하였다.

## 구현

상단바를 고정시키는 것에는 다양한 방법이 있겠지만, 제일 간단한 것은 상단바의 요소의 CSS에 
`position: fixed`를 추가하는 것이다. 
이 속성이 추가되면 기본적으로 상단바가 반투명한 오버레이 상태로 사용자 화면 상단에 존재하게 된다.
이렇게하는 것만으로도 상단바를 항상 상단에 고정되게 하는 목적은 달성가능하다. 

하지만 이렇게 하면 스크롤에 상관없이 항상 상단바가 오버레이 상태로 있게 된다. 
이렇게되면 제목 등과 같은 문서 최상단의 요소들이 항상 오버레이된 상단바에 조금 가려지게 된다.
물론 반투명하기에 안보이는 것은 아니지만 시각적으로 거슬린다. 

따라서, 스크롤을 일정 이상 내리면 `fixed`되고, 그렇지 않을 때에는 기본 상태로 있게 할 필요가 있다. 
이를 위해 JavaScript를 이용해 동적으로 스타일을 수정하는 방법을 사용한다. 

### JavaScript 코드 작성

먼저, 이를 구현하기 위한 JavaScript파일을 생성한다. 필자는 `/assets/js`{: .filepath } 디렉터리에 `topbar_sticky.js`{: filepath } 라는 이름으로
생성하였다. 그리고 아래와 같은 코드를 작성하였다.

```javascript
/*
* Add EventListener for Sticky Header
* class 'fixed-header' defined at 'assets/css/jekyll-theme-chirpy.scss'
*/
document.addEventListener('DOMContentLoaded', function() {
	//Find topbar by id
	var header = document.getElementById('topbar-wrapper');
	
	//Find parent of header. (for dynamic width)
	var container = header.parentElement;
	
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
``` 
{: file='topbar_sticky.js' }
이제 코드를 하나하나 살펴보자.


```javascript
document.addEventListener('DOMContentLoaded', function() { ......
```

위 코드는 `DOMContentLoaded` 이벤트의 리스너로 상단바 고정을 위한 로직을 추가하는 과정이다. 
`DOMContentLoaded`이벤트는 HTML 구문 분석이 끝나고 돔트리가 완성된 시점에 발생한다. 
고정 로직을 해당 이벤트에 리스너로 추가하는 이유는, 후에 작성할 코드들이 모든 페이지에 적용되게 하기 위함이다. 
또한, 돔트리가 완성된 시점에서 발생하는 해당 이벤트를 사용하면 DOM이 로드되지 않았을 때 요소를 탐색하여 
오류가 발생하는 경우를 현저히 줄일 수 있기 때문이기도 하다. 

이하 코드들은 모두 이 이벤트 리스너에 들어갈 함수의 내용이다.

```javascript
//Find topbar by id
var header = document.getElementById('topbar-wrapper');
	
//Find parent of header. (for dynamic width)
var container = header.parentElement;
```

필요한 요소들을 찾아서 각 변수에 할당한다. 이때 `container`에 `header`(topbar)의 부모 요소를 찾아서 넣은 이유는, 
상단바가 상위 컨테이너의 범위를 벗어나는 경우를 막기 위함이다. 이에 대한 로직은 아래의 함수를 보면 알 수 있다.


```javascript
//update header's width. 
//for limit header's width to parent container's width
function updateWidth() {
	var con_width = container.offsetWidth;
	header.style.width = con_width + 'px';
}
```

보다시피, `header`의 넓이를 상위 요소인 `container`의 넓이로 고정하는 함수이다. 


```javascript
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
```
위의 코드가 상단바를 고정시키기 위한 로직이다. `window`의 `scroll`이벤트에 리스너를 추가한다. 
스크롤 될때마다 실행되어 `if`문을 통해 현재 페이지의 `pageYOffset`이 `100`을 초과하였다면, 즉 스크롤을 일정 이상 내려서
상단바가 보이지 않을 위치까지 내려갔다면  
`header`의 CSS 클래스에 `fixed-header`를 추가하여 화면 상단에 고정시킨다.(해당 클래스의 내용은 후술한다.)
만약 초과하지 않았다면, `fixed-header`클래스를 제거하여 기본상태로 되돌린다. 


```javascript
//add resize event.
//when resize, update header's width
window.addEventListener('resize', updateWidth);
```

마지막으로 `window`의 `resize`이벤트에 `updateWidth` 함수를 리스너로 추가한다. 
이를 통해 창 사이즈가 조절되었을 때에도 상단바의 크기를 상위 컨테이너의 폭으로 고정할 수 있다. 

위의 코드를 통해 일어나는 일들은 아래와 같다.

문서가 로드되었을 때: 
1. `DOMContentLoaded` 이벤트 발생 
2. 이벤트 리스너가 실행된다.
3. `window`의 `scroll`이벤트에 리스너가 추가된다. 
4. `window`의 `resize`이벤트에 리스너가 추가된다.


스크롤을 내렸을 때: 
1. `window`의 `scroll`이벤트 발생
2. 이벤트 리스너가 실행된다.
3. `pageYOffset`을 읽어서 `100`이상이라면 `fixed-header` 클래스 추가 후 사이즈 조정, 
그렇지 않으면 `fixed-header` 제거

### CSS 파일에 클래스 추가

CSS 클래스를 추가하고 제거하는 과정을 작성하였으니, 이제 추가할 클래스를 정의해야 한다. 
[chirpy의 공식 문서](https://chirpy.cotes.page/posts/getting-started/)에 따르면, 
스타일시트를 커스터마이징 하기 위해서는 `assets/css/jekyll/jekyll-theme-chirpy.scss`{: .filepath }
파일을 수정하라고 한다. 시키는 대로, 해당 파일에 클래스를 아래와 같이 추가하자.

```css
......
/* for sticky header. when scroll down, this class will be added to header. */
.fixed-header {
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 100;
}
......
```
{: file='jekyll-theme-chirpy.scss' }

### 레이아웃에 JavaScript 포함시키기

이제 작성한 JavaScript파일을 포함시켜야 한다. 모든 페이지에 적용되어야 하므로, 
모든 페이지에 적용되는 레이아웃 파일에 포함되도록 해야 한다. 
이를 위해 기본 레이아웃인 `_layouts/default.html`{: .filepath }
파일에 아래와 같이 추가한다. 

{% raw %}
```html
......
<html lang="{{ page.lang | default: site.alt_lang | default: site.lang }}" {{ prefer_mode }}>
  {% include head.html %}
	<script src="{{ '/assets/js/topbar_sticky.js' | relative_url }}"></script><!--for sticky header-->
  <body>
    {% include sidebar.html lang=lang %}
	......
```
{: file='default.html' }
{% endraw %}

`<script>`태그와 `src` 속성을 사용하여 작성한 JavaScript파일을 포함시키는 HTML 코드를 삽입하였다. 
이때, URL을 정확히 표시하기 위하여 [Jekyll에서 제공하는 Liquid 필터인 `relative_url`](/posts/about-jekyll-liquid/#relative_url)
을 사용하였다. 

이제 빌드하여 실행하면 된다. 

## 결과

위의 내용을 전부 적용한 뒤, 사이트를 빌드한 후 실행한 후 스크롤을 내려보면 아래와 같이 상단바 고정이 잘 적용된 것을 볼 수 있다.

![example_fixed](/assets/img/topbar_example/topbar_example_fixed.png){: width="816" height="58" }
_상단바가 고정된 모습_

