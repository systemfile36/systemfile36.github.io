---
title: Java 기본 - 중첩 클래스와 중첩 인터페이스, 익명객체
date: 2024-09-03 14:00:00 +0900
categories: [Java, Java Basic]
tags: [java, oop, basic, interface, nested]
description: 자바의 중첩 클래스, 중첩 인터페이스, 익명객체의 기본적인 개념들을 정리
---

(본 글은 기록 목적이 비교적 강하므로 설명이 불친절하고 체계적이지 않고, 자세하지 않을 수 있습니다.)

(본 글은 [필자의 네이버 블로그 ](https://blog.naver.com/loliisjinri)에서 가져왔습니다. 
이는, 정리한 글들을 한 곳에 모아 개인적으로 보기 편하기 위함입니다. 따라서 기본적으로 해당 블로그에 있는 글과 본 글은 
본질적으로는 같은 글입니다. )  

## 중첩 클래스

기본적으로 클래스는 별도의 파일을 가지고 생성된다.
하지만 특정 클래스하고만 관계가 있는 클래스의 경우에는 따로 있으면 그 관계를 유추하기 어렵다.

따라서 클래스 내부에서도 클래스를 선언할 수 있는데, 이를 중첩 클래스라 한다.
이를 통해 클래스 간의 관계성을 코드에 명확히 드러낼 수 있고, 원한다면 외부에서의 접근을 차단할 수 도 있다.

### 인스턴스 멤버 클래스

인스턴스 멤버 클래스는 클래스의 멤버로서 선언되는 클래스 중, 인스턴스를 필요로 하는 클래스이다.

```java
public class Outer {
    class Member {
        ......
    }
    ......
}
```
{: .nolineno }

인스턴스 멤버 클래스는 말 그대로 인스턴스의 멤버로 간주된다.
따라서 외부 클래스의 인스턴스가 있어야 사용할 수 있다.

```java
public class Main {
    public static void main(String args[]) {
        //Outer.Member member = new Outer.Member(); //에러
        Outer outer = new Outer();
        Outer.Member member = new outer.Member();
    }
}
```

생성할 때에도 위와 같이 멤버 처럼 . 연산자로 접근하면 된다.

또한 멤버로 취급되는 만큼 메소드나 필드 처럼 접근 제한자를 부여할 수 있다.
아무 것도 붙이지 않으면 같은 패키지 내에서는 어디에서나 접근 가능하고,
`public`은 어디서나, `private`는 외부 클래스 내부에서만 접근 가능하다.

인스턴스 멤버 클래스는 외부 클래스의 인스턴스 필드나 인스턴스 메소드에서는 제한 없이 사용할 수 있다.
하지만 인스턴스가 생성되어야 사용가능하기에 정적 필드의 초기값이나 정적 메소드에서는 사용될 수 없다.

인스턴스 멤버 클래스는 외부 클래스의 모든 필드와 메소드에 접근 가능하다.
인스턴스 멤버 클래스가 생성되었다는 것은 외부 클래스의 인스턴스가 있다는 뜻이기 때문이다.

```java
public class Outer {
    private int local = 100;
    
    public class Member {
        public int printOuterLocal() {
            changeLocal();
            System.out.println(local);
        }
    }

    private void changeLocal() { 
        this.local -= 1;
    }
}
```

### 정적 멤버 클래스

정적 멤버 클래스는 이름 그대로 `static`으로 선언된 멤버 클래스를 말한다.
특성도 `static` 멤버와 비슷하게 간주된다.

```java
public class Outer {
    public static Member { ...... }
}
```

정적 필드와 정적 메소드를 포함한 모든 필드와 메소드를 선언 가능하다.
접근할때에는 정적 멤버에 접근하듯이 접근하면 된다.

```java
Outer.Member member = new Outer.Member();
```

정적 멤버 클래스는 모든 정적 메소드나 정적 필드의 초기값으로 사용될 수 있다.
하지만 `static`이므로 인스턴스 필드와 인스턴스 메소드에는 접근이 불가하다.
외부 클래스의 인스턴스 없이 독립적으로 생성되기 때문이다.

정적 멤버 클래스는 보통 코드 가독성의 향상을 위해 기능들을 한 곳으로 묶는 목적으로 사용한다.

```java
public class StorageManager {
    public static void saveData(String data) {
        //기타 전처리
        Storage.save(data);
    }
    public static String loadData() {
        //기타 전처리
        return Storage.load();
    }
    private static class Storage {
        private static final String STORAGE_FILE = "data.txt";
        public static void save(String data) {
            //저장 관련
        }
        public static String load() {
            //로드 관련
        }
    }
}
```
{: .nolineno }

이렇게 하면 파일 저장과 로드에 관한 코드를 한 곳에 몰아넣을 수 있다.
기능을 클래스별로 분리하면서도 파일은 하나로 만들어서 관리에 편리해진다.

### 로컬 클래스

로컬 클래스는 메소드 내에서 선언된 클래스를 말한다.
로컬 클래스에는 접근 제한자를 붙일 수 없으며, 정적 메소드와 필드를 선언할 수 없다.

```java
void func() {
    class Local {
        private int localValue = 0;
        public int getLocalValue() { return this.localValue; }
    }
    Local local = new Local();
    System.out.println(local.getLocalValue());
}
```
{: .nolineno }

로컬 클래스는 메소드가 실행시에만 사용되고, 메소드가 종료(`return`)되면 사라진다.
(단 인스턴스는 유지될 수도 있다. 여기서 사라진다는 것은 클래스에 대한 접근을 말한다.)

보통 아래와 같이 비동기 처리를 위한 스레드 객체를 만들 때에 사용한다.
(익명 객체로 사용하는 경우가 더 많지만 일단은 예시로 넣어둔다.)

```java
void func() {
    class LoadThread extends Thread { ...... }
    Thread th = new LoadThread();
    th.start();
}
```

로컬 클래스는 메소드가 종료되어도 인스턴스가 유지될 수도 있다는 특성 때문에 제한이 생긴다.

메소드의 매개 변수와 지역 변수는 메소드가 종료(`return`)되면 스택에서 사라지기 때문에 로컬 클래스에서 그대로 사용하게 되면 참조에 문제가 생긴다.

이를 막기 위해서 로컬 클래스는 매개 변수나 지역 변수를 복사해서 가지고 온다.
또한, 복사해서 가지고 온 후에 변경되어 서로 값이 달라지는 경우를 막기 위해 자동으로 `final` 특성이 부여된다.

```java
void func(int param) {
    int localValue = 100;

	localValue -= 10; //에러 발생!

    class Local {
        public void getValue() {
            return param + localValue;
        }
    }
}
```
{: .nolineno }

위의 예시에서 매개 변수 `param`과 지역 변수 `localValue`는 명시되어있진 않아도 `final` 특성이 부여된 상태이다.
로컬 클래스 `Local`이 사용하고 있기 때문이다.

즉, 메소드 `func(int)` 내에서는 `param`과 `localValue`의 수정은 불가능하다. 만약 하면 컴파일 에러가 날 것이다.

그런데 저런 대책을 세운 이유가 로컬 클래스가는 메소드 종료 뒤에도 인스턴스를 유지할 수도 있기 때문이라 했다.
그런 경우는 어떻게 있을까? 로컬 클래스는 메소드 외부에선 사용할 수 없어서 타입 선언도 안되는데 말이다.

인스턴스가 유지되는 경우는 바로 로컬 클래스가 특정 클래스의 하위 객체거나, 인터페이스의 구현 객체일 때이다.
아래의 예시를 보자. (Runnable이나 Thread에 대한 것은 멀티스레딩에서 다룬다. 일단은 예시로 살펴보자)

```java
public Thread getThread(int param) {
    int localValue= 100;

    class Local extends Thread {
        @Override
        public void run() {
            System.out.println("param : " + param);
            System.out.println("localValue : " + localValue);
        }
    }
    return new Local();
}
```
{: .nolineno }

이 경우에는 `Local` 클래스는 메소드 종료 후에는 타입으로든 인스턴스로든 참조할 수 없지만,
`return` 값으로 반환된 `Local`의 인스턴스는 아래와 같이 외부에서 `Thread` 타입으로 받아서 사용할 수 있다.

```java
Thread th = getThread(200);
th.run();
```
{: .nolineno }

이는 위의 `extends Thread` 부분을 `implements Runnable`로 치환해도 같다.
(사용할때만 `new Thread(getThread(200));`과 같이 사용하면 된다.)

### 외부 클래스 참조 얻기

위에서 설명한 모든 중첩 클래스에서 `this` 키워드는 외부 클래스가 아닌 중첩 클래스 자신을 가리킨다.
`super` 키워드 또한 외부 클래스가 아닌 중첩 클래스 자신이 상속받은 클래스를 가리킨다.

외부 클래스의 참조를 얻기 위해서는 `외부클래스.this`를 사용해야 한다.

```java
public class Outer {
    private int outerValue = 100;
    public class Member {
        public void printOuterValue() {
            System.out.println(Outer.this.outerValue);
        }
    }
}
```
## 중첩 인터페이스

중첩 인터페이스는 클래스 내부에 선언된 인터페이스를 말한다.
굳이 클래스 내부에 인터페이스를 선언하는 이유는, 관계성을 명확히 하기 위해서이다.

만약 특정 클래스 내부에서만 사용하는 인터페이스의 경우, 파일을 따로하게 되면 용도를 명확히 알기 어렵다.
그렇다고 인터페이스 이름에, 사용되는 클래스 이름을 포함시키는 것도 번거럽고 복잡하다.
따라서 클래스 내부에 선언하는 것이다.

```java
public class Outer {
    interface Inner { ...... }
}
```

주로 UI의 이벤트를 처리할 때에 많이 사용한다.

```java
public class Button {
    OnClickListener listener;
    
    void setOnClickListener(OnClickListener listener) { this.listener = listener; }
    
    .......

    interface OnClickListener {
        void onClick();
    }
}
```
{: .nolineno }

위와 같이 특정 UI 클래스 내부에 이벤트 리스너 인터페이스를 정의하여
해당 UI에 사용되는 이벤트 리스너라는 것을 명확히 드러낸다.


```java
public class customListener implements Button.OnClickListener {
    @Override 
    public void onClick() { ...... }
}
```

```java
void func() {
    class customListener implements Button.onClickListener {
        @Override
        public void onClick() { ...... }
    }
    Button btn = new Button();
    btn.setOnClickListener(new customListener());
}
```

## 익명 객체

익명 객체는 로컬 클래스와 사용 목적이 어느 정도 일치 한다.

다른 점이라면, 로컬 클래스는 같은 메소드 내에서 언제든지 이름으로 새 인스턴스를 만들 수 있지만
익명 객체는 이름이 없기 때문에 이름으로 새 인스턴스를 만들 수 없다.

즉, 익명 객체는 이름이 없는 로컬 클래스로 간주할 수 있다.

### 익명 자식(하위) 객체

상위 객체 변수에 하위 객체 인스턴스를 대입할 수 있다는 것은 상속과 다형성에서 언급했다.
만약 상위 객체 변수에 오버라이딩 등으로 커스텀한 하위 객체 인스턴스를 대입하고 싶다면,

```java
public class Child extends Parent {
    @Override
    public void func() { ...... }
}
```

```java
Parent p = new child();
```

위와 같이 하위 객체를 작성한 후, 인스턴스로 대입해야 한다.
하지만 한번만 사용할 하위 객체의 경우에는, 저렇게 따로 파일로 작성하는 것이 불필요하고 번거롭다.

이럴때에는 위에서 설명한 로컬 클래스를 사용할 수 있다. 하위 객체를 사용할 메소드 내에 선언하는 것이다.

```java
public void method() { 
    class Child extends Parent {
        @Override
        public void func() { ...... }
    }
    Parent p = new child();
    p.func();
}
```

하지만 이것도 불필요한 부분이 포함되어 있다. 저 `Child`라는 하위 객체는 `Parent`타입 변수 `p`에 한번 대입되고
더이상 사용되지 않는다. 그렇다면 굳이 이름을 부여해서 객체를 선언하는 과정 자체가 필요하지 않다.

이럴 때 익명 하위 객체를 사용하는 것이다.
위의 예시는 아래와 같이 익명 하위 객체를 사용하는 것으로 변환 가능하다.

```java
public void method() { 
    Parent p = new Parent() {
        @Override
        public void func() { ...... }
    };
    p.func();
}
```

익명 하위 객체는 아래와 같은 형식을 가진다. 부모 생성자를 호출하는 구문 뒤에 클래스의 몸체가 붙는 식이다.

```java
상위객체타입 변수명 = new 상위객체(매개변수...) {
    //필드, 메소드 등등
    };
```

기본적으로 로컬 클래스와 비슷한 특성을 가지지만, 다른 점이 있다.
바로 익명 하위 객체에서는 생성자를 선언할 수 없다는 것이다. 선언한 부분 외에서는 사용을 못하기 때문이다.

또한 익명 하위 객체에서 새로 선언된 필드와 오버라이딩 되지 않은 메소드는 외부에서 접근할 방법이 없다.
상위 객체 타입으로 자동형변환이 일어나 상위 객체에 선언된 부분에만 접근할 수 있기 때문이다.
또한 익명이기 때문에 강제 형 변환도 불가능하다.

익명 하위 객체는 여러 부분에서 사용된다.
전에도 말했듯이 상위 객체가 들어가는 자리에는 하위 객체도 들어갈 수 있다. (그래야 한다.)
이는 필드와 변수뿐만 아니라 메소드에도 해당한다.

```java
class Example {
    public void method1(Parent parent) { ...... }
    public void method2() {
        method1(new Parent() { 
            @Override
            public void func() { ...... }
        });
    }
}
```

### 익명 객체의 로컬 변수 접근 제한

위에서 익명 객체들은 로컬 클래스와 같은 점이 많다고 언급하였다.
로컬 클래스가 지역 변수나 매개변수에 접근하게 되면 해당 변수는 `final` 특성이 자동으로 부여된다.

왜냐하면 인스턴스는 메소드 종료 후에도 남을 수 있지만 지역 변수나 매개 변수는 아니기 때문이다.

이는 익명 객체에도 동일하게 적용된다.
익명 객체가 지역 변수, 매개 변수에 접근하면 따로 선언이 없더라도 해당 변수는 `final`이라는 것을 알아야 한다.

```java
public void func(int param) {
    int localValue = 100;

    //localvalue += 10; final 이므로 접근 불가
    
    Thread th = new Thread() {
        @Override
        public void run() {
            Systemout.println(param + localValue);
        }
    };
}
```