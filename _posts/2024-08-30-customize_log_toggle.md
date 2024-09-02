---
title: Customize Log - 토글 버튼
date: 2024-08-25 20:00:00 +0900
categories: [Blogging, Customize log]
tags: [js, css, customize, javascript, toggle]
description: 애니메이트된 토글 버튼을 만드는 과정 서술
media_subpath: /assets/img/toggle_example/
---

## 목적

[이전 글](/posts/customize_log_in_page_toc)에서 만든 in_page_toc를 켜고 끄는 기능을 추가하기 위해 
토글 버튼을 만들고자 한다. 
이전 글을 작성한 시점에서 이미 토글 버튼을 만든 후 포함 시켰지만, 하나의 글에 담기에는 가독성이 떨어지기에 
이렇게 별도의 글로 작성한다. 

## 구현

버튼의 디자인과 작동 자체는 HTML과 CSS만으로 구현할 수 있다. 
필요한 스크립트는 토글 버튼에 이벤트 리스너를 추가하여 버튼이 수행할 동작을 지정하는 것 뿐이다. 
직접 필요한 곳에 인라인 HTML로 추가시키고, 메인 스타일시트에 스타일을 정의하여도 되지만, 
그렇게 하면 가독성도 떨어지고 관리도 어렵고 재사용성도 떨어지기 때문에 별도의 파일로 분리한다. 
따라서 필요한 파일은 HTML과 CSS파일이다. 과정은 아래와 같다.

- 버튼의 레이아웃으로 사용할 HTML파일 작성
- 버튼의 시각적 효과를 정의할 CSS파일 작성
- 버튼을 실제로 필요한 곳에 포함하기
- 버튼에 이벤트 리스너를 추가하여 동작 정의

단계별로 알아보자.

### 레이아웃으로 사용할 HTML파일 작성

먼저 레이아웃 파일을 보자. 

```html
<!-- toggle button. -->
<!-- style defined at btnToggle.scss -->
<label class="toggle">
	<input type="checkbox" checked=true>
	<span class="slider"></span>
</label>
```
{: file='btnToggle.html' }

`<input type="checkbox">`은 실제 토글 버튼으로 기능할 부분이다. `checked` 필드와 `change`이벤트를 
통해 별도의 코드 없이 토글 기능을 사용할 수 있다.

`<span class="slider">`는 시각적 효과를 담당한다. 나중에 CSS의 `transform`, `transition`, 가상 요소등을 통해 
부드럽게 움직이는 효과를 줄것이다.

전체적인 설계를 요약해보자. 시각적으로 보이는 버튼을 클릭하면 `<input type="checkbox">`가 작동하여 체크 언체크가 된다. 

시각적인 부분은 `<span class="slider">`와 CSS를 통해 해당 요소에 추가될 가상 요소 `:before`가 담당하게 될 것이다.

해당 파일은 Liquid의 `include` 태그를 통해 포함될 것이므로 `_includes`디렉터리에 포함시키자.

### 버튼의 시각적 효과를 위한 SCSS 파일 작성

