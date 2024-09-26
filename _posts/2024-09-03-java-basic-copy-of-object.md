---
title: Java 기본 - 객체의 복사 (얕은 복사, 깊은 복사)
date: 2024-09-03 16:00:00 +0900
categories: [Java, Java Basic]
tags: [java, oop, basic, copy, factory, shallow, deep]
description: 자바에서 객체를 복사하는 방법과, 개념 서술
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
(좀 더 수정되긴 하였지만)본질적으로는 같은 글입니다. )  

## 개요

프로그래밍을 하다보면 객체의 복사본을 만드는 것이 유용할 때가 존재한다.
매개변수로 전달할 때 원본 객체를 변형할 수 없게 하기 위해서 복사본을 대신 넘길 수 있다.

기존 객체에서 일부만 변경한 새로운 객체를 만들고 싶을 때는 복사본을 만들고 변경하는 것이 더 빠를 것이다.

객체를 새로 생성하는 과정이 복잡하고 오버헤드가 심하다면, 오브젝트 풀링 같은 느낌으로
객체의 복사본을 여러개 만들어 놓고 변경하여 사용하고, 다시 반환하는 형태로 사용할 수 있다.

이러한 복사본을 사용할 때에는 목적에 맞게 얕은 복사를 사용할 지 깊은 복사를 사용할 지, 
복사 한다면 그 방법은 어떻게 할지 적절히 선택하여 사용하여야 한다.

## 얕은 복사와 깊은 복사

객체와 같은 참조 타입의 복사에는 **얕은 복사(shallow copy)**와 **깊은 복사(deep copy)**가 있다.

**얕은 복사(shallow copy)**는 참조만을 복사하는 것을 말한다.

```java
int[] arr = { 1, 2, 3, 4, 5 };
int[] copied = arr;
```

위와 같이 단순 대입만 하게 되면 참조만 복사되는 얕은 복사가 일어난다.
즉, 실제 힙 영역에 같은 내용을 가진 새 배열을 만들고 참조를 가져온 것이 아니라
이미 만들어진 배열에 대한 참조만 가져온 것이다.

`arr`과 `copied`는 같은 배열을 가리키고 있을 것이다. C로 비유하면 같은 주소값을 가진 포인터 두개 인것이다.
따라서 원본 `str`이 변경되면 `copied`도 영향을 받게 된다.

참조 타입을 매개변수로 넘기는 것도 어찌보면 얕은 복사라고 할 수 있다. (참조값을 넘기는 것이기 때문)

물론 `String`과 같은 불변객체라면 얕은 복사로도 문제가 생기지 않을 것이다.
오히려 불필요한 객체가 힙에 생기지 않으므로 메모리 효율 차원에서는 좀 더 좋을 것이다.

**깊은 복사(deep copy)**는 원본과 독립된 새로운 객체를 만드는 것을 말한다.
참조 타입이라면 같은 내용을 가진 새로운 객체를 힙 영역에 생성한 뒤 참조를 대입한다.

```java
int[] arr = { 1, 2, 3, 4, 5 };

int[] copied = Arrays.copyOf(arr, arr.length);

int[] copied2 = new int[arr.length];
System.arraycopy(arr, 0, copied2, 0, arr.length);
```

위와 같이 깊은 복사를 수행하면 원본과는 독립된 새로운 배열이 생성된다.

이제 객체를 복사하는 방법을 알아보자.
객체를 복사하는 방법에는 여러가지가 있지만,
기본적으로 `clone` 메소드, 복사 생성자, 정적 팩토리 메소드 등으로 구현한다.
(얕은 복사는 단순 대입이나 `Object.clone()`의 호출로 충분하므로 깊은 복사에 대해서만 서술한다.)

## clone 메소드

`clone` 메소드는 `java.lang.Object`에 아래와 같이 정의된 메소드이다.
`protected Object clone() throws CloneNotSupportedExcption`

해당 메소드에 대한 자세한 내용은 아래의 링크를 참고하라.

