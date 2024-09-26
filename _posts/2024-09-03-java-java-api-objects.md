---
title: Java 기본 API - Objects
date: 2024-09-03 17:00:00 +0900
categories: [Java, Java API]
tags: [java, oop, basic, copy, objects, compare]
description: 자바 기본 API 중, Objects에 관한 내용을 서술
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
(좀 더 수정되긴 하였지만)본질적으로는 같은 글입니다. )  

## Objects 클래스

Objects 클래스는 객체의 연산에 유용한 유틸리티들이 정적 메소드로 포함된 클래스이다.
해당 정적 메소드들을 활용하면 직접 구현하지 않고도 많은 작업을 간단하게 할 수 있다.

### compare

`int compare(T a, T b, Comparator<? super T> c)`
: 두 객체를 받아서 `Comparator`구현 객체의 `compare`메소드로 비교한 후, 결과값을 정수로 리턴한다. 
서로 같다면 `0`, `a > b`라면 `1`, `a < b`라면 `-1`을 리턴한다. 

객체를 비교하는 방법을 매번 실행 코드에서 작성하거나 각 객체마다 각기 다른 메소드를 쓰는 것 보다는,
비교 방법을 정의한 `Comparator`를 만드는 것이 일관성에도, 편의성에도 좋은 영향을 줄 것이다.

`T`나 `<? super T>`는 제네릭 키워드로 자세한 건 후에 다룬다.

일단은 `T`는 비교하는 객체의 타입을 나타내고, `<? super T>`는 해당 타입의 하위 객체를 나타낸다고 보면 된다.
이 메소드를 사용하기 위해서는 아래와 같이 `Comparator` 인터페이스를 구현해야 한다.

```java
public interface Comparator<T> {
    int compare(T a, T b);
}
```

비교하고자 하는 객체 타입을 `T` 대신 넣으면 치환된다.
아래와 같이 사용한다.

```java
public class Test {

	public static void main(String[] args) {
		Member m1 = new Member("Test", 1000);
		Member m2 = new Member("Test2", 1000);
		
		int com = Objects.compare(m1, m2,new Member.MemberComparator());
		System.out.println(com);
	}
	
	public static class Member {
		private String name;
		private int code;
		
		public Member(String name, int code) {
			this.name = name; this.code = code;
		}
		......
		public int getCode() {
			return this.code;
		}
		public static class MemberComparator implements Comparator<Member> {
			@Override
			public int compare(Member a, Member b) {
                //정수를 비교하는 static 메소드
				return Integer.compare(a.getCode(), b.getCode());
			}
		}
	}
}
```

따로 선언하는 것이 귀찮다거나 재사용하지 않을 것이라면 익명 구현 객체로 구현할 수도 있다.

```java
int com = Objects.compare(m1, m2, new Comparator<Member>() {
    @Override
	public int compare(Member a, Member b) {
		return Integer.compare(a.getCode(), b.getCode());
	}
});
System.out.println(com);
```

### equals

`boolean equals(Objcet a, Object b)`
: `a`와 `b`의 일치 여부를 `boolean`으로 반환한다. 두 값이 모두 `null`이 아니라면, 
`a.equals(b)`의 값을 리턴한다. 둘 중 하나가 `null`이라면 `false`를, 둘 다 `null`이라면 `true`를 
반환한다.

### deepEquals

`boolean deepEquals(Object a, Object b)`
: 두 값이 `null`이 아니고, 배열이 아니라면 위의 `equals`와 똑같이 동작한다. 
만약 두 값이 `null`이 아닌 배열이라면, 배열 내의 모든 항목값의 일치 여부를 확인하여 `boolean`으로 리턴한다.

`a`, `b` 모두 `null`이 아닌 배열일 경우, 해당 메소드가 반환하는 값은 `Arrays.deepEquals(Object[] a, Object[] b)`
와 같다. 

### hash