이제 실질적으로 움직이는 부분을 만들기 위한 부분이다. 해당 사이트의 테마는 기본적으로 SCSS를 사용하므로, 
그에 맞춰서 SCSS를 사용하기로 하였다. SCSS에 대한 자세한 내용은 [공식문서](https://sass-lang.com/documentation/)를 참고하라.

먼저 실제 파일을 보자.

```scss
/*
* For implement toggle button.
* check layout 'btnToggle.html' in _includes directory
*/

/* variables for toggle button */
$toggle-width: 60px;
$toggle-height: 34px;
$toggle-padding: 4px;
$transition-time: .2s;

/* styling toggle container */
.toggle {
  position: relative; /* set relative. child elements is relative to this element */
  display: inline-block;
  width: $toggle-width;
  height: $toggle-height;
}

/* hiding checkbox input element. */
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* background of toggle button */
.slider {
  position: absolute; /* Positions relative to the parent element(.toggle). */
  cursor: pointer; /* when mouse over, cursor change to 'pointer' */
  top: 0;
  left: 0;    /* fill parent elements */
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: $transition-time; /* change color over 0.4s. */
  border-radius: $toggle-height; /* round edge */
}

/* toggle button's round-moving part. it will move when toggle 
*  use :before. it will be located before <span class:"slider">
*/
.slider:before {
  position: absolute; /* Positions relative to the parent element(.slider). */
  content: ""; /* content is empty. (I wanna make just white circle) */
  height: calc($toggle-height - 2 * $toggle-padding);
  width: calc($toggle-height - 2 * $toggle-padding);
  left: $toggle-padding;
  bottom: $toggle-padding;
  background-color: white;
  transition: $transition-time; /* move over 0.4s */
  border-radius: 50%;
}

/* Select .slider(background) using next-sibling combinator.  
*  when input is checked, change background color to green.
*/
input:checked + .slider {
  background-color: #4CAF50;
}

/* Select .slider:before(round-move part) using next-sibling combinator.  
*  when input is checked, move round-move part. 
*  when input is unchecked, move back. (CSS default) 
*/
input:checked + .slider:before {
  transform: translateX(calc($toggle-width - $toggle-height));
}

/* when input is unchecked, change background color to red */
input:not(:checked) + .slider {
  background-color: #f44336;
}
```
{: file='btnToggle.scss' }


이제 하나하나 살펴보자. 
<br/>
<br/>
아래의 코드는 필요한 변수를 정의한 것이다. 

```scss
/* variables for toggle button */
$toggle-width: 60px;
$toggle-height: 34px;
$toggle-padding: 4px;
$transition-time: .2s;
```
{: .nolineno }

코드내에 직접 상수로 정의하는 것보다는, 저렇게 변수로 별도로 정의하는 것이 
세세한 수치를 조정할 때 실수도 줄이고 좀 더 편리할 것이다. 
<br/>
<br/>
아래의 코드는 토글 버튼을 담는 컨테이너, 즉 `<lable class="toggle">`을 스타일링한다.

```scss
/* styling toggle container */
.toggle {
  position: relative; /* set relative. child elements is relative to this element */
  display: inline-block;
  width: $toggle-width;
  height: $toggle-height;
}
```
{: .nolineno }

`position`을 `relative`로 설정한다. 기본적으로 해당 값은 자기 자신의 원래 위치(`static`) 기준으로 
위치를 결정한다는 뜻으로, `top`, `left`등과 같은 요소를 사용할 때 적용된다. 

하지만 여기서는 실제 버튼이 될 자식 요소들(`.slider` 등)의 위치 기준점이 되기 위하여 설정하였다. 
부모의 위치가 지정되어 있어야 자식 요소에서 `absolute`로 설정하여 부모 기준으로 자기 자신을 배치할 수 있기 때문이다. 

`display`를 `inline-block`으로 설정한다. 이는 `inline`처럼 다른 요소들과 나란히 배치되면서도 
`block`처럼 `width`, `height`값을 설정할 수 있게 한다. (`inline`은 해당 값을 설정할 수 없다.)

그리고 넓이와 높이를 각각 정의한 변수로 할당한다.
<br/>
<br/>
아래의 코드는 `.toggle`클래스를 가진 요소의 하위 요소 `input`에 적용되는 스타일이다. 
여기선, 체크 박스를 가리킬 것이다. 

```scss
/* hiding checkbox input element. */
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
```
{: .nolineno }

실제 작동 부분은 시각적인 토글 부분으로 정의되므로, 실제 `<input type="checkbox">`는 숨긴다. 
투명하게 만들고, 크기를 0으로 설정한 모습이다. 
<br/>
<br/>
아래의 코드는 `.slider` 클래스를 가진 요소, 즉 `<span class="slider">`를 스타일링한다. 
해당 요소는 실제 버튼의 배경을 담당한다. 

```scss
/* background of toggle button */
.slider {
  position: absolute; /* Positions relative to the parent element(.toggle). */
  cursor: pointer; /* when mouse over, cursor change to 'pointer' */
  top: 0;
  left: 0;    /* fill parent elements */
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: $transition-time; /* change color over 0.4s. */
  border-radius: $toggle-height; /* round edge */
}
```
{: .nolineno }

`position`을 `absolute`로 설정한다. 이는 부모 요소를 기준으로 한 위치를 가지겠다는 뜻이다. 
위에서 부모 요소인 `<lable class="toggle">`의 `position`을 `relative`로 설정하였기에, 
해당 요소를 기준으로 위치를 잡는다. 

`cursor`를 `pointer`로 설정함으로서 마우스를 올렸을 때, 클릭 가능한 요소임을 알 수 있게 하였다.

`top`, `left`, `right`, `bottom`을 모두 `0`으로 설정함으로서 부모 요소를 가득 채우도록 늘린다.
배경이 될 부분이기 때문이다. 

`background-color`는 `#ccc`(회색)으로 설정하였다. 이는 후에 상태에 따라 변경될 것이기 때문에 
실제 배경이 회색인 경우를 보기는 어려울 것이다. 

`transition`은 변수를 통해 할당하였다. 변수의 값에 따라 상태 변화시의 애니메이션 효과 시간이 달라질 것이다. 
해당 요소는 색이 바뀔 것이므로, 색이 바뀌는 데 걸리는 시간을 결정한다. 

`border-radius`역시 변수를 참조한다. 꼭짓점을 둥글둥글하게 만든다. 
<br/>
<br/>
아래 코드는 `:before` 가상 요소를 통해 `<span class="slider">`의 앞에(여기선, 위에) 움직이는 원형 부분을 
추가한다. 이는 실제 버튼처럼 보이게하는 부분이다. (결과 이미지를 보면 어떤 부분인지 알 수 있을 것이다.)

```scss
/* toggle button's round-moving part. it will move when toggle 
*  use :before. it will be located before <span class:"slider">
*/
.slider:before {
  position: absolute; /* Positions relative to the parent element(.slider). */
  content: ""; /* content is empty. (I wanna make just white circle) */
  height: calc($toggle-height - 2 * $toggle-padding);
  width: calc($toggle-height - 2 * $toggle-padding);
  left: $toggle-padding;
  bottom: $toggle-padding;
  background-color: white;
  transition: $transition-time; /* move over 0.4s */
  border-radius: 50%;
}
```
{: .nolineno }

이 역시 `position`을 `absolute`로 설정하여 `<lable class="toggle">`에 대해 위치하도록 한다. 

`content`를 빈 문자열로 할당한 것은 `content`요소를 설정하지 않으면 `:before`요소가 나타나지 않기 때문이다.
단순히 하얀색상의 원을 구현하고 싶으므로 그냥 빈 문자열을 할당하였다.

`height`와 `width`를 내장 함수 `calc`를 통해 연산하여 할당한다. 해당 연산은 실제 버튼의 높이에서 
위 아래의 여백(`toggle-padding`)을 뺀 값으로 설정하는 것이다. (원형이으로 만들 것이므로 둘 다 같은 값으로 할당한다.)

`transition`은 위와 같이 변수를 통해 할당하였다. 변수의 값에 따라 상태 변화시의 애니메이션 효과 시간이 달라질 것이다.
해당 요소는 위치가 바뀔 것이므로 위치가 이동하는 시간을 결정한다. 

`border-radius`를 `50%`로 설정하여 완전하게 둥근 모양으로 만든다. 
<br/>
<br/>
아래의 코드들은 `<input type="checkbox">`의 상태에 따라 각 요소들의 상태를 조절하는 것이다. 
실제 애니메이션 효과를 구현한다. 

```scss
/* Select .slider(background) using next-sibling combinator.  
*  when input is checked, change background color to green.
*/
input:checked + .slider {
  background-color: #4CAF50;
}
```
{: .nolineno }


`input`의 가상 클래스 `:checked`를 사용하여 해당 체크 박스가 체크 되어 있을 때의 상태를 가리킨다. 
그리고, 인접 형제 결합자([Next-sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Next-sibling_combinator))
를 사용하여 `input` 바로 다음 위치한 형제 요소 중 `.slider`클래스를 가진 요소를 선택한다. 
즉, `<input type="checkbox">` 바로 다음에 있는 `<span class="slider">`를 선택한다. 

체크 되었을 때, 배경 색을 `#4CAF50`(초록색)으로 설정하여 켜진 상태라는 것을 시각적으로 알린다. 

아래는 움직이는 부분을 스타일링한다. 

```scss
/* Select .slider:before(round-move part) using next-sibling combinator.  
*  when input is checked, move round-move part. 
*  when input is unchecked, move back. (CSS default) 
*/
input:checked + .slider:before {
  transform: translateX(calc($toggle-width - $toggle-height));
}
```
{: .nolineno }

위와 마찬가지로 `input`과 인접 형제 결합자를 사용한다. 다만, 해당 코드에서는 가상 요소 `.slider:before`를 선택한다. 

체크 되었을 때, 이동하는 원형 부분을 버튼의 넓이에서 원형 부분의 지름을 뺀 만큼 오른쪽으로 이동시킨다. 

만약 체크 되지 않아서 해당 스타일이 적용되지 않을 경우, CSS는 위치를 기본값을 되돌릴 것이다. 
즉, 체크 되지 않았을 때의 동작은 별도로 정의하지 않아도 된다. 
<br/>
<br/>
아래는 체크 되지 않았을 때의 배경색을 설정한다. 

```scss
/* when input is unchecked, change background color to red */
input:not(:checked) + .slider {
  background-color: #f44336;
}
```
{: .nolineno }

체크가 해제 되었을 때(`input:not(:checked)`), 배경색을 `#f44336`(빨간색)으로 설정하여 
꺼졌음을 시각적으로 알린다. 

이로서 CSS를 통해 시각적인 동작부를 구현하였다. 이제 실제로 사이트에 포함시킬 차례이다. 

해당 파일을 `assets/css/`에 포함시킨다. 그리고 같은 디렉터리에 있는 `jekyll-theme-chirpy.scss`에 
아래와 같이 추가한다. 

```scss
......
/* import btnToggle for styling toggle button*/
@import 'btnToggle';
......
```
{: file='jekyll-theme-chirpy.scss' .nolineno }

### 버튼을 필요한 곳에 포함하기 

버튼을 실제로 포함하고자 하는 곳에 넣는다. 여기선, 전에 만든 [in_page_toc](/posts/customize_log_in_page_toc/)에 
토글 버튼을 추가하여 접고 펴는 기능을 구현한다. 

버튼을 추가하기 전에, 버튼의 배치를 위해 변경해야할 부분이 존재한다. 단순히 `include`태그로 포함시키면 
원하는 대로 배치되지 않는다. 이를 해결하기 위해 `display`의 `flex`를 이용하고자 한다.

이를 위해 먼저 `in_page_toc.html`에 `flex`로 기능할 영역을 만들자.

{% raw %}
```html
<div class="in_page_toc-header">
	<h2 data-toc-skip id="in_page_toc-title" class="panel-heading ps-3 mb-2">Contents</h2>
	<!-- Toggle button for toggle in_page_toc. check btnToggle.scss -->
	{% include btnToggle.html %}
</div>
```
{: file='in_page_toc.html' .nolineno }
{% endraw %}

`in_page_toc-header`클래스를 가진 `div`요소를 작성하였다. 
해당 요소는 제목을 나타내는 `#in_page_toc-title`과 `include` 태그로 포함될 토글 버튼을 
하나로 묶는다. 
<br/>
<br/>
스타일을 설정하기 위해 in_page_toc의 스타일을 정의한 `in_page_toc.scss`에 아래의 코드를 추가하자.

```scss
/* flex-box */
.in_page_toc-header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

/* set margin to align */
.in_page_toc-header .toggle {
	margin-top: 40px;
	margin-left: 20px;
	margin-bottom: 8px;
}
```
{: file='in_page_toc.scss' }
`display`를 `flex`로 설정하여 flex-box로 만든다. 

`align-items`는 수직 방향(상하)에 대한 정렬을 말한다. `flex-start`로 하면 flex-box의 상단에 붙을 것이고, 
`flex-end`로 하면 하단에 붙을 것이다. 이는 실제로 HTML코드를 브라우저로 연 다음 콘솔로 `classList` 나 `style`속성 등을 사용하여 
변경하면서 시각적으로 확인하는 것이 알기 쉽다. 여기서는 중앙에 정렬되는 것을 원하기 때문에 `center`로 설정한다. 

`justify-content`는 수평 방향(좌우)에 대한 정렬을 말한다. in_page_toc가 왼쪽 정렬 기준이므로, 
해당 값 또한 `flex-start`로 하여 왼쪽부터 정렬되게 하였다. 

또한 해당 flex-box아래에 있는 `.toggle` 클래스를 가진 요소(여기서는 `include`한 토글 버튼)의 여백을 설정한다. 
해당 값은 같은 flex-box에 있는 `#in_page_toc-title`의 margin값을 고려하여 설정하였다. 

이렇게 요소를 정렬하였다면, 동작을 정의할 차례이다. 

### 버튼에 이벤트 리스너를 추가하여 동작 정의

이제 해당 버튼에 이벤트를 연결할 차례이다. 해당 버튼은 `in_page_toc`에 속할 것이므로 
해당 레이아웃의 동작을 다룬 `in_page_toc.js`에서 이벤트 리스너를 추가한다. 
<br/>
<br/>
아래와 같이 `querySelector()`와 CSS선택자를 사용하여 요소를 찾는다. 
`tocToggle`은 `btnToggle.html`의 `<input type="checkbox">`에 대한 참조를 가질 것이다.

```javascript
......
//Find toggle button that located at toc-header
var tocToggle = document.querySelector('.in_page_toc-header .toggle input');
......
```
{: file='in_page_toc.js' .nolineno }
<br/>
<br/>
그리고 아래처럼 `change` 이벤트에 이벤트 리스너를 추가한다. 

```javascript
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
```

체크 박스의 상태가 변화(`change`)하면 넘긴 람다식이 실행된다. 

해당 람다식은 실행 되면 해당 요소의 `checked`필드를 확인해서 in_page_toc의 `display`속성을 
바꾸어 표시 여부를 결정하는 단순한 로직이다.

## 결과 

버튼은 아래와 같이 표시된다. 

![toggle_example_on](toggle_example_on.png){: width="330" height="240"}
_토글 버튼이 켜져있는 상태_

![toggle_example_off](toggle_example_off.png){: width="330" height="80"}
_토글 버튼이 꺼져있는 상태_

해당 포스트에도 in_page_toc가 포함되어 있으므로 직접 확인하는 것이 빠르다.

