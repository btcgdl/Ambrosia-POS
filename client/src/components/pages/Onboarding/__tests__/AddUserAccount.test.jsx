import { render, screen, fireEvent } from "@testing-library/react";
import { UserAccountStep } from "../AddUserAccount";

describe("Step 2 User Account", () => {
  const mockChange = jest.fn();

  const defaultData = {
    userName: "",
    userPassword: "",
  };

  beforeEach(() => {
    mockChange.mockClear();
  });

  it("renders username and password fields", () => {
    render(<UserAccountStep data={defaultData} onChange={mockChange} />);

    expect(screen.getByPlaceholderText("step2.fields.userNamePlaceholder")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("step2.fields.passwordPlaceholder")).toBeInTheDocument();
  });

  it("calls onChange when username is typed", () => {
    render(<UserAccountStep data={defaultData} onChange={mockChange} />);

    const userInput = screen.getByPlaceholderText("step2.fields.userNamePlaceholder");
    fireEvent.change(userInput, { target: { value: "Ivan" } });

    expect(mockChange).toHaveBeenCalledWith({
      userName: "Ivan",
      userPassword: "",
    });
  });

  it("calls onChange and updates password strength", () => {
  const { rerender } = render(
    <UserAccountStep data={defaultData} onChange={mockChange} />
  );

  const passwordInput = screen.getByPlaceholderText("step2.fields.passwordPlaceholder");
  fireEvent.change(passwordInput, { target: { value: "abc123!!" } });

  rerender(
    <UserAccountStep
      data={{ ...defaultData, userPassword: "abc123!!" }}
      onChange={mockChange}
    />
  );

  expect(mockChange).toHaveBeenCalledWith({
    userName: "",
    userPassword: "abc123!!",
  });

  expect(screen.getByText(/step2.strength.title:/)).toBeInTheDocument();
  expect(screen.getByText(/step2.strength.weak|step2.strength.regular|step2.strength.good|step2.strength.strong/)).toBeInTheDocument();
});

  it("toggles password visibility when clicking the eye icon", () => {
    render(<UserAccountStep data={{ userName: "", userPassword: "abc123!!" }} onChange={mockChange} />);

    const toggleBtn = screen.getByRole("button");
    const input = screen.getByPlaceholderText("step2.fields.passwordPlaceholder");

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "password");
  });
});