`int hash(Object... values)`
: 여러개의 값을 받아서 고유한 해시코드를 반환한다. 

매개변수로 받은 인자들을 배열로 만들어서 `Arrays.hashCode(Object[])`를 호출하는 방식으로 동작한다.

따라서 여러 종류의 값을 가진 객체 간에도 손쉽게 고유성을 어느정도 보장하는 해시코드를 얻을 수 있다.
보통은 아래 처럼 해시테이블 등을 이용하기 위해 `hashCode()`를 오버라이딩할 때 사용한다.

```java
public class Member {
    private String name;
    private String code;
    private int age;
    ......
    @Override
    public int hashCode() {
        return Objects.hash(name, code, age);
    }
}
```

물론 전부 `String`으로 만들어서 이어붙인 후 `String` 객체에 정의된 `hashCode`를 호출하거나,
필드들을 조합하고 가공하여 해시값을 생성하는 독자적인 로직을 만들수도 있겠지만
대체로 복잡하고 힘들면서도 비효율적인 코드가 되기 쉽다.

따라서 대부분 위와 같이 `Objects.hash()`를 사용하는 것이 쉬우면서도 효율적일 것이다.

허나 사용할 때에 주의할 점이 있다.
이 `Objects.hash(Object... values)`는 선언에서도 볼 수 있듯이 여러개의 값을 받을 수 있다.

물론 하나의 값을 넣을 수도 있다. 넣어도 특별한 오류 없이 값을 반환한다.
하지만 반환된 값은 그 객체의 해시값과는 다른 값이다. 예시로 살펴보자.

```java
//Member의 hashCode()는 오버라이딩 되지 않았음
Member m1 = new Member("Test", 1234);
Sytem.out.println(m1.hashCode());
System.out.println(Objects.hash(m1));
```

얼핏 보면 두번의 `println`은 서로 같은 값을 출력할 것 같지만, 실제로는 서로 다른 값이 출력된다.

`Member`의 `hashCode`는 `Object`에 정의된 것으로 해당 인스턴스의 내부 주소에 기반해서 값을 반환한다.
`Objects.hash()`는 넘겨진 값을 통해 배열을 만든 후 `Arrays.hashCode(Object[])`를 호출하여 값을 반환한다.

즉 위의 코드에서 `m1.hashCode()`는 `m1`에 대한 내부 주소로 만들어진 값을,
`Objects.hash(m1)`은 `m1`이라는 요소 하나로만 구성된 배열에 대해 `Arrays.hashCode`가 생성한 값을 반환한다.

당연히 다를 수 밖에 없는 것이다. 이는 `Member`가 `hashCode`를 적절히 오버라이딩 했어도 같다.
따라서 단일 객체에 대한 정확한 해시값을 얻고 싶다면 `Objects.hashCode(Object o)`를 사용하거나,
해당 객체의 `hashCode()` 메소드를 호출해야 한다.


### hashCode

`int hashCode(Object o)`
: 인자로 받은 `o`의 해시코드를 반환한다.

해당 메소드는 매개변수로 받은 객체가 `hashCode()`를 오버라이딩 하였다면 해당 메소드를 실행하고, 
아니라면 해당 객체에 대한 `Object`의 기본 `hashCode()`를 호출한다.

즉, 매개변수 `obj`에 대해 `obj.hashCode()`를 한것과 같은 효과를 낸다.
그럼에도 이 메소드를 사용하는 이유는 `null` 일때 `0`을 반환한다는 특수성 때문이다.

### isNull

`boolean isNull(Object obj)`
: 매개변수 `obj`가 `null`이라면 `true`, 그 외에는 `false`를 리턴한다.

단순한 `null` 체크용 함수이다. 

후에 언급할 함수적 인터페이스 중 하나인 `Predicate`에 사용하거나 `Stream`의 `filter`에도 사용할 수 있다.
특정 컬렉션에서 `null`인 요소만 제거하거나, `null`이 아닌 요소만 고르는 등에 사용할 수 있을 것이다.

