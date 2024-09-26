---
title: Java 기본 - 상속 
date: 2024-09-03 14:00:00 +0900
categories: [Java, Java Basic]
tags: [java, oop, basic, inheritance]
description: 자바 상속의 기본적인 개념들을 정리
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
본질적으로는 같은 글입니다. )  

## 상속

클래스는 자신이 가진 메소드와 필드를 자식 클래스에게 물려줄 수 있다. 이 물려주는 것을 상속이라 한다.
또한, 다른 의미로 보면 "확장"이라고 볼 수도 있다. 실제로 자바에서는 상속 키워드로 `extends`를 사용한다.
추상적인 상위 개념에서 자식으로 갈 수록 구체적인 객체가 되어가는 것으로도 사용할 수 있다.

```java
public class WebApplicationAdaptor {
    private List<Client> clients = new List<Client>();
    ......
    public List<Client> getClient() { return client; }
    ......
}
```
{: .nolineno }

```java
public class CustomAdaptor extends WebApplicationAdaptor {
    ......
    //커스텀한 기능, 멤버 등등
    ......
}
```
{: .nolineno }

위와 같이 기존에 작성한 클래스에 새 기능을 추가하거나, 동작을 커스텀한 새로운 클래스를 만들 수 있다.
이렇게 하면, 기존의 클래스가 들어갈 자리에 바꿔 넣기만 하면 커스텀한 기능을 그대로 사용할 수 있다. 
말 그대로 **확장**이라고 볼 수 있다.

아래의 코드는 추상 클래스와 상속을 사용한 것이다.

```java
public abstract class Weapon {
    private String name;
    private WeaponType weaponType; 
    ......
    public abstract void action();
    ......
}
```
{: .nolineno }

```java
public class Gun {
    private int roundPerMin;
    private int dmgPerRound; 
    ......
    @Override
    public void action() {
         //특정 동작
    }
    ......
}
```
{: nolineno }

공통된 부분을 묶어서 코드의 재사용성을 늘리고, 다형성을 구현한다.

### 부모 생성자 호출

기본적으로 자식 클래스는 부모 클래스가 먼저 생성이 되고, 
자식 클래스가 생성된 후 부모 클래스에 대한 참조를 가지는 형태로 생성된다. 

따라서 기본적으로 자식 클래스의 생성자에는 부모 생성자에 대한 호출이 포함되어야 한다.
별도로 넣지 않을경우 부모의 기본생성자를 호출하는 `super();` 가 생성자의 맨 위에 자동으로 추가된다.

하지만 부모에게 있는 변수를 초기화하거나, 
아니면 코드의 중복을 줄이거나 하는 이유등으로 명시적으로 자식 객체에서 부모의 생성자를 호출해야 할때가 있다.

```java
public class UIElement {
    private Image img; 
    ......
    public UIElement(Image img) {
        this.img = LoadImage(this.path);
        ......
    }
    ......
}
```
{: nolineno }

```java
public class Button {
    ......
    public Button(Image img) {
        super(img);
        ......
    }
    ......
}
```
{: nolineno }

위와 같이 `super()`를 통해 부모의 생성자를 호출할 수 있다.

### 메소드 오버라이딩

부모 객체의 메소드를 재정의 하는 것을 말한다.
부모 객체에 이미 있는 메소드가 자식 객체와는 맞지 않거나, 추상 메소드일 경우에 오버라이딩을 사용한다.

```java
@Override
public void action() {
    ......
}
```
{: nolineno }

위와 같은 방식으로 사용한다.
`@Override` 어노테이션을 사용하여 컴파일러에게 오버라이딩된 메소드라는 것을 알려 검사를 하게한다.

단, 오버라이딩한 메소드는 새로운 예외를 throws 할 수 없다. 물론 할 수 있는 경우도 있지만, 
이에 대해선 후에 예외 처리에 대한 글에서 언급한다.

### final 키워드

final 키워드가 필드에 사용되는 경우는 [이전 글](/posts/java-basic-basic/)에서 언급하였다.

