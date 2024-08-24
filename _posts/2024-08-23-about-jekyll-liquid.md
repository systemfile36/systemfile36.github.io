---
title: Jekyll - Liquid
date: 2024-08-23 20:30:00 +0900
categories: [Blogging, About Jekyll]
tags: [jekyll, liquid, filters, Variables]
description: Jekyll에서 사용하는 Liquid의 Filters나 Variables등에 대해 서술
---

본 글은 [Jekyll 공식문서](https://jekyllrb.com/docs/liquid/)의 관련 문서들을 참고하여, 
자주 사용할 것 같은 fileters나 variables등에 대해 정리한 것이다. 

Liquid에 대한 전반적인 정리는 [About Liquid 카테코리](/categories/about-liquid/)를 참고하길바란다.

## Filters

Jekyll에서는 [Liquid의 기본 필터들](/posts/about-liquid-filters/)뿐만 아니라, 
작업을 쉽게 하기 위한 추가적인 필터들을 정의해 놓았다. 

### relative_url

대상 문자열의 앞에 `baseurl`을 붙인다. 즉, `prepend: {baseurl}`과 같다. 
주로 서버 내의 파일에 대한 경로에 사용한다. 예를 들어, 사이트에 커스텀한 자바스크립트를 추가하고 싶다고 하자.
이를 위해 `/assets/js`{: .filepath }에 `example.js`파일을 추가하였다. 
이를 실제 사이트에 포함하기 위해 기본 레이아웃인 `_layouts/default.html` 파일에 `<script>`태그를 통해 추가한다.
이때, 아래와 같이 추가하면 된다. 

{% raw %}
```html
......
<html lang="{{ page.lang | default: site.alt_lang | default: site.lang }}" {{ prefer_mode }}>
  {% include head.html %}
	<script src="{{ '/assets/js/example.js' | relative_url }}"></script>
  <body>
......
```
{: file='default.html' .nolineno }
{% endraw %}

서버 내의 상대 경로인 `/assets/js/example.js`에 `relative_url`필터를 사용한 것을 볼 수 있다.

### date_to_string

`date`를 아래와 같은 형식으로 변환한다.

{% raw %}
```liquid
{{ site.time | date_to_string }}
```
{% endraw %}

```plaintext
{{ site.time | date_to_string }}
```

### where

`objects`의 배열에서 첫번째 인자를 이름으로가진 프로퍼티가 두번째 인자와 일치하는 값을 가지고 있는 모든 객체를 찾아서
반환한다.

{% raw %}
```liquid
{{ site.members | where:"graduation_year","2014" }}
```
{% endraw %}

별도의 `data file`을 사용할 때 유용할 것이다. 
`SQL`의 `WHERE`절에서 `=`기호 만을 사용하는 느낌이다. 

### where_exp

단순히 프로퍼티의 이름과 값만 인자로받는 위의 `where`과 달리, 표현식으로 반환할 객체들을 찾는다. 

{% raw %}
```liquid
{{ site.members | where_exp:"item", 
"item.graduation_year == 2014" }}

{{ site.members | where_exp:"item",
"item.graduation_year < 2014" }}

{{ site.members | where_exp:"item",
"item.projects contains 'foo'" }}
```
{% endraw %}

좀 더 `SQL`의 `WHERE`절에 가까워졌다.

### find 

이름 그대로 객체를 찾는다. 위의 [where](#where)과 비슷하지만, 모든 것을 찾는 `where`과 달리 
`find`는 처음 찾은 하나만 반환한다. 아래 예시는 `title`이 `About Post`인 페이지를 찾는다.

{% raw %}
```liquid
{{ site.pages | find: "title", "About Post" }}
```
{% endraw %}

```plaintext
{{ site.pages | find: "title", "About Post" }}
```

### find_exp

`where_exp`와 비슷하지만, 처음 찾은 객체 하나만 반환한다. 아래 예시는 위의 `find`의 예시를 
`find_exp`를 사용하는 것으로 바꾼 것이다.

{% raw %}
```liquid
{{ site.pages | find_exp: "item", "item.title == 'About Post'" }}
```
{% endraw %}

```plaintext
{{ site.pages | find_exp: "item", "item.title == 'About Post'" }}
```

### number_of_words

대상 문자열의 단어 수를 반환한다. 

{% raw %}
```liquid
{{ "This is Test String" | number_of_words }}
```
{% endraw %}

```plaintext
{{ "This is Test String" | number_of_words }}
```

### array_to_sentence_string

배열을 문장으로 만든다. 각 요소는 `, `로 구분되며 마지막 요소는 `and`로 구분된다.
인자로 원하는 연결자를 넣으면 대체된다.

{% raw %}
```liquid
{{ page.tags | array_to_sentence_string }}
{{ page.tags | array_to_sentence_string: "AND" }}
```
{% endraw %}

```plaintext
{{ page.tags | array_to_sentence_string }}
{{ page.tags | array_to_sentence_string: "AND" }}
```

### markdownify

마크다운으로 쓰여진 문자열을 HTML로 변환한다. 
아래는 `capture`로 마크다운 문자열을 `var_md`에 할당하고, 이를 `markdownify`로 HTML로 출력하는 예시이다.

{% raw %}
```liquid
{% capture var_md %}
## Test of Title
test inner text
1. test
2. test2
{% endcapture %}

{{ var_md | markdownify }}
```
{% endraw %}



```html
{% capture var_md %}
## Test of Title
test inner text
1. test
2. test2
{% endcapture %}

{{ var_md | markdownify }}
```

### jsonify

배열 등을 JSON으로 변환한다.

```plaintext
{{ page.tags | jsonify }}
```

### normalize_whitespace

탭과 줄바꿈 문자를 포함한 모든 `whitespace`로 간주되는 문자를 하나의 스페이스 공백으로 치환한다.

{% raw %}
```liquid
{{ "a \n b" | normalize_whitespace }}
```
{% endraw %}


## Variables

Jekyll에서는 _Front Matter_를 가진 모든 파일을 처리한다. 
처리한 각 파일에는 Liquid로 사용할 수 있는 다양한 데이터가 변수로 제공된다.

### site

사이트에 대한 전반적인 정보와 `_config.yml`에 정의된 설정들을 담고 있다.
아래의 표를 참고하라.

| 변수명          | 설명               |
| :------------ | :--------------- |
| `site.time`   | 현재 시간을 나타낸다.   |
| `site.pages`  | 모든 페이지들의 리스트이다. |
| `site.posts`  | 모든 post들의 역순 목록이다. |
| `site.related_posts` | 페이지가 post라면 관련 포스트를 10개까지 표시한다. |
| `site.static_files` | 모든 [정적 파일](/posts/about-jekyll-content)의 리스트이다. |
| `site.html_pages` | `site.pages`에서 `.html`로 끝나는 것만 가져온 리스트이다. |
| `site.html_files` | `site.static_files`에서 `.html`로 끝나는 것만 가져온 리스트이다. |
| `site.collections` | 모든 컬렉션의 리스트이다.(post를 포함한다.) |
| `site.data` | `_data` 디렉터리에서 로드된 데이터의 리스트이다. |
| `site.categories.CATEGORY` | `CATEGORY`라는 이름의 카테고리의 모든 포스트 목록이다. |
| `site.tags.TAG` | `TAG`라는 이름의 태그를 가진 모든 포스트 목록이다. |
| `site.url` | `_config.yml`에 정의된 `url`을 반환한다. |

### page

해당 페이지에 대한 정보와, _Front Matter_에 정의된 변수들을 담고 있다.

| 변수명      | 설명      |
| :-------- | :------- |
| `page.content` | 페이지의 컨텐츠이다. |
| `page.title` | 페이지의 제목이다. | 
| `page.url` | 페이지의 URL이다. 도메인은 포함되지 않는다. 예[^footnote-1] |
| `page.date` | 페이지에 할당된 날짜이다. | 
| `page.id` | 컬렉션이나 포스트의 식별자이다. |
| `page.categories` | 페이지가 속한 카테고리의 리스트이다.[^footnote-2] |
| `page.tags` | 페이지가 속한 태그의 리스트이다.[^footnote-2] |
| `page.name` | 페이지나 포스트의 파일명이다. |
| `page.next` | 다음 포스트이다. 순서는 `site.posts` 기준이다. |
| `page.previous` | 이전 포스트이다. 순서는 `site.posts` 기준이다. |


## 주석

[^footnote-1]: `{{ page.url }}`
[^footnote-2]: _Front Matter_에 의해 지정 될 수 있다.