### nonNull

`boolean nonNull(Object obj)`	
: 매개변수 `obj`가 `null`아니라면 `true`, 그 외에는 `false`를 리턴한다.

### requireNonNull

`T requireNonNull(T obj)`
: 매개변수로 받은 객체가 `null`인지 여부를 체크한 뒤,
`null`이 아니라면 매개변수로 받은 객체를 그대로 리턴하고,
`null`이라면 `NullPointerException`을 `throw` 한다.

이름 그대로 `null`이 아닐 것을 요구하는 곳에 대입할 때 사용할 수 있다.
메소드나 생성자에서 매개변수로 받은 것의 `null` 체크를 하기 위해서 사용한다.
비교를 위해 먼저 고전적인 방법을 알아보자.

```java
public Student(String name, String code) {
    if((name == null) || (code == null)) {
        throw new NullPointerException();
    }
    this.name = name;
    this.code = code;
}
```

`if`문을 통해 매개변수의 `null` 여부를 체크 한 후 `null` 이라면 예외를 던지고, 아니라면 필드에 대입한다.

의도 자체는 명확히 전달되긴 하지만 코드가 좀 길어지고 지저분해진다.
`Objects.isNull()`을 사용하더라도 어차피 if문을 사용해야 하기에 코드 길이에는 별 영향은 없다.

게다가 각 필드마다 예외에 대한 메시지를 넘기고 싶다면 코드가 더 길어진다.
하지만 `requireNonNull`을 사용하면 간단해진다.

```java
public Member(String name, String code) {
    this.name = Objects.requireNonNull(name);
    this.code = Objects.requireNonNull(code);
}
```

순서는 조금 달라지겠지만 사용하는 측에서는 `if`문을 사용한 것과 별 다를 바 없는 결과를 얻을 수 있다.
이와 같이 `null`이 아닐 때에만 대입하고 그 외에는 예외를 던져야 하는 상황에서 쓸만하다.

`T requireNonNull(T obj, String msg)`
: 기본형과 같지만, `obj`가 `null`일 경우 `throw` 하는 예외에 `msg`를 넘긴다.

즉, `obj`가 `null`이 아닐경우에는 기본형과 같이 `obj`를 그대로 리턴하지만
`obj`가 `null`이라면 `NullPointerException(msg)`를 `throw` 한다.

```java
this.name = Objects.requireNonNull(name, "Name is Null!");
```

주로 `null`이 발생한 객체나 대입할 필드, 변수 등에 대한 정보를 메시지로 전달하기 위해 사용한다.
위 처럼 "Name is Null!"이라는 메시지를 통해 매개변수 중 `name`이 `null` 이라는 점을 전달하거나 하는 식이다.


`T requireNonNull(T obj, Supplier<String> msgSupplier)`
: 메시지를 넘긴다는 점에서 위와 같지만, 직접 `String`을 받는 대신 `Supplier<String>`의 구현 객체를 받아서
해당 객체의 `get` 메소드를 통해 메시지를 얻는다는 점이 다르다.

```java
this.name = Objects.requireNonNull(name, new Supplier<String>() {
    public String get() {
        return "Name is Null!";
	}
});
```

물론 위 처럼 익명 객체로 작성하기 보다는 아래 처럼 람다식을 주로 사용한다.

```java
this.name = Objects.requireNonNull(name, () -> {
	return "Name is Null!";
});
```

```java
this.name = Objects.requireNonNull(name, () -> "Name is Null!");
```

위의 예시처럼 간단한 메시지라면 그냥 `String`으로 넘기는 게 더 간단하고 읽기도 편할 것이다.
하지만 에러 메시지에 좀 더 자세한 메시지를 담기 위해 별도의 가공 과정이 들어가는 경우에는 유용할 것이다.
(변수등을 통해 결합 하고 싶은 경우 등등)