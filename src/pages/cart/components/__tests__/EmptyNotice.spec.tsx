import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import customRender from '@/utils/test/render';
import { EmptyNotice } from '../EmptyNotice';
import { useNavigate } from 'react-router-dom';
import { pageRoutes } from '@/apiRoutes';

// 모킹: useNavigate 함수 모킹
vi.mock('react-router-dom', async () => {
  const originalModule = await vi.importActual('react-router-dom'); // 원본 모듈 불러오기
  return {
    ...originalModule, // 원본 모듈 유지
    useNavigate: vi.fn(), // useNavigate만 모킹
  };
});

it('"홈으로 가기" 링크를 클릭할 경우 "/" 경로로 navigate 함수가 호출된다', async () => {
  // Arrange: 테스트 준비
  const mockNavigate = vi.fn(); // navigate 함수를 모킹

  // useNavigate 훅이 모킹된 navigate 함수를 반환하도록 설정
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);

  // EmptyNotice 컴포넌트를 렌더링
  const { user } = await customRender(<EmptyNotice />);

  // Act: "홈으로 가기" 텍스트를 가진 버튼을 클릭
  const linkButton = screen.getByText('홈으로 가기');
  await user.click(linkButton);

  // Assert: navigate 함수가 '/' 경로로 호출되었는지 확인
  expect(mockNavigate).toHaveBeenCalledWith(pageRoutes.main);
});
