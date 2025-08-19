const mockFind = jest.fn();
const mockFindByIdAndDelete = jest.fn();
const mockCreate = jest.fn();

export const Vehicle = {
  find: mockFind.mockResolvedValue([]),
  create: mockCreate.mockResolvedValue({}),
};

export const Booking = {
  find: mockFind.mockResolvedValue([]),
  findByIdAndDelete: mockFindByIdAndDelete.mockResolvedValue(null),
  create: mockCreate.mockResolvedValue({}),
};

export const resetMocks = () => {
  mockFind.mockClear();
  mockFindByIdAndDelete.mockClear();
  mockCreate.mockClear();
};
