import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AsyncExampleComponent } from "./async-example.component";
import { DependencyService } from "../dependency/dependency.service";
import { of, throwError } from "rxjs";

describe("AsyncExampleComponent", () => {
  let component: AsyncExampleComponent;
  let fixture: ComponentFixture<AsyncExampleComponent>;

  const fakeDependencyService = jasmine.createSpyObj("fakeDepService", ["asyncExample", "observableExample"]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsyncExampleComponent ],
      providers: [
        { provide: DependencyService, useValue: fakeDependencyService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("asyncExample возвращает промис с указанным параметром - async/await", async () => {
    const result = await component.asyncExample("Alice");
    expect(result).toBe("Alice");
  });

  it("asyncExample реджектит промис без указания параметра - async/await", async () => {
    try {
      await component.asyncExample();
    } catch (err) {
      expect(err).toBe("имя не указано");
    }
   });

  it("sayHiAsync, выводит строку приветствия для указанного имени", async () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.resolve("Hello"));
    const result = await component.sayHiAsync("Bob");
    expect(result).toBe("Hello, Bob!");
  });

  it("sayHiAsync, выводит ошибку, если сервис вернул ошибку", async () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.reject());
    const result = await component.sayHiAsync("Bob");
    expect(result).toBe("сервис вернул ошибку");
  });

  it("asyncExample возвращает промис с указанным параметром - механизм промисов", () => {
    return component.asyncExample("Alice").then(result => {
      expect(result).toBe("Alice");
    });
  });

  it("asyncExample реджектит промис без указания параметра - механизм промисов", () => {
    return component.asyncExample().then(undefined, error => {
      expect(error).toBe("имя не указано");
    });
  });

  it("promiseExample присваивает указанное имя полю класса - механизм промисов", () => {
    return component.promiseExample("Dan").then(() => {
      expect(component.name).toBe("Dan");
    });
  });

  it("sayHiAsync, выводит строку приветствия для указанного имени - механизм промисов", () => {
    fakeDependencyService.asyncExample.and.returnValue(Promise.resolve("Hello"));
    return component.sayHiAsync("Alice").then(result => {
      expect(result).toBe("Hello, Alice!");
    });
  });

  it("asyncExample возвращает промис с указанным параметром - callback Done", done => {
    component.asyncExample("Alice").then(result => {
      expect(result).toBe("Alice");
      done();
    });
  });

  it("asyncExample реджектит промис без указанного имени - callback Done", done => {
    component.asyncExample().then(result => {
      expect(result).toBe("Alice");
    }, err => {
      expect(err).toBe("имя не указано");
      done();
    });
  });

  it("observableExample возвращает переданное значение - callback Done", done => {
    component.observableExample("Dan").subscribe(result => {
      expect(result).toBe("Dan");
      done();
    });
  });

  it("observableExample возвращает ошибку, если значение не передано - callback Done", done => {
    component.observableExample().subscribe(undefined, error => {
      done();
      expect(error).toBe("нет имени");
    });
  });

  it("subjectExampleMethod записывает имя в поле класса subject - callback Done", done => {
    component.subjectExample.subscribe(result => {
      expect(result).toBe("Alice");
      done();
    });
    component.subjectExampleMethod("Alice");
  });

  it("sayHiObservable возвращает прветствие по указанному имени - callback Done", done => {
    fakeDependencyService.observableExample.and.returnValue(of("Hello"));
    component.sayHiObservable("Dan").subscribe(result => {
      expect(result).toBe("Hello, Dan!");
      done();
    });
  });

  it("sayHiObservable выводит ошибку, если сервис вернул ошибку - callback Done", done => {
    fakeDependencyService.observableExample.and.returnValue(throwError("сервис недоступен"));
    component.sayHiObservable("Dan").subscribe(undefined, error => {
      expect(error).toBe("сервис временно недоступен");
      done();
    });
  });

  it("setNameAfterMinute записывает указанное имя в поле класса спустя минуту", () => {
    jasmine.clock().install();
    component.setNameAfterMinute("Alice");
    jasmine.clock().tick(60000);
    expect(component.name).toBe("Alice");
    jasmine.clock().uninstall();
  });
});