선언 이후, 수정될 수 없다는 것을 의미한다.
이는 클래스와 메소드에도 적용된다.
`class` 앞에 `fianl` 키워드가 붙게 되면 더이상 상속할 수 없음을 의미한다. 이를 `final` 클래스라 한다.

```java
public final class String { ...... }
```
{: nolineno }

위와 같이 자바 표준 API의 `String`은 `final` 클래스이기 때문에 더이상 상속할 수 없다.

`fianl` 메소드는, 더이상 오버라이딩 할 수 없음을 의미한다.

```java
public class Parent {
      ......
      public final void action() { ...... }
      ......
}
```
{: nolineno }

```java
public class Child extends Parent {
      ......
      @Override
      public void action() { ...... }
      ......
}
```
{: nolineno }

위와 같이 final 키워드가 붙은 action() 메소드를 오버라이딩 하려고 하면 컴파일 시점에서 에러가 난다.

## 다형성

앞에서도 간단하게 예시를 들었던 개념이다.
여기서는 다형성 중에서도 서브타입 다형성을 알아보자

**서브타입 다형성**이란, 상위 객체의 변수에 하위 객체의 인스턴스를 할당하여 사용할 수 있는 것이다.
`User` 객체의 하위 객체로 `VIPUser` 객체가 있다고 하자. 이때 `VIPUser`는 `User`이다. 라고 해도 어색하지 않다.
하위 객체는 상위 객체와 is-a 관계로 되어있어야 한다. 그렇기에 위의 문장이 성립하는 것이다.

같은 이유로, 하위 객체는 반드시 상위 객체를 대체할 수 있어야 한다.
상위 객체 자리에 하위 객체가 들어가도 아무 문제 없이 실행되어야 하는 것이다.
이를 위해, 객체지향언어에서는 상위 객체 변수에 하위 객체 인스턴스를 할당하면 **자동 형변환**이 일어난다.

```java
public class UIElement { ...... }
```
{: .nolineno }

```java
public class Button extends UIElement { ...... }
```
{: .nolineno }

```java
public class TextBox extends UIElement { ...... }
```
{: .nolineno }

```java
UIElement btn = new Button();
UIElement tb = new TextBox();
```
{: .nolineno }

위와 같이 `UIElement` 타입의 변수에 하위 객체인 `Button`이나 `TextBox`를 할당하면 자동 형변환이 일어난다.
이렇게 상위 객체 변수에 자동 형변환으로 할당된 하위 객체는 자기 타입의 변수에 할당된 것과 어떻게 다를까.

바로 접근할 수 있는 범위가 달라지게 된다.
상위 객체로 형변환이 일어나게 되면, **상위 객체에 선언된 필드와 메소드만 사용할 수 있다.**
즉, 하위 객체에서 선언된 필드와 메소드는 가려지게 된다.

```java
public class TextBox extends UIElement {
      ......
      public void getText() { ...... }
      ......
}
```
{: .nolineno }

만약 위와 같이 `TextBox`가 상위 객체인 `UIElement`에는 없는 `getText()` 메소드를 가진다면, 
아래와 같이 사용하면, 에러가 발생한다. 

```java
UIElement tb = new TextBox();
String text = tb.getText(); //Error
```
{: .nolineno }

`UIElement` 클래스에는 `getText()` 메소드가 없기 때문이다.

하지만 `UIElement`에 `getText()`가 정의되어 있다면, `TextBox`의 `getText()`를 호출할 수 있다.

아래와 같이 오버라이딩된 상태라면, 정상적으로 `TextBox`의 메소드가 호출된다.

```java
public class TextBox extends UIElement {
    ......
    @Override
    public void getText() { ...... }
    ......
}
```
{: .nolineno }

```java
UIElement tb = new TextBox();
String text = tb.getText(); //TextBox 클래스의 getText()호출
```
{: .nolineno }

