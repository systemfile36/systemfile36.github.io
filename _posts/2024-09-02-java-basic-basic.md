---
title: Java 기본 - 기본 개념 
date: 2024-09-02 22:00:00 +0900
categories: [Java, Java Basic]
tags: [java, oop, basic]
description: 자바의 기본적인 개념들을 정리
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
본질적으로는 같은 글입니다. )  

## JVM 

자바 가상 머신을 뜻한다.
자바 가상 머신은 자바 바이트 코드를 실행하기 위한 가상의 운영 체제라 볼 수 있다.

C/C++은 컴파일 시에 그 환경에 맞는 바이너리로 바로 컴파일 된다.
그렇기에 사용환경에 따라서 전체 파일에 대한 재 컴파일이 필요하다.
동적 라이브러리로 분리해서 개별적으로 수정하고 컴파일해서 좀 수고를 덜 수는 있지만 제한적이다.

하지만 자바는 컴파일 시에 바로 바이너리로 컴파일 하는 것이 아니라,
자바 가상 머신에서 공용으로 사용되는 바이트 코드로 컴파일 한다.
이 바이트 코드는 운영체제와 상관 없이 모든 자바 가상 머신에서 작동을 보장한다.
즉, 실행할 컴퓨터에 운영체제에 맞는 자바 가상 머신만 설치되어 있다면 개발자는 대상 컴퓨터가 어떤 운영체제인지는 전혀 신경쓰지 않아도 된다는 것이다.

다만 이러한 특성 때문에 처음부터 바이너리를 뱉어내는 C/C++가 달리, 한 과정을 더 거치는 특성상
런타임에서의 전체적인 속도가 약간 느리다는 단점을 지닌다.

## 스택과 힙 영역

**스택(Stack)영역**은 메소드(함수)에 대한 호출 정보와 기본형 변수(int, float, double, boolean, ...) 등이 저장되는 영역이다. 
메소드가 호출될 때 마다 스택에 메소드와 그 안의 지역 변수들이 스택에 쌓이고(push), 값을 리턴하거나 종료되면 제거(pop)된다.

**힙(Heap)영역**은 객체와 배열이 생성되는 영역이다. (사실 자바에선 배열도 객체에 해당한다.)
C/C++에서 malloc을 통해 메모리의 동적할당을 받을 때의 영역도 이 힙 영역이다.
자바에서 객체를 생성하면 인스턴스가 힙 영역에 생성되고, 이 인스턴스에 대한 참조를 변수가 가지게 된다.

```java
String str = new String("Hello, World!");
```

위의 코드는 `String` 객체의 생성자를 통해 새 문자열 인스턴스를 `str`에 할당하는 코드이다. 
해당 `String` 객체의 인스턴스는 힙 영역에 생성되고,
변수 `str`은 이에 대한 참조를 가지게 된다. 즉, `str`은 해당 `String` 객체에 대한 주소를 가진 포인터라고 볼 수 있다.
(물론 개념적으로는 포인터와는 다르다. 하지만 내부적으로는 어느정도 비슷하게 동작한다.)

```c
char* str = (char*)malloc(sizeof(char) * 14);
strcpy(str, "Hello, World!");
```

C언어로 표기하면 대략 위와 비슷한 형태가 될 것이다. 

이 특성은 객체간의 비교를 할 때 중요하다.
`==`, `!=`과 같은 비교 연산을 할 때, 단순히 객체 변수끼리 비교하게 되면 원하는 결과가 나오지 않을 수 있다.

```java
String str1 = new String("Hello, World!");
String str2 = new String("Hello, World!");
return str1==str2;
```

위와 같은 코드는 `false`를 리턴 한다. 왜냐하면 `str1`과 `str2`는 `new` 연산자를 통해 생성된 별개의 객체이기 때문이다. 
그렇기에 비교 연산을 수행하면 서로 다른 객체를 가리키기 때문에 일치하지 않는다고 뜨는 것이다.

즉, 객체에 대한 `==`, `!=`과 같은 연산은 포인터의 주소가 일치하는지 아닌지 확인하는 것과 비슷하다 보면 된다.

