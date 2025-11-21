import { render, screen, fireEvent, act } from "@testing-library/react";
import { I18nProvider } from "../../../../../i18n/I18nProvider";
import { Users } from "../Users";
import * as useModulesHook from "../../../../../hooks/useModules";
import * as configurationsProvider from "../../../../../providers/configurations/configurationsProvider";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/store/users"),
}));

jest.mock("lucide-react", () => ({
  Users: () => <div>Users Icon</div>,
  Package: () => <div>Package Icon</div>,
  ShoppingCart: () => <div>ShoppingCart Icon</div>,
  Settings: () => <div>Settings Icon</div>,
  LogOut: () => <div>LogOut Icon</div>,
  FileText: () => <div>FileText Icon</div>,
  Languages: () => <div>Languages Icon</div>,
  Edit: () => <div>Edit Icon</div>,
  Trash2: () => <div>Trash2 Icon</div>,
  Plus: () => <div>Plus Icon</div>,
  Pencil: () => <div>Pencil Icon</div>,
  Trash: () => <div>Trash Icon</div>,
  Eye: () => <div>Eye Icon</div>,
  EyeOff: () => <div>EyeOff Icon</div>,
}));

jest.mock("@/services/apiClient", () => ({
  apiClient: jest.fn(() => Promise.resolve([
    {
      id: 1,
      name: "Jordano Anaya",
      phone: "4431342288",
      pin: "1234",
    },
    {
      id: 2,
      name: "Carlos Ruz",
      phone: "4431234567",
      pin: "5678",
    },
  ])),
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe("Users page", () => {
  const mockLogout = jest.fn();
  const mockConfig = {
    businessName: "Mi Tienda Test",
    businessType: "store",
  };

  const defaultNavigation = [
    {
      path: "/store/users",
      label: "users",
      icon: "users",
      showInNavbar: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(useModulesHook, "useModules").mockReturnValue({
      availableModules: {},
      availableNavigation: defaultNavigation,
      checkRouteAccess: jest.fn(),
      isAuth: true,
      isAdmin: false,
      isLoading: false,
      user: { userName: "testuser" },
      logout: mockLogout,
    });

    jest.spyOn(configurationsProvider, "useConfigurations").mockReturnValue({
      config: mockConfig,
      isLoading: false,
      businessType: "store",
      refreshConfig: jest.fn(),
      setConfig: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderUsers() {
    return render(
      <I18nProvider>
        <Users />
      </I18nProvider>
    );
  }

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

    expect(screen.getByText("modal.titleAdd")).toBeInTheDocument();
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