그렇다면 이렇게 자동형변환으로 부모 객체로 변환해서 사용하는 이유는 무엇일까.

**바로 다형성을 활용한 확장성 때문이다.**
만약 다형성을 활용하지 않는다고 가정하고 아래 코드를 보자. (어디까지나 예시이므로 구조는 아무렇게나 했다)

```java
public class MyAuthService {
    private final UserRepos userRepos;
    
    public MyAuthService(UserRepos userRepos) { this.userRepos = userRepos; }
   
    public boolean auth(String username, String passWord) {
        //userRepos를 이용해 인증 절차 진행 후 boolean 값 리턴
    }
   
    public void logout(String username) {
        //세션 삭제 등의 절차 진행
    }
}
```
{: .nolineno }

```java
public class LoginController {
    private final MyAuthService authService;
    
    public LoginController(MyAuthService authService) { this.authService = authService; }
    
    public void login(String username, String password) {
        if(authService.auth(username, password)) {
            //인증 통과 시 처리
        } else { 
            //인증 실패 시 처리
        }
    
    public void logout(String username) {
        authService.logout(username)
        //기타 처리
    }
}
```
{: .nolineno }

위와 같이 `MyAuthService` 클래스를 통해 인증을 처리하는 `LoginController` 클래스가 있다.

여기까지는 괜찮다. 코드에 문제가 없다면 제대로 실행될 것이고, 딱히 문제는 없다.
그러나 문제는 확장이 필요할 때이다.

만약 `MyAuthService`가 아닌 다른 인증 서비스를 사용하고 싶다면 어떻게 할 것인가?
물론 `MyAuthService` 자체를 수정하는 방법도 있을 것이다. 하지만 직관적이지 않다.

게다가 여러개의 인증 서비스를 상황에 따라 사용할 경우에는 어떻게 할 것인가. 복사해서 여러개를 만든 다음, 
각 타입의 필드를 `LoginController`에 새로 선언할 것인가?

`LoginController`에 인증 서비스가 추가 될때마다 필드 타입을 바꾸어야 할 것이고, 
이에 따라 메소드 내에서의 지역 변수 타입들도 바꾸어야 할 것이다.

단순히 인증 서비스를 변경하고 싶을 뿐인데 `LoginController` 클래스까지 수정해야 하는 것이다.
이는 `LoginController`가 `MyAuthService`에 의존하기 때문이다. **결합도가 높은 것이다.**

결합도가 높기 때문에 `MyAuthService`가 아닌 다른 것을 사용하려고 하면 
거기에 의존하는 `LoginController`도 수정해야한다.

하지만 다형성을 사용한다면 클래스 사이의 결합도를 낮추어서 `LoginController`에 대한 수정을 최소화할 수 있다.

아래와 같이 기본이 되는 인증 클래스를 만든다. (이는 추상 클래스나 인터페이스로 작성할 수도 있다.)

```java
public class AuthService {
    private final UserRepos userRepos;
    
    public AuthService(UserRepos userRepos) { this.userRepos = userRepos; }
    
    pubilc boolean auth(String username, String password) {
        //인증 처리
    } 
   
    public void logout(String username) {
        //세션 삭제 등의 처리
    }
}
```
{: .nolineno }

이제 아래와 같이, 만든 기본 인증 클래스를 상속받아서 원하는 메소드를 오버라이딩하거나, 로직을 변경하면 된다. 

```java
public class FastAuthService extends AuthService {
    public FastAuthService(UserRepos userRepos) { super(userRepos); }
  
    @Override
    public boolean auth(String username, String password) {
        //변경된 인증 처리
    }
}
```
{: .nolineno }

```java
public class SafeAuthService extends AuthService {
    public SafeAuthService(UserRepos userRepos { super(userRepos); }
    
    @Override
    public boolean auth(String username, String password) {
        //변경된 인증 처리
    }
    
    @Override
    public void logout(String username) {
        //변경된 세션 삭제 등의 처리
    }
}
```
{: .nolineno }