객체간의 내용을 비교를 하고 싶다면 각 객체의 `equals()`를 사용하면 된다.
대부분의 객체는 `Object`로 부터 상속받은 `equals()`를 오버라이딩 하여 각 객체에 맞는 비교 연산을 정의했을 것이기 때문에 편하게 사용하면 된다.

## 객체 지향 프로그래밍에 관하여

객체 지향이란 객체간의 상호작용을 통해 프로그래밍을 설계하는 방식이다.
현실 세계의 객체를 추상화하여 필요한 부분만을 가져와 설계한 것이 OOP에서의 객체이다.

프로그램에서의 객체는 기본적으로 필드와 메소드를 가진다.
한 객체와 관련된 특성과 동작들은 그 객체안에 모든 것이 정의 되어야 한다.
또한 한 객체는 하나의 책임을 가져야 한다. 이를 단일 책임 원칙이라 한다. (자세한 건 후에)

### 캡슐화

변수와 그에 대한 함수를 한가지로 묶는 것을 말한다. 그리고 이 과정에서 정보 은닉이라는 개념이 파생된다.

정보 은닉이란, 클래스 외부로 부터 불필요한 정보를 숨기는 것이다.
왜 위와 같은 특성을 지녀야 하는지 살펴보도록 하자.

```java
public class BankAccount {
    public long balance;
     
    public BankAccount(double balance) { this.balance = balance; }
    
    ......
}
```

위의 코드는 `balance`를 `public`으로 설정하여 외부에서 접근할 수 있게 하였다. 이렇게 
캡슐화를 지키지 않게 되면, 

```java
BankAccount ac = new BankAccount(3000);
ac.balance += 1000000;
```

위와 같이, `balance`를 직접 수정할 수 있게 된다. 

물론 당장은 오류가 발생하지 않는다. 하지만, 후에 기능을 확장할 때 문제가 생길 가능성이 크다.

입금 한도를 추가하고 싶은 경우, 위와 같이 외부에서 직접 잔액을 늘리게 되면 입금 한도를 체크하는 부분을 `balance`에 접근하는 모든 곳에 작성해야 한다. 
이는 시간도 많이 걸리고 가독성도 떨어지고, 누락 될 수도 있다.

또한 직접 접근해서 연산하는 과정에서 잔액이 음수가 되거나 하는 경우가 생겨 버그가 생기면, 
원인을 특정하고 수정하는 것조차 어렵게 된다.

이처럼 확장성도, 유지보수의 용이성도 떨어지게 된다. 따라서 아래와 같이 캡슐화를 지켜서 외부에서 직접 접근하지 못하게 한 후, 
필요한 처리는 public 메소드로 정의해서 사용하게 한다.

```java
public class BankAccount {
    private long balance;
     
    public BankAccount(double balance) { this.balance = balance; }
    
    public void deposit(long amount) {
        balance += amount; 
    }

    public void withdraw(long amount) {
        if (amount > balance) {
            System.out.println("잔액이 부족합니다.");
        } else {
            balance -= amount;
        }
    }
}
```

이렇게 `balance`에 접근하는 곳이 `BankAccount` 클래스 내부로 한정되어, 
`balance`와 관련된 오류가 있을 경우 `BankAccount` 내부만 확인하면 된다. 
또한 위와 같이 예외를 처리할 때에도 편리하다.

후에 기능을 추가하고 싶다면 `BankAccount`의 메소드를 수정하거나 만들어서 간단하게 추가할 수 있다.

### 상속

부모 객체에서 자식 객체로 메소드와 필드를 물려 받기 때문에 상속이라 불린다.
다르게 해석하면, 확장이라고 볼 수도 있다. 실제로 자바에서는 `extends` 라는 키워드를 사용한다.

일반적으로 부모로 갈 수록 추상적이고 자식으로 갈 수록 구체적으로 변한다.
기능적으로 보면, 부모에서 자식으로 갈 수록 기능이 확장된다고도 볼 수 있다.

상속에 대한 자세한 내용은 별도의 글에서 서술한다.

### 다형성

같은 타입이지만 다양한 객체를 이용할 수 있는 성질이다. 위의 상속과도 연계된다.
같은 타입에 여러 종류의 객체를 집어넣어 일관되게 사용할 수 있는 것이다.

예시를 통해 살펴보자

```java
public abstract class UIElement {
    public Position pos;
    ......
    public abstract void click();
    ......
}
```

