import { screen, waitFor, within } from '@testing-library/react';

import {
  mockUseAuthStore,
  mockUseCartStore,
} from '@/utils/test/mockZustandStore';
import render from '@/utils/test/render';
import { ProductInfoTable } from '../ProductInfoTable';

beforeEach(() => {
  mockUseAuthStore({
    user: {
      uid: 'mocked-uid',
      email: 'test@example.com',
      displayName: '홍길동',
    },
  });
  mockUseCartStore({
    cart: [
      {
        id: '6',
        title: 'Handmade Cotton Fish',
        price: 809,
        count: 3,
        image: 'image_url_1',
      },
      {
        id: '7',
        title: 'Awesome Concrete Shirt',
        price: 442,
        count: 4,
        image: 'image_url_2',
      },
    ],
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  // Arrange: 컴포넌트를 렌더링하고, 행(row) 요소들을 가져옵니다.
  await render(<ProductInfoTable />);
  const rows = screen.getAllByRole('row');
  const dataRows = rows.slice(1); // 헤더 행을 제외한 데이터 행을 선택

  const [firstItem, secondItem] = dataRows;

  // Assert: 첫 번째 아이템의 이름, 수량, 합계 금액을 확인합니다.
  within(firstItem).getByText('Handmade Cotton Fish');
  within(firstItem).getByDisplayValue('3'); // 수량 확인
  within(firstItem).getByText((content, element) => content.includes('2,427')); // 809 * 3 = 2,427

  // Assert: 두 번째 아이템의 이름, 수량, 합계 금액을 확인합니다.
  within(secondItem).getByText('Awesome Concrete Shirt');
  within(secondItem).getByDisplayValue('4'); // 수량 확인
  within(secondItem).getByText((content, element) => content.includes('1,768')); // 442 * 4 = 1,768
});

it('특정 아이템의 수량이 변경되었을 때 값이 재계산되어 올바르게 업데이트 된다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const dataRows = screen.getAllByRole('row');
  const [firstItem] = dataRows.slice(1);

  const input = within(firstItem).getByDisplayValue('3');
  await user.clear(input);
  await user.type(input, '5');

  await waitFor(() => {
    within(firstItem).getByText((content, element) =>
      content.includes('4,045')
    ); // 809 * 5 = 4,045
  });
});

it('특정 아이템의 삭제 버튼을 클릭할 경우 해당 아이템이 사라진다', async () => {
  const { user } = await render(<ProductInfoTable />);
  const dataRows = screen.getAllByRole('row');
  const [, secondItem] = dataRows.slice(1);

  expect(
    within(secondItem).getByText('Awesome Concrete Shirt')
  ).toBeInTheDocument();

  const deleteButton = within(secondItem).getByRole('button'); // '삭제' 버튼을 찾는 방법 수정
  await user.click(deleteButton);

  await waitFor(() => {
    expect(
      screen.queryByText('Awesome Concrete Shirt')
    ).not.toBeInTheDocument();
  });
});

it('장바구니에 포함된 아이템들의 이름, 수량, 합계가 제대로 노출된다', async () => {
  await render(<ProductInfoTable />);
  const rows = screen.getAllByRole('row');
  const dataRows = rows.slice(1);

  const [firstItem, secondItem] = dataRows;

  within(firstItem).getByText('Handmade Cotton Fish');
  within(firstItem).getByDisplayValue('3');
  within(firstItem).getByText((content, element) => content.includes('2,427')); // 809 * 3 = 2,427

  within(secondItem).getByText('Awesome Concrete Shirt');
  within(secondItem).getByDisplayValue('4');
  within(secondItem).getByText((content, element) => content.includes('1,768')); // 442 * 4 = 1,768
});