```java
public class LoginController {
    private final AuthService authService;
    
    public LoginController(AuthService authService) { this.authService = authService; }
    
    public void login(String username, String password) {
        if(authService.auth(username, password)) {
            //인증 통과 시 처리
        } else { 
            //인증 실패 시 처리
        }
    
    public void logout(String username) {
        authService.logout(username)
        //기타 처리
    }
}
```
{: .nolineno }

마지막으로 사용할 곳에서 `AuthService`타입으로 사용하면 된다. 
상황에 따라 사용하고 싶은 하위 객체들을 할당시켜주기만 하면 알아서 자동형변환되어 사용가능하다.

인증서비스를 변경하고 싶을 때도 `LoginController`를 변경하지 않은 채, 
단순히 `AuthService`의 하위 객체를 만들고 생성자에 넘겨주기만 해도 된다.

만약 새로 생성하지 않고 인증 서비스를 바꾸고 싶다면, `setAuthService`와 같은 메소드를 만들어 사용할 수도 있을 것이다.

또한, 리플렉션을 통해 이름으로 접근하여 사용할 수도 있다. 

이처럼 다형성은 다양한 방법으로 구현할 수 있다. 해당 글이 상속에 관한 글이기에 상속을 사용한 것일 뿐이다.

### 강제 타입 변환

**강제 타입 변환(Casting)**은 상위 객체를 하위 객체로 강제로 변환하는 것이다.
하위 객체에만 존재하는 메소드를 호출할 필요가 있을 때 사용한다.

다만 무조건 변환할 수 있는 것은 아니다. 위에서 설명한 자동형변환이 일어난 상태의 객체만 변환 가능하다.
자동 형 변환이 일어난 상태의 상위 객체는 하위 객체가 가려져 있을 뿐 존재하기 때문에 변환 가능하지만,
그렇지 않은 상위 객체는 하위 객체가 애초에 존재하지 않기 때문에 변환 불가능하다.

강제 타입 변환을 하는 예시를 먼저 보자. (위에서 사용한 `UIElement` 예시를 사용한다.)

```java
public class TextBox extends UIElement {
      ......
      public void getText() { ...... }
      ......
}
```
{: .nolineno }

```java
UIElement ui = new TextBox(); //자동 형 변환이 일어난다.

ui.getText(); //에러가 발생한다. ui의 타입이 UIElement이기 때문이다.

TextBox tb = (TextBox)ui; //강제 형 변환 사용

tb.getText(); //에러가 발생하지 않는다. TextBox 타입으로 변환하였기 때문
```
{: .nolineno }

이와 같이 강제 타입 변환은 가려져 있던 하위 객체의 메소드를 사용해야 할 때 요긴하다.

### instanceof

강제 형 변환은 상위 객체 타입 변수나 매개변수에 하위 객체 인스턴스가 들어갔을 때만 가능하다.
즉, 상위 객체 타입 변수나 매개변수에 상위 객체 인스턴스가 있을 때에는 변환이 되지 않는다.

하지만 매개변수로 받는 메소드 측에서는 자기가 받은 인스턴스가 상위 객체인지 하위 객체인지 바로 알 수 없다.
이럴 때 사용하는 연산자가 `instanceof`이다. 다음과 같이 사용한다.

```java
boolean result = /*객체(인스턴스)*/ instanceof /*타입*/
```
{: .nolineno }

보통은 아래와 같이 메소드에서 넘겨받은 매개변수의 타입을 판단할 때 사용한다.

```java
public void func(Parent parent) {
    if(parent instanceof Child) {
        Child child = (Child)parent;
        ......
    }
}
```
{: .nolineno }

## 추상 클래스

추상 클래스는 인스턴스로 생성할 수 없는, 말 그대로 추상적인 클래스이다.
추상적인 특징과 동작을 모아서 정의하고, 상세한 구현은 하위 객체에게 맡기는 것이다.

따라서 추상 클래스는 상속의 대상만 될 수 있다.
그러므로 추상 클래스를 사용하는 이유는 상속과 다형성을 사용하는 이유와 어느정도 겹친다.

