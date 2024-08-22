---
title: Liquid - Filters
date: 2024-08-22 11:30:00 +0900
categories: [Blogging, About Liquid]
tags: [liquid, objects, tags, filters]
description: Liquid의 Filters에 대한 내용을 서술
---

## 기본적인 구조

{% raw %}
Filters는 object, variable의 출력을 바꾼다. `|`기호로 사용한다.
보통 `{{`, `}}`로 둘러쌓인 출력문이나 `assign`태그에서 사용한다.
{% endraw %}

숫자의 절대값을 반환하는 `abs` 필터를 예시로 보자. 아래의 코드는 출력문 내부에서 필터를 사용해 수의 절대값을 출력한다.

{% raw %}
```liquid
{{ -15 | abs }}
```
{% endraw %}

```plaintext
{{ -15 | abs }}
```

`assign`태그 내에서 사용할 때에도 같은 방식으로 사용한다. 

{% raw %}
```liquid
{% assign var_int = -17.4 | abs %}
{{ var_int }}
```
{% endraw %}

아래와 같이 여러개의 필터를 연속해서 사용하는 것도 가능하다. 

{% raw %}
```liquid
{% assign var_int = -17.4 | abs | prepend: "$ " %}
{{ var_int }}
```
{% endraw %}

```plaintext
{% assign var_int = -17.4 | abs | prepend: "$ " %}
{{ var_int }}
```

## Liquid 표준 Filters

### abs

숫자의 절대값을 반환한다. 

{% raw %}
```liquid
{{ -15 | abs }}
```
{% endraw %}

```plaintext
{{ -15 | abs }}
```

`number`타입이 아닌 `string`타입이더라도, 해당 문자열이 숫자만 포함한다면 
`abs`태그는 작동한다.

{% raw %}
```liquid
{{ "-15" | abs }}
```
{% endraw %}

```plaintext
{{ "-15" | abs }}
```

### append

이름에서도 알 수 있듯이, 문자열의 뒤에 다른 문자열을 붙인다. 
붙일 문자열에는 리터럴뿐만 아니라 다른 변수도 들어갈 수 있다.

{% raw %}
```liquid
{% assign template_file = "/video.html" %}
{{ "_includes/" | append: "embed" | append: template_file %}
```
{% endraw %}

```plaintext
{% assign template_file = "/video.html" %}
{{ "_includes/" | append: "embed" | append: template_file }}
```

### at_least

숫자의 최소값을 제한한다. 필터의 대상 숫자가 `at_least`의 인자보다 작다면 `at_least`의 인자가 출력될 것이다.
더 크다면, 해당 숫자가 그대로 출력될 것이다. 

{% raw %}
```liquid
{{ 10 | at_least: 14 }}
{{ 10 | at_least: 9 }}
```
{% endraw %}

```plaintext
{{ 10 | at_least: 14 }}
{{ 10 | at_least: 9 }}
```

다른 프로그래밍 언어의 `min`함수와 비슷하다. 즉, 위의 코드의 첫 줄은 `Math.min(10, 14)`와 같은 기능을 한다.

### at_most

위의 `at_least`의 최댓값 버전이다. 필터의 대상 숫자가 `at_most`의 인자보다 크면 `at_most`의 인자가 출력될 것이다.
더 작다면, 해당 숫자가 그대로 출력될 것이다.

{% raw %}
```liquid
{{ 5 | at_most: 10 }}
{{ 5 | at_most: 4 }}
```
{% endraw %}

```plaintext
{{ 5 | at_most: 10 }}
{{ 5 | at_most: 4 }}
```

다른 프로그래밍 언어의 `max`함수와 비슷하다. 즉, 위의 코드의 첫 줄은 `Math.max(5, 10)`와 같은 기능을 한다.

### capitalize

대상 문자열의 첫 문자를 대문자로 만들고, 그 외의 문자열은 소문자로 만든다.

{% raw %}
```liquid
{{ "test of CAPITALIZE" | capitalize }}
```
{% endraw %}

```plaintext
{{ "test of CAPITALIZE" | capitalize }}
```

### ceil

해당 숫자보다 큰 수 중, 가장 가까운 정수로 올림한다. 다른 언어의 수학 관련 라이브러리에도 포함되어 있는 `ceil`함수/메소드와 
같은 역할을 한다. 문자열에 대해서도, 해당 문자열이 숫자로 변환가능하다면 작동한다.

