---
title: Liquid - Tags
date: 2024-08-18 15:30:00 +0900
categories: [Blogging, About Liquid]
tags: [liquid, objects, tags, filters]
description: Liquid의 Tags에 대한 내용을 서술
---

이하의 글은 [Liquid 공식 문서](https://shopify.github.io/liquid/tags/control-flow/)의 Tags를 참고하여 작성하였다.

## Control flow

제어문 태그는 말 그대로 코드 흐름을 제어하는 목적으로 사용된다. 프로그래밍 언어라면 거의 반드시 존재하는 
`if`문, `select-case`문과 같은 것들과 같은 역할을 하는 태그들이다.

### if 

`if`문이다. 논리 연산을 통해 `true`가 리턴되면 블록 내의 코드를 실행한다.

{% raw %}
```liquid
{% if page.title == "Liquid - Tags" %}
  이 글은 Liquid의 Tags와 관련된 글입니다.
{% endif %}
```
{% endraw %}

또한, 특정 object나 variables가 존재하지 않는다면(==`nil`라면) `false`로 취급되는 것을 이용해 
해당 변수가 존재하는지 여부를 간단하게 확인할 수 있다. 
아래의 코드는 이 블로그에도 쓰인 chirpy 테마의 `_layouts`{: .filepath}에 있는 `post.html`{: .filepath}의 
일부를 발췌한 것이다.

{% raw %}
```liquid
{% if page.description %}
  <p class="post-desc fw-light mb-4">{{ page.description }}</p>
{% endif %}
```
{% endraw %}

`if`문을 통해 `page.description`이 존재하는지 확인한 후, 존재한다면 `html`에 출력한다. 

### unless

`if`의 부정이다. 즉, 논리 연산을 통해 `false`가 리턴되었을 때, 블록 내의 코드를 실행한다.

{% raw %}
```liquid
{% unless page.title == "Liquid - Tags" %}
  이 글은 Liquid의 Tags와 관련된 글이 아닙니다.
{% endunless %}
```
{% endraw %}

### elsif / else

`if`문이 있으니, 당연히 `else if`와 `else`문과 같은 것도 존재한다.
다만 표기는 C 계열 언어들과 달리 `elsif`와 `else`이다. 
기능은 다른 언어들과 같다.

{% raw %}
```liquid
{% if page.title == "Liquid - Tags" %}
  이 글은 Liquid의 Tags와 관련된 글입니다.
{% elsif page.title == "Liquid - Filters %}
  이 글은 Liquid의 Filters와 관련된 글입니다.
{% else %}
  이 글은 Liquid의 Tags나 Filters와 관련이 없는 글입니다.
{% endif %}
```
{% endraw %}

### case/when

`switch-case`문과 같은 점프 테이블 형태의 분기문이다. Liquid에서는 `case-when`으로 
구성된다. `case`와 변수로 블록을 시작하고, `when`으로 해당 변수의 값의 상태를 지정한다. 

`when`은 여러개의 값을 허용한다. 여러개의 값이 주어지면, 해당 변수가 주어진 값들 중 하나라도 일치하면
해당 `when` 블록의 코드가 실행된다. 즉, 여러개의 값이 주어지면 서로 `or` 연산으로 엮인 것으로 취급한다.
여러개의 값은 `,`기호로 연결하거나 `or` 연산자로 구분하면 된다. 

`else`를 추가하여 하나도 일치하는 `when` 블록이 없을 때 실행할 코드를 지정할 수도 있다. 
`switch-case`문에서의 `default`와 비슷하다고 보면 된다.

{% raw %}
```liquid
{% assign handle = "cake" %}
{% case handle %}
  {% when "cake" %}
     This is a cake
  {% when "cookie", "biscuit" %}
     This is a cookie
  {% else %}
     This is not a cake nor a cookie
{% endcase %}
```
{% endraw %}


## Iteration

당연하지만, 반복문도 존재한다.

### for

`for`문은 대부분의 언어에서 대표적인 반복문 중 하나이다. 
다른 언어와 비교하면, python의 `for`문이나 C 계열의 `for-each`문과 비슷한 구조를 가진다. 
아래의 코드는 현재 post의 모든 tag에 대해 반복하며 tag를 출력한다.

{% raw %}
```liquid
{% for tag in page.tags %}
  {{ tag }}
{% endfor %}
```
{% endraw %}

만약, 별도의 리스트 없이 정해진 숫자만큼 반복하고 싶다면 아래와 같이 `range`를 사용할 수 있다.

{% raw %}
```liquid
{% for i in (1..10) %}
  {{ i }}
{% endfor %}
```
{% endraw %}

위의 코드는 1부터 10까지를 출력할 것이다. python의 `for`문과 비슷하다고 한 이유를 알 것이다.

#### else

`for`문 블럭 안에 `else`블럭을 삽입하면, 
반복을 위해 사용한 리스트가 비어있는 등의 이유로 루프가 한번도 실행되지 않았을 때 
`else`블럭 내부의 코드가 실행된다. 

{% raw %}
```liquid
{% for tag in page.tags %}
  {{ tag }}
{% else %}
  There is no Tags in this page
{% endfor %}
```
{% endraw %}

위의 코드는 `page.tags`가 아무것도 포함하지 않을 경우 `else` 블럭 내부의 텍스트가 출력될 것이다.

#### break

다른 언어의 `break`와 마찬가지로, Liquid의 `break` 태그는 반복문을 탈출하게 한다.

{% raw %}
```liquid
{% for i in (1..5) %}
  {% if i == 4 %}
    {% break %}
  {% else %}
    {{ i }}
  {% endif %}
{% endfor %}
```
{% endraw %}

위의 코드는 3까지 출력된 후, `break`에 의해 반복문에서 벗어나게 되어, 
3까지만 출력될 것이다.

```plaintext
1 
2 
3
```

#### continue

다른 언어의 `continue`와 마찬가지로, 현재 반복을 스킵하고 다음 반복으로 넘어간다.

{% raw %}
```liquid
{% for i in (1..5) %}
  {% if i == 4 %}
    {% continue %}
  {% else %}
    {{ i }}
  {% endif %}
{% endfor %}
```
{% endraw %}

위의 코드는 4가 출력되기 전에 `continue`에 의해 반복이 스킵되므로 
1부터 5의 숫자 중, 4만 출력되지 않을 것이다.

```plaintext
1 
2 
3 
  
5 
```

### for (parameters)

반복문에 추가적인 매개변수를 지정할 수 있다.

#### limit

반복 횟수를 제한한다. 해당 횟수에 도달하면 반복 중인 리스트에 요소가 남아있더라도 
반복문은 중지된다.

{% raw %}
```liquid
{% for item in (1..10) limit:2 %}
  {{- item | append: " " -}} 
{% endfor %}
```
{% endraw %}

`limit`이 없다면 10까지 출력되었겠지만, `limit`으로 인해 2까지만 출력되었다.

```plaintext
1 2
```

#### offset

지정한 인덱스부터 반복을 시작한다. 

{% raw %}
```liquid
{% for item in (1..10) offset:3 %}
  {{- item | append: " " -}} 
{% endfor %}
```
{% endraw %}

인덱스 `3`부터 시작하여 4부터 출력된 것을 볼 수 있다.

```plaintext
4 5 6 7 8 9 10
```


#### range

python의 `range()`와 비슷하다. 숫자의 범위를 지정할 수 있다. 
`(n..m)`으로 지정하면 `n`에서 `m`까지의 숫자 리스트가 생성된다.(양쪽 다 포함)
주로 반복문에서 사용한다. 여기서 `n`과 `m`은 숫자 리터럴뿐만 아니라 변수도 들어갈 수 있다.

{% raw %}
```liquid
{% assign num = 10 %}
{% for item in (5..num) %}
  {{- item | append: " " -}} 
{% endfor %}
```
{% endraw %}

```plaintext
5 6 7 8 9 10
```
#### reversed

반복의 순서를 역순으로 바꾼다. `reverse`필터와는 철자가 다르다는 것을 주의하라.

{% raw %}
```liquid
{% for item in (1..5) reversed %}
  {{- item | append: " " -}} 
{% endfor %}
```
{% endraw %}

```plaintext
5 4 3 2 1
```

### forloop (object)

`for`문 안에서 사용가능한 object이다. `for`문에 대한 정보를 담고 있다. 
사용가능한 프로퍼티는 아래의 표를 참고하라.

| 프로퍼티 | 설명            | 반환타입 |
| :---- | :------------ | :---- |
| length | 반복문의 총 반복 횟수 | `number` |
| parentloop | 현재 반복문의 상위 반복문의 `forloop` object[^footnote-1] | `forloop` |
| index | 1부터 시작하는 현재 반복의 인덱스 | `number` |
| index0 | 0부터 시작하는 현재 반복의 인덱스 | `number` |
| rindex | 1부터 시작하는 역방향 인덱스 | `number` |
| rindex0 | 0부터 시작하는 역박향 인덱스 | `number` |
| first | 현재 반복이 첫번쨰 반복이면 `true`, 아니면 `false` | `boolean` |
| last | 현재 반복이 마지막 반복이면 `true`, 아니면 `false` | `boolean` |

주로 아래와 같이 현재 반복문이 마지막인지 여부를 확인할 때 등의 상황에 쓰인다.
아래의 코드는 `fruits`에 `split`필터를 통해 과일들을 `string`배열로 `assign`하고 
해당 배열의 내용을 한 줄에 출력하는 코드이다.


{% raw %}
```liquid
{%- assign fruits = "banana, apple, mango" | split: ", " -%}
{%- for friut in fruits -%}
	{{ friut }} {%- if forloop.last != true -%}-{%- endif -%}
{%- endfor -%}
```
{% endraw %}

## Template

Template 태그들은 프로세싱을 하지 않을 부분을 지정하거나, 템플릿 파일들의 관계성을 설정할 때 사용한다.

### comment

`comment`태그는 이름에서도 알 수 있듯이 주석을 달기 위한 태그이다. 
`<!-- ... -->`와 같은 HTML 주석을 통해서도 주석을 넣을 수 있지만, 
주석 내부에 Liquid 문법에 사용되는 표현이 들어가거나 Liquid 코드 자체가 들어가면 
에러가 발생한다. 이는 `html` 템플릿 파일과 `markdown`파일 모두에 적용된다. 마크다운 전처리나 `html`처리보다 
Liquid에 의한 처리가 먼저 되기 때문이다. 그렇기에 이 태그가 존재한다.

`comment`블럭 내부의 모든 텍스트는 출력되지 않고, 모든 Liquid 코드는 실행되지 않는다.

{% raw %}
```liquid
{% comment %}
{% assign str = "test" %}
{{ test }} 
{% endcomment %}
```
{% endraw %} 

### raw

`raw`태그는 Liquid 프로세싱을 일시적으로 중단시키는 역할을 한다. 
본 블로그의 Liquid에 관한 post에서도 상당한 빈도로 사용한 태그이다. 
위에서도 언급했듯이, 마크다운 전처리보다 Liquid 처리가 우선하기 때문에, 코드블럭 내부라도
Liquid 코드를 작성하면 에러가 나거나 단순히 해당 코드가 실행되어버려서 의도한 결과가 나오지 않게 된다.
`raw`태그 블럭을 설정하면, 해당 블럭 내부의 Liquid 코드는 그 형식이 맞는지에 상관없이 텍스트로서 출력된다.


### include

`include`태그는 다른 템플릿의 렌더링된 컨텐츠를 현재 템플릿에 삽입하는 태그이다. 

{% raw %}
```liquid
{% include "template-name" %}
```
{% endraw %} 

Jekyll에서는 해당 태그를 템플릿을 불러오기 위해 사용한다. 
해당 태그는 post를 작성할 때에도 사용한다. 바로 영상과 같은 미디어 파일을 포함할 때이다. 
본 블로그의 [Post 작성 - 기본의 Video 문단](/posts/write-a-post-basic/#video)을 참고하라.
`include`태그를 통해 미리 만들어둔 템플릿 파일을 포함시키는 방식으로 작동하는 것을 눈치챌 수 있다.

Jekyll에서는 위의 예시 코드와 달리 파일명을 통해 포함시킬 템플릿을 지정한다. 
해당 태그에 지정하는 파일의 경로는 기본적으로 `_includes`디렉터리에 대한 상대경로로 간주된다.
즉, 아래의 코드는 `_includes/footer.html`{: .filepath }를 포함시킨다.

{% raw %}
```liquid
{% include footer.html %}
```
{% endraw %} 

해당 태그에 사용하는 파일명에는 변수도 들어갈 수 있다. 예를 들어, _Front Matter_에 `var`이라는 이름으로 
포함시킬 템플릿명을 지정하였다면 아래와 같은 코드로 사용할 수 있다.

{% raw %}
```liquid
{% if page.var %}
	{% include {{ page.var }} %}
{% endif %}
```
{% endraw %} 

`include`로 포함할 템플릿에 매개변수를 넘기는 것도 가능하다. 
post에 영상을 포함하기 위한 코드를 통해 살펴보자. 아래와 같이 `변수명="변수내용"`을 통해 넘긴다.

{% raw %}
```liquid
{% include embed/video.html src='{URL}' %}
```
{% endraw %}

이렇게 넘긴 변수는 `include.{변수명}`을 통해 참조할 수 있다. 
`embed/video.html`{: .filepath }파일의 내용을 살펴보자.

{% raw %}
```liquid
{% assign video_url = include.src %}
{% assign title = include.title %}
{% assign poster_url = include.poster %}
{% assign types = include.types | default: '' | strip | split: '|' %}
......
```
{: file='video.html' }
{% endraw %}

넘겨받은 각종 변수들을 `include.{변수명}`을 통해 참조하여 새로운 변수에 할당하는 것을 볼 수 있다.
넘기지 않은 변수는 `nil`이 되므로, 이를 `if`를 통해 체크하여 HTML 생성에 사용하면 된다.
만약 넘겨받은 변수들이 형식에 맞는지 체크해야 한다면, 새 변수에 할당하는 시점에 
각종 filter를 통해 체크하거나 가공하여 사용하면 된다.

단순한 `string`이 아닌 다른 변수를 넘기고 싶을때도 있을 것이다. 
예를 들어, 현재 post의 제목을 포함한 특정 문장을 보내고 싶을 경우에는 단순한 문자열로 넘길 수 없다.
이럴 때에는 `capture`태그를 통해 별도의 변수에 할당한 뒤 넘기면 된다.

{% raw %}
```liquid
{% capture caller_info %}
Included by {{ page.title }}
{% endcapture %}

{% include template.html info=caller_info %}
```
{% endraw %}

`capture`태그에 대한 자세한 내용은 [Variable문단의 capture 부분](#capture)을 참고하라.

## Variable

Variable 태그들은 새로운 Liquid 만들고 할당한다.

### assign

새로운 이름의 변수를 만들고 할당한다.

{% raw %}
```liquid
{% assign var_int = 21 %}
{% assign var_float = 12.7 %}
{% assign var_boolean = false %}
{% assign str = "Example String" %}
```
{% endraw %}

### capture

`capture`태그는 블록 내의 문자열을 새 변수에 할당한다.
`assign`태그와 달리 다른 변수들을 활용한 복잡한 문자열을 변수에 저장하는 것이 가능하다.

{% raw %}
```liquid
{% assign favorite_food = "pizza" %}
{% assign age = 35 %}

{% capture about_me %}
I am {{ age }} and my favorite food is {{ favorite_food }}.
{% endcapture %}

{{ about_me }}
```
{% endraw %}

### increment

`increment`태그는 초기값이 `0`인 새 `number`변수를 만들고 출력한다. 
연속적으로 호출할 경우, 해당 값을 `1` 증가시킨 후 출력한다.

 {% raw %}
```liquid
{% increment counter %}
{% increment counter %}
{% increment counter %}
```
{% endraw %}

```plaintext
0
1
2
```

주의할 점은, `increment`가 사용하는 변수는 `assign`으로 만들어진 변수에는 영향이 없다는 것이다. 
아래와 같이, 서로 같은 `counter`라는 이름으로 변수를 만들고 사용하여도 `increment`와 `assign`의 값은 일치하지 않는다.

 {% raw %}
```liquid
{% assign counter = 200 -%}
{% increment counter %}
{% increment counter %}
{% increment counter %}
{{ counter }}
```
{% endraw %}

```plaintext
0
1
2
200
```

### decrement

초기값이 `-1`이고, 호출될 때마다 1씩 감소하는 것만 제외하면 `increment`와 동일하다. 

## footnote
[^footnote-1]: 현재 반복문이 중첩 반복문의 내부 반복문이 아니라면 `nil`을 반환한다.