위와 같은 추상 클래스 `UIElement`가 있다. 
이를 실체화한 자식 클래스들을 만든다.

```java
public class Button extends UIElement {
    ......
    @Override
    public void click() {
        //클릭 시의 동작
    }
}
```

```java
public class TextArea extends UIElement {
    ......
    @Override
    public void click() {
        //클릭 시의 동작
    }
}
```

위와 같이 만들어진 자식 클래스들은 각각의 타입으로 변수를 선언할 필요 없이 부모 클래스 타입의 변수에 들어갈 수 있다.

아래의 코드를 보자.

```java
List<UIElement> elements = new List<UIElement>();
Button btn = new Button();
TextArea ta = new TextArea();

elements.add(btn);
elements.add(ta);

for(UIElement e : elements) {
    e.click();
}
```

`List<UIElement> elements`에는 `UIElement`타입만 들어갈 수 있으나, 
각기 다른 클래스의 인스턴스인 `btn`과 `ta`가 정상적으로 들어갔다. 

또한, `for-each`문에서도 각 객체의 타입과는 상관없이 `click`메소드를 실행한다.
이는 부모 객체에서 정의한 추상메소드를 자식 객체가 모두 구현 했기 때문이다.

이와 같이 자식 객체는 부모 객체의 자리에 들어가도 아무 문제가 없고, 없어야 한다. (is-a 관계)

다형성은 추상 클래스 외에도 인터페이스 등으로도 구현될 수 있다. 자세한 것은 별도의 글에서 서술한다.

## 클래스

클래스는 new 연산자를 통해 생성된다.

```java
Example ex = new Example();
```

생성된 클래스의 인스턴스는 힙 영역에 생성되고, 변수 `ex`는 이 인스턴스에 대한 참조를 가지게 된다.

### 필드

필드는 객체가 가지는 데이터를 말한다.
기본 타입, 다른 참조 타입일 수도 있다.

기본적으로 객체의 생성과 동시에 영역이 확보되며, 소멸 시 같이 소멸된다.

### 생성자

생성자는 객체를 생성할 때 호출 된다.
모든 객체는 생성자를 가지고, 없으면 컴파일러가 직접 기본 생성자를 추가한다.
단, 직접 작성한 생성자가 하나라도 있으면 기본 생성자는 추가되지 않는다.

```java
class Example {
    String name;
    int code;
    
    Example() { this("default", 125); }
    Example(String name, int code) { this.name = name; this.code = code }
}
```

위와 같이 매개변수를 받아서 필드를 초기화 하는 용도로 사용하는 경우가 많다.
그 외에도 필요한 초기 작업등을 행한다.

오버로딩과 다른 생성자 호출(`this()`)를 통해 일부 인자만 받아서 필드를 초기화하고 나머지는 기본값을 넣어주는 것도 가능하다.

### 메소드

메소드의 형식과 하는 일은 C 에서 말하는 함수와 거의 같다.
다만 객체 내부에서 객체의 동작을 정의한다는 점에서 개념적으로 약간 다를 뿐이다.

(공통된 부분은 생략)

```java
int sum(int ... values) {
    int sum = 0;
    for(int i = 0; i < values.length; i++){ sum += values[i] }
    return sum;
}
```

위와 같이 " ... "을 사이에 넣어 여러개의 매개변수를 받을 수 있다.
받은 매개변수는 메소드 내부에서 배열처럼 사용할 수 있다.

메소드 또한 오버로딩하여 같은 메소드명으로 다른 타입의 매개변수를 받고, 리턴할 수 있다.

## static

`static` 키워드를 필드나 메소드 앞에 사용하면 각각 정적 필드와 정적 메소드가 된다.

정적 필드와 메소드는 인스턴스가 생성되어야 사용가능한 일반 필드, 메소드와 달리
클래스 로딩이 끝난 시점에서 사용가능하다. 컴파일 타임에 이미 공간이 확보된 것이다.

정적 필드를 초기화할 때 연산 과정을 거치고 싶다면 정적 블록을 사용할 수 있다.

```java
static String defaultName = "default";
static String defaultCode = "00000000";
static String defaultModel;

static { defaultModel = defaultName + "-" + defaultCode; }
```