{% raw %}
```liquid
{{ 1.1 | ceil }}
{{ 3.0 | ceil }}
{{ 24.23 | ceil }}
{{ "2.4" | ceil }}
```
{% endraw %}

```plaintext
{{ 1.1 | ceil }}
{{ 3.0 | ceil }}
{{ 24.23 | ceil }}
{{ "2.4" | ceil }}
```

### compact

배열 내의 모든 `nil`타입 값을 삭제한다. 
공식 문서의 예시를 통해 알아보자. 

아래 예시는 웹 사이트의 모든 페이지의 리스트를 담고 있는 `site.pages` 변수를 
`map` 필터를 통해 각 페이지의 `category` 속성만을 추출해 `site_categories` 배열로 만든 후 출력한다.

{% raw %}
```liquid
{% assign site_categories = site.pages | map: "category" %}
{% for category in site_categories %}
- {{ category }}
{% endfor %}
```
{% endraw %}

```plaintext
- business
- celebrities
- 
- lifestyle
- sports
```

만약 카테고리가 없는 페이지가 있다면, 배열의 일부 항목은 `nil`이 될 것이다. 
따라서 일부 행은 빈 상태로 출력이 될것이다. 

이를 막기 위해 `compact`필터를 사용할 수 있다. 해당 필터를 사용하면 배열 내의 `nil`항목을 삭제하여 
빈 항목이 출력되는 것을 방지할 수 있다. 

{% raw %}
```liquid
{% assign site_categories = site.pages | map: "category" | compact  %}
{% for category in site_categories %}
- {{ category }}
{% endfor %}
```
{% endraw %}

```plaintext
- business
- celebrities
- lifestyle
- sports
```

### concat

두 개의 배열을 잇는다. 

{% raw %}
```liquid
{% assign fruits = "apples, oranges, peaches" | split: ", " -%}
{% assign vegetables = "carrots, turnips, potatoes" | split: ", " -%}

{% assign everything = fruits | concat: vegetables -%}

{% for item in everything -%}
- {{ item }}
{% endfor %}
```
{% endraw %}

```plaintext
{% assign fruits = "apples, oranges, peaches" | split: ", " -%}
{% assign vegetables = "carrots, turnips, potatoes" | split: ", " -%}

{% assign everything = fruits | concat: vegetables -%}

{% for item in everything -%}
- {{ item }}
{% endfor %}
```

필터를 연속해서 사용함으로서 두 개 이상의 배열을 이을 수도 있다. 

{% raw %}
```liquid
{% assign furniture = "chairs, tables, shelves" | split: ", " -%}

{% assign everything = fruits | concat: vegetables | concat: furniture -%}

{% for item in everything -%}
- {{ item }}
{% endfor %}
```
{% endraw %}

```plaintext
{% assign furniture = "chairs, tables, shelves" | split: ", " -%}

{% assign everything_2 = fruits | concat: vegetables | concat: furniture -%}

{% for item in everything_2 -%}
- {{ item }}
{% endfor %}
```

### date

타임 스탬프를 다른 날짜 포맷으로 바꾼다. 예시를 통해 살펴보자.

{% raw %}
```liquid
{{ page.date | date: "%a, %b %d, %y" }}
```
{% endraw %}

```plaintext
{{ page.date | date: "%a, %b %d, %y" }}
```

