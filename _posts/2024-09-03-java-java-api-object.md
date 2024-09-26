---
title: Java 기본 API - Object
date: 2024-09-03 14:00:00 +0900
categories: [Java, Java API]
tags: [java, oop, basic, api, object, equals]
description: 자바의 API중, Object 클래스를 정리
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
본질적으로는 같은 글입니다. )  

## 개요

자바에서 제공하는 기본 API들에 대한 정보는 [공식 도큐먼트](https://docs.oracle.com/javase/8/docs/api/)에서 상세히 확인할 수 있다.
그 외의 다른 버전에 대한 정보나 오라클 DB, 오라클 클라우드 관련도 찾을 수 있다.

특정 API에 대한 정보를 알고 싶다면 그때그때 도큐먼트 항목을 보는 것이 가장 정확하다.

하지만, 자주 사용하는 것에 대해서는 숙지를 해놓는 것이 시간 단축에도 도움이 될것이다.

따라서 주로 사용하는 API에 대해서는 따로 정리하고자 한다.
이 외의 API에 대한 것은 그때그때 관련 도큐먼트의 링크등을 참고하면 된다.

## Object 클래스

`Object` 클래스는 모든 클래스의 계층도에서 최상위에 위치한 클래스이다.
즉, 모든 클래스는 `Object`의 하위 클래스이다.

따라서 모든 클래스는 `Object`에 포함된 모든 메소드를 활용할 수 있다.
`Object`에는 메소드만이 정의되어 있다.

객체의 일치 확인 연산이나, 객체 정보 반환, 그 외 스레드 관련 메소드 등이 있다.

### equals

`public boolean equals(Object obj)`
: `obj`가 해당 객체와 일치하는 지 여부를 `boolean`으로 반환한다.

매개 변수로는 모든 클래스가 들어갈 수 있다. (모든 객체는 `Object`의 하위 객체이므로)

`Object`에 정의된 기본 `equals` 메소드는 일치 연산자(`==`)과 같은 결과를 `return` 한다.
완전히 같은, 즉 같은 인스턴스를 가리킬때에만 `true`를 리턴하게 된다.

```java
public class Test {
	public static void main(String[] args) {
		Member m1 = new Member("Test", 1234);
		Member m2 = new Member("Test", 1234);
		System.out.println(m1 == m2);
		System.out.println(m1.equals(m2));
	}
	public static class Member {
		private String name;
		private int code;
		public Member(String name, int code) {
			this.name = name; this.code = code;
		}
	}
}
```

```console
false
false
```

위의 코드에서 `Member` 타입 `m1`과 `m2`가 가진 인스턴스는 모든 필드값이 서로 같다.

하지만 일치 연산자와 `equals` 메소드는 둘 다 `false`를 리턴한다.
이는 값은 같지만 서로 다른 인스턴스를 가리키기 때문이다.

하지만 `String`의 `equals` 메소드는 같은 문자열을 가지면 서로 다른 인스턴스라도 `true`를 리턴한다.

```java
String str1 = new String("Test");
String str2 = "Test";
System.out.println(str1 == str2);
System.out.println(str1.equals(str2));
```

```console
false
true
```

이는 `String` 클래스가 `equals` 메소드를 오버라이딩 했기 때문이다.
객체의 주소로 일치 여부를 판단하는 `Object`의 `equals`	를 오버라이딩하여 문자열의 내용으로 일치 여부를 판단하는 것으로 바꾼 것이다.

이와 같이 논리적으로 같은 객체는 `equals`를 통해 비교했을 때 `true`를 리턴하도록 오버라이딩 해야한다.
`equals`의 법칙은 공식 문서에도 나와 있다.

공식 문서에 따르면 `equals`를 구현할 때의 규칙은 아래와 같다. 

It is reflexive(반사, 재귀)
: 자기 자신을 대입했을 때 반드시 `true`를 리턴해야 한다. (`x == x`)

It is symmetric(대칭)
: `x.equals(y)`는 `y.equals(x)`가 `true`를 리턴할 때, `true`를 리턴해야 한다. (`x == y`, `y == x`)

It is transitive(전이)
: `x.equals(y)`와 `y.equals(z)`가 `true`라면 `x.equals(z)`도 `true`를 리턴해야 한다.(`x == y`, `y == z`, `z == x`)

It is consistent(일관된)
: 비교에 사용되는 정보가 변경되지 않는 한, 항상 일관된 값을 리턴해야 한다는 뜻이다.

또한, 모든 `null`아닌 값 x에 대하여 `x.equals(null)`은 반드시 `false`를 리턴해야 한다.

객체를 직접 만들었다면 위의 규칙에 맞게 `equals`를 오버라이딩 하는 것이 좋다.

만약 오버라이딩 하지 않는다면 후에 컬렉션을 사용할 때에 원하지 않는 결과가 나올 수 있다.
컬렉션에서 객체를 검색하거나 특정할때 이 `equals`를 통해 비교하기 때문이다.

보통 아래와 같은 방식으로 오버라이딩 한다.


```java
public static class Member {
	private String name;
	private int code;
	public Member(String name, int code) {
		this.name = name; this.code = code;
	}
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Member) {
			Member temp = (Member)obj;
			if(temp.name.equals(name) && temp.code == code) {
				return true;
			}
		}
		return false;
	}
}
```

주의할 점은 매개변수 타입이 `Object` 타입이므로 `instanceof` 연산자로 타입부터 확인해야 한다는 것이다.

타입이 같다면 형변환 후, 필드를 비교하고 일치하면 `true`를 리턴한다.
그 외에는 필드가 다르거나 애초에 타입이 다른 것이므로 `false`를 리턴하도록 한다.

### hashCode

`public int hashCode()`
: 해당 객체의 해시 코드를 정수로 반환한다. 

물론 여기서 반환하는 해시는 MD5나 SHA같은 복잡한 알고리즘을 사용하지 않고, 그럴 필요가 없다. 
단순히 객체 식별 목적으로 사용되는 정수 값을 반환하는 정도이다. 

이 `hashCode()`가 반환하는 해시코드는 객체를 식별하기 위해 사용되는 정수이다.
주로 `HashSet`, `HashMap`, `Hashtable`과 같이 해시 값을 사용하는 컬렉션에서 사용한다.

이러한 컬렉션들은 이 `hashCode()` 메소드와 `equals()` 메소드를 호출하여 객체의 동등성을 판단한다.
둘 중 하나라도 서로 다르다면 해당 컬렉션은 두 객체를 다른 것으로 판단한다.

`Object`에 정의된 기본 `hashCode()`는 대체로 객체의 내부적인 주소를 정수로 바꾸어 반환한다.
따라서 완전히 같은 인스턴스에 대해서만 같은 `hashCode()`를 반환할 것이다.

```java
class Product {
    private String code;
    public Product(String code) { this.code = code; }
}
......
Product pro1 = new Product("100001");
Product pro2 = new Product("100001");
System.out.println((pro1.hashCode() == pro2.hashCode()));
```

```console
false
```

만약 저 `Product` 클래스를 해시 맵과 같은 해시를 사용하는 컬렉션에서 정상적으로 사용하고 싶다면 
`equals`와 `hashCode` 메소드를 아래와 같이 오버라이딩 해야 한다.

```java
class Product {
    private String code;
    public Product(String code) { this.code = code; }
    @Override
    public boolean equals(Object obj) { ...... } //생략
    @Override
    public int hashCode() {
        return code.hashCode();
    }
}
```

`String` 클래스는 이미 `hashCode()`를 오버라이딩하여 같은 문자열에 대해서 같은 값을 리턴하기 때문에 
단순히 `code`의 `hashCode`를 리턴하는 것 만으로도 정상 작동 할 것이다.

만약 필드가 여러개라면 `Objects.hash()` 메소드를 이용할 수 있을 것이다.

이제 `hashCode()` 메소드의 일반적인 규칙을 알아보자. 공식 문서에 따르면, 규칙은 아래와 같다.

1. 자바 어플리케이션이 실행되는 동안 같은 객체에 대해 두 번 이상의 `hashCode()` 메소드가 호출되었을 때, 
비교할 때 사용되는 정보가 변경되지 않은 이상 항상 일관되게 같은 정수 값을 리턴해야 한다. 
(단, 같은 프로그램의 다른 실행에서 까지 같을 필요는 없다.). 이는 같은 객체에 대해서는 항상 같은 값을 리턴하라는 뜻이다.

2. 만약 두 객체가 `equals()` 메소드에 의해 같다고 판정되었다면, 
두 객체의 `hashCode()` 메소드도 같은 정수 값을 리턴 해야 한다. 이는 논리적으로 같은 객체끼리는 같은 값을 리턴하라는 뜻이다.

3. 두 객체가 `equals()` 메소드에 의해 같지 않다고 판정되었다고 해서, 반드시 두 객체의 `hashCode()` 메소드가 
서로 다른 값을 반환할 필요는 없다. 
단, 같지 않은 객체들이 서로 다른 정수 값을 반환하는 것은 해시 테이블의 성능을 향상시킬 수 있다. 
이는 서로 다른 객체라 해서 반드시 서로 다른 값을 반환해야 하는 건 아니라는 것이다. 
다만 서로 다른 객체가 각각 다른 값을 반환하게 만든다면 해시 테이블 등의 해시 값을 사용하는 컬렉션에서 발생하는 
해시 충돌을 막아서 보다 나은 성능을 보여준다는 뜻이다.

## clone

`protected Object clone() throws CloneNotSupportedExcption`
: 객체의 복사본을 리턴한다. 

이 "복사본"이 정확히 어떠한 것인지는 구현하는 측에 달려있다.
보통은 원본과 논리적으로 같은 새로운 객체를 생성한다.

즉, `x.clone() != x` 도 `true`를 리턴하고, `x.clone().equals(x)` 또한 `true`를 리턴한다는 것이다.
물론 이것은 반드시 요구되는 사항은 아니다. 다만 대체로 그러할 뿐이다.

`clone`을 통해 복사를 하기 위해서는 `Cloneable` 인터페이스를 구현해야 한다. 
해당 객체가 `Cloneable` 인터페이스를 `implements` 하지않았다면 `CloneNotSupportedExcption`을 던진다. 
이 예외는 `Checked Exception`이기 때문에 반드시 `try-catch`나 `throws`를 통해 처리할 것을 요구한다. 

또한, 반환 타입이 `Object` 이므로 사용 시에는 반드시 형변환이 필요하다는 것을 주의해야 한다.
보통 오버라이딩 단계에서 반환형을 자기 자신으로 바꾸는 것이 추천된다.

`clone` 메소드를 오버라이딩할 때에는 필요에 따라 얕은 복사나 깊은 복사를 잘 선택하여 구현해야 한다.
얕은 복사와 깊은 복사, 기타 복사 방법은 별도의 글에 정리하였다. 아래 링크를 참조하라.

이제 `clone` 메소드를 오버라이딩 하는 방법을 알아보자.
얕은 복사로 충분한 경우라면 단순히 `super.clone()`을 리턴하는 것으로 충분하다.

`super.clone()`을 통해 호출되는 `Object` 클래스의 `clone()` 메소드는 기본적으로 얕은 복사를 수행한다.
불변 객체나 기본 타입만 필드로 가진다면 얕은 복사만 수행하여도 독립된 복사본이 생성된다.

```java
public class Student implements Cloneable {
    private String name;
    private int age;

    public Student(String name, int age) { this.name = name; this.age = age; }
    //getter와 setter 생략
    @Override
    public Student clone() throws CloneNotSupportedExcption {
        return (Student)super.clone();
    }
}
```

`Student` 클래스의 필드는 기본 타입이거나 참조 타입이더라도 내용이 변하지 않는 객체(`String`)이기 때문에 
얕은 복사를 하여도 상관 없다. 
따라서 `super.clone()`을 리턴하는 것으로 끝난다.

깊은 복사가 필요한 경우라면 `super.clone()`으로 얕은 복사본을 만든 뒤, 추가적인 작업을 거쳐야 한다.

```java
public class Course implements Cloneable {
    private String courseName;
    private List<Student> students;

    public Course(String courseName, List<Student> students) {
        this.courseName = courseName;
        this.students = students;
    }
    //getter와 setter 생략
    @Override
    public Course clone() throws CloneNotSupportedExcption {
        Course copy = (Course) super.clone(); //먼저 얕은 복사
        
        copy.students = new ArrayList<Course>(); //깊은 복사를 위해 새 리스트 생성
        for(Student student : this.students) { //반복문으로 새 리스트에 복사본 추가
            copy.students.add(student.clone());
        }
        return copy;
    }
}
......
public class Student implements Cloneable {
    private String name;
    private int age;
    
    public Student(String name, int age) { this.name = name; this.age = age; }
    //getter와 setter 생략
    @Override
    public Student clone() throws CloneNotSupportedExcption {
        return (Student)super.clone(); //Student 클래스는 얕은 복사로 충분하다.
    }
}
```
{: .nolineno }

`Course`는 `students`라는 컬렉션을 가지고 있으므로 완전히 독립된 복사본을 만들기 위해서는 추가적인 작업을 거쳐야 한다.
 
`super.clone`을 호출하여 얕은 복사를 수행한 뒤, `students`에 내용이 같은 새 리스트를 만들어 준 후 반환한다. 
`Student` 클래스는 불변 객체와 기본 타입만 가지므로 `clone`이 단순히 `super.clone`을 반환하는 것으로 충분하다. 

(굳이 오버라이딩한 것은 `protected`인 `Object`의 `clone`을 `public`으로 쓰기 위함이다. 일반적으로 접근성을 높이는 편이 좋다.)

만약 상속받은 객체가 있을 경우에는, 상속 받은 객체가 `clone()`을 오버라이드 했다면 위와 똑같이 `super.clone`을 호출해 부모 객체의 필드를 복사한 후 자신의 필드도 복사하면 된다.

