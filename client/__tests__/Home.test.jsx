import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import { AuthContext } from "../src/modules/auth/AuthProvider";

jest.mock("next/navigation");

describe("Home Page", () => {
  it("renders heading", () => {
    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: false,
          user: null,
          isLoading: true,
        }}
      >
        <Home />
      </AuthContext.Provider>
    );

    expect(
      screen.getByText("Verificando autenticación...")
    ).toBeInTheDocument();
  });
});
