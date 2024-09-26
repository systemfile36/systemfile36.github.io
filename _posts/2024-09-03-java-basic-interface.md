---
title: Java 기본 - 인터페이스
date: 2024-09-03 14:00:00 +0900
categories: [Java, Java Basic]
tags: [java, oop, basic, interface]
description: 자바의 인터페이스의 기본적인 개념들을 정리
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
본질적으로는 같은 글입니다. )  

## 인터페이스

Java에서 말하는 인터페이스는 실생활의 인터페이스와 어느정도 비슷하다.
우리는 유저 인터페이스(UI)를 통해 프로그램 내부의 구조를 모르더라도 프로그램과 상호작용할 수 있다.
이 유저 인터페이스는 프로그램과 사용자 사이를 연결해준다.

마찬가지로 Java에서의 인터페이스 역시 객체와 사용자 사이를 연결해주는 역할을 한다.
특정 객체가 특정 인터페이스의 구현 객체라는 사실만 알면, 해당 객체의 상세 내용을 모르더라도 인터페이스에서 정의된 메소드만 사용하면 객체와 상호작용할 수 있다.

그렇다면 왜 직접 메소드를 호출하지 않고 인터페이스를 사이에 둔 채 상호작용하는 것일까?
바로 코드의 수정을 최소화 한채로, 다양하게 기능을 확장하는 것이 가능하기 때문이다.
또한 추상 클래스와 마찬가지로 다형성을 구현하는 것에도 유용하다.

바로 예시를 보자

```java
public interface AuthService {
    public boolean auth(String username, String password);
    public void logout(String username);
}
```

```java
public FastAuthService implements AuthService {
    ......
    @Override
    public boolean auth(String username, String password) { ...... }
    
    @Override
    public void logout(String username) { ...... }
    ......
}
```
{: .nolineno }

```java
public class LoginController {
    private final AuthService authService;
    
    public LoginController(AuthService authService) { this.authService = authService; }
   
    public void login(String username, String password) {
        if(authService.auth(username, password)) {
            //인증 후 처리
        } else {
            //인증 실패 시 처리
        }
    }
    
    public void logout(String username) {
        authService.logout(username);
        //기타 처리
    }
}
```
{: .nolineno }

이전 글, ["상속"](/posts/java-basic-inheritance/)에서 든 예시를 인터페이스와 그 구현 객체로 바꾸어 보았다.

객체를 사용하는 측인 `LoginController`에서는 `FastAuthService`가 어떻게 구현되어있는지는 알 필요가 없다.
그저 `AuthService` 인터페이스를 구현하였으니 `auth` 메소드와 `logout` 메소드가 있다는 것만 알고 사용하면 된다.

이는 `FastAuthService` 내부가 수정되더라도 마찬가지다.
또한 `FastAuthService`가 아닌 다른 방식을 사용하고 싶다면, 또 다른 `AuthService`의 구현 객체를 만들면 된다.
`LoginController`와 그의 생성자는 모든 `AuthService`의 구현 객체를 받고 저장할 수 있으므로 언제든지 구현해서 넘겨주기만 하면 된다. 
별도의 수정은 필요하지 않게 된다.

## 인터페이스의 형식

위에서도 간단히 보았듯이 인터페이스는 다음과 같이 선언한다.

```java
접근제한자 interface 인터페이스명 { ...... }
```

인터페이스 내부에 선언할 수 있는 것은 상수, 추상 메소드, 디폴트 메소드, 정적 메소드 뿐이다.
일반적인 필드나 메소드, 생성자는 작성할 수 없다.

상수는 클래스에서와 같이 `public static final`로 선언하면 된다. 사용법 또한 클래스에서의 상수와 같다.
인터페이스에서의 필드는 상수 밖에 없다는 것이 정해져 있으므로 `public static final`은 생략할 수 있다.
생략하더라도 컴파일 과정에서 내부적으로 추가되어 처리된다.

추상 메소드도 추상 클래스에서 사용하는 것과 같다. 선언부터, 사용 시 규칙 까지.

