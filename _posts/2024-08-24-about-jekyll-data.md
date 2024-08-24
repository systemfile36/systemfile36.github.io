---
title: Jekyll - Data Files
date: 2024-08-24 17:30:00 +0900
categories: [Blogging, About Jekyll]
tags: [jekyll, filters, data_files]
description: Jekyll에서 Data Files를 사용하는 방법을 서술
---

## Data Files란

Jekyll에는 사이트에 대한 다양한 정보를 변수로 정의해서 사용할 수 있게 해두었다. 
이에 더해서, 본인이 정의한 데이터를 Liquid를 통해서 접근하게 할 수 있다. 이러한 파일들을 
Data Files라고 칭한다. 

해당 기능을 사용하면, 각종 페이지에서 중복되는 부분을 크게 줄일 수 있다. 
공통되는 부분을 데이터로서 저장하고 로딩할 수 있는 것이다. 
예를 들어, 다양한 post에서 공통적으로 포함시킬 표에 들어갈 정보(명령어 목록 등의 정보)를 데이터 파일로 저장하고, 
표와 같은 레이아웃 파일을 `_includes`에 저장한 후, 필요할 때 `include`태그로 데이터 파일을 넘겨서 표시하는 방법을 
고려할 수 있을 것이다. 

## Data Files의 형식과 위치

Jekyll이 로딩하는 데이터의 종류에는 `YAML`, `JSON`, `CSV` 등이 있다. 
이 로딩할 데이터들은 `_data` 디렉토리에 위치해 있다. 

주의할 점은, 데이터로서 로딩될 `CSV`파일에는 반드시 헤더 row가 필요하다는 것이다. 
후에 접근할 때, 필드 명으로 접근해야 하기 때문이다. 

## Data Files에 접근하는 방법

`site.data`를 통해 `_data` 디렉토리에 위치한 데이터 파일에 접근할 수 있다.
[Jekyll의 공식 문서](https://jekyllrb.com/docs/datafiles/)에서 사용한 예를 통해 살펴보자. 


### 기본적인 사용법

먼저 기본적인 예를 살펴보자. 
`_data`디렉토리에 `ExampleData.csv`파일을 작성한 후, 아래와 같은 내용을 작성하였다.

```plaintext
name,github
Eric Mill,konklone
Parker Moore,parkr
Liu Fengyun,liufengyun
```
{: file='ExampleData.csv' }

위와 같이 작성한 파일은, `site.data.ExampleData`로 접근할 수 있다. 
이를 통해 알 수 있듯이, 기본적으로 파일명으로 접근하게 된다. 
위의 데이터를 표로 만들어 출력하면 아래와 같다. 

{% raw %}
```liquid
{% for item in site.data.ExampleData -%}
{% if forloop.first == true -%}
| name | github |
| :----| :------|
{% endif -%}
| {{ item.name }} | {{ item.github }} |
{% endfor %}
```
{% endraw %}


{% for item in site.data.ExampleData -%}
{% if forloop.first == true -%}
| name | github |
| :----| :------|
{% endif -%}
| {{ item.name }} | {{ item.github }} |
{% endfor %}

<br>

### 특정 값에 접근하는 방법

Data File내의 특정 요소에 바로 접근할 수도 있다. 예시로, 
`_data` 디렉토리에 `ExampleYml.yml`파일을 만들고 아래와 같이 작성하였다. 

```yaml
dave:
    name: David Smith
    age: 30
John:
    name: John Doe
    age: 23
Alice:
    name: Alice
    age: 12
```

위와 같은 형식의 파일은 이름으로 접근할 수 있다. 각 데이터에 접근할 수 있다. 

{% raw %}
```liquid
{% assign var_person = site.data.ExampleYml["John"] %}
{{ var_person.name }}
```
{% endraw %}

```plaintext
{% assign var_person = site.data.ExampleYml["John"] %}
{{ var_person.name }}
```

### 특정 파일에 접근하는 방법 

`_data`디렉터리에 서브 디렉터리를 만들고 그곳에 파일들을 위치하게 되면, 
변수의 네임스페이스에 추가된다. 예를 들어, `_data`디렉토리의 하위에 `example`디렉토리를 만들고, 
그곳에 `a.yml`, `b.yml`의 파일을 위치하였다고 가정하자. 이 파일들은 각각 
`site.data.example['a']`, `site.data.example['b']`로 접근 가능하다. 
아래의 실제 사용례를 보면 알 수 있듯이, 특정 디렉토리에 파일들을 모아놓은 뒤, 
각 페이지에서 변수로 접근할 파일명을 선언하고 사용하는 등의 방식도 가능하다.

## 실제 사용례

해당 블로그에 사용된 Chirpy 테마는 위의 데이터 파일을 사용해서 다국어에 대응하고 있다.
`_includes`디렉터리의 `lang.html`파일을 보면 아래와 같이 되어있다.

{% raw %}
```liquid
{% comment %}
  Detect appearance language and return it through variable "lang"
{% endcomment %}
{% if site.data.locales[page.lang] %}
  {% assign lang = page.lang %}
{% elsif site.data.locales[site.lang] %}
  {% assign lang = site.lang %}
{% else %}
  {% assign lang = 'en' %}
{% endif %}
```
{% endraw %}

코멘트에도 적혀있듯이, `page.lang`을 읽어서 언어 정보를 확인한 후, 
`site.data`를 통해 `_data/locales`디렉터리 내에서 해당 이름으로 파일을 찾는다. 
만약 `page.lang`과 일치하는 이름의 파일이 있다면, 해당 언어에 대한 파일이 있다는 뜻이므로 
`lang` 변수에 할당한다. 없다면 `site.lang`정보를 참조하고, 그래도 없다면 기본적으로 `en`을 할당한다.

이제 `lang.html`을 다른 곳에서 `include`태그를 통해 포함시키게 되면, 
`lang`변수를 통해 언어 정보에 접근할 수 있게 된다. 
아래는 `lang.html`을 `include`하여 사용하는 `_layouts/home.html`파일의 일부이다.

{% raw %}
```liquid
......
{% if post.pin %}
	<div class="pin ms-1">
		<i class="fas fa-thumbtack fa-fw"></i>
			<span>{{ site.data.locales[lang].post.pin_prompt }}</span>
	</div>
{% endif %}
......
```
{: file='home.html' }
{% endraw %}

보다시피, `site.data.locales[lang]`을 이용하여 해당 파일에 정의된 변수에 접근하고 있는 것을 알 수 있다. 
해당 파일에는 `yml`형식으로 각 UI에 표시할 텍스트를 담고 있다. 아래는 `en.yml`의 내용의 일부이다.

```yaml
......
panel:
  lastmod: Recently Updated
  trending_tags: Trending Tags
  toc: Contents
......
```
{: file='en.yml' }

이와 같이, 각 언어 파일에서 UI와 같은 곳에 표시할 텍스트의 변수명과 실제 텍스트를 `yml`등의 파일로 저장한 뒤,
사이트 설정에 따라 로드하는 방식을 사용하면 보다 체계적인 다국어화 설계가 가능하다. 