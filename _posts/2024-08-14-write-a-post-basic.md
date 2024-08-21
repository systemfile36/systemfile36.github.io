---
title: Chirpy Post 작성 - 기본
date: 2024-08-17 20:00:00 +0900
categories: [Blogging, About Post]
tags: [post, posts, chirpy]
---

해당 글은 [chirpy의 Writing a New Post](https://chirpy.cotes.page/posts/write-a-new-post/)
와 [chirpy 테마의 데모](https://chirpy.cotes.page/posts/text-and-typography/)를 기반으로 chirpy 테마를 활용한 jekyll 사이트에 post를 작성하는 방법을 개인적으로 정리한 것입니다. <br>
글 작성법도 익힐 겸 작성한 것이므로 부족할 수 있습니다...

## 이름과 경로

포스트로 추가할 파일의 이름은 `YYYY-MM-DD-TITLE.EXTENSION`{: .filepath}의 형식을 가진 채 
`_posts`{: .filepath}에 위치해야 한다. 여기서 `EXTENSION`{: .filepath}는 반드시 
`md`{: .filepath}나 `markdown`{: .filepath} 중 하나여야 한다. 

## Front Matter

기본적으로, post의 최상단에 아래와 같은 블럭을 [YAML](https://yaml.org/) front matter 블럭 형식으로 작성해야 한다.

```yaml
---
title: TITLE
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [TOP_CATEGORIE, SUB_CATEGORIE]
tags: [TAG]     # TAG names should always be lowercase
---
```
Front Matter의 개념에 대해 정확히 알고 싶다면 아래의 jekyll 공식 문서 링크를 참고하라
<https://jekyllrb.com/docs/front-matter/>

> post의 _layout_ 부분은 기본적으로 `post`로 설정되어 있기 때문에 별도로 _layout_ 변수를 수정할 필요는 없다.
{: .prompt-tip}


### Timezone

시간을 정확히 표기하기 위해 timezone을 제대로 설정해야 한다.<br>
`_config.yml`{: .filepath}에 정의된 `timezone`뿐만 아니라
Front Matter 블럭에 있는 `date` 변수에도 시간대를 설정해야 한다.
형식은 `+/-TTTT` 이다.<br>
본 블로그는 Asia/Seoul로 설정되어 있으므로 `+0900` 으로 설정하면 될 것이다.


### Categories와 Tags

`categories` 는 말 그대로 카테고리를 의미한다. 최대 두 개의 요소를 가질 수 있다.
순서대로 상위 카테고리, 하위 카테고리를 뜻한다.<br>
`tags` 는 태그를 의미한다. 0개에서 무한 개의 요소를 가질 수 있다.
아래와 같은 형식으로 사용한다.

```yaml
categories: [프로그래밍 언어, Java]
tags: [java, oop]
```

### Post 설명문

기본적으로 post의 처음 문단의 일부가 HOME에서 게시물 목록과 _Further Reading_ 영역 등에 노출된다.
만약 첫 문단을 기반으로 자동 생성된 설명문이 싫다면, _Front Matter_ 의 `description` 필드를 사용할 수 있다.

```yaml
description: post에 대한 요약
```

추가로, `description` 필드의 텍스트는 post's 페이지에서 post 제목 하단에도 표시된다.

## Table of Contents

Table of Contents(약칭 TOC)는 우측 패널에 표시되는 것을 말한다.
TOC는 본문에 포함된 제목들(\#문자를 통해 작성된 Heading 문장)을 참조해 글의 내용을 목차로 정리해주고, 
링크를 통해 해당 제목이 있는 곳으로 이동할 수 있게 해준다.
`_config.yml`{: .filepath}의 `toc`에 `true`/`false`를 입력하여 TOC 사용 여부를 설정할 수 있다.
만약 일부 글에만 TOC를 끄고 싶다면  _Front Matter_ 에 아래와 같이 추가하면 된다.

```yaml
toc: false
```

## Media

_Chirpy_ 에서는 이미지와 오디오, 비디오와 같은 것을 미디어 리소스라고 통칭한다.
(여기서만 그렇게 칭하는 것은 아니지만, 공식 문서에서 이렇게 언급하길래...)

### URL Prefix

미디어 리소스를 사용하기 위해 URL로 소스를 지정할 때, 해당 URL에 중복되는 부분이 많다는 것을 느낄 것이다. 
CDN을 사용한다면 CDN주소가 항상 앞에 붙을 것이고, 서버 내부의 주소를 사용한다면 `/assets/`{: .filepath}
와 같은 경로가 항상 앞에 붙을 것이다. 이를 해결하기 위해 고정된 접두사를 따로 설정해둘 수 있다.

- 만약 미디어 파일들을 호스트하는 CDN을 따로 사용중이라면, `_config.yml`{: .filepath}에 정의된 `cdn`
필드를 아래와 같이 수정하면 모든 미디어 소스 링크 앞에 해당 URL이 붙을 것이다.

```yaml
cdn: https://cdn.com
```
{: file='_config.yml' .nolineno } <!-- Kramdown의 IAL, HTML 요소에 속성 추가 -->
<!-- 이 경우에는 file 속성을 "_config.yml"로 설정하고, CSS 클래스 중 하나로 .nolineno 클래스를 추가한다. -->

- 현재 post/page에 한정하여 리소스 경로의 접두사를 설정하고 싶다면, _front matter_에 `media_subpath` 변수를 
설정하면 된다.  

```yaml
media_subpath: /path/to/media/
```
{: .nolineno }


`site.cdn`과 `page.media_subpath`를 둘 다 설정하였다면, 둘 모두 이미지 URL에 포함될 것이다.

### Images

#### Caption

이미지에 caption을 넣고 싶다면 이미지 링크의 다음 라인에 이탤릭채를 추가하면 된다. 
그렇게 하면 이미지 밑에 캡션이 뜰것이다. 

```markdown
![이미지-설명](/path/to/image)
_Image Caption_
```
{: .nolineno }

#### Size

이미지가 로드될 때, 레이아웃이 예기치 않게 변하거나 이동할 수 있다. 이를 막기 위해 이미지의 너비와 높이를 설정해야 한다.
또한, 이미지의 크기가 사전에 정의되어 있다면 브라우저가 미리 해당 공간을 확보하여 사용자 경험에도 긍정적이다. 
이 외에도 화면 크기에 따라 레이아웃을 조절할때 너비 높이를 지정해놓으면 의도치 않은 이미지 변형을 막을 수 있다.

```markdown
![Example](/assets/img/example.png){: width="500" height="400"}
```

#### Position

별도의 지정이 없으면 이미지는 가운데로 정렬된다. 만약 지정하고 싶다면 위치를 뜻하는 CSS 클래스를 사용할 수 있다. 

> 한번 포지션을 지정하면, 이미지에 캡션이 추가되면 안된다.
{: .prompt-warning }

- **기본 위치(Normal position)**

  이미지가 왼쪽으로 정렬된다. 
  
  ```markdown
  ![Example](/assets/img/example.png){: .normal }
  ```
  {: .nolineno }
  
- **글의 왼쪽으로(Float to left)**

  ```markdown
  ![Example](/assets/img/example.png){: .left }
  ```
  {: .nolineno }
  
- **글의 오른쪽으로(Float to right)**

  ```markdown
  ![Example](/assets/img/example.png){: .right }
  ```
  {: .nolineno }
  
#### Dark/Light mode

다크모드와 라이트 모드에 따라 이미지를 전환하게 설정할 수 있다. 두 개의 이미지를 준비한 후, 아래와 같이 지정하면 된다.

```markdown
![for Light mode](/assets/img/light-mode.png){: .light }
![for Dark mode](/assets/img/dark-mode.png){: .dark }
```

#### Shadow

이미지에 그림자 효과를 주고 싶다면 아래와 같이 `shadow`클래스를 추가해주면 된다.

```markdown
![Example](/assets/img/example.png){: .shadow }
```
{: .nolineno }

#### Preview Image

만약 post 최상단에 이미지를 추가하고 싶다면, 아래와 같이 _Front Matter_의 `image` 속성에 추가하면 된다.
주의해야 할것은, 이미지의 해상도는 `1200 x 630`으로 준비해야 한다는 것이다. 
만약 이미지의 비율이 `1.91 : 1`에 맞지 않다면, 이미지가 스케일되거나 짤리게 된다.

```yaml
image:
  path: /assets/img/head.png
  alt: 이미지 하단에 표시될 텍스트
```

[`media_subpath`](#url-prefix)에서 지정한 접두사는 이 preview image에도 적용된다. 
즉, `media_subpath`를 설정하였다면 위의 `path`부분에는 파일명만 적어도 된다는 뜻이다.

### Video

#### Social Media Platform

유튜브 등의 소셜 미디어 플랫폼의 영상을 포함시킬 수 있다. 
포함하고 싶다면 아래와 같은 Liquid 문법을 사용하면 된다. (jekyll은 Liquid를 사용한다. [공식문서](https://jekyllrb.com/docs/liquid/)를 참고하라)

{% raw %}
```liquid
{% include embed/{Platform}.html id='{ID}' %}
```
{% endraw %}


`Platform`은 플랫폼의 이름을 말한다. 모두 소문자라는 것을 주의하라. ex)youtube, twitch, ...etc 
`ID`는 해당 비디오의 ID를 말한다.
아래의 표를 보면 알기 쉽다.

| URL                                                                                                | Platform  | ID            |
| -------------------------------------------------------------------------------------------------- | --------- | ------------- |
| [https://www.**youtube**.com/watch?v=**dQw4w9WgXcQ**](https://www.youtube.com/watch?v=dQw4w9WgXcQ) | `youtube` | `dQw4w9WgXcQ` |


위의 표에서 사용한 링크를 예시로 위의 Liquid 코드를 해석하면, 
include를 통해 `embed/youtube.html`{: .filepath }에 `id`를 넘기는 것이다. 
해당 html 파일은 실제로는 `{리포지토리 루트 디렉토리}/_includes/embed`{: .filepath } 디렉토리에 존재한다.

```html
<iframe
  class="embed-video"
  loading="lazy"
  src="https://www.youtube.com/embed/{{ include.id }}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>
```
{: .file='youtube.html' }

{% raw %}
(변수 출력에는 `{{ variable }}`과 같은 문법으로 사용한다.)
{% endraw %}

#### Video Files

만약 서버 내의 파일을 그대로 추가하고 싶다면 아래와 같은 Liquid 문법을 사용한다.

{% raw %}
```liquid
{% include embed/video.html src='{URL}' %}
```
{% endraw %}

(해당 코드도 위와 마찬가지로 이미 존재하는 html 파일에 URL과 기타 속성들을 넘긴 후 포함하는 방식이다.)

`URL`에는 비디오 파일의 경로를 URL로 적으면 된다. 서버 내의 파일이라면 `/assets/video/video.mp4`{: .filepath}
과 같이 될 것이다.


`src`외의 추가적인 속성들도 지정할 수 있다. 아래의 지정가능한 속성들의 리스트를 참고하라.

- `poster='/assets/posters/poster.png'` \- 비디오가 다운로드되는 동안 보일 이미지를 지정한다.
- `title='Text'` \- 비디오 아래에 표시될 제목을 지정한다. 이미지의 Caption과 비슷하다.
- `autoplay=true` \- 비디오의 자동재생 여부를 지정한ㄷ.ㅏ
- `loop=true` \- 비디오의 반복재생 여부를 지정한다.
- `muted=true` \- 오디오의 음소거 여부를 지정한다.
- `types` \- 추가적인 비디오의 확장자를 지정한다. `|`으로 구분한다. 처음 지정한 비디오 파일과 같은 디렉터리에 있어야 한다.

위의 속성들을 사용한 예시는 다음과 같다.

{% raw %}
```liquid
{%
  include embed/video.html
  src='/assets/video/video.mp4'
  types='ogg|mov'
  poster='poster.png'
  title='Example video'
  autoplay=true
  loop=true
  muted=true
%}
```
{% endraw %}

### Audios 

만약 오디오 파일을 포함하고 싶다면 아래의 Liquid 문법을 사용한다.

{% raw %}
```liquid
{% include embed/audio.html src='{URL}' %}
```
{% endraw %}

`URL`에는 오디오 파일의 경로를 URL로 적으면 된다. 서버 내의 파일이라면 `/assets/audio/audio.mp3`{: .filepath}
과 같이 될 것이다.

`src`외의 추가적인 속성들도 지정할 수 있다. 아래의 지정가능한 속성들의 리스트를 참고하라.

- `title='Text'` \- 오디오 아래에 표시될 제목을 지정한다. 이미지의 Caption과 비슷하다.
- `types` \- 추가적인 오디오의 확장자를 지정한다. `|`으로 구분한다. 처음 지정한 비디오 파일과 같은 디렉터리에 있어야 한다.

사용 예시는 아래와 같다.

{% raw %}
```liquid
{%
  include embed/audio.html
  src='/assets/audio/audio.mp3'
  types='ogg|wav|aac'
  title='Example audio'
%}
```
{% endraw %}

## Pinned Posts

하나 이상의 포스트를 HOME 화면에 고정할 수 있다. 고정된 post들은 날짜의 역순으로 정렬된다. 
아래와 같이 _Front Matter_의 `pin`속성을 true로 지정해서 활성화 할 수 있다.

```yaml
pin: true
```

## Prompts

다양한 종류의 프롬프트를 활용할 수 있다. `tip`, `info`, `warning`, `danger`가 있다.
각 타입에 맞는 디자인을 가지고 있다. IAL을 이용해서 `prompt-{type}`과 같은 형식으로 클래스를 추가하면 된다.

```markdown
> Example tip prompt.
{: .prompt-tip }
```
{: .nolineno }

## Syntax

(이 글 내에서도 계속 써왔지만, 다시 한번 문법을 정리한다.)

### Inline Code

아래와 같이 하면 문장에서 바로 코드 형식의 문장을 삽입가능하다.

```markdown
`inline code`
```
{: .nolineno }


### Filepath Highlight

아래와 같이 하면 파일 경로를 강조 표시할 수 있다.

```markdown
`/assets/img/image.png`{: .filepath}
```
{: .nolineno }


### Code Block

아래와 같이 하면 코드 블럭을 쉽게 만들 수 있다. 위에서 yaml, markdown 등의 코드를 표기할 때 쓴 것도 이 코드 블럭에 언어를 지정한 것이다.

````markdown
```
Some Code
```
````

#### Specifying Language

아래와 같이 코드 블럭에 언어를 지정하면 해당 언어에 맞는 테마가 적용된다. 아래의 코드 블럭은 yaml 언어가 지정되었다.

````markdown
```yaml
key: value
```
````
{% raw %}
> Jekyll tag인 `{% highlight %}`는 chirpy 테마에는 호환되지 않는다.
{: .prompt-danger }
{% endraw %}

#### Line Number

언어를 `plaintext`, `console`, `terminal`로 지정하지 않았다면, 기본적으로 라인 넘버가 출력된다.
만약 라인 넘버를 숨기고 싶다면 `nolineno`클래스를 추가하면 된다.

````markdown
```shell
echo 'No more line numbers!'
```
{: .nolineno }
````

#### Specifying the Filename

코드 블럭의 상단에 특정 파일명을 출력하고 싶다면 `file`속성을 추가/설정해주면 된다.
따로 설정하지 않으면 기본적으로 지정한 언어의 이름이 표시된다.

````markdown
```shell
......
```
{: file="path/to/file" }
````

#### Liquid Codes

Jekyll의 markdown 파일은 먼저 Liquid에 의해 처리된 후, markdown 처리기에 의해 처리된다.
그렇기 때문에 Liquid 문법에 걸리면 오류가 발생한다. 이는 코드 블럭 내부라도 적용된다. 
이를 막기 위해서는 raw 태그를 사용해야 한다. 해당 태그에 대한 내용은 [Liquid 문서](https://shopify.github.io/liquid/tags/template/#raw)
를 참고하라.

## Mathematics

chirpy 테마에서는 수학 공식을 표기하기 위해 [MathJax](https://www.mathjax.org/)를 사용한다. 
웹사이트의 퍼포먼스를 기본적으로는 로드되지 않는다. 만약 필요하다면 아래와 같이 _Front Matter_에 `math`속성을 
추가하면 된다.

```yaml
math: true
```
{: .nolineno }

## 기타 디자인 요소

다른 문단에서 설명하지 않은 post 작성에 사용가능한 디자인 요소들을 정리한다.
(몇몇 예시들은 [chirpy의 데모](https://chirpy.cotes.page/posts/text-and-typography)에서 인용하였다.)

### Heading

말 그대로 제목을 의미한다. 보통 각 문단의 제목으로 많이 사용한다. 
디자인 요소뿐만이 아니라 [TOC](#table-of-contents)의 생성에도 관여한다. 
예시를 보자.

```markdown
## Title
......
### Sub Title0
......
#### Sub-Sub Title
......
### Sub Title1
......
```

위와 같이 작성하면, TOC에는 `Title`이 표시되어 있을 것이다. 
`Title`에 들어가게 되면 `Sub Title0`, `Sub Title1`이 `Title` 아래에 표시된다.
`Sub Title0`에 들어가면 `Sub-Sub Title`이 아래에 표시된다. 

이런식으로 `#`의 개수에 따라 각 문단을 계층화 시킨다고 보면 편하다.

아래와 같이 제목을 앵커로 삼아 해당 제목으로 향하는 링크를 걸 수도 있다.

```markdown
## Some Title
......
[Link to Some Title!](#some-title)
```

주의할 점은 모두 소문자로, 공백은 `-`으로 대체해야 한다는 것이다.

만약 작성한 제목을 TOC에 포함시키고 싶지 않다면 아래처럼 `data-toc-skip=''` 속성을 추가/설정 해주면 된다.

```markdown
##Some Title
{: data-toc-skip='' }
```

### Lists

간단한 기호를 통해 목록을 사용할 수 있다. 

#### Ordered list

```markdown
1. First
2. Second
3. Third
```

**출력** 

1. First
2. Second
3. Third

#### Unordered list

```markdown
- Chapter
  - Section
    - Paragraph
```

**출력** 

- Chapter
  - Section
    - Paragraph


#### ToDo list

```markdown
- [ ] Job
  - [x] Step 1
  - [x] Step 2
  - [ ] Step 3
```

**출력** 

- [ ] Job
  - [x] Step 1
  - [x] Step 2
  - [ ] Step 3
  
 
### Description list
 
```markdown 
Sun
: the star around which the earth orbits

Moon
: the natural satellite of the earth, visible by reflected light from the sun
 ```
 
**출력** 

Sun
: the star around which the earth orbits

Moon
: the natural satellite of the earth, visible by reflected light from the sun

### Tables

표 역시 간단한 기호를 통해 표현할 수 있다. 

```markdown
| Company                      | Contact          | Country |
| :--------------------------- | :--------------- | ------: |
| Alfreds Futterkiste          | Maria Anders     | Germany |
| Island Trading               | Helen Bennett    |      UK |
| Magazzini Alimentari Riuniti | Giovanni Rovelli |   Italy |
```

**출력**

| Company                      | Contact          | Country |
| :--------------------------- | :--------------- | ------: |
| Alfreds Futterkiste          | Maria Anders     | Germany |
| Island Trading               | Helen Bennett    |      UK |
| Magazzini Alimentari Riuniti | Giovanni Rovelli |   Italy |

### Link

단순히 주소를 링크하는 경우에는 아래와 같이 한다.

```markdown
<http://127.0.0.1:4000>
```

**출력**

<http://127.0.0.1:4000>


텍스트에 링크를 걸고 싶다면 아래와 같이 한다.

```markdown
[출력되는 내용](http://127.0.0.1:4000)
```

**출력**

[출력되는 내용](http://127.0.0.1:4000)

또한 아래와 같이 웹사이트 링크가 아닌, 서버 내의 pdf파일을 링크하여 뷰어가 해당 파일을 열게 할 수 있다.

```markdown
[Get this File](/assets/Test.pdf)
```

**출력**

[Get this File](/assets/Test.pdf)

### Footnote

인용문의 출처를 기재하거나, 특정 단어나 문장에 부가적인 설명을 달고 싶을 때 주석이 있으면 편리하다. 
아래와 같이 작성하면 주석을 달 수 있다. 숫자를 클릭하면 해당 주석으로 이동한다.

```markdown
주석을 달고 싶은 문장[^footnote-1], 
......
출처가 필요한 글[^footnote-2]
......
### 주석
[^footnote-1]: 주석
[^footnote-2]: 출처
```

**출력**

주석을 달고 싶은 문장[^footnote-1], 출처가 필요한 글[^footnote-2]


## 주석
[^footnote-1]: 주석
[^footnote-2]: 출처