마찬가지로 인터페이스에서의 메소드는 기본적으로 추상 메소드이므로 public abstract를 생략하더라도
컴파일 과정에서 자동으로 추가되어 처리된다. 즉, 아래의 두 선언은 같은 것으로 취급된다.

```java
public abstract void func(String str); 
```
{: .nolineno }

```java
void func(String str); 
```
{: .nolineno }

디폴트 메소드는 이름 그대로 기본 메소드를 말한다. 해당 인터페이스를 구현한 모든 객체에 기본적으로 포함되는 메소드이다. 
일반적인 클래스의 메소드를 선언하는 것과 같은 방식으로 선언한다. `default` 키워드가 붙을 뿐이다.
기본적으로 `public` 특성을 가지므로 생략하더라도 자동으로 추가되어 처리된다.

```java
default void func(String str);
```
{: .nolineno }

정적 메소드 또한 일반 클래스의 정적 메소드와 똑같이 선언하고, 똑같이 사용한다.
`public`을 생략하여도 자동으로 추가된다는 점만 조금 다르다.


## 인터페이스 구현

인터페이스를 구현할때에는, 구현하고 싶은 인터페이스를 `implements` 하면 된다.

```java
public class FastAuthService implements AuthService { ...... }
```
{: .nolineno }

구현 객체는 반드시 인터페이스에 선언된 모든 추상 메소드를 오버라이딩 하여야 한다.
그렇지 않으면 컴파일 에러가 발생하게 된다.

일부만 오버라이딩하고 싶다면 구현 객체에 `abstract` 키워드를 붙여 추상클래스로 만들어야 한다.
또한 인터페이스의 모든 추상 메소드는 `public`이므로 이보다 강한 접근 제한은 불가능하다.
즉, 반드시 `public`으로 선언되어야 한다.

이클립스 등의 IDE에서는 기본적으로 추상 메소드를 자동으로 오버라이딩 해주는 기능이 있다.
이를 통해 빠르게 추가한 후, 실제 내용을 작성하면 된다.

구현 객체를 사용할 때에는 일반 클래스나 추상 클래스와 마찬가지로 사용할 수 있다.
상위 객체 변수에 하위 객체 변수를 넣어 일괄적으로 사용하듯,
구현 객체 또한 인터페이스 타입 변수에 넣어 사용할 수 있다. 자동형변환이 되는 것이다.

```java
AuthService authService = new FastAuthService();
```
{: .nolineno }

매개변수에서 사용할 때에도 마찬가지다.
매개변수에 인터페이스 타입을 선언하면, 모든 해당 인터페이스의 구현 객체를 매개변수로 받을 수 있다.

## 익명 구현 객체

구현 객체를 여러번 사용할 것이라면 따로 클래스를 만드는 것이 편하겠지만,
일회용으로 쓸 구현 객체를 위해 클래스를 선언하는 것은 귀찮다.
이를 위해 별도의 클래스 선언 없이 익명으로 구현 객체를 만들 수 있다. 

아래와 같이 사용한다.

```java
인터페이스 변수 = new 인터페이스() {
    //추상 메소드 구현
};
```
{: .nolineno }

나중에 언급할 람다식도 함수적 인터페이스의 익명 구현 객체를 만드는 것이다.

예시를 통해 살펴보자.
먼저 익명 구현 객체를 사용하지 않는 경우를 보자

```java
public interface CallBack {
	void onSetMessage(Callee callee);
}
```

```java
public class Callee {
	private String msg = "";
	private CallBack callBack = null;
	
	public void setCallBack(CallBack callBack) {
		this.callBack = callBack;
	}
	
	public void setMessage(String msg) {
		this.msg = msg;
		
		if(this.callBack != null) {
			this.callBack.onSetMessage(this);
		}
	}
	
	public String getMessage() {
		return msg;
	}
}
```

```java
public class PrintSetMessage implements CallBack {
	@Override
	public void onSetMessage(Callee callee) {
		System.out.println(callee.getMessage());
	}
}
```

```java
public class Caller {
	public static void main(String args[]) {
		Callee callee = new Callee();
		CallBack pm = new PrintSetMessage();
		callee.setCallBack(pm);
		callee.setMessage("Test");	
	}
}
```