해당 태그에 사용되는 날짜 포맷은 [STRFTIME](https://strftime.net)과 같은 문법을 따른다. 
각 날짜 요소에 대한 시그니쳐는 해당 링크를 확인하라.

특정 날짜 변수뿐만 아니라 날짜를 나타내는 문자열에 대해서도 작동한다. 

{% raw %}
```liquid
{{ "Aug 12, 2024" | date: "%Y, %B %d" }}
```
{% endraw %}

```plaintext
{{ "Aug 12, 2024" | date: "%Y, %B %d" }}
```

### default

기본적으로 출력될 값을 지정한다. 출력할 값이 `nil`이거나 `false`이거나 비어있는 상태라면 
`default`로 지정한 값이 출력된다. 

{% raw %}
```liquid
{{ product_price | default: 3.99 | prepend: "$" }}
```
{% endraw %}

```plaintext
{{ product_price | default: 3.99 | prepend: "$" }}
```
`product_price`변수는 정의되지 않았으므로 `nil`이다. 따라서 `default`로 지정한 값인 `3.99`가 출력 되는 것을 
볼 수 있다.

비어있는 문자열에 대해서도 `default`로 지정한 값이 출력된다. 

{% raw %}
```liquid
{% assign price_of_test = "" %}
{{ price_of_test | default: 3.99 | prepend: "$" }}
```
{% endraw %}

```plaintext
{% assign price_of_test = "" %}
{{ price_of_test | default: 3.99 | prepend: "$" }}
```
### divided_by

대상 수를 인자의 수로 나눈 몫을 출력한다. 나눌 숫자(인자)가 정수일 경우
결과 값은 자신보다 작은 정수 중 가장 가까운 정수로 내림된다.(`floor`태그와 같다.)

{% raw %}
```liquid
{{ 20 | divided_by: 8 }}
```
{% endraw %}

```plaintext
{{ 20 | divided_by: 8 }}
```

나누는 숫자가 부동소수점일 경우에는 출력값 또한 부동소수점으로 출력된다. 

{% raw %}
```liquid
{{ 20 | divided_by: 8.0 }}
```
{% endraw %}

```plaintext
{{ 20 | divided_by: 8.0 }}
```

해당 태그를 포함한 연산이 이루어지는 태그들은 숫자의 형을 변환한다. 
정수에 대해 실수 연산을 하개되면 결과값은 실수로 나오는 것이다. 

### downcase

문자열의 모든 알파벳을 소문자로 만든다. `.toLowerCase()`메소드와 비슷한 결과를 낸다.

{% raw %}
```liquid
{{ "Public Static Void Func()" | downcase }}
```
{% endraw %}

```plaintext
{{ "Public Static Void Func()" | downcase }}
```

### escape

문자열 내의 특수문자들을 이스케이프 형태로 바꾸어준다. 이렇게 이스케이프된 문자열은 
URL등에서도 사용할 수 있게 된다. 예시로 보는 것이 빠르다. 

{% raw %}
```liquid
{{ "Do you like 'Pratt & Whitney'?" | escape }}
```
{% endraw %}

```plaintext
{{ "Do you like 'Pratt & Whitney'?" | escape }}
```

### first

배열의 첫번째 요소를 반환한다.

{% raw %}
```liquid
{{ "First Second Third Fourth" | split: " " | first }}
```
{% endraw %}

```plaintext
{{ "First Second Third Fourth" | split: " " | first }}
```

해당 필터는 배열에 대해 `.`기호로 사용하는 것이 가능하다. 

{% raw %}
```liquid
{% assign var_str_arr = "First Second Third Fourth" | split: " " %}
{% if var_str_arr.first == "First" %}
	Correct!
{% else %}
	Incorrect!
{% endif %}
```
{% endraw %}

```plaintext
{% assign var_str_arr = "First Second Third Fourth" | split: " " -%}
{% if var_str_arr.first == "First" -%}
	Correct!
{% else -%}
	Incorrect!
{% endif -%}
```

### floor 

대상 숫자보다 작은 정수 중, 가장 가까운 정수로 내림한다. 문자열일 경우, 숫자로의 변환을 시도한 후 적용한다.

{% raw %}
```liquid
{{ 1.2 | floor }}
{{ 1.9 | floor }}
{{ 24.533 | floor }}
{{ "23.7" | floor }}
```
{% endraw %}

```plaintext
{{ 1.2 | floor }}
{{ 1.9 | floor }}
{{ 24.533 | floor }}
{{ "23.7" | floor }}
```

### join

배열의 요소들을 하나의 문자열로 연결한다. 이떄, 인자로 넘긴 문자열을 분리자로 삼는다. 

{% raw %}
```liquid
{% assign var_arr_join = "John, Amy, Jane, Michael" | split: ", " %}
{{ var_arr_join | join: " and " }}
```
{% endraw %}

```plaintext
{% assign var_arr_join = "John, Amy, Jane, Michael" | split: ", " %}
{{ var_arr_join | join: " and " }}
```

### last 

위에서 서술한 `first`태그와 비슷하다. 대신 이 태그는 마지막 요소를 반환한다.
사용법은 위의 [`first`](#first)와 같다. 

{% raw %}
```liquid
{{ var_str_arr.last }}
```
{% endraw %}

```plaintext
{{ var_str_arr.last }}
```

### lstrip

문자열 왼쪽의 모든 공백을 삭제한다. 문자열 사이의 공백과 오른쪽의 공백은 삭제하지 않는다. 

{% raw %}
```liquid
{{ "		example test string        " | lstrip }}!!!!!
```
{% endraw %}

```plaintext
{{ "		example test string        " | lstrip }}!!!!!
```

### map

위에서도 한번 사용했던 그 태그이다. 배열의 각 요소에서 인자로 넘긴 이름의 프로퍼티를 추출해서 
배열을 생성한다. 

{% raw %}
```liquid
{% assign site_categories = site.pages | map: "category" %}
{% for category in site_categories %}
- {{ category }}
{% endfor %}
```
{% endraw %}

위에서 사용했던 예시이다. `site.pages`로 모든 페이지 목록을 불러온 뒤, `category` 프로퍼티를 추출해서 
해당 프로퍼티로 배열을 만들어 출력하는 것이다. 

### minus

대상 숫자에서 인자로 넘긴 수를 뺀 값을 출력한다. 

{% raw %}
```liquid
{{ 20 | minus: 8 }}
{{ 3 | minus: 10 }}
{{ 2.4 | minus: 1 }}
```
{% endraw %}

```plaintext
{{ 20 | minus: 8 }}
{{ 3 | minus: 10 }}
{{ 2.4 | minus: 1 }}
```

### modulo

대상 숫자를 인자로 나눈 나머지를 반환한다. C 계열 언어의 `%`연산자와 같은 역할을 한다. 

{% raw %}
```liquid
{{ 3 | modulo: 2 }}
{{ 61 | modulo: 12 }}
```
{% endraw %}

```plaintext
{{ 3 | modulo: 2 }}
{{ 61 | modulo: 12 }}
```

### plus

대상 숫자에 인자를 더한 값을 리턴한다. 

{% raw %}
```liquid
{{ 10 | plus: 8 }}
{{ 14.5 | plus: 22 }}
```
{% endraw %}

```plaintext
{{ 10 | plus: 8 }}
{{ 14.5 | plus: 22 }}
```

### prepend 

대상 문자열의 앞에 인자로 넘긴 문자열을 붙인다. 

{% raw %}
```liquid
{% assign path = "_includes/embed" -%}
The file's path is {{ "/video.html" | prepend: path }}.
```
{% endraw %}

```plaintext
{% assign path = "_includes/embed" -%}
The file's path is {{ "/video.html" | prepend: path }}.
```

### remove

대상 문자열에서 인자로 넘긴 문자열을 지운다. 

{% raw %}
```liquid
{{ "This is Test String!!" | remove: " Test" }}
```
{% endraw %}

```plaintext
{{ "This is Test String!!" | remove: " Test" }}
```

### remove_first

대상 문자열에서 인자로 넘긴 문자열을 지운다. 단, 처음 등장하는 것만 지운다. 

{% raw %}
```liquid
{{ "The string in this string is strange" | remove_first: "str" }}
```
{% endraw %}

```plaintext
{{ "The string in this string is strange" | remove_first: "str" }}
```

### replace

대상 문자열에서 첫번째 인자의 문자열을 찾아서 두번째 인자로 바꾼다. 

{% raw %}
```liquid
{{ "This is my car" | replace: "my", "her" }}
```
{% endraw %}

```plaintext
{{ "This is my car" | replace: "my", "her" }}
```

### replace_first

`replace`태그와 같지만, 전부가 아닌 처음 등장하는 문자열만 바꾼다. 

{% raw %}
```liquid
{{ "This is my first car. That car is my second car" | replace_first: "my", "your" }}
```
{% endraw %}

```plaintext
{{ "This is my first car. That car is my second car" | replace_first: "my", "your" }}
```

### reverse

배열의 요소들을 반대로 정렬한다. `reverse`태그는 문자열에는 적용할 수 없다. 

{% raw %}
```liquid
{% assign var_str_reverse = "First, Second, Third" | split: ", " %}
{{ var_str_reverse | reverse | join: ", " }}
```
{% endraw %}

```plaintext
{% assign var_str_reverse = "First, Second, Third" | split: ", " %}
{{ var_str_reverse | reverse | join: ", " }}
```

문자열을 직접 조작할 수 없기에, 문자열에 사용하고 싶다면 위와 같이 `split`태그나 `join`태그를 같이 사용해야 한다.

### round

대상 숫자를 반올림한다. 기본적으로 소수점 첫째 자리에서 반올림하지만, 인자로 정수 `n`을 넘기면 
소수점 아래 `n+1`번째 자리에서 반올림 한다.

{% raw %}
```liquid
{{ 1.4 | round }}
{{ 1.2 | round }}
{{ 15.358 | round: 2 }}
```
{% endraw %}

```plaintext
{{ 1.4 | round }}
{{ 1.2 | round }}
{{ 15.358 | round: 2 }}
```

### rstrip

기본적인 사용법은 [lstrip](#lstrip)과 같다. 단, 해당 태그는 오른쪽의 공백을 제거한다. 

{% raw %}
```liquid
{{ "		example test string        " | rstrip }}!!!!!
```
{% endraw %}

```plaintext
{{ "		example test string        " | rstrip }}!!!!!
```

### size

대상 문자열의 길이를 반환하거나, 대상 배열의 요소의 개수를 반환한다. 
해당 태그 또한 `first`태그나 `last`태그와 같이 `.`기호로 사용할 수도 있다.

{% raw %}
```liquid
{{ "Test of String" | size }}
{% assign var_str_size = "one, two, three, four, five" | split: ", " %}
{{ var_str_size.size }}
```
{% endraw %}

```plaintext
{{ "Test of String" | size }}
{% assign var_str_size = "one, two, three, four, five" | split: ", " %}
{{ var_str_size.size }}
```

### slice

첫번째 인자에서부터 두번째 인자 만큼 잘라낸 문자열을 반환한다. 
즉, 첫번째 인자는 `index`를, 두번째 인자는 `length`를 의미한다. 

{% raw %}
```liquid
{{ "String" | slice: 0 }}
{{ "String" | slice: 3 }}
{{ "String" | slice: 0, 3 }}
```
{% endraw %}

```plaintext
{{ "String" | slice: 0 }}
{{ "String" | slice: 3 }}
{{ "String" | slice: 0, 3 }}
```

### sort

배열 내의 요소들을 정렬한다. 이때, 대소문자를 구분한다. 

{% raw %}
```liquid
{% assign var_str_sort = "Apple, Giraff, Zebra, Banana, Salt" | split: ", " %}
{{ var_str_sort | sort | join: ", " }}
```
{% endraw %}

```plaintext
{% assign var_str_sort = "Apple, Giraff, Zebra, Banana, Salt" | split: ", " %}
{{ var_str_sort | sort | join: ", " }}
```

객체를 정렬할때에는, 정렬할 기준 프로퍼티를 지정할 수도 있다. 단순히 인자로 프로퍼티 명을 넘기면 된다.

### split

문자열을 지정한 구분자로 잘라서 배열로 반환한다. 다른 언어에도 존재하는 `split`메소드/함수와 비슷하다. 

{% raw %}
```liquid
{% assign var_str_split = "A, B, C, D, E" | split: ", " %}
{% for letter in var_str_split -%}
	{{ letter -}} {% if forloop.last != true -%}-{% endif -%}
{% endfor -%}
```
{% endraw %}

```plaintext
{% assign var_str_split = "A, B, C, D, E" | split: ", " %}
{% for letter in var_str_split -%}
	{{ letter -}} {% if forloop.last != true -%}-{% endif -%}
{% endfor %}
```

### strip

[lstrip](#lstrip)와 [rstrip](#rstrip)를 합쳐놓은 태그이다. 왼쪽과 오른쪽 모두의 공백을 제거한다. 

{% raw %}
```liquid
{{ "		example test string        " | strip }}!!!!!
```
{% endraw %}

```plaintext
{{ "		example test string        " | strip }}!!!!!
```

### strip_html

문자열 내의 모든 HTML 태그들을 제거한다. 

{% raw %}
```liquid
{{ "This is <strong>Text<strong> with HTML" | strip_html }}
```
{% endraw %}

```plaintext
{{ "This is <strong>Text<strong> with HTML" | strip_html }}
```

### strip_newlines

문자열 내의 모든 개행 문자를 제거한다. 

{% raw %}
```liquid
{% capture var_str_newlines %}
Test
 of Str
ing
{% endcapture %}

{{ var_str_newlines | strip_newlines }}
```
{% endraw %}

```plaintext
{% capture var_str_newlines %}
Test
 of Str
ing
{% endcapture %}

{{ var_str_newlines | strip_newlines }}
```

### sum

배열 내의 모든 요소를 합한다. 

{% raw %}
```liquid
{% assign total_quantity = collection.products | sum: "quantity" %}
{{ total_quantity }}
```
{% endraw %}

위의 코드는 `collection.products`안의 object의 `quantity`프로퍼티를 다 더한다. 

### times

대상 숫자에 인자의 숫자를 곱한다. 

{% raw %}
```liquid
{{ 3 | times: 2 }}
{{ 27.5 | times: 3 }}
```
{% endraw %}

```plaintext
{{ 3 | times: 2 }}
{{ 27.5 | times: 3 }}
```