공통된 특성과 메소드가 모두 상위 객체인 추상 클래스에 정의되어 있다면, 다양한 하위 객체들을 해당 추상 클래스 타입의 변수에 담아서 일괄적으로 처리할 수 있다. 
코드의 중복되는 부분도 줄어들어 수정도 용이해진다.

또한 규격이 이미 추상 클래스에 선언되어 있으므로 협업을 할때에도 실수를 줄일 수 있다.
이렇게 만들어진 추상 클래스의 구현 객체들은 위에서 설명한 다형성과 그를 활용한 확장성의 혜택을 받을 수 있다.

사실 추상 클래스는 인스턴스로 생성할 수 없다는 점만 제외하면 기존의 클래스와 같다.
위에서 언급한 예시들에서의 상위 객체들을 추상 클래스로 대체해도 문제가 없다.(인스턴스화 하지 않는다면)
오히려 추상 클래스를 사용하는 것이 더 자연스러운 예시도 있다.

선언은 아래와 같이 `abstract`를 붙이는 것으로 충분하다.
`abstract` 키워드가 붙으면 인스턴스로 생성하는 것이 불가능해진다.
그 외의 필드, 메소드, 생성자 같은 건 기존의 클래스와 같다.

### 추상 메소드

추상 메소드는 추상 클래스에서만 선언가능한 형태의 메소드이다.
추상 메소드는 선언부만 존재하며, 반드시 하위 객체에서 오버라이딩할 것을 요구한다.

만약 상속받은 하위 객체에서 추상 메소드를 오버라이딩하지 않는다면 컴파일 에러가 난다.
추상 메소드를 사용하는 것은 오버라이딩 해야함을 명시적으로 전달하여 오류를 막기 위함이다.

```java
public class AuthService {
    private final UserRepos userRepos;
    
    public AuthService(UserRepos userRepos) { this.userRepos = userRepos; }
    
    pubilc boolean auth(String username, String password) {
        //인증 처리
    } 
   
    public void logout(String username) {
        //세션 삭제 등의 처리
    }
    ......
}
```
{: .nolineno }

```java
public class FastAuthService extends AuthService {
    public FastAuthService(UserRepos userRepos) { super(userRepos); }
  
    ......
}
```
{: .nolineno }

만약 위와 같이 `AuthService`가 추상 클래스가 아니면 
상속받은 `FastAuthService`에서 상위 객체의 메소드를 오버라이딩 하지 않더라도 아무런 에러가 발생하지 않는다.

위의 예시에서는 상위 객체의 메소드의 개수가 그렇게 많지 않기에 문제가 없을 수 있지만,
메소드가 무수히 많아지게 되면 오버라이딩하여 기능을 바꾸어야 함에도 불구하고 빼먹을 수도 있다.

그렇게 되면 일부 기능은 하위 객체에 맞게 실행되는데 일부 기능은 상위 객체의 것이 실행되어 예상치 못한 에러가 발생할 수 있다.

이를 위해 추상 클래스와 추상 메소드를 활용할 수 있다.

```java
public abstract class AuthService {
    ......
    pubilc abstract boolean auth(String username, String password);
    ......
}
```
{: .nolineno }

이렇게 하면 하위 객체에서는 반드시 `auth` 메소드를 오버라이딩해야하고 그렇지 않으면 에러가 나서 알려준다.

이 추상 클래스와 추상메소드는 구현 객체가 해당 메소드를 오버라이딩하였다는 것을 보장해준다.
즉, 해당 클래스를 사용할 때 상위 객체의 것이 호출되는지, 하위 객체의 것이 호출되는지 고민할 필요가 없어지게 된다.

다만, 딱히 오버라이딩하고 싶지 않은 메소드도 추상 메소드라면 오버라이딩해야 한다는 단점도 존재한다. 
이는 뒤에 서술할 인터페이스에도 포함되는 단점이다.