[링크](/posts/java-java-api-object/#clone)


## 복사 생성자

복사 생성자는, 이름 그대로 복사를 목적으로 만들고 사용하는 생성자이다.

```java
public class Student {
    private String name;
    private int age;
    private Address address;
    ......
    public Student(Student origin) {
        this.name = origin.name;
        this.name = origin.age;
        this.adresss = new Address(origin.adress);
    }
    ......
}
......
public class Address {
    private String city;
    private String zip;
    ......
    public Address(Address origin) {
        this.city = origin.city;
        this.zip = origin.zip;
    }
    ......
}
```

복사 생성자는 매개변수로 원본 객체를 받아서 해당 객체의 필드를 자신의 필드로 복사하는 식으로 작동한다.

기본 타입이나 불변객체라면 단순히 자신의 필드에 원본의 필드를 대입하는 것으로 충분하고,
가변 객체라면 위와 같이 해당 객체의 복사 생성자를 통해 깊은 복사를 할 수도 있다.

만약 상속을 했다면 상위 클래스의 복사 생성자를 호출하여 상위 클래스 필드를 복제한 후, 해당 클래스의 필드를 복제하는 식으로 모든 필드를 완전히 복사할 수 있다.

```java
public class Person {
    private String name;
    private int age;
    public Person(String name, int age) { this.name = name; this.age = age; }
    public Person(Person origin) {
        this.name = origin.name;
        this.age = origin.age;
    }
    ......
}
......
public class Student extends Person {
    private String grade; 
    private String sNum;
    public Student(String name, int age, String grade, String sNum) {
        super(name, age);
        this.grade = grade;
        this.sNum = sNum;
    }
    public Student(Student origin) {
        super(origin);
        this.grade = origin.grade;
        this.sNum = origin.sNum;
    }
    ......
}
```

복사 생성자를 사용하면 여러 장단점들이 있다.

기본적으로 생성자이기 때문에 객체의 초기화 과정이 일원화 되지 않는 현상이 없다.

마찬가지로 생성자이기 때문에 별도의 타입 변환 과정 없이 자기 자신의 타입에만 들어가도록 컴파일러가 강제하므로 런타임에 타입 에러가 날 걱정이 없다.

복사하는 과정을 직접 하나하나 구현하므로 세밀하게 조정할 수 있다. 
원하는 필드만 선택적으로 복제하거나, 참조형 객체더라도 일부는 얕은 복사를 하고 일부는 깊은 복사를 하는 등의 작업이 가능하다.

하지만 모든 필드에 대해서 복제 작업을 거쳐야 하기에 필드가 많아진다면 수고가 많아진다는 단점도 가진다.
또한 호출 할때마다 new 키워드로 호출해야 하는 것도 귀찮을 수 있는 부분이다.
그리고 복사 과정은 유연하게 조정할 수 있지만, 생성자이기 때문에 같은 타입을 받는 새로운 메소드로 오버로딩할 수가 없다. 
다른 부분에서는 유연성이 떨어지는 것이다.

## 정적 팩토리 메소드

정적 팩토리 메소드는 복사본 등의 인스턴스를 생성해서 반환하는 정적 메소드를 말한다.

디자인 패턴 중 하나로, 복사 뿐만 아니라 생성자를 숨기고 인스턴스 생성 역할을 대신하거나, 
객체의 생성 조건을 검사하는 등의 경우에도 사용되지만 여기서는 일단 복사에 대해서만 언급한다.
(그 외에는 별도로 디자인 패턴에 대해 다룬 글에서...)

```java
public class Student {
    private String name;
    private int age;
    private Address address;
    ......
    public static Student copyOf(Student origin) {
        Student copy = new Student();
        copy.name = origin.name;
        copy.age = origin.age;
        copy.address = Address.copyOf(origin.address);
        return copy;
    } 
    ......
}
......
public class Address {
    private String city;
    private String zip;
    ......
    public static Address copyOf(Address origin) {
        Address copy = new Address();
        this.city = origin.city;
        this.zip = origin.zip;
        return copy;
    }
    ......
}
```

위와 같이 새로운 복사본을 만들어서 리턴하는 정적인 메소드를 만들어서 사용한다.
복사하는 과정은 다른 방법과 크게 다르지 않다.

다른 방법과의 차별점이라면 사용자가 직접 만드는 메소드인 만큼 제약이 없다는 점이 있다.
자기 자신과 같은 타입을 받아야 한다거나 받는 매개변수가 하나여야 한다거나 하는 제약이 일절 없다.

오버로딩을 통해 구조는 비슷하지만 타입이 다른 객체를 받아서 알맞게 가공한 뒤 복사본을 만들 수도,
여러개의 객체나 매개변수를 받아서 적절히 조합하여 반환할 수도 있다.

```java
public class Member {
    private String name;
    private int age;
    ......
    //getter, setter
    ......
    public static Member copyOf(Student origin) {
        Member copy = new Member();
        copy.name = origin.getName();
        copy.age = origin.getAge();
        return copy;
    }
}
......
public class Student {
    private String name;
    private int age;
    private String sNum;
    ......
    //getter, setter
    ......
    public static Student copyOf(Member origin, String sNum) {
        Student copy = new Student();
        copy.name = origin.getName();
        copy.age = origin.getAge();
        copy.sNum = sNum;
        return copy;
    }
}
```

또한 멀티스레드 환경에서 사용하기 위해 `synchronized` 키워드 등을 통해 스레드 세이프하게 만들 수도 있다.

```java
public static synchronized Student copyOf(Member origin, String sNum) { ...... }
```

그 외에도 객체 생성에 코스트가 많이 드는 경우에 기존 객체를 재사용하는 것에도 쓸 수 있다.

```java
public class Student {
    private static final Map<Student, Student> cache = new HashMap<>();
    ......
    public static Student copyOf(Student origin) {
        return cache.computeIfAbsent(origin, (key) -> {
            Student temp = new Student();
            //key에서 각종 필드 복사
            return temp;
        });
    }
    ......
}
```

`cache`는 원본을 키값으로 복사본을 보관하는 캐시이다.

`copyOf`는 매개변수로 받은 원본을 키값으로 삼아 `cache`를 탐색한 후, 키가 존재하면 그대로 리턴하고
존재하지 않는 다면 복사본을 만들어 `cache`에 넣은 후 리턴한다.

이미 복사본으로 만든 적이 있다면 새로 만들지 않고 캐시에서 불러오는 것이다.
물론 해당 객체는 불변 객체인 것이 독립성을 유지하는데 좋다.

만약 불변 객체가 아닌데 캐시를 사용하고 싶다면,
별도의 팩토리 클래스를 만들어서 오브젝트 풀링을 하는 방법도 있다.

`computeIfAbsent`는 키값과 람다식을 받아서 키값에 해당하는 값을 찾는다.
찾았다면 그 값을 그대로 리턴하고, 찾지 못했다면 람다식에 인자로 받은 키값을 넘긴 후 람다식을 실행한다.
그리고 람다식이 리턴한 값을 맵에 `put`한 뒤 리턴한다.

보다 자세한 내용은 컬렉션에 대한 글에서 서술하고 여기서는 대충 저런식으로 캐시를 구현하는구나라고 생각하자.

팩토리 메소드는 여러개 만들어도 상관없으므로 용도에 따라 다른 정적 메소드를 만들 수 있다.

깊은 복사를 수행하는 `deepCopy` 메소드를 별도로 만들어서 의도를 명확히할 수도,
사용자에게 필요에 따라 선택적으로 깊은 복사를 수행하게할 수도 있다.

## 각 방법의 장단점

- `clone` 메소드의 장점
	- 구현 시 이미 존재하는 `Object`의 `clone` 메소드를 재사용하여 코드를 줄일 수 있다. 
	기본 타입과 불변 객체는 `Object.clone()`이 반환한 값을 그대로 사용하고, 그 외의 가변 객체만 별도로 가공하면 된다.
	- 표준 메소드이므로 널리 알려져 있다.
	- 제대로 구현할 경우 빠른 속도를 보여준다. 이 장점은 상속 관계가 깊게 얽혀있을 수록 돋보인다.
	
- `clone` 메소드의 단점 
	- 구현하는 과정에 주의를 많이 기울여야 한다. 특히 상속 관계가 얽혀 있다면 모든 상위 객체가 `clone`을 적절히 오버라이딩 하여야 한다. 
	그렇지 않으면 누락되는 필드가 생기는 등의 문제가 생길 수 있다. 
	또한 객체가 필드에 다른 객체를 가진다면 그 객체에 대한 `clone`도 호출해야한다. 
	이 과정에서 순환 참조가 일어날 수도 있다.
	(A와 B가 서로에 대한 참조를 가진 경우, A의 `clone`에서 B의 `clone`을 호출 -> B의 `clone`은 A의 `clone`을 호출 -> 반복 -> 스택 오버플로우). 
	이를 막기 위한 조치도 고려하여야 한다. (별도의 캐싱 등)
	- 인스턴스 생성 시 생성자를 거치지 않기 때문에, 객체가 생성되는 부분이 여러부분이 된다. 
	만약 객체가 생성되는 개수를 제한하고 싶다거나 생성자에서 특정한 초기화 작업을 거쳐야만 한다면 머리가 아파질 것이다.
	- 반환 형이 `Object` 타입이므로 사용할 때마다 타입 캐스팅을 해야한다.
	- `Checked Exception`인 `CloneNotSupportedException`을 던지므로 `throws`나 `try-catch` 등으로 처리해주어야 한다.
	
<br/>

- 복사 생성자의 장점 
	- 생성자를 통해 객체를 생성한다는 기본 구조를 벗어나지 않으면서도 복사를 구현할 수 있다.
	- 직접 복사 과정을 작성하므로 세세한 부분을 조정할 수 있다. 원하는 필드만 복사하거나, 
	가변 객체 필드 중 일부만 깊은 복사를 하고 일부는 얕은 복사로 사용하는 등의 처리를 손쉽게 조정할 수 있다.
	- 생성자이므로 컴파일 타임에 타입 체크가 이루어져서 안전하다. 런타임에 타입 에러가 나지 않는다. 
	`clone()`은 타입 캐스팅을 거치기 때문에 타입 에러가 날 가능성이 존재한다.
	- 복제할 객체를 받아서 자신의 필드에 대입하는 방식이기에 직관적이다.
	- 복사 생성자 내에서 상위 객체의 복사 생성자를 사용할 때, 직관적이다. 
	단순히 `super()`에 매개변수로 자신이 받은 것을 넘기면 된다. 
	정적 팩토리 메소드의 경우에는 `super` 키워드를 사용할 수 없어 상위 객체의 이름으로 접근해야 해서 비직관적이다.
	
- 복사 생성자의 단점
	- 생성자이므로 호출할 때 `new` 키워드를 사용해야 한다.
	- 같은 타입을 받는 생성자는 하나만 있을 수 있다. 정적 팩토리 메소드처럼 상황에 맞게 선택할 수 있게 해주는 것이 불가능하다.
	- 직접 모든 필드에 대해 복사 과정을 수동으로 작성해야하므로 필드가 많아지면 코드가 길어질 수 있다.
	- 복사 생성자는 대체로 어디에서나 접근할 수 있으므로, 복사를 제한해야할 상황이 생겨도 제한할 수 없다.
	
<br/>

- 정적 팩토리 메소드의 장점
	- 이름을 직접 지정할 수 있으므로 의도에 따라 명확하게 작성할 수 있다.
	- 용도에 따라 각각 다른 이름의 메소드를 만들어서 사용자에게 선택의 폭을 늘림과 동시에 의도가 코드에 드러나게 할 수 있다. 
	(`deepCopy()`를 통해 깊은 복사를 별도로 만드는 등)
	- 직접 만드는 메소드인 만큼 오버로딩 등을 통해 다양한 상황에 맞는 메소드들을 만들 수 있다. 
	구조가 비슷한 다른 클래스를 받아서 복사본을 만들어 반환하거나 여러개의 매개변수를 받거나 콜백을 사용하는 등 구현하기 나름이다. 
	물론 이름을 적절히 설정해야 할것이다.
	- 복사 과정을 세세히 조정할 수 있기 때문에 원하는 대로 커스텀할 수 있다.
	- 생성자를 숨기고 팩토리 메소드들만 드러냄으로서 객체의 생성이나 복사를 횟수등의 조건에 따라 제한하는 등 객체의 생성/복사를 통제하고 제어할 수 있다. 
	이를 통해 복잡한 복사 로직도 구현하기에 따라 충분히 가능하다.
	- `synchronized` 키워드 등을 통해 스레드-세이프하게 만들어 멀티스레딩 환경에서의 안정성을 확보할 수 있다. 
	`Concurrent` 컬렉션들을 통해 캐싱 또한 스레드-세이프하게 만들 수 있는 등 활용도는 다양하다.
	
- 정적 팩토리 메소드의 단점
	- 이름을 직접 지정하는 만큼 일관성이 없다. 명확한 명명규칙을 정해놓지 않으면 객체마다 서로 다른 팩토리 메소드들의 이름들 때문에 혼동할 수 있다.
	- 마찬가지로 이름 때문에 해당 객체에 인스턴스 생성이나 복사를 담당하는 메소드가 있는지, 각각의 용도는 어떻게 되는지 알아내는 것부터가 번거로울 수 있다.
	- 정적 메소드이기에 super 키워드를 사용할 수 없다. 따라서 상위 객체의 필드들을 복제하고 싶다면 상위 객체의 정적 팩토리 메소드를 호출해야 한다. 
	직접 상위 객체의 이름으로 접근해야 하기 때문에 무슨 목적으로 호출한 건지 직관적이지 않다.
	
<br/>

이러한 장단점에 따라 각각 적합한 상황을 대략적으로 보자.
단순한 구조의 객체나 불변 객체라면 간단한 복사 생성자나 캐싱 등의 작업을 하기 편리한 정적 팩토리 메소드가 어울릴 수 있다.

상속 관계가 복잡하다면 구현 또한 복잡하지만 clone 메소드가 높은 성능을 뽐내줄 것이다.

타입 안정성과 직관적인 것을 원한다면 복사 생성자가 좋을 것이다.
객체 생성/복사 과정을 통제하거나 상황에 따라 다양한 방식으로 생성/복사 하고 싶다면 정적 팩토리 메소드가 적절할 것이다.

물론 반드시 상황에 따라 다른 것을 사용할 필요는 없다. 오히려 여러개를 같이 사용하는 경우도 많이 있다.
추상적인 상위 객체에서는 복사 생성자를 사용하지만 복잡해진 하위 객체들에서는 정적 팩토리 메소드나 `clone` 메소드를 사용할 수도 있다.
한 객체가 세 가지 중 두개 이상을 가지고 있어도 된다.