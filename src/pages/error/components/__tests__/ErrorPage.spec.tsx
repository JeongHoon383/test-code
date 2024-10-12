// 필요한 테스트 유틸리티와 컴포넌트를 임포트합니다.
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

// 커스텀 렌더 함수와 테스트할 컴포넌트를 임포트합니다.
import customRender from '@/utils/test/render';
import { ErrorPage } from '../ErrorPage';

// react-router-dom 모듈을 모킹합니다.
vi.mock('react-router-dom', async () => {
  // 실제 모듈의 내용을 가져옵니다.
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual, // 실제 모듈의 모든 내용을 유지합니다.
    useNavigate: vi.fn(), // useNavigate 함수만 모킹합니다.
  };
});

// ErrorPage 컴포넌트에 대한 테스트 스위트를 정의합니다.
describe('ErrorPage', () => {
  // 특정 기능에 대한 테스트 케이스를 정의합니다.
  it('"뒤로 이동" 버튼 클릭시 뒤로 이동하는 navigate(-1) 함수가 호출된다', async () => {
    // Arrange: 테스트 준비
    // navigate 함수를 모킹합니다.
    const mockNavigate = vi.fn();
    // useNavigate 훅이 모킹된 navigate 함수를 반환하도록 설정합니다.
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // ErrorPage 컴포넌트를 렌더링합니다.
    // customRender 함수는 React Query와 React Router 컨텍스트를 제공합니다.
    const { user } = await customRender(<ErrorPage />);

    // Act: 사용자 동작 시뮬레이션
    // "뒤로 이동" 텍스트를 가진 버튼을 찾습니다.
    const backButton = screen.getByText('뒤로 이동');
    // 버튼 클릭을 시뮬레이션합니다.
    await user.click(backButton);

    // Assert: 예상 결과 확인
    // navigate 함수가 -1을 인자로 호출되었는지 확인합니다.
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