`Callee` 클래스는 넘겨받은 `CallBack` 구현 객체를 저장한 후, 
메시지가 설정되었을 때 `CallBack` 구현 객체의 `onSetMessage` 메소드를 실행하여 지정된 동작을 실행한다.

위의 코드에서는 `Callee` 클래스의 메시지가 설정되었을 때 설정된 메시지를 출력하게 하기 위해,
`CallBack` 구현 객체인 `PrintSetMessage`를 만들었다.

그 후, `Caller`의 `main`에서 `Callee`에게 `PrintSetMessage`를 넘겨준 후, `setMessage`를 통해 메시지를 설정했다.
실행하면 "Test"라는 텍스트가 출력되는 것을 볼 수 있다.

이제 이것을 익명 구현 객체를 사용한 버전으로 보자

```java
public class Caller {
	public static void main(String args[]) {
		Callee callee = new Callee();
		//CallBack pm = new PrintSetMessage();
		callee.setCallBack(new CallBack() {
			@Override
			public void onSetMessage(Callee callee) {
				System.out.println(callee.getMessage());
			}
		});
		callee.setMessage("Test");
	}
}
```

이렇게 익명 구현 객체를 사용하면 `PrintSetMessage`와 같이 구현 객체를 따로 파일로 만들필요가 없다.
매개변수로 넘기는 과정에서 직접 구현 객체를 만들어서 넘기는 것이다.

## 다중 인터페이스 구현

자바에선 클래스의 다중 상속이 불가능하다. 이는 모호함이 생기기 때문이다. 
만약 다중 상속을 통해 두 개의 부모를 가진다면, `super` 키워드가 가리키는 부모가 무엇인지 결정할 수 없다.
이외에도 죽음의 다이아몬드와 같은 문제가 생기기 때문에 다중 상속은 대부분 권장하지 않는다. 

대신, 인터페이스는 여러개를 구현할 수 있다. 단순히 콤마로 구분해서 이어 붙이면 된다.

```java
public class DragableButton implements Cilckable, Dragable { ...... }
```

## 인터페이스 사용

인터페이스 구현 객체를 사용하는 방법은 단순하다.
인터페이스 타입 변수에 구현 객체를 대입하면 된다.
인터페이스에 선언된 메소드라면 언제든지 호출할 수 있다.

단순히 변수로 사용할 수도, 생성자를 포함한 메소드의 매개 변수로 사용할 수도 있다.
인터페이스 타입 변수에는 어떤 구현 객체가 대입되어도 상관없고, 이는 매개변수에서도 마찬가지이다.

위의 예시에서도 `CallBack` 타입 변수에 구현 객체인 `PrintSetMessage`를 대입했고,
`setCallBack(CallBack callBack)` 메소드에서도 `PrintSetMessage` 타입 변수를 넘겨주었다.

디폴트 메소드는 구현 객체에서 별도로 작성하지 않더라도 그냥 메소드를 사용하듯이 사용할 수 있다.
원한다면 오버라이딩도 가능하다.

## 인터페이스의 다형성

인터페이스의 다형성은 상속의 다형성과 상당 부분 겹친다.
상위 객체 타입 변수에 모든 하위 객체 인스턴스를 대입해도 문제 없는 것처럼,
인터페이스 또한 모든 구현 객체를 대입해도 문제 없다.
이를 **서브타입 다형성**이라고 한다. 이에 대한것은 [상속](/posts/java-basic-inheritance/)에서도 한번 작성하였다. 해당 글을 참고하라.

위에서 예시로 작성한 콜백 함수 예시에서도 다형성에 대한 것이 나와있다.
`Callee`의 필드 `callBack`은 `CallBack` 타입이다. 이곳에는 모든 구현 객체가 들어갈 수 있다.
이를 설정하는 `setCallBack(CallBack callBack)` 메소드도 마찬가지다.
그렇기 때문에 `message`가 설정되었을 때의 동작을 바꾸고 싶을 때는,
단순히 `Caller`에서 다른 `CallBack` 구현 객체를 넘겨주면 된다.
`Callee`의 코드를 수정하지 않더라도 다양한 동작을 실행할 수 있는 것이다.

