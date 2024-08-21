---
title: Liquid - 기본
date: 2024-08-17 20:30:00 +0900
categories: [Blogging, About Liquid]
tags: [liquid, objects, tags, filters]
description: Liquid에 대한 기본적인 내용을 서술
---

이하의 글은 [Liquid 공식 문서](https://shopify.github.io/liquid/basics/introduction/)의 Basics를 참고하여 작성하였다.

## Introduction

Liquid는 Ruby로 작성된 템플릿 언어이다. 템플릿 파일 내부의 objects, 
tags, filters의 조합을 사용해서 동적인 컨텐츠를 표시할 수 있게 해준다. 
동적 컨텐츠를 위한 템플릿 언어라는 점에서 JSP와 비슷한 역할을 한다고 볼 수 있다.
하지만 Java API 전체에 접근할 수 있는 JSP와 달리 단순하고 제한적인 기능을 가진다.
그렇지만 정적 사이트에 있어서는 빠른 성능을 보여주고 안정적이므로 그러한 환경에서는 유리할 수 있다.

Jekyll에서는 템플릿 언어로 이 Liquid를 사용한다. `_layouts` 디렉터리를 살펴보면 알 수 있듯이, 
post나 기타 페이지들의 표시도 해당 디렉터리에 있는 Liquid를 포함한 `html`파일 템플릿을 이용한다. 
더 자세한 내용은 [Jekyll 공식 문서](https://jekyllrb.com/docs/step-by-step/04-layouts/)을 참고하라.

내부적으로 본 블로그에서 사용중인 chirpy 테마도 
`_includes/embed`{: .filepath } 디렉터리에 있는 Liquid를 활용한 
레이아웃 템플릿을 사용한다. 이 템플릿을 `include`태그나 `render`테그를 사용해서 `src`를 넘긴 후, 현재 페이지에 
포함시킴으로서 사전에 만들어놓은 테마와 레이아웃에 맞게 각종 미디어 파일을 페이지에 포함시킬 수 있다. 


### Objects

**Objects**는 Liquid가 페이지에 표시할 콘텐츠를 담고 있다. Objects와 variables는 
두겹의 중괄호로 둘러쌓였을 때 표시된다. C언어의 구조체와 어느정도 비슷하다 볼 수 있다.

{% raw %}
```liquid
{{ page.title }}
```
{% endraw %}

출력은 아래와 같다.

{{ page.title }}

`page` 객체에 있는 `title` 프로퍼티를 읽은 것이다. 
해당 문서의 _Front Matter_에 작성된 title이 출력된 모습이다. 
눈치챘겠지만, `page` 객체를 통해 _Front Matter_에 작성된 다른 variables에도 접근할 수 있다.
이에 대한 것은 다른 post에서 서술한다.

### Tags

**Tags**는 로직을 만들고 제어문을 만든다. 중괄호와 퍼센트 기호로 둘러 쌓인 곳에 작성한다.
해당 영역에 있는 텍스트는 시각적인 출력이 존재하지 않는다. 다른 프로그래밍 언어처럼 반복문이나 
조건문 등이 존재한다.

{% raw %}
```liquid
{% if user %}
  Hello {{ user.name }}!!!
{% endif %}
```
{% endraw %}

해당 코드는 user가 `false`나 `nil`가 아니라면 (즉, `true`로 취급된다면) 
user.name 필드를 포함한 문장을 출력한다.

출력은 아래와 같다. (user라는 객체가 존재하지 않으므로, 즉 user가 `nil`이므로 아무것도 출력하지 않을 것이다. )

{% if user %}
  Hello {{ user.name }}!!!
{% endif %}

Tags는 아래와 같이 분류할 수 있다.

- Control flow
- Iteration
- Template
- Variable assignment

보다 자세한 내용은 [Liquid - Tags](/posts/about-liquid-tags)를 참고하라.


### Filters

**Filters**는 object나 variable의 출력을 바꾼다. object, variable의 출력을 바꾸는 것이므로 
두겹의 중괄호로 둘러쌓인 곳 안에서 사용된다. 그리고 후에 설명할 Variable assignment에서도 사용된다.
Filters를 사용할 때에는 `|`기호를 사용한다.

{% raw %}
```liquid
{{ "/assets/img/example" | append: ".html" }}
```
{% endraw %}

출력은 아래와 같다.

{{ "/assets/img/example" | append: ".html" }}

`append`를 통해 왼편의 텍스트에 지정된 텍스트를 붙인 것을 볼 수 있다.

여러개의 Filters를 사용할 수도 있다. 이 경우, 왼쪽부터 적용된다.

{% raw %}
```liquid
{{ "/img/example" | append: ".html" | prepend: /assets }}
```
{% endraw %}

출력은 아래와 같다.

{{ "/img/example" | append: ".html" | prepend: "/assets" }}

`append`로 ".html"을 붙인 뒤, `prepend`로 앞에 "/assets"를 붙였다.


## Operators

다른 프로그래밍 언어와 같이, Liquid도 각종 논리 연산자와 비교 연산자를 가진다. 
해당 연산자들은 Control flow tags에서 사용할 수 있다. 비교 연산자는 C 계열 언어들과 차이는 없지만, 
논리 연산자는 조금 다르다.

### 기본 연산자

기본적인 연산자는 아래의 표와 같다.

| == | equals                   |
| != | does not equal           |
| >  | greater than             |
| <  | less than                |
| >= | greater than or equal to |
| <= | less than or equal to    |
| or | logical or               |
|and | logical and              |

이러한 기본 연산자는 다른 프로그래밍 언어에서처럼 조건문 등에서 사용할 수 있다.

{% raw %}
```liquid
{% if product.type == "Shirt" or product.type == "Shoes" %}
    Shirt or Shoes
{% endif %}
```
{% endraw %}


### contains

`contains` 연산자는 우항의 문자열에 좌항의 문자열이 포함되었는지 여부를 체크한다.
아래의 코드는 `page.title`에 "Liquid"라는 문자열이 포함되어 있다면, 지정 텍스트를 표시할 것이다.

{% raw %}
```liquid
{% if page.title contains "Liquid" %}
    이 글은 Liquid에 관한 글입니다.
{% endif %}
```
{% endraw %}

`contains`는 문자열 뿐만이 아니라, 문자열의 배열에서도 포함 여부를 체크 가능하다.
아래의 코드는 `page.tags`에 liquid가 있다면, 지정 텍스트를 표시한다.

{% raw %}
```liquid
{% if page.tags contains liquid %}
    이 글은 Liquid에 관한 글입니다.
{% endif %}
```
{% endraw %}

`contains`는 문자열에 대해서만 작동한다. 문자열이 아닌 다른 오브젝트의 배열에 대해서는 
작동하지 않는다.

### 논리 연산자의 처리 순서

태그에 하나 이상의 `and`나 `or` 연산자가 있다면, 연산자들은 _오른쪽에서 왼쪽 순으로_ 체크된다.
다른 일반적인 프로그래밍 언어들과 달리, 괄호 등을 통해 우선 순위를 바꾸는 것은 불가능하다. 
만약 사용한다면 괄호 자체가 invalid한 문자이기 때문에 태그 자체가 작동하지 않게 될 것이다.

예시 코드를 보자.

{% raw %}
```liquid
{% if true and false and false or true %}
    결과값은 false가 된다. 
	과정을 살펴보면, 
	true and false and (false or true)
	true and (false and true)
	true and false
	false
	이렇게 된다.
{% endif %}
```
{% endraw %}

## Truthy and falsy

boolean 타입이 아닌 변수가 조건문과 같은 boolean 문맥에서 사용되면, 
일정한 기준에 따라 해당 변수에 대해 `true`인지 `false`인지 판단하게 된다.

기본적으로 `nil`와 `false`를 제외한 모든 값은 `true`로 간주된다.
따라서 문자열이든 무엇이든 저 두개만 아니면 논리적으로 `true`로 판단된다.
이는 빈 문자열에 대해서도 마찬가지이다. 

## Types

Liquid의 objects는 6개의 타입 중 하나가 될 수 있다.

- String
- Number
- Boolean
- Nil
- Array
- EmptyDrop

각 variables는 `assign`이나 `capture` 태그를 통해 초기화할 수 있다.
(Tags에 관한 자세한 내용은 별도의 post에서 다룬다. 여기선 assign 태그가 변수 할당 역할을 한다는 것만 알아두자.)

### String

String은 문자열이다. 다른 언어에서도 자주 찾아볼 수 있는 타입이다. 
\' 나 \" 기호로 둘러 쌓인 리터럴은 문자열이다.
 
{% raw %}
```liquid
{% assign str = "Example String" %}
```
{% endraw %}

### Number

Number는 정수와 부동소수점을 포함한 숫자를 뜻한다.

{% raw %}
```liquid
{% assign var_int = 21 %}
{% assign var_float = 12.7 %}
```
{% endraw %}

### Boolean

Boolean은 논리값을 나타낸다. `true`나 `false`값을 가진다.
인용부호는 필요하지 않다. 

{% raw %}
```liquid
{% assign var_boolean = false %}
```
{% endraw %}

### Nil

Nil은 아무 결과가 없을 때 반환되는 빈 값이다. `null`과 어느정도 비슷하다 보면 된다.
위에서도 언급했듯이 `nil`은 조건문에서 `false`로 취급된다. 

아래의 코드는 해당 페이지에 `user`가 존재하지 않으므로 `false`로 취급되어
아무것도 표시되지 않을 것이다.

{% raw %}
```liquid
{% if user %}
  Hello {{ user.name }}!!!
{% endif %}
```
{% endraw %}

### Array

Array는 타입이 모여있는 리스트이다. 다른 언어에서도 자주 보이는 배열과 같다.

배열의 항목에 접근할때에는, 아래와 같이 iteration tag를 사용할 수 있다. 
아래의 코드는 `site.users`에 대해 반복하는 코드이다. 보다시피 다른 언어들에도 있는 
foreach문과 같은 구조를 가졌다는 것을 알 수 있다.

{% raw %}
```liquid
{% for user in site.users %}
  {{ user }}
{% endfor %}
```
{% endraw %}

만약 `site.users`가 "Amy", "Michael", "John"과 같다면 아래와 같이 출력될 것이다.

```plaintext
Amy Michael John
```

반복문이 아닌 특정 요소에 접근하고 싶다면, 다른 언어와 마찬가지로 인덱스를 사용할 수 있다.
특이한 점은, python처럼 음수 인덱스를 사용할 수 있다는 것이다. 
음수 인덱스는 뒤에서부터 카운팅 된다.

{% raw %}
```liquid
{{ site.users[0] }}
{{ site.users[1] }}
{{ site.users[-1] }}
```
{% endraw %}

`site.users`가 "Amy", "Michael", "John"과 같다면 아래와 같이 출력될 것이다.

```plaintext
Amy
Michael
John
```

배열은 초기화할 수 없다. 대신, `split` 필터를 사용해서 `string`을 배열로 만들 수 있다.

### EmptyDrop

`EmptyDrop`은 삭제된 object에 접근하였을 때 반환되는 타입이다. 
아래의 예시에서, `page_1`, `page_2`, `page_3`은 `EmptyDrop`을 리턴한다. 

{% raw %}
```liquid
{% assign variable = "hello" %}
{% assign page_1 = pages[variable] %}
{% assign page_2 = pages["does-not-exist"] %}
{% assign page_3 = pages.this-handle-does-not-exist %}
```
{% endraw %}

`empty`값의 비교 연산을 통해 object가 비어있는지 여부를 확인할 수 있다.

{% raw %}
```liquid
{% if pages != empty %}
  <h1>{{ pages.frontpage.title }}</h1>
  <div>{{ pages.frontpage.content }}</div>
{% endif %}
```
{% endraw %}

`pages`가 비어있다면 해당 비교 연산은 `true`를 리턴할 것이다.

## Whitespace control

기본적으로 Liquid 코드라인은 아무것도 출력하지 않는 코드라도, 빈 라인을 출력한다. 
아래 예시 코드를 보자. `assign` 태그는 변수에 값을 할당하는 태그라서 아무것도 출력하지 않음에도 
빈 줄이 출력될것이다.

{% raw %}
```liquid
{% assign variable = "hello" %}
{{ variable }}
```
{% endraw %}

```markdown

hello
```

`assign` 태그의 닫는 괄호에 `-`기호를 추가하면 해당 태그에 의해 생성되는 공백을 제거할 수 있다.

{% raw %}
```liquid
{% assign variable = "hello" -%}
{{ variable }}
```
{% endraw %}

```markdown
hello
```

만약 어떤 태그이든 상관없이 공백을 출력하지 않게 하고 싶다면, 양쪽 모두에 `-`기호를 추가하면 된다. 
어디든 상관없다. 


