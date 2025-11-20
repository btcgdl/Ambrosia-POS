import { render, screen, fireEvent, act } from "@testing-library/react";
import { I18nProvider } from "../../../../../i18n/I18nProvider";
import { Users } from "../Users";

function renderUsers() {
  return render(
    <I18nProvider>
      <Users />
    </I18nProvider>
  );
}

describe("Users page", () => {
  it("renders the table and header", async () => {
    await act(async () => {
      renderUsers();
    });

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("addUser")).toBeInTheDocument();
    expect(screen.getByText("Jordano Anaya")).toBeInTheDocument();
    expect(screen.getByText("Carlos Ruz")).toBeInTheDocument();
  });

  it("opens AddUsersModal when clicking Add User", async () => {
    await act(async () => {
      renderUsers();
    });

    const btn = screen.getByText("addUser");
    await act(async () => {
      fireEvent.click(btn);
    });

    expect(screen.getByText("modal.titleAdd")).toBeInTheDocument(); // modal text
  });

  it("opens EditUsersModal with correct user data", async () => {
    await act(async () => {
      renderUsers();
    });

    const editButtons = screen.getAllByRole("button", {
      name: "Edit User",
    });

    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    expect(screen.getByText("modal.titleEdit")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Jordano Anaya")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4431342288")).toBeInTheDocument();
  });

  it("opens DeleteUsersModal", async () => {
    await act(async () => {
      renderUsers();
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete User",
    });

    await act(async () => {
      fireEvent.click(deleteButtons[1]);
    });

    expect(screen.getByText("modal.titleDelete")).toBeInTheDocument();
  });
});