이와 같이 인터페이스의 다형성은 상속의 다형성과 거의 비슷하다고 보면 된다.
그저 상위 객체와 하위 객체의 관계가 인터페이스와 구현 객체의 관계가 된 것이다.

## 강제 타입 변환

강제 타입 변환 또한 상속에서의 사용법과 완전히 같다.
자동형변환으로 인터페이스 타입으로 변환 된 것만 가능한 것도 같다.

이와 같이 사용하는 `instanceof` 연산자의 사용법도 완전히 같다.

## 인터페이스 상속

인터페이스도 다른 인터페이스를 상속 받을 수 있다.
또한 인터페이스이기 때문에 여러개를 상속 받는 것도 가능하다.

여러 개의 인터페이스를 상속받은 인터페이스를 구현한 객체는 
상속된 인터페이스의 추상 메소드를 포함한 모든 추상 메소드를 구현할 의무가 있다.

```java
public interface InterfaceA { void funcA(); }
```

```java
public interface InterfaceB { void funcB(); }
```


```java
public interface InterfaceC extends InterfaceA, InterfaceB {
    void funcC();
}
```

```java
public class Test implements InterfaceC {
    @Override
    public void funcA() { ...... }
    @Override
    public void funcB() { ...... }
    @Override
    public void funcC() { ...... }
}
```
{: .nolineno }

## 디폴트 메소드

디폴트 메소드는 이름 그대로 인터페이스에 포함된 기본 메소드이다.
메소드의 실행부 없이 선언만 하는 추상 메소드와 달리 실행부도 같이 포함되어 선언된다.

```java
public interface InterfaceA {
    ......
    default void func() { ...... }
}
```

위의 코드에서 선언된 디폴트 메소드 `func()`는 모든 구현 객체에서 호출할 수 있다.
이것이 디폴트 메소드를 사용하는 이유 중 하나이다. 다른 예시를 통해 살펴보자.

```java
public interface Drawable {
    void draw();
}
```

```java
public class Circle implements Drawable {
    ......
    @Override
    public void draw() { ...... }
    ......
}
```
{: .nolineno }

```java
public class Rectangle implements Drawable {
    ......
    @Override 
    public void draw() { ...... }
    ......
}
```
{: .nolineno }

위와 같이 `draw()`라는 추상메소드를 가진 `Drawable`의 구현 객체 `Circle`, `Rectangle`이 있다.
`Drawable` 인터페이스에 새 기능 `printColor()` 기능을 추가하려 한다.

하지만 단순하게 `printColor()`를 추상메소드로 선언하면 `Circle`, `Rectangle` 모두에 실행문을 작성해야 한다.
이는 중복되는 부분을 늘리게 되어 가독성과 유지보수, 둘 다 불리해지게 된다.

하지만 아래처럼 디폴트 메소드로 선언하면 구현 객체들을 수정하지 않아도 모든 구현 객체에서 호출할 수 있다.

```java
public interface Drawable {
    void draw();
    default void printColor() { ...... }
}
```

또한, 기존 인터페이스를 살짝만 수정해서 사용하고 싶을 때에도 유용하다.

기존 코드에 수정을 최소화하기 위해 기존 인터페이스를 사용하여 새 구현 객체를 만들어 내고 싶을 수도 있다.
이렇게 하면 기존에 사용하던 메소드 등에 수정을 가하지 않고도 새 구현 객체를 사용할 수 있기 때문이다.

하지만 새 기능도 추가하고 싶다. 그렇다고 추상 메소드를 새로 선언하면 기존 구현 객체도 수정해야 한다.
이럴때에는 새로운 디폴트 메소드를 추가하기만 하면 된다.

또한, 다른 구현 객체들이 계속 추가되어 거기서 디폴트 메소드를 자신에 맞게 변경하고 싶다면
오버라이딩 하면된다. 디폴트 메소드 또한 오버라이딩을 지원한다.
마치 상위 객체의 메소드를 오버라이딩 하듯이 선언하면 된다.