정적 블록은 클래스 로딩 시점에 자동으로 실행된다.

정적 메소드와 블록에서는 인스턴스 멤버와 메소드를 실행할 수 없다.
(인스턴스는 클래스 로딩 시점엔 사용할 수 없기 때문이다.)

## final

`final` 키워드는 여러 곳에서 사용되지만, 여기선 일단 클래스의 필드에 사용되는 경우만 알아보자

필드 앞에 `final` 키워드가 붙으면 초기값에서 더이상 변경할 수 없음을 뜻한다.

이 `final` 필드는 직접 기본값을 주거나, 생성자에서 초기화 할 수 있다.
`public static final`로 사용해서 전역 상수로 만들 수도 있다.
이 상수는 어디서나 클래스.상수명으로 참조 가능하다.

## 패키지

패키지는 일종의 네임스페이스와 비슷하다.
실제 참조할때에도, 상위패키지명.하위패키지명. ...... .클래스명 으로 사용한다.

사용 이유도 얼추 비슷하다. 여러 팀에서 만든 다양한 클래스를 포함한 모듈들을 사용할 때, 
클래스 이름이 중복될 수도 있고 패키지 이름이 중복될 수도 있다. 

따라서 팀이나 프로젝트명으로 상위 패키지를 만들고 그 아래에 필요에 따라 패키지를 분류하여 관리한다.

```java
package 상위패키지명.하위패키지명;
```

클래스 파일 최상단에 위와 같이 패키지 선언을 하여 관리할 수 있다.

## 접근 제한자

`public`, `protected`, `private`, `default` 등이 있다.

클래스는 `public`, `default` 제한자만을 가질 수 있다.
`public class`는 모든 클래스와 패키지에서 사용할 수 있다.
`class`는 해당 패키지 내에서만 사용할 수 있다.

생성자 또한 접근 제한자를 사용할 수 있다.

`public` 생성자는 아무런 제약 없이 호출될 수 있다.
`protected` 생성자는 같은 패키지에 있거나, 자식 클래스일 때 호출될 수 있다.

`private` 생성자는 해당 객체 내부를 제외한 어디에서도 호출될 수 없다.
생성자의 접근을 제한은 빌더(Builder)를 따로 만들어 사용하거나,
별개의 `static` 팩토리 메소드를 만들어 객체 생성을 통제하기 위해서 사용한다. 
(디자인 패턴에 대해서는 별개의 글에서 언급)

필드와 메소드 또한 접근 제한자를 사용할 수 있다.
보통 외부에서 접근하길 원하지 않는 필드나 메소드를 숨기고 싶을 때 `private`로 사용한다.
위의 정보은닉에 대해서 다룰 때도 언급했듯이, 필드에 직접 접근하는 것을 막는 것이 디버깅에 유리하다.

보통 필드들을 `private`로 숨기고 Getter, Setter 메소드를 따로 만들어 조회하거나 설정하게 한다.

```java
class Example {
    private String name;
    private String code;
    ......
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    ......
}
```

굳이 이렇게 하는 이유는, 유지보수와 확장에 유리해지기 때문이다.

위의 코드에서 name에 길이 제한이 필요하다면 단순히 `setName` 부분을 수정하면 된다.

만약 Getter, Setter를 사용하지 않고 필드에 직접 접근하여 사용하고 있었다면 접근하는 
모든 부분에 길이 제한 코드를 삽입해야 할 것이다. 이렇게 하면 시간도 걸리고 누락될 가능성도 있다.

## 어노테이션

어노테이션은 뜻 자체는 단순히 주석이라는 의미이다.
어노테이션은 컴파일러나 소프트웨어 개발 툴에게 정보를 제공할 수도 있고,
또한 런타임에 참조하여 추가적인 처리를 할 수 있게 해준다.
`@Override`나 `@Deprecated`, `@SuppressWarnings` 등등의 내장 어노테이션들은
조건에 맞지 않으면 컴파일 에러나 경고를 발생시킨다.
이외에도 직접 어노테이션을 만들어 런타임에 참조하여 특정 어노테이션의 존재여부에 따라 분기하거나 엘리먼트를 조회하여 추가 정보를 얻을 수 있다.
이에 대한 자세한 내용은 다른 글에서 언급한다.