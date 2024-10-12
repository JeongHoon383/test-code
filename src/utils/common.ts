export const pick = <T extends object, K extends keyof T>(
  // 제네릭 타입 T는 객체 타입, K는 T의 키 중 하나를 나타냄
  obj: T, // 첫 번째 파라미터 obj는 객체
  ...propNames: K[] // propNames는 객체의 키 목록 (여러 개의 키를 받을 수 있음)
): Pick<T, K> => {
  // 결과 타입은 Pick<T, K>로, obj에서 propNames로 선택한 키들만을 포함하는 객체 타입
  const result = {} as Pick<T, K>; // 빈 객체 result를 생성하고, 이 객체는 Pick<T, K> 타입으로 선언됨

  propNames.forEach((key) => {
    // 각 propNames 키에 대해 반복문을 실행
    if (key in obj) {
      // 키가 obj에 존재하면
      result[key] = obj[key]; // result에 해당 키와 값을 저장
    } else {
      throw new Error( // 만약 키가 obj에 존재하지 않으면 에러를 던짐
        `Property "${String(key)}" does not exist on the object.` // 에러 메시지로 키가 객체에 없다고 표시
      );
    }
  });

  return result; // 최종적으로 result 객체를 반환
};

export const debounce = <T extends (...args: any[]) => void>(
  // 제네릭 타입 T는 함수를 나타냄
  fn: T, // fn은 호출할 함수
  wait: number // wait는 대기 시간 (밀리초)
): ((...args: Parameters<T>) => void) => {
  // 반환 타입은 T 함수의 매개변수를 그대로 받는 함수
  let timeout: number | null = null; // timeout 변수를 null로 초기화하여 대기 상태를 추적

  return (...args: Parameters<T>) => {
    // 반환된 함수는 T 함수와 동일한 매개변수를 받음
    const later = () => {
      // later 함수는 대기 시간이 끝난 후 실행될 함수
      timeout = -1; // timeout을 -1로 설정하여 대기 상태가 끝났음을 표시
      fn(...args); // 대기 후 원래 함수를 호출 (args는 원래 함수의 매개변수)
    };

    if (timeout !== null) {
      // timeout이 설정되어 있다면 (대기 상태가 남아있다면)
      clearTimeout(timeout); // 기존 대기 시간을 취소
    }
    timeout = window.setTimeout(later, wait); // 새로운 대기 시간 설정 후, 대기 시간이 끝나면 later 호출
  };
};

export const isNumber = (
  value: unknown
): value is number => typeof value === 'number'; // 입력값이 number 타입인지 확인하는 함수 // 입력값의 타입이 'number'인 경우 true를 반환, 아니면 false

export const parseJSON = <T = unknown>(value: string): T | null => {
  // 입력값을 JSON으로 파싱하는 함수
  if (!value) {
    // 입력값이 없거나 빈 문자열이면
    return null; // null 반환
  }

  const result = JSON.parse(value); // 입력값을 JSON 파싱하여 result에 저장
  return typeof result === 'string' ? JSON.parse(result) : result; // 만약 result가 문자열이라면 다시 JSON 파싱, 그렇지 않으면 그대로 반환
};